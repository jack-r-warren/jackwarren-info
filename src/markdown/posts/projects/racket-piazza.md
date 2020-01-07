---
title: Racket Piazza
date: 2017-12-01
tags:
    - Racket
---

When I took Northastern's Fundamentals of Computer Science 1, the main project was to build a client mimicking Piazza, our class forum. The class provided a server that our [Universe](https://docs.racket-lang.org/teachpack/2htdpuniverse.html) programs could connect to, and our job was to make our client support the basic features of a forum: posts, replies, and searching.

Beyond those requirements, I added a number of extra features. Since the project (or close variants of it) could be used in the future, I'll refrain from discussion of my implementation of the core features and instead focus on my additions.

## Window Resizing

One of the early realizations through iterations of the project is that the graders would frequently have different screen magnifications and resolutions than I and my partners did. We still wanted to have a large window size, so we designed our entire program to strictly base graphics off of extracted and clearly labeled constants.

Since Universe programs have very basic window handling, normal drag-to-resize functionality wasn't available. Our hope was rather that, by making the size easy to change, the graders would have an easier time with our project.

## Text Wrapping

In testing the window resizing, one of the problems that arose was text going off of the page. Since messages and the window width could both be an arbiitrary length, my solution was to implement rudimentary text wrapping. Racket provides little in the way of help for this task, so the process is roughly as follows:

-   Upon program launch:
    -   Measure the height and width of the characters in pixels (the entire program uses a monospaced font)
-   When rendering text:
    -   Take in the text and current indentation level as arguments
    -   Split text into a list of strings
    -   Recursively combine the strings to fit as many as will fit on a line, taking into account any pre-existing indent
    -   With each string now representing a line, render each line as an image and place them above each other with left alignment

## Recursive Random Backgrounds

Another offshoot of the window resizing had to do with having graphical backgrounds for the program. Other groups in the class took advantage of their guaranteed window sizes to create interesting backgrounds, but we didn't have that luxury. Instead, my approach used randomization to be agnostic to the requested size.

The image generation system operates by accepting dimensions, a base color, and a color to use as a randomization range. The requested dimensions are divided up into a number of squares, and within each square, a random color is generated. That color is the result of randomly adjusting the red, green, and blue of the base color to some value +/- the corresponding value of the randomization range.

For example, if the base color was (100, 100, 100) and the the randomization range was (0, 20, 0), then the squares would be have colors simimilar to (100, 110, 100), (100, 96, 100), and (100, 102, 100). In practice, this means that the backgrounds looked like TV static that was highly pixelated and tinted. We has different colors at the top of the program depending on what mode the program was being used in, and used continuity of image style to provide a more intuitive interface. The best example of this is in the mode for making a new post and the mode for replying to an existing post. Both involve a text entry box, and to signify that fact, the backgrounds of both text boxes were generated with the same settings.

Upon building this system, one thing became immediately apparent: the process of rendering each square next to each other upon every draw of the program was extremely intensive. To lessen this load, I delved into the Racket image library, and began using the freeze function, which has the effect of returning its image input as a single static bitmap image. In my own benchmarking, I also found that Racket's recursive reduction function `foldr` seemed to have marginally longer runtime than Racket's equivalent of a spread operator, `apply`. Since `apply` wasn't firmly within the realm of what we had learned in class, I went out of my way to document my use and understanding of both it and `foldr`.

[Source code for this project is available upon request.](/contact)
