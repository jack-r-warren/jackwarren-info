import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout/layout"
import Metadata from "../components/metadata"
import TagList from "../components/tag-list"
import _ from "lodash"

const AllTagsPage = ({ data }) => (
    <Layout>
        <Metadata title="All Tags" />
        <h1>All Tags</h1>
        <p>
            Every tag on the site, ordered by the number of posts with that tag.
            Clicking on one will show you all posts with that tag.
        </p>
        <p>
            If you're just browsing, you might also be interested in seeing{" "}
            <Link to={"posts/"}>all posts</Link>.
        </p>
        <TagList
            countMap={_.countBy(
                data.allMarkdownRemark.nodes.flatMap(node => node.fields.tags)
            )}
            showTitle={false}
        />
    </Layout>
)

export const query = graphql`
    query {
        allMarkdownRemark {
            nodes {
                fields {
                    tags
                }
            }
        }
    }
`

export default AllTagsPage
