---
title: Auto CSP - Future Ideas
date: 2020-06-30
tags:
    - Kotlin
    - HTTP
    - CSP
---

This post is continued from the previous one in this series, [Trials and Tribulations](/posts/projects/auto-csp/trials-and-tribulations).

This post is something of a retrospective on what I've done and what I could do in the future, mostly separate from the individual issues I faced and have previously discussed.

Essentially, I venture that a report-based system is not sufficient for generating a CSP. I think this might be a bit more accurately shown in the context of a Feature Policy, where the things that would be blocked are less akin to load-time directives like `img-src` and more akin to user-action directives like `form-action`. Feature Policy controls things like phone vibration, which are very unlikely to every be triggered on load, and so an automated crawler simply has a low likelihood of properly triggering reports for the policy to be correctly formed.

At the same time, though, I think trying to hand-roll a web browser for the purpose of generating a security policy is not a smart move. The most critical thing an automatic generator needs to do is access all of the content, and making coverage dependent on parsing and then manually executing/simulating JavaScript to load resources is unnecessary. Similar to how I ended up having to address `form-action`, I think using a browser is the right approach, but instead _every_ packet should be inspected, and that should be the primary way that the policy is developed.

I'm not sure what the best way is to do that sort of inspection. Regex is the first thing that comes to mind, but I suspect that a system parsing the syntax tree of the JavaScript might be a bit more resilient to obfuscation (or at least less prone to human Regex errors).

At the same time, though, I'm not sure that it is a "good" outcome for this project's conclusion to be "well, you'll never get it right unless you roll your own JS, HTML, and CSS parsers, and get them to agree with all major browsers." I think there's a mistake in the threat model of the web standards here: big websites that can afford a CSP are already pretty good at avoiding the things like XSS that it protects against. We need tools that maybe aren't as bulletproof but are a lot easier to implement. The abundance of web frameworks and static site generators should be used to our advantage: they provide platforms we can leverage to detect where resources are being loaded from. Imagine, for a moment, that Gatsby's ability to work with Netlify to influence HTTP headers was used at build-time to hash inline scripts and inject them into the CSP _on a per-page basis_. Gatsby is an extremely flexible static site generator too, more rigid ones might have an even easier time helping out.

The solution here doesn't have to be one-size fits all. Creating a standard like CSP and unleashing it upon web developers doesn't promote its use as much as simply abstracting over it at the framework level would. I have almost zero use for my website working offline, but when adding that feature to every page was as simple as adding a line to my `package.json`, I shrugged my shoulders and went for it. I don't think that CSP is a doomed standard, I just think we as a cybersecurity community need to help make it easier for folks to use.

```kotlin
sealed class UrlMsg
class SendUrls(val urls: Sequence<String>) : UrlMsg()
class GetUrl(val url: CompletableDeferred<String?>) : UrlMsg()

fun CoroutineScope.urlActor(initialQueue: Collection<String> = listOf()) = actor<UrlMsg> {
    val alreadyReceived: MutableSet<String> = initialQueue.toMutableSet()
    val queue = ArrayDeque(initialQueue)
    for (msg in channel) when (msg) {
        is SendUrls -> msg.urls.forEach {
            if (it !in alreadyReceived) {
                alreadyReceived.add(it)
                queue.addLast(it)
            }
        }
        is GetUrl -> msg.url.complete(queue.removeFirstOrNull())
    }
}
```

### Thanks

Many thanks to anyone who makes it through reading this series--I'd be more than happy to talk more about it, so just [let me know](/contact) if you have any questions or comments.
I'd also like to thank [Professor William Robertson](https://wkr.io/) at Northeastern University for guidance in doing this project--his insight was more than useful in pushing me towards what was reasonable and possible with the technology at hand.
