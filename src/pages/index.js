import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout/layout"
import ProfileImage from "../components/profile-image"
import Metadata from "../components/metadata"
import PostList from "../components/post-list/post-list"

import indexStyles from "./index.module.scss"

const IndexPage = ({ data }) => (
    <Layout>
        <Metadata title="Home" />
        <div className={indexStyles.container}>
            <div className={indexStyles.profile}>
                <ProfileImage />
            </div>
            <div className={indexStyles.leader}>
                <h1>Hi, I'm Jack Warren</h1>
                <h3>
                    I’m an undergrad studying cybersecurity at Northeastern
                    University
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
            sort: { fields: [fields___date], order: DESC }
            limit: 5
        ) {
            nodes {
                excerpt(format: PLAIN)
                fields {
                    slug
                    title
                }
            }
        }
    }
`

export default IndexPage
