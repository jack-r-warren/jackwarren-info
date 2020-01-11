---
title: Animator Software
date: 2018-12-03
tags:
    - Java
---

The project for Object-Oriented Design was an extensive piece of animator software built over multiple months with the specification being teased out slowly over time, requiring our code to be flexible and well-designed. The end product features command line usage, and Swing-based GUI, its own file format, export to optimized SVG, layers, graphical scrubbing, and more.

Our approach to this project had two prongs: generic types and documentation. We fully expected to be thrown curveballs throughout the project, like having to support a new kind of basic shape or property. As such, we took advantage of the model-view-controller architecture to add generic types. The model was completely generic, with only convenience classes supplying enum types to make it concrete. The controller was completely agnostic to the types of the model, serving only to make available the model's features. The views necessarily required certain types from the model (our SVG export couldn't support arbitrary types of shapes, for example), so it would specify enum types where necessary to close the loop. We found the benefits of this approach when we had to integrate another group's views into our project, because our model and controller were designed from the ground up to match a view's specifications without any modification. Simple adapters were added, and we were on our way.

The other key to our success on this project was documentation. We went beyond the required README.txt file to supply a full version history from assignment to assignment, using Javadoc to also document changes in the code itself. Excluding verbose tests of raw output, our project had more lines of comments than it did code. Those comments were formatted with HTML where necessary, making our generated Javadoc useful and readable.

[Source code for this project is available upon request.](/contact)
