import React from "react"
import { graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout/layout"
import Metadata from "../components/layout/metadata"
import PostList from "../components/post-list/post-list"

import indexStyles from "./index.module.scss"

const IndexPage = ({ data }) => (
    <Layout>
        <Metadata title="Home" />
        <div className={indexStyles.container}>
            <StaticImage
                className={indexStyles.profile}
                src="../images/profile.png"
                alt="Profile headshot"
                layout="constrained"
                placeholder="blurred"
                // _variables.scss / $phone-maximum
                width={480}
                quality={100}
            />
            <div className={indexStyles.leader}>
                <h1>Hi, I’m <a rel="me" href="https://hachyderm.io/@jackwarren">Jack Warren</a></h1>
                <h3>
                    Senior Software Engineer, DevOps <br />@{" "}
                    <a href="https://www.broadinstitute.org/">
                        Broad Institute of MIT and Harvard
                    </a>
                </h3>
                <h3>
                    <Link to={"/contact"}>Contact →</Link>
                </h3>
            </div>
        </div>
        <h3>Recent Posts</h3>
        <PostList postNodes={data.allMarkdownRemark.nodes} />
        <h3 className={indexStyles.noMargin}>
            <Link to={"/posts"}>All Posts</Link>
        </h3>
    </Layout>
)

export const query = graphql`
    query {
        allMarkdownRemark(
            filter: { fields: { categories: { in: ["/posts"] } } }
            sort: { fields: [fields___date], order: DESC }
            limit: 5
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

export default IndexPage
