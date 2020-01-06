require(`dotenv`).config()

module.exports = {
    siteMetadata: {
        siteUrl: process.env.SITE_URL || `https://jackwarren.info`,
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
        `gatsby-transformer-sharp`,
        `gatsby-plugin-netlify`,
        "gatsby-plugin-netlify-cache",
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                excerpt_separator: `<!-- endexcerpt -->`,
                plugins: [
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
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `jackwarren.info`,
                short_name: `Jack Warren`,
                start_url: `/`,
                background_color: `#fff`,
                theme_color: `#fff`,
                display: `minimal-ui`,
                icon: `src/images/favicon.png`,
                icon_options: {
                    purpose: `maskable`,
                },
            },
        },
        `gatsby-plugin-offline`,
    ],
}
