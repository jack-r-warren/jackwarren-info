---
title: Auto CSP - Trials and Tribulations
date: 2020-06-29
tags:
    - Kotlin
    - HTTP
    - CSP
---

This post is continued from the previous one in this series, [The (Proposed) Solution](/posts/projects/auto-csp/the-solution).

Actually getting the design I previously laid out working was, to put it lightly, extremely difficult. I've worked on hard problems before, with less knowledge going into it. This one, though, made me frankly fairly dejected about the state of web security as a consequence of trying to develop software for it.

In other words, what I set out to do wasn't supposed to be terribly difficult. I think the fact that it was begins to explain why web security is so awful. The issues I list here aren't all with standards and documentation, some are more related to the stack I was using. However, I wasn't exactly using some antiquated tool for the job: this was greenfield development and I was choosing the software I honestly thought would work best. These issues aren't all directly related to my own work either, some are just things I learned about during the course of development.

> In all of this, I mean no ill-will towards the folks who may have worked on any of the things I'm discussing. I don't pretend to have enough experience to weigh in with a full two-cents here; I just looked at this ecosystem with fresh eyes and found myself frustrated. If a cybersecurity kid can get annoyed by all this, I bet some other folks might too.

I've divided this into rough categories.

```toc

```

## Web Standards

### Inline scripts are good web development, depending on who you ask

One of the great things I got to make use of when [building my website](/posts/projects/jackwarren-info/) was how my stack helped me embed things so there were fewer requests needed to the server. It just to happens that this runs antithetical to everything CSP is supposed to do, since needing to allow `'unsafe-inline'` for scripts defeats half the point.

Yes, there's solutions to this issue, which suppose that if you know the inline code you want to send you can nonce or hash it. However...

### Most web developers don't know everything on their own sites

I built my own website by hand, using frameworks to avoid my website looking old and essentially putting my resume in a bad light. The result is that _I'm actually not in control of the code I put out_. Yes, I could manually find and hash the inline scripts that parts of the Gatsby framework embed in my site. No, I won't do that, because for _security reasons_ I use Dependabot to automatically update my stack. I'm way more interested in automatic, timely updates than I am hashing all the inline scripts on my website.

In other words, I think there's a significant disconnect between the people creating these web security standards and the people developing websites using frameworks. That isn't to say that the large companies are doing a great job of using CSP either...

### CDNs make CSP look ridiculous

I use Netlify and CloudFlare for hosting and proxying on my website. This, in turn, means that there's servers that I don't control who will be contacted in the course of my website loading. If I run Auto CSP on my own website, the output is littered with referenced to a random subdomain of Amazon's Cloudfront CDN, which could change at any time.

```text
... font-src https://d33wubrfki0l68.cloudfront.net; img-src 'self' data: https://d33wubrfki0l68.cloudfront.net https://api.netlify.com; ...
```

I intended to go to Amazon's own website to show that they had to resort to wildcarding their own CDN, but I instead found that they don't use a CSP, which I suppose might also prove my point.

### Deprecation before implementation

For some reason I can't fathom, [report-uri](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri) is deprecated before [report-to](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to) has been implemented in anything other than Chromium ([and Google's docs say you need a flag to enable it in Chrome](https://developers.google.com/web/updates/2018/09/reportingapi#header)). I have the luxury of being a college student with lots of time to kill during the COVID-19 pandemic, but if I had asked any of the folks I have built websites for if I could add some deprecated or unsupported features to their site, the answer would've been a firm no.

I'm not at all saying that the existing API can't be improved upon--in fact, I had planned to make Auto CSP work with Feature Policy too until I realized it had no reporting mechanism at all--but deprecating the only working thing is hostile to developers and makes it harder for an honest business justification.

### APIs that only get 90% of the way there

This is the trickiest issue that I have with the web standards I worked with. In all the research of existing work I did, a few places mentioned that using a full browser for crawling had the benefit of executing JavaScript, which could load resources or do things that could trigger CSP violations after the page had "loaded," thus giving full coverage for finding violations.

However, I noticed something when I ran one of the early iterations of my program on my own site:

```text
... form-action 'none'; ...
```

Well, that's weird, because I definitely have a [contact form](/contact). Sure enough, that form did have an action:

```html
<form
    name="contact"
    method="post"
    action="/contact/thanks"
    data-netlify="true"
    data-netlify-honeypot="bot-field"
>
    ...
</form>
```

In retrospect, it was easy to see why my approach didn't work: because the crawler never tried to use the form, it never got a violation from the `form-action` directive, so it never modified it.

Fixing this issue was surprisingly annoying--I ended up using Regex to detect this sort of case and manually adjust the `form-action` directive as if a report had been sent. While this is an edge case, it goes a long way towards concluding that reports can't actually meaningfully inform a CSP. Even in the case of the earlier-mentioned research work using real users and heuristics to adjust the CSP, I get a few thousand hits on my website a month and maybe one or two contact form hits. I don't have a useful heuristic available to adjust the CSP to account for `form-action` unless I just adjust to anything I get a report about, which is less than helpful.

## Web Ecosystem

These issues have a bit more to do with the technologies I chose rather than web standards, but they still impacted my work and I think there are improvements that could be done here.

### Browser PWA support

My website uses service workers to run offline. I didn't code that, it is courtesy of [gatsby-plugin-offline](https://www.gatsbyjs.org/packages/gatsby-plugin-offline/). Nonetheless, I found that Auto CSP didn't work reliably on my own site because the PWA would cache things and change how requests were made. One would think that there would be a command line flag to disable such a thing, or at least some capability for that in Selenium. No such luck. Online answers suggest _using Selenium to click through to the browser's UI settings page to clear local storage data_.

For Chrome, at least, I found out that the `--disable-local-storage` flag actually also disables PWA. That, of course, also means that I end up disabling cookies, which makes Auto CSP not work great on sites that actually use cookies.

### Chrome incognito mode happily uses service workers

Logic would have it that I could address the above case by using a browser's incognito mode. It turns out that Chrome will happily make use of existing PWA service workers in incognito mode, and I haven't been able to figure out a way to disable that. This appears to very specifically be a "feature" of how Selenium makes use of Chrome, since I can't replicate this manually. It did throw off my testing for a good while, however.

### Loading after loaded

Selenium will block until pages report that they're done loading. This is great, except it doesn't work at all on modern websites, because in the name of speed (and higher search rankings...) sites will say that they're done loading before everything has actually been loaded in. I have to compensate in Auto CSP by essentially sleeping the thread for a second or so to hopefully let the page actually finish loading.

## Kotlin

I love Kotlin but a few things drove me insane during this project:

### Lack of examples of Gradle Kotlin DSL

The DSL is great but actually figuring out how to do moderately complex things can be extremely aggravating. More examples of `build.gradle.kts` files would go a long way here, because there simply aren't many complex ones.

### Ktor logging is uncontrollably verbose

Ktor is a lovely server library but I despise its default logging. I understand that it is useful in production systems, but it spewing thousands of lines onto my terminal is not necessary (and making it better shouldn't require me digging into unmaintained slf4j packages). This should be something with a much more accessible toggle, at least in my opinion.

### Ktor's understanding of Content-Type is very limited

Specifically in the context of Json parsing, Ktor will proactively reject things with Content-Types other than exactly `application/json`, requiring me to open up Wireshark or start adding print statements to figure out what content type I need to hardcode and add to the [ContentNegotiation plugin](https://ktor.io/servers/features/content-negotiation.html). I would much prefer a more permissive system, even if that was behind a toggle, such that I could say "just trust me, try to parse, and then throw your error if it doesn't work."

Continue on to the next post in this series, [Future Ideas](/posts/projects/auto-csp/future-ideas).
