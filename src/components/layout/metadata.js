import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { graphql, useStaticQuery } from "gatsby"
import defaultImg from "../../images/default.jpg"
import { globalHistory } from "@reach/router"

function Metadata({ description, title }) {
    const { site, allFile } = useStaticQuery(
        graphql`
            query {
                site {
                    siteMetadata {
                        siteUrl
                        title
                        description
                        author
                        authorTwitter
                    }
                }
                allFile(
                    limit: 1
                    filter: {
                        name: { eq: "favicon" }
                        ext: { eq: ".svg" }
                        sourceInstanceName: { eq: "images" }
                        relativeDirectory: { eq: "" }
                    }
                ) {
                    nodes {
                        publicURL
                    }
                }
            }
        `
    )

    // Trick to get the current path outside of the DOM
    const path = globalHistory.location.pathname
    const metaDescription = description || site.siteMetadata.description

    return (
        <Helmet
            // Workaround for https://github.com/nfl/react-helmet/issues/315
            defer={false}
            // If template can't be used, use just the given title raw
            defaultTitle={title}
            titleTemplate={`%s | ${site.siteMetadata.title}`}
        >
            <html lang="en" />
            <link
                rel="canonical"
                href={`${site.siteMetadata.siteUrl}${path}`}
            />
            <link
                rel="icon"
                // We get a url for this via graphql because we don't want to
                // inline it, which webpack would do for us if we imported it
                // directly
                // Querying publicURL on a file node causes it to be copied
                href={allFile.nodes[0].publicURL}
                type="image/svg+xml"
                sizes="any"
            />
            <meta
                name="viewport"
                content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"
            />

            <title>{title}</title>
            <meta name="description" content={metaDescription} />

            <meta
                name="og:url"
                content={`${site.siteMetadata.siteUrl}${path}`}
            />
            <meta name="og:title" content={title} />
            <meta name="og:description" content={metaDescription} />
            <meta name="og:type" content="website" />
            <meta
                name="og:image"
                content={`${site.siteMetadata.siteUrl}${defaultImg}`}
            />
            <meta name="og:site_name" content={site.siteMetadata.title} />
            <meta name="og:locale" content="en_US" />
            <meta name="og:determiner" content="" />

            <meta name="twitter:card" content="summary" />
            <meta
                name="twitter:site"
                content={`@${site.siteMetadata.authorTwitter}`}
            />
        </Helmet>
    )
}

Metadata.defaultProps = {
    description: ``,
}

Metadata.propTypes = {
    description: PropTypes.string,
    title: PropTypes.string.isRequired,
}

export default Metadata
