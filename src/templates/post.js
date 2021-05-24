import React from "react"
import { graphql } from "gatsby"
import rehypeReact from "rehype-react"
import Layout from "../components/layout/layout"
import Metadata from "../components/layout/metadata"
import DarkModeSwitch from "../components/layout/dark-mode-switch/dark-mode-switch"
import "../styles/code-format.scss"
import CutOut from "../components/layout/cut-out/cut-out"
import StyleDemo from "../components/style-demo/style-demo"
import ClickToCopy from "../components/click-to-copy/click-to-copy"
import Note from "../components/note/note"
import { categoryString, dateString, tagString } from "../util/post-util"

import postStyles from "./post.module.scss"

export default ({ data }) => {
    const post = data.markdownRemark
    const info = [
        ...(categoryString(post) || []),
        ...(dateString(post) || []),
        ...(tagString(post) || []),
    ]
    const joinedInfo =
        info.length > 1
            ? info.reduce((prev, curr) => [prev, "\u00A0• ", curr])
            : info

    // Use rehype to make custom components available in markdown files
    // noinspection JSPotentiallyInvalidConstructorUsage
    const renderAst = new rehypeReact({
        createElement: React.createElement,
        components: {
            "dark-mode-switch": DarkModeSwitch,
            "cut-out": CutOut,
            "style-demo": StyleDemo,
            "click-to-copy": ClickToCopy,
            note: Note,
        },
    }).Compiler

    return (
        <Layout>
            <Metadata
                title={post.fields.title}
                description={post.excerpt || ``}
            />
            <div className={postStyles.content}>
                {joinedInfo.length > 0 && (
                    <h4 className={postStyles.info}>{joinedInfo}</h4>
                )}
                <h1>{post.fields.title}</h1>
                {renderAst(post.htmlAst)}
            </div>
        </Layout>
    )
}

export const query = graphql`
    query ($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            fields {
                slug
                categories
                title
                date(formatString: "MMMM Do, Y")
                tags
            }
            htmlAst
            excerpt(format: PLAIN)
        }
    }
`
