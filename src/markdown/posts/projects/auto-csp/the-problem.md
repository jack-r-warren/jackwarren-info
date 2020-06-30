---
title: Auto CSP - The Problem
date: 2020-06-27
tags:
    - Kotlin
    - HTTP
    - CSP
featured: true
featuredImage: csp-graphic.png
---

When you visit sites online, your browser generally trusts the servers it contacts. Security tools like cryptography can help, but some attacks focus on getting your browser to directly contact a malicious server. All the encryption in the world can't help with those attacks, because the danger isn't that the connection might be tampered with--it is that your computer shouldn't have made that connection in the first place.

There's a number of these sorts of attacks, with Cross Site Scripting ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)) being one of the most common. XSS is essentially a trick to bypass the "same origin policy" that browsers try to use to figure out who they can trust. Servers can help browsers in this process by giving the browser a Content Security Policy ([CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)). A CSP augments the default same origin policy by telling the browser exactly who can be contacted to load what sorts of resources: images, scripts, fonts, etc.

## A Brief Example

In principle, CSP can be wonderfully concise. Let's suppose you visited example.com, and in sending you the web page, it gave your browser the following CSP:

```text
default-src 'self'; img-src 'self' https://example.org;
```

In English, that policy essentially tells the browser "you should only need to load things from me, except for images, which might come from me or https://example.org."

The complexity comes from the quantity of data that an actual CSP usually has to convey. Granularity is key here: a CSP of `default-src *` (with the "\*" meaning "anything") isn't very helpful. Instead, a good CSP should list out every source needed for each "directive" (meaning for images, scripts, fonts, etc) as specifically as possible. The size of the data isn't really problem, as it is just text: the issue is that someone with knowledge of how the site works actually has to sit down and manually enumerate all of those sources. Miss one, or have someone make an update to the site without checking the CSP, and suddenly browsers would freak out and refuse to load parts of the website.

The issue boils down to it being a new enough process that it is still manual. Big companies can afford to keep a CSP updated, but there would be huge benefits to the average person's online security if it was much easier for every site to implement a CSP.

## Existing Work

This problem isn't a new one, and there's been attempts to tackle it before. There are two main approaches: manually parsing website data and predicting where different resources would be loaded from, or actually loading the website for real with a dummy, overly-restrictive CSP and asking the browser to report any violations. [4ARMED has a good comparison of both ways](https://www.4armed.com/blog/how-to-create-content-security-policy/), and for good reason, the second method is much more popular. What actually matters is how a browser will interpret the policy, so building it directly from violations of a fake policy is a good strategy.

[Csper](https://csper.io/docs/generating-content-security-policy) is an example of a fully-fledged service using this report-based method. Its generator assumes you'll install a browser extension and browse a few pages on the target site to trigger enough reports to figure out what needs to be allowed in the policy. A potential issue here is that if the pages you visit aren't actually a representative set of where your site might request resources from, your policy might not actually cover all web pages. Csper solves this by being a paid service that helps you manually review reports from actual users who can't view pages on your site. Other solutions, like [this one from Jamie Scaife](https://www.jamieweb.net/blog/testing-your-csp-using-travis-ci-and-headless-chrome-crawler/) use an automated crawler to try to visit more pages to have a more representative set. His solution is aimed to check an existing CSP to make sure it is still facially valid before a site is deployed, since it isn't able to make much sense of the reports themselves.

Two researchers, Kailas Patil of the Vishwakarma Institute of Information Technology and Braun Frederik of Mozilla Corporation, [tackled the representative-set issue by trying to infer the CSP in real-time](http://ijns.femto.com.tw/contents/ijns-v18-n2/ijns-2016-v18-n2-p383-392.pdf). Rather than have a single computer either manually or automatically visit webpages to generate reports, they'd simply push out potentially overly-restrictive policies to real users and let their computers make the reports, which the server could use to heuristically allow certain things in the policy. While this approach does eventually generate a very granular and accurate CSP, the issue is that word "eventually." There's bound to be some lag time before the real-time CSP system is able to collect enough reports to be confident that a certain resource should be allowed through. That lag time might be small, but in practice it also guarantees site failures for some number of users, which could be seen as unacceptable from a business perspective.

A better solution to generating a CSP needs to combine much of the above: both crawling and report generation need to be handled automatically in a single package that can be run "offline," when the site is not deployed, so that users don't see errors.

Continue on to the next post in this series, [The (Proposed) Solution](/posts/projects/auto-csp/the-solution).
