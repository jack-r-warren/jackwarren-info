require(`dotenv`).config()

module.exports = {
    siteMetadata: {
        siteUrl:
            (process.env.CONTEXT === "production" ||
            process.env.CONTEXT === "development"
                ? process.env.URL
                : process.env.DEPLOY_PRIME_URL) || "https://jackwarren.info",
        title: `Jack Warren`,
        description: `Blog posts, tutorials, and projects from a cybersecurity undergrad at Northeastern University`,
        author: `Jack Warren`,
        authorTwitter: `_jwarren`,
        authorLinkedIn: `jack-r-warren`,
        authorKeybase: `jackwarren`,
        email: `jack@jackwarren.info`,
        siteRepository: `https://github.com/jack-r-warren/jackwarren-info`,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-sharp`,
        `gatsby-plugin-netlify`,
        `gatsby-plugin-netlify-cache`,
        `gatsby-plugin-catch-links`,
        `gatsby-transformer-sharp`,
        `gatsby-transformer-json`,
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                excerpt_separator: `<!-- endexcerpt -->`,
                plugins: [
                    `gatsby-remark-autolink-headers`,
                    `gatsby-remark-responsive-iframe`,
                    {
                        resolve: `gatsby-remark-copy-linked-files`,
                        options: {
                            ignoreFileExtensions: [`png`, `jpg`, `jpeg`],
                            destinationDir: f =>
                                `downloads/${f.hash}/${f.name}`,
                        },
                    },
                    {
                        resolve: `gatsby-remark-table-of-contents`,
                        options: {
                            exclude: "((?:Table of )?Contents|In this post)",
                            tight: false,
                            fromHeading: 1,
                            toHeading: 6,
                        },
                    },
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            inlineCodeMarker: "›",
                            showLineNumbers: true,
                            prompt: {
                                user: "jack",
                                host: "localhost",
                                global: true,
                            },
                        },
                    },
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            // _variables.scss $tablet-maximum minus
                            // layout.module.scss main-box padding
                            maxWidth: 864,
                            showCaptions: [`title`],
                            backgroundColor: `transparent`,
                        },
                    },
                ],
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `markdown`,
                path: `${__dirname}/src/markdown`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `data`,
                path: `${__dirname}/src/data`,
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `jackwarren.info`,
                short_name: `Jack Warren`,
                start_url: `/`,
                background_color: `#fff`,
                theme_color: `#fff`,
                display: `minimal-ui`,
                icon: `src/images/favicon.svg`,
                icon_options: {
                    purpose: `maskable`,
                },
            },
        },
        {
            resolve: `gatsby-plugin-robots-txt`,
            options: {
                resolveEnv: () => process.env.CONTEXT || "development",
                env: {
                    production: {
                        policy: [{ userAgent: "*" }],
                    },
                    development: {
                        policy: [{ userAgent: "*", disallow: ["/"] }],
                        sitemap: null,
                        host: null,
                    },
                    "branch-deploy": {
                        policy: [{ userAgent: "*", disallow: ["/"] }],
                        sitemap: null,
                        host: null,
                    },
                    "deploy-preview": {
                        policy: [{ userAgent: "*", disallow: ["/"] }],
                        sitemap: null,
                        host: null,
                    },
                },
            },
        },
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                  {
                    site {
                      siteMetadata {
                        title
                        description
                        siteUrl
                      }
                    }
                  }
                `,
                feeds: [
                    {
                        serialize: ({ query: { site, allMarkdownRemark } }) => {
                            return allMarkdownRemark.edges.map(edge => {
                                return Object.assign({}, edge.node.fields, {
                                    description: edge.node.excerpt,
                                    url:
                                        site.siteMetadata.siteUrl +
                                        edge.node.fields.slug,
                                    guid:
                                        site.siteMetadata.siteUrl +
                                        edge.node.fields.slug,
                                    // RSS categories are just a list of strings
                                    categories: edge.node.fields.categories
                                        .map(cat => cat.split("/").pop())
                                        .filter(cat => cat !== ""),
                                })
                            })
                        },
                        query: `
                          {
                            allMarkdownRemark(
                              filter: {fields: {categories: {in: ["/posts"]}, date: {ne: null}}} 
                              sort: {order: DESC, fields: fields___date}) 
                            {
                              edges {
                                node {
                                  excerpt
                                  fields {
                                    title
                                    date
                                    slug
                                    categories
                                  }
                                }
                              }
                            }
                          }
                        `,
                        output: "/rss.xml",
                        title: "jackwarren.info RSS",
                        match: "^/posts/",
                    },
                ],
            },
        },
        `gatsby-plugin-sitemap`,
        `gatsby-plugin-offline`,
    ],
}
