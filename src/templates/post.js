import React from "react"
import { graphql, Link } from "gatsby"
import _ from "lodash"
import rehypeReact from "rehype-react"
import Layout from "../components/layout/layout"
import Metadata from "../components/metadata"
import DarkModeSwitch from "../components/layout/dark-mode-switch/dark-mode-switch"
import "../styles/code-format.scss"
import CutOut from "../components/layout/cut-out"
import StyleDemo from "../components/style-demo"

import postStyles from "./post.module.scss"
import ClickToCopy from "../components/click-to-copy"

export default ({ data }) => {
    const post = data.markdownRemark
    const info = [
        ...(post.fields.categories.length > 0
            ? [
                  [
                      "In ",
                      post.fields.categories
                          .map(cat => (
                              <Link key={cat} to={cat}>
                                  {_.startCase(cat.split("/").pop())}
                              </Link>
                          ))
                          .reduce((prev, current) => [prev, " / ", current]),
                  ],
              ]
            : []),
        ...(post.fields.date !== null
            ? [<span key={post.fields.date}>{post.fields.date}</span>]
            : []),
        ...(post.fields.tags.length > 0
            ? [
                  post.fields.tags
                      .map(tag => (
                          <Link key={tag} to={`/tags/${_.kebabCase(tag)}`}>
                              {tag}
                          </Link>
                      ))
                      .reduce((prev, curr) => [prev, ", ", curr]),
              ]
            : []),
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
    query($slug: String!) {
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
