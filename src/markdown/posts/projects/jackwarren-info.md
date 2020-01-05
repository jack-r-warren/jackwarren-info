---
title: Personal Website
date: 2020-01-01
tags:
    - CSS
    - JavaScript
    - React
    - Gatsby
featured: true
---

This site itself is one of the projects of which I'm proudest. It is entirely self-designed with a fast, modern stack behind it.

<!-- endexcerpt -->

## Concept

I made this site's predecessor in high school using Squarespace's platform. At the time, it was a great way to showcase my work without saddling myself with upkeep and maintenance.

Into early college, though, I started using it as a blogging platform, and found that it was simply too restrictive. The breaking point was when I'd direct people to my GitHub account to look at my projects, because the "README" files there could be formatted better than the blog posts on my own site.

For a new site, I wanted a few things:

-   I wanted to learn something new—languages, frameworks, deployment, something
-   I wanted to be able to write blog posts in Markdown—not pasted into a CMS; literal `.md` files
-   I wanted code blocks in blog posts to be well formatted (long an issue with Squarespace)

Along the way, I added quite a few more things to my list. Read on for a rundown of what I ended up with.

## Overview

This website is built with [Gatsby](https://www.gatsbyjs.org/), a [React](https://reactjs.org/) framework that uses [GraphQL](https://graphql.org/) to bring data into static site generation. This approach, also known as [JAMstack](https://jamstack.org/), means that the site isn't closely coupled to the server: it is a client-side web app at heart.

In the case of my website, I use Gatsby's site generation to transform and package content so that visitors get the benefit of quick, static pages while I get the benefit of a developer- and writer-friendly environment.

## Features

### Light and Dark Mode

<cut-out>
    <dark-mode-switch/>
</cut-out>

I happen to swear by light mode, but those who prefer dark can find it jarring when they are met with a bright website.

The best of both worlds? Light and dark modes, automatically set based on device preference, user-customizable, and persistent between visits.

This works by using CSS variables and HTML attributes for wide browser support. The toggle switch uses React hooks and synchronizes itself across all instances of the component on a page.

Many thanks to [Ananya Neogi](https://dev.to/ananyaneogi)'s [excellent article](https://dev.to/ananyaneogi/create-a-dark-light-mode-switch-with-css-variables-34l8) on the subject and Mozilla's web documentation on browser feature support.

### Design Scheme

<div>
    <style-demo/>
</div>

A color scheme switch isn't any good without a design language that stays cohesive and legible.

For the color scheme, thanks go to Google's [Material Design Color Tool](https://material.io/resources/color) for color and legibility info and [this tweet](https://twitter.com/steveschoger/status/1151160261170126850) by [Steve Schoger](https://twitter.com/steveschoger) for pointers on depth cues in dark modes. Typography is done via [Kyle Matthews'](https://github.com/KyleAMathews) [typeface packages](https://github.com/KyleAMathews/typefaces), and [Sass](https://sass-lang.com/) and [Gatsby's support for style modules](https://www.gatsbyjs.org/docs/css-modules/) help wire it all up.

### Code Blocks

```javascript{5}
// Run each time the default theme changes
useEffect(() => {
    // If we aren't storing a user preference for the theme,
    // update the theme to match the new default
    if (!localStorage.getItem("theme")) setCurrentTheme(defaultTheme)
}, [defaultTheme])
```

To match with the light and dark modes, Markdown code blocks are styled to automatically switch between light and dark solarized color schemes. The syntax analysis is done at the point of the site's generation, resulting in a fast client experience.

Thanks here go to [Prism](https://prismjs.com/) and Gatsby's [plugin and resources for it](https://www.gatsbyjs.org/packages/gatsby-remark-prismjs). The solarized color scheme was originally created by [Ethan Schoonover](https://ethanschoonover.com/solarized/) and my adaptation of it is based on [Hector Matos's](https://krakendev.io/) [Prism port](https://github.com/PrismJS/prism/blob/master/themes/prism-solarizedlight.css).

### Deployment

<a href="https://app.netlify.com/sites/jackwarren-info/deploys">
    <img src="https://api.netlify.com/api/v1/badges/d5c1c4a8-c3aa-4940-8cb9-c8511672e545/deploy-status" alt="Netlify Status Indicator" style="border-radius: unset; margin: 0;">
</a>

This site is deployed to [Netlify](https://www.netlify.com/), with their GitHub integration providing a continuous deployment pipeline.

Security headers and redirects are made courtesy of [gatsby-plugin-netlify](https://www.gatsbyjs.org/packages/gatsby-plugin-netlify/).

### Addendum: Details

I'm a bit of a perfectionist, and there's a lot of work I've done on this site that doesn't condense down to a list of features. Some of the smaller highlights that didn't make the cut:

-   In code blocks, the line numbers hide on mobile for easier skimming
-   It might not be obvious on first glance, but the post pages aren't the only thing generated from markdown: category and link pages are entirely generated too, complete with statically-generated pagination
-   Inline click-to-copy functionality from the contact page is nice and portable: <click-to-copy copy="jack@jackwarren.info">try me!</click-to-copy>
-   Markdown parsing is augmented to render custom components (this entire page is just a Markdown file)
-   [gatsby-plugin-manifest](https://www.gatsbyjs.org/packages/gatsby-plugin-manifest) and [gatsby-plugin-offline](https://www.gatsbyjs.org/packages/gatsby-plugin-offline) make this site work offline as a Progressive Web App
-   There's a significant amount of linting and workflow support in this site's codebase: beyond what Gatsby already packages in, [Prettier](https://prettier.io/), [Husky](https://github.com/typicode/husky), [stylelint](https://stylelint.io/), and a reflected GraphQL schema are all in use.
