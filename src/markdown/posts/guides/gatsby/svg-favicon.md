---
title: Using an SVG Favicon in Gatsby
date: 2020-01-15
tags:
    - Gatsby
    - React
---

Using an [SVG favicon](https://caniuse.com/#feat=link-icon-svg) in a Gatsby site can be a bit tricky, because it is one of the only times where you don't want to inline the SVG.

<!-- endexcerpt -->

My site generally uses [gatsby-plugin-manifest](https://www.gatsbyjs.org/packages/gatsby-plugin-manifest/#automatic-mode-configuration) for making rasterized favicons from my SVG file:

```javascript
module.exports = {
    // ...
    plugins: [
        // ...
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                // ...
                icon: `src/images/favicon.svg`,
                icon_options: {
                    purpose: `maskable`,
                },
            },
        },
    ],
}
```

Even if the source image is an SVG, that plugin can't help with making the SVG source available on the site (even if you try to use its [hybrid mode](https://www.gatsbyjs.org/packages/gatsby-plugin-manifest/#hybrid-mode-configuration)).

One potential solution would be to place a file in your `public` folder manually, commit it, and then hard-code a link to it in configuration for something like [gatsby-plugin-react-helmet](https://www.gatsbyjs.org/packages/gatsby-plugin-react-helmet/).

That solution is messy, though: in my case the entire `public` folder was generated and I didn't want to break that paradigm. What I wanted was to have static generation place my SVG favicon into the `public` folder automatically. Importing the favicon into a JavaScript file like you would any other image will actually inline it, because the file size is so small.

So how can you import an image without any risk of inlining it?

Gatsby (and GraphQL to the rescue): you can query the URL of a file and Gatsby will copy the file to `public/static/` with a hashed filename. There's a few steps:

### Make sure your icon can be accessed

Your icon will need to be in a folder read by an instance of [gatsby-source-filesystem](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/):

```javascript{5-11}
module.exports = {
    // ...
    plugins: [
        // ...
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                // ...
                icon: `src/images/favicon.svg`,
                icon_options: {
                    purpose: `maskable`,
                },
            },
        },
    ],
}
```

### Query with GraphQL

You can craft a query using GraphiQL, but it might look something like this

```graphql
query SvgIconQuery {
    allFile(
        limit: 1
        filter: {
            name: { eq: "favicon" }
            ext: { eq: ".svg" }
            sourceInstanceName: { eq: "images" }
            relativeDirectory: { eq: "" }
        }
    ) {
        edges {
            node {
                publicURL
            }
        }
    }
}
```

### Make use of the URL

I use the children syntax for my usage of Helmet, so your usage might look a little different. You can look at the full example [here on GitHub](https://github.com/jack-r-warren/jackwarren-info/blob/master/src/components/layout/metadata.js).

```javascript{17-29,39-44}
// In metadata.js, a React component I wrote
// to wrap Helmet:

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

    return (
        <Helmet
        // ...
        >
            // ...
            <link
                rel="icon"
                href={allFile.nodes[0].publicURL}
                type="image/svg+xml"
                sizes="any"
            />
            // ...
        </Helmet>
    )
}

export default Metadata
```

Please [let me know](/contact) if you have any ideas, suggestions, or questions!
