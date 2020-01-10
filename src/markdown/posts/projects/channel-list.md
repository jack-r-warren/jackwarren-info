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

The web app is deployed to GitHub pages [right here](https://jack-r-warren.github.io/channel-list/), and I've embedded it below too:

<iframe src="https://jack-r-warren.github.io/channel-list/" style="width:100%;height:350px"></iframe>

The source code is available [on GitHub](https://github.com/jack-r-warren/channel-list).

For this project, I decided to dip my toes into a few technologies I hadn't worked with much before:

-   Kotlin (Despite primarily targeting the JVM, this JetBrains-developed language can transpile to JavaScript)
-   React (Community-provided Kotlin type bindings exist for common JavaScript packages, allowing seamless usage)

The end product is fairly simple:

1. Channels are loaded and parsed from `.json` upon loading the app in the browser
2. Typing in the top bar filters results upon each key press
3. Clicking or tapping on a channel opens a small modal with instructions on how to use Alexa in the apartment to change the TV to that channel

The simplicity here is key: channels can be easily edited via the configuration file, the interface behaves well on mobile devices, and the modal smoothes over special cases in the Alexa logic. Beyond solving a real-world problem, building this web app was a great intro to React and it was what ultimately inspired me to remake my [own website](/posts/projects/jackwarren-info/) from scratch.
