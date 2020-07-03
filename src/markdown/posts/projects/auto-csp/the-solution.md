---
title: Auto CSP - The (Proposed) Solution
date: 2020-06-28
tags:
    - Kotlin
    - HTTP
    - CSP
featured: true
featuredImage: code-graphic.png
featuredPriority: 10
---

This post is continued from the previous one in this series, [The Problem](/posts/projects/auto-csp/the-problem).

The core design takes after [Jamie Scaife's work](https://www.jamieweb.net/blog/testing-your-csp-using-travis-ci-and-headless-chrome-crawler/) mentioned in the previous post, with some more flexibility and modern techniques used to try to account for the increasing complexity in both CSP versions and reporting APIs.

## Design

There are three components:

-   a reverse proxy, which sits in between a browser and any server (online or local), rewriting any data from the server to do two things: one, add an overly-restrictive CSP that will trigger every possible violation and report, and two, change any links that would normally go back to the server to instead go to the proxy
-   a reporting endpoint, which works with browsers to receive CSP violation reports and process them into a working final policy
-   an automated browser, which uses breadth-first searching to crawl across pages of the proxied website, triggering CSP violation reports along the way

As with most things, the devil is in the details. A goal for this project was to make it relatively easy to integrate into a Jenkins CI infrastructure. Unlike many CI services, Jenkins is generally run independently by companies that use it, meaning that those companies can set up individual workers ("agents") with dependencies and that those agents can more easily run their "jobs" on a more useful schedule. The point of this project wasn't to create a CI solution, but aiming for it provided good guidelines for how to make the application easy to use given the context.

## Implementation

I opted to use [Kotlin](https://kotlinlang.org/) built with the [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) to get the broad language support of the JVM without the more antiquated issues of Java or Groovy. For the two components that require server architecture, I made use of JetBrains's [Ktor](https://ktor.io/). With Ktor's support for Kotlin coroutines, I'd be able to run all three components at the same time without having to worry about threads or performance issues.

I split the code itself into two Gradle modules, one for the core code and one for a typed object model to represent all the CSP directives and their options.

### Directives Module

The goal of the directives module is to make data about how CSP works available in a programmatic way to bridge the gap between merely collecting reports and creating a policy from them. This object model doesn't perform validation like a browser might, but it can serialize to and deserialize from the browser-readable text format.

The key distinction this module provides is that rather than the proxy component having a hardcoded strictest-possible policy, it can essentially ask "give me all directives, filter for what can generate reports, set each one's options to the strictest possible, and serialize to the browser's format." Similarly, the reporting-endpoint doesn't need extensive logic: it can simply ask the object model to try to adjust a given directive to a report or remove it if no adjustment is possible.

Another benefit here is that this object model can be extensively documented inline. CSP has multiple partially incompatible versions and deprecated parts without implemented replacements. For this software to have any potential of being useful, the data underpinning it needs to be able to keep pace with the web standards in use by browsers.

### Core Module

The core module contains the code for the three components that actually make the application go. Some of the specifics of the components will be mentioned in context with the issues they address in the next post in this series, but a logical flow is given here.

[Clikt](https://ajalt.github.io/clikt/) is used for wrapping the components into something that works from the command line. The components can be run in a hierarchy:

-   just the proxy
-   the proxy and endpoint (allows for manual browsing, similar to [Csper's extension](https://csper.io/docs/generating-content-security-policy))
-   all three components (automatic, similar to Jaime Scaife's aforementioned work, except producing a working policy)

#### Reverse Proxy

Upon receiving a packet from the client, the reverse proxy makes a request to the real server at the same URI. The response from the server is processed in a few ways before being passed to the client:

-   The packet's Location header has its domain replaced to instead reference the proxy
-   The packet's existing CSP headers (if any) are replaced with the new "report-only" strict policy from the directive object model
-   If the packet's Content-Type is some derivative of "text/html":
    -   The contents of the packet are rewritten to replace any instances of the real server's domain with that of the proxy before being forwarded to the client
    -   The contents of the packet are parsed for any links to the same server, which are reported back to the breadth-first search running on the automated browser component
-   If the packet's Content-Type is anything else, the raw packet contents sent along to the client

#### Reporting Endpoint

There are currently two different ways of reporting CSP violations. The one currently in use by browsers is actually deprecated, but its replacement hasn't been formally implemented yet. What has been implemented by browsers is their preference: if the newer method is available, the older method will be ignored completely. In the interest of producing working software not bound to a particular browser, this software supports the older, standardized method. Support for the newer method partially exists: the missing link is an object model to parse the report (since the report lacks a standardized format at this time, reports received in the newer format are simply printed). The endpoint does support CORs preflight requests, per [Google's documentation](https://developers.google.com/web/updates/2018/09/reportingapi#header) on how the new reporting API will likely behave.

As mentioned previously, logic on actually interpreting reports falls to the directives object model. Upon receiving an issue about a URI, the directive will essentially be asked if it can adjust to allow that URI. In the case of many directives, that means delegating to the "src" options to adjust to it. In others, all that can be automatically done is to remove the directive altogether.

#### Automatic Browser

The final piece of the puzzle is an automatic browser. While something that Gradle can't handle on its own, I made the decision to use Selenium to stay as current as possible with web browsers. The application works with either Chrome or Firefox, and expects the proper WebDriver executable to available on the system path. A fairly common use of Jenkins CI in the first place is to better run Selenium tests, so using that framework here isn't the end of the world. Importantly, it means that all web page parsing and CSP report generation is completely decoupled from my own code.

There are costs that come with using a full browser though, as will be discussed in the next post. The rest of this component consists of just a breadth-first search through pages with the only wrinkle being a usage of [Coroutine Actors](https://kotlinlang.org/docs/reference/coroutines/shared-mutable-state-and-concurrency.html#actors) to allow the proxy coroutine to communicate with the automated browser one without breaking concurrency and being a bottleneck.

The code for this project is available on [GitHub](https://github.com/jack-r-warren/auto-csp).

Continue on to the next post in this series, [Trials and Tribulations](/posts/projects/auto-csp/trials-and-tribulations).
