---
title: Channel List
date: 2019-12-01
tags:
    - Kotlin
    - React
    - CSS
featured: true
featuredImage: ./channel-list.png
---

When my apartment complex's posted TV channel listings didn't match up with what my TV actually registered, I decided to over-engineer a bit of a solution for myself.

<!-- endexcerpt -->

The web app is built with Gradle on Travis CI and deployed to Netlify. The site is proxied by Cloudflare to be available at [channel-list.jackwarren.info](https://channel-list.jackwarren.info). A small preview is below:

<iframe src="https://channel-list.jackwarren.info" style="width:100%;height:400px;"></iframe>

The source code is available [on GitHub](https://github.com/jack-r-warren/channel-list-gradle).

For this project, I decided to dip my toes into a few technologies I hadn't worked with much before:

-   Kotlin (Despite primarily targeting the JVM, this JetBrains-developed language can transpile to JavaScript)
-   React (Community-provided Kotlin type bindings exist for common JavaScript packages, allowing seamless usage)

I also made use of a few things I had a bit more experience with:

-   Gradle (Kotlin/JS's Gradle plugin handles JavaScript dependencies and building)
-   Travis CI (Netlify can't handle JVM builds, so Travis CI handles the CI/CD by simply pushing the generated static files to Netlify)

The end product is fairly simple:

1. Channels are loaded and parsed from `.json` upon loading the app in the browser
2. Typing in the top bar filters results upon each key press
3. Clicking or tapping on a channel opens a small modal with instructions on how to use Alexa in the apartment to change the TV to that channel

The simplicity here is key: channels can be easily edited via the configuration file, the interface behaves well on mobile devices, and the modal smoothes over special cases in the Alexa logic. Beyond solving a real-world problem, building this web app was a great intro to React and it was what ultimately inspired me to remake my [own website](/posts/projects/jackwarren-info/) from scratch.

### Update (2/10/2020)

Upgraded from the old IntelliJ build system and Yarn build and dependency system to the new Gradle plugins for the same functionality. Also moved from manual deployment to GitHub pages to Travis CI automatically deploying to Netlify.
