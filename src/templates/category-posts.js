import React from "react"
import { graphql, Link } from "gatsby"
import _ from "lodash"
import Layout from "../components/layout/layout"
import Metadata from "../components/metadata"
import PostList from "../components/post-list/post-list"
import FeaturedPostList from "../components/post-list/featured-post-list"
import TagList from "../components/tag-list"
import PaginatedNavigation from "../components/paginated-navigation"

import categoryPostsStyles from "./category-posts.module.scss"

export default ({ data, pageContext }) => {
    console.log(pageContext.parentCategories)
    const parents = [
        ...(pageContext.parentCategories.length !== 0
            ? [
                  pageContext.parentCategories
                      .map(cat => (
                          <Link key={cat} to={cat}>
                              {_.startCase(cat.split("/").pop())}
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
                      .map(cat => (
                          <Link key={cat} to={cat}>
                              {_.startCase(cat.split("/").pop())}
                          </Link>
                      ))
                      .reduce((prev, curr) => [prev, ", ", curr]),
              ]
            : []),
    ]

    const featureExist = data.featuredPosts.nodes.length > 0
    const shouldFeature = featureExist && pageContext.selfPage <= 1
    const categoryName = _.startCase(pageContext.selfCategory.split("/").pop())
    const featuredComponents = (
        <>
            <h3>{`Featured ${categoryName}`}</h3>
            <FeaturedPostList postNodes={data.featuredPosts.nodes} />
        </>
    )

    return (
        <Layout>
            <Metadata title={`All ${categoryName}`} />
            <div>
                {parents.length > 0 && <h4>{parents}</h4>}
                <h1>{featureExist ? categoryName : `All ${categoryName}`}</h1>
                {children.length > 0 && <h4>{children}</h4>}
                {shouldFeature && featuredComponents}
                <div className={categoryPostsStyles.container}>
                    <div className={categoryPostsStyles.left}>
                        {shouldFeature && <h3>{`All ${categoryName}`}</h3>}
                        <PaginatedNavigation
                            selfPage={pageContext.selfPage}
                            totalPages={pageContext.totalPages}
                            baseSlug={pageContext.selfCategory}
                        />
                        <PostList postNodes={data.allPosts.nodes} />
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
                                node => node.fields.tags
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
            sort: { fields: [fields___date], order: DESC }
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
    }
`
