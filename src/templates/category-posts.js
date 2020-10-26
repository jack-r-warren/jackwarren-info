import React from "react"
import { graphql, Link } from "gatsby"
import _ from "lodash"
import Layout from "../components/layout/layout"
import Metadata from "../components/layout/metadata"
import PostList from "../components/post-list/post-list"
import FeaturedPostList from "../components/post-list/featured-post-list"
import TagList from "../components/tag-list/tag-list"
import PaginatedNavigation from "../components/layout/paginated-navigation/paginated-navigation"

import categoryPostsStyles from "./category-posts.module.scss"
import { slugToProperCase } from "../util/post-util"

export default ({ data, pageContext }) => {
    const parents = [
        ...(pageContext.parentCategories.length !== 0
            ? [
                  pageContext.parentCategories
                      .map((cat) => (
                          <Link key={cat} to={cat}>
                              {slugToProperCase(cat)}
                          </Link>
                      ))
                      .reduce((prev, current) => [prev, " / ", current]),
                  " /",
              ]
            : []),
    ]

    const children = [
        ...(pageContext.childCategories.length !== 0
            ? [
                  "Subcategories: ",
                  pageContext.childCategories
                      .map((cat) => (
                          <Link key={cat} to={cat}>
                              {slugToProperCase(cat)}
                          </Link>
                      ))
                      .reduce((prev, curr) => [prev, ", ", curr]),
              ]
            : []),
    ]

    const featureExist = data.featuredPosts.nodes.length > 0
    const shouldFeature = featureExist && pageContext.selfPage <= 1
    const categoryName = slugToProperCase(pageContext.selfCategory)
    const featuredComponents = (
        <>
            <h3>{`Featured ${categoryName}`}</h3>
            <FeaturedPostList postNodes={data.featuredPosts.nodes} />
        </>
    )
    const description =
        data.categoryDescription.nodes.length > 0
            ? data.categoryDescription.nodes[0].description
            : null

    return (
        <Layout>
            <Metadata title={categoryName} description={description} />
            <div>
                {parents.length > 0 && <h4>{parents}</h4>}
                <h1>{categoryName}</h1>
                {children.length > 0 && <h4>{children}</h4>}
                {description && (
                    <p
                        dangerouslySetInnerHTML={{
                            __html: description,
                        }}
                    />
                )}
                {shouldFeature && featuredComponents}
                <div className={categoryPostsStyles.container}>
                    <div className={categoryPostsStyles.left}>
                        {shouldFeature && <h3>{`All ${categoryName}`}</h3>}
                        <PaginatedNavigation
                            selfPage={pageContext.selfPage}
                            totalPages={pageContext.totalPages}
                            baseSlug={pageContext.selfCategory}
                        />
                        <PostList
                            postNodes={data.allPosts.nodes}
                            showCategories={false}
                        />
                        <PaginatedNavigation
                            selfPage={pageContext.selfPage}
                            totalPages={pageContext.totalPages}
                            baseSlug={pageContext.selfCategory}
                            noMargin
                        />
                    </div>
                    <TagList
                        countMap={_.countBy(
                            data.taggedPosts.nodes.flatMap(
                                (node) => node.fields.tags
                            )
                        )}
                        className={categoryPostsStyles.right}
                    />
                </div>
            </div>
        </Layout>
    )
}

export const query = graphql`
    query($selfCategory: String!, $postLimit: Int!, $postSkip: Int!) {
        allPosts: allMarkdownRemark(
            filter: { fields: { categories: { in: [$selfCategory] } } }
            sort: { fields: [fields___date], order: DESC }
            skip: $postSkip
            limit: $postLimit
        ) {
            nodes {
                excerpt(format: PLAIN)
                fields {
                    slug
                    title
                    categories
                }
            }
        }
        taggedPosts: allMarkdownRemark(
            filter: { fields: { categories: { in: [$selfCategory] } } }
        ) {
            nodes {
                fields {
                    tags
                }
            }
        }
        featuredPosts: allMarkdownRemark(
            sort: {
                fields: [fields___featuredPriority, fields___date]
                order: [DESC, DESC]
            }
            limit: 2
            filter: {
                fields: {
                    featured: { eq: true }
                    categories: { in: [$selfCategory] }
                }
            }
        ) {
            nodes {
                excerpt(format: PLAIN)
                fields {
                    categories
                    slug
                    title
                    featuredImage {
                        childImageSharp {
                            fluid(maxWidth: 800) {
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
            }
        }
        categoryDescription: allCategoryDescriptionsJson(
            filter: { category: { eq: $selfCategory } }
            limit: 1
        ) {
            nodes {
                description
            }
        }
    }
`
