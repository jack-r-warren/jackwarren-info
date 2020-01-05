---
title: Simple Racket Antivirus
date: 2018-04-10
tags:
    - Racket
---

As part of NU’s CS2550 Foundations of Cybersecurity, we were tasked with creating simple antivirus software. We were to make two programs: one for training and one for detection. The first would be given a collection of benign files and a collection of malicious ones and would have to output a file of malware definitions. The second would then accept that definitions file and other files to test, and would output whether those other files were malware or not.

We were allowed to use any language we liked, so long as it would run from the command line after an included Makefile had been run. I had done previous work in the class with Racket, since it was the only language a fair number of students in the class knew and I had been writing a [series of guides](/posts/guides/racket) to assist them. I continued that trend for this project, using shebang in both programs to sidestep any issues that might arise from having a compile process work across both my and the instructor’s platforms.

Notably, we were told that the files we’d have to detect would be extremely similar to the ones our program could use to train—the changes, if any, would be on the scale of a few bits here or there. This heavily influenced my approach: rather than hashing entire files, I’d simply use small sections of each one. For training, I used set subtraction to have the definitions file be all of the sections that appeared in any malicious files but not in any benign files. For detection, I would look in the definitions for any of the sections I pulled from the files I was trying to classify.

There’s certainly several details I’m omitting—mainly, my tactic for getting sections from a file. Those sections would certainly need to be the same for the same file, but also needed to be resistant to slight modifications to the file. That way, even if a file had been changed from what the program had trained on, enough sections would be the same that my program could correctly classify it. Since that project may still be in use in the class, I’ll refrain from more in-depth discussion here.

[Source code for this project is available upon request.](/contact)
