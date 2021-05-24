import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout/layout"
import Metadata from "../components/layout/metadata"
import PostList from "../components/post-list/post-list"
import PaginatedNavigation from "../components/layout/paginated-navigation/paginated-navigation"

export default ({ data, pageContext }) => {
    const tag = pageContext.selfTag
    return (
        <Layout>
            <Metadata title={`${tag} Posts`} />
            <div>
                <h4>
                    <Link to={"/tags"}>Tags</Link> /
                </h4>
                <h1>{`${tag} Posts`}</h1>
                <PaginatedNavigation
                    selfPage={pageContext.selfPage}
                    totalPages={pageContext.totalPages}
                    baseSlug={pageContext.selfTagSlug}
                />
                <PostList postNodes={data.allMarkdownRemark.nodes} />
                <PaginatedNavigation
                    selfPage={pageContext.selfPage}
                    totalPages={pageContext.totalPages}
                    baseSlug={pageContext.selfTagSlug}
                    noMargin
                />
            </div>
        </Layout>
    )
}

export const query = graphql`
    query ($selfTag: String!, $postLimit: Int!, $postSkip: Int!) {
        allMarkdownRemark(
            filter: { fields: { tags: { in: [$selfTag] } } }
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
    }
`
