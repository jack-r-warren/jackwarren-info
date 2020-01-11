const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)
const _ = require(`lodash`)
const { attachFields } = require(`gatsby-plugin-node-fields`)

const DEFAULT_FEATURED_IMAGE = "images/default.jpg"

// Description for fields to be created by gatsby-plugin-node-fields
const descriptors = [
    {
        predicate: node => node.internal.type === "MarkdownRemark",
        fields: [
            {
                name: "slug",
                getter: (node, context, actions, getNode) =>
                    createFilePath({ node, getNode }),
                validator: value => value != null,
            },
            {
                name: "title",
                getter: node => node.frontmatter.title,
                validator: value => value != null,
            },
            {
                name: "date",
                getter: node => node.frontmatter.date,
                defaultValue: null,
            },
            {
                name: "tags",
                getter: node => node.frontmatter.tags,
                defaultValue: [],
            },
            {
                name: "featured",
                getter: node => node.frontmatter.featured,
                defaultValue: false,
            },
            {
                name: "featuredImage",
                getter: node => node.frontmatter.featuredImage,
                defaultValue: (node, context, actions, getNode) =>
                    [
                        ...createFilePath({ node, getNode })
                            .split("/")
                            .filter(s => s !== "")
                            .map(() => ".."),
                        DEFAULT_FEATURED_IMAGE,
                    ].join("/"),
            },
            {
                name: "categories",
                getter: (node, context, actions, getNode) =>
                    createFilePath({ node, getNode })
                        .split("/")
                        .filter(s => s !== "")
                        .slice(0, -1)
                        .reduce(
                            (soFar, current) => [
                                ...soFar,
                                soFar.length === 0
                                    ? `/${current}`
                                    : `${soFar.slice(-1)[0]}/${current}`,
                            ],
                            []
                        ),
            },
        ],
    },
]

exports.onCreateNode = ({ node, getNode, actions }) => {
    attachFields(node, actions, getNode, descriptors)
}

exports.createPages = async ({ graphql, actions }) => {
    const { createPage, createRedirect } = actions
    const createFirstPageRedirect = baseSlug =>
        createRedirect({
            fromPath: `${baseSlug}/1`,
            isPermanent: true,
            redirectInBrowser: true,
            toPath: baseSlug,
        })

    const result = await graphql(`
        query {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                            categories
                            tags
                        }
                    }
                }
            }
        }
    `)

    // Category pages
    const POSTS_PER_CATEGORY_PAGE = 10
    const categoryList = result.data.allMarkdownRemark.edges.flatMap(
        ({ node }) => node.fields.categories
    )
    const categoriesByCount = _.countBy(categoryList)
    const categorySet = [...new Set(categoryList)]
    _.forIn(categoriesByCount, (postsInCategory, categorySlug) => {
        const pagesNeeded = Math.ceil(postsInCategory / POSTS_PER_CATEGORY_PAGE)
        Array.from({ length: pagesNeeded }).forEach((undefinedItem, index) => {
            createPage({
                path:
                    index === 0 ? categorySlug : `${categorySlug}/${index + 1}`,
                component: path.resolve(`./src/templates/category-posts.js`),
                context: {
                    selfCategory: categorySlug,
                    childCategories: categorySet.filter(
                        s =>
                            s.startsWith(categorySlug) &&
                            // We only want shallow subcategories
                            s.split("/").length ===
                                categorySlug.split("/").length + 1
                    ),
                    parentCategories: categorySet
                        .filter(
                            s =>
                                categorySlug.startsWith(s) && categorySlug !== s
                        )
                        .sort((a, b) => a.length - b.length),
                    postLimit: POSTS_PER_CATEGORY_PAGE,
                    postSkip: index * POSTS_PER_CATEGORY_PAGE,
                    totalPages: pagesNeeded,
                    selfPage: index + 1,
                },
            })
        })

        // If we have any pages at all for this category, make /1 redirect to
        // the base page
        if (pagesNeeded > 0) {
            createFirstPageRedirect(categorySlug)
        }
    })

    // Tag pages
    const POSTS_PER_TAG_PAGE = 10
    const tagList = result.data.allMarkdownRemark.edges.flatMap(
        ({ node }) => node.fields.tags
    )
    const tagsByCount = _.countBy(tagList)
    _.forIn(tagsByCount, (postsWithTag, tag) => {
        const pagesNeeded = Math.ceil(postsWithTag / POSTS_PER_TAG_PAGE)
        const baseSlug = `/tags/${_.kebabCase(tag)}`
        Array.from({ length: pagesNeeded }).forEach((undefinedItem, index) => {
            createPage({
                path: index === 0 ? baseSlug : `${baseSlug}/${index + 1}`,
                component: path.resolve(`./src/templates/tag-posts.js`),
                context: {
                    selfTag: tag,
                    selfTagSlug: baseSlug,
                    postLimit: POSTS_PER_TAG_PAGE,
                    postSkip: index * POSTS_PER_TAG_PAGE,
                    totalPages: pagesNeeded,
                    selfPage: index + 1,
                },
            })
        })

        // If we have any pages at all for this tag, make /1 redirect to the
        // base page
        if (pagesNeeded > 0) {
            createFirstPageRedirect(baseSlug)
        }
    })

    // Post pages
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/post.js`),
            context: {
                slug: node.fields.slug,
            },
        })
    })

    // Permanent redirects from my old site
    _.forIn(
        {
            // new : (old | [old])

            // projects
            "/posts/projects/racket-piazza/": "/blog/racket-piazza/",
            "/posts/projects/racket-antivirus/": "/blog/simple-antivirus/",
            "/posts/projects/minishell/": "/blog/minishell/",
            "/posts/projects/robotic-arm/": "/blog/robotic-arm/",

            // guides
            // racket
            "/posts/guides/racket/racket-command-line/":
                "/blog/racket-command-line/",
            "/posts/guides/racket/racket-system-access/":
                "/blog/racket-system-access/",
            // console
            "/posts/guides/console/wsl-config/": "/blog/zsh/",
            "/posts/guides/console/cmder-tasks/": "/blog/cmder-tasks/",
            "/posts/guides/console/": [
                "/blog/ssh-keys/",
                "/blog/cmder-and-windows/",
                "/blog/cmder-windows-consoles/",
                "/blog/wsl-windows-aliases/",
                "/blog/linux-console-extensions/",
                "/blog/ls-colors/",
                "/blog/wsl/",
                "/blog/cmder/",
            ],
        },
        (oldPaths, newPath) =>
            _.forEach(
                Array.isArray(oldPaths) ? oldPaths : [oldPaths],
                oldPath => {
                    createRedirect({
                        fromPath: oldPath,
                        isPermanent: true,
                        toPath: newPath,
                    })
                }
            )
    )
}
