# [jackwarren.info](https://jackwarren.info)

[![Netlify Status](https://api.netlify.com/api/v1/badges/d5c1c4a8-c3aa-4940-8cb9-c8511672e545/deploy-status)](https://app.netlify.com/sites/jackwarren-info/deploys)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

This is the codebase behind my personal website.

The site is built with React, using Gatsby for static generation, Sass for styling, and Remark for Markdown processing.

The site is deployed to Netlify and proxied by Cloudflare.

The site is fully copyrighted by Jack Warren; more information is available in the LICENSE file.

## Configuration

### Environment Variables

-   `URL` - The base URL of the website, with the leading protocol and without the trailing slash
    -   Set automatically by Netlify during deployment
    -   Defaults to `https://jackwarren.info`
-   `CONTEXT` - The context for building
    -   Set automatically by Netlify [during deployment](https://docs.netlify.com/site-deploys/overview/#deploy-contexts)
    -   Defaults to `development`
-   `DEPLOY_PRIME_URL` - The specific URL of the deployment
    -   Set automatically by Netlify during deployment
    -   Only used if the `CONTEXT` is not `development` or `production`
    -   Can be ignored for development purposes (used automatically in Netliy branch deployments and deployment previews)

[Dotenv](https://www.npmjs.com/package/dotenv) is configured in this project and it is the recommended way to set these variables.

For a local development environment, create a `.env` file at the root of the project containing the following:

```
URL=http://localhost:8000
CONTEXT=development
```

### GraphQL

The GraphQL endpoint is only available during development/rendering.

The `.graphqlconfig` assumes the schema will be available at Gatsby's development-time default of `http://localhost:8000/___graphql`.

## Running

You'll need [Node.js, npm](https://www.gatsbyjs.org/tutorial/part-zero/#-install-nodejs-and-npm), and [Git](https://www.gatsbyjs.org/tutorial/part-zero/#install-git).

Install the Gatsby CLI if you don't have it already:

```shell script
npm install -g gatsby-cli
```

### Command line

Clone down this repository:

```shell script
git clone git@github.com:jack-r-warren/jackwarren-info.git
```

For local development, run the development server:

```shell script
npm run develop
```

To make the development server available on your local network (assuming your firewall allows access to port 8000):

```shell script
npm run develop -- --host=0.0.0.0
```

To make a production build:

```shell script
npm run build
```

### WebStorm

Create a new project from version control with this URL:

```
git@github.com:jack-r-warren/jackwarren-info.git
```

WebStorm will autodetect the npm scripts available in the project for tasks like building and formatting.

Several run configurations have been defined for common actions:

-   `develop`: Run the development server
-   `develop host`: Run the development server so it is available on your local network (assuming your firewall allows access to port 8000)
-   `format`: Apply code formatting style to the project

## Tooling

[Prettier](https://prettier.io/) is used for code formatting, and is called by the `format` npm task.

[Husky](https://www.npmjs.com/package/husky) is used to run `pretty-quick` before all commits.

[Stylelint](https://stylelint.io/) is used for additional SCSS linting.
