---
title: Racket System Access
date: 2018-04-10
tags:
    - Racket
---

This guide provides an introduction to interacting directly with the system from a Racket program.

<!-- endexcerpt -->

This guide assumes you have a basic understanding of making Racket command line programs and assumes a Linux system (WSL is fine, I don't use Mac but it likely is as well)

### Contents

```toc

```

## Arbitrary Command Line Parameters

In my previous guide I discussed Racket's command-line function as it pertains to flags, but what about the case of providing an arbitrary number of parameters without flags? Luckily, command-line gives us a very quick way to simply get all parameters as a list:

```scheme
(define PARAMETER-LIST (command-line
                        #:args list
                        list))
```

Let's break down the above: first, we are defining this as a constant, as it will be whenever our program is run (i.e. the parameters will already be entered). The second line says to store all arguments (meaning anything not a specified flag) in list. The third line says for the result of the command-line function to be that list, such that we store the parameters in the order they were entered in `scheme›PARAMETER-LIST`.

It is also possible to have multiple arguments after `scheme›#:args`, such that we specify a required number of parameters and name them specific things. That is done by putting a name in parentheses, to specify that it is one parameter and should not be a list.

More info on this can be found in the documentation. An example of how this can be used is the following:

```scheme
#! /usr/bin/racket
#lang racket

; all parameters as a list
(define PARAMETER-LIST (command-line
                        #:args list
                        list))

; print how many parameters were entered
(printf "~a\n" (string-append "You entered "
                              (number->string (length PARAMETER-LIST))
                              " parameters"))
```

## Files and Directories

Racket has a set of more in-depth tools to work with files and directories. Key to this is the concept of paths:

> When a Racket procedure takes a filesystem path as an argument, the path can be provided either as a string or as an instance of the path datatype. If a string is provided, it is converted to a path using [string->path](https://docs.racket-lang.org/reference/Manipulating_Paths.html#%28def._%28%28quote._~23~25kernel%29._string-~3epath%29%29). Beware that some paths may not be representable as strings; see [Unix Path Representation](https://docs.racket-lang.org/reference/unixpaths.html#%28part._unixpathrep%29) and [Windows Path Representation](https://docs.racket-lang.org/reference/windowspaths.html#%28part._windowspathrep%29) for more information. A Racket procedure that generates a filesystem path always generates a [path](https://docs.racket-lang.org/reference/pathutils.html#%28tech._path%29) value.

Source: [Racket Documentation](https://docs.racket-lang.org/reference/pathutils.html)

Why such emphasis on paths? Taking in a parameter of the path to a file is pretty straightforward, but what if you take in a directory as a parameter? The [directory-list function](https://docs.racket-lang.org/reference/Filesystem.html#%28def._%28%28lib._racket%2Fprivate%2Fbase..rkt%29._directory-list%29%29) is extremely useful for getting a list of each actual thing in a directory, but even if you give it a string, it will always return a list of paths.

Another important note is the `scheme›#:build?` flag that allows you to provide a context for the resulting paths. Most usefully, supplying `scheme›(current-directory)` will do a good job of giving the path from where your program is actually being run to where the contents of the directory are:

```scheme
(define (get-directory-list string-path)
  (directory-list string-path #:build? (current-directory)))
```

Other path functions can be very useful as well, specifically `string->path` and `path->string`. A note of caution about `path->string`: depending on how you use the string, you may want to manipulate it some to make sure that things like spaces are properly escaped.

### Temporary Files

So what happens if you want to make a temporary file? Sure, you could make a file yourself in the directory your program is in, but we can do better. Racket provides us with a clean, easy way to generate temporary files with the [`make-temporary-file`](https://docs.racket-lang.org/reference/Filesystem.html#%28def._%28%28lib._racket%2Ffile..rkt%29._make-temporary-file%29%29) function. With that function, Racket handles creating a temporary file in the current system's best-practice location. The naming of the file is such that you can make as many temporary files as you want without them conflicting with each other.

The `make-temporary-file` function doesn't need any arguments, and it returns a path, not a string. Importantly, it is up to you to delete the file when you're done. Below is a simple program that creates a temporary file, tells you where it was created, and then cleans up after itself.

```scheme
#! /usr/bin/racket
#lang racket
(define tmp-path (make-temporary-file))
(printf "~a\n" (string-append "The temporary file was created at "
                              (path->string tmp-path))
(delete-file tmp-path)
```

Another note is that you don't necessarily have to use the file that is created: if you need a path to extract a file to, for example, you can overwrite the actual file but use the path as one you know will be unique.

## System Commands

Racket has the ability to use subprocesses, where it runs system commands while feeding it input and receiving the output. The actual [subprocess](https://docs.racket-lang.org/reference/subprocess.html#%28def._%28%28quote._~23~25kernel%29._subprocess%29%29) function is extremely powerful, but for many uses, the simpler [system](https://docs.racket-lang.org/reference/subprocess.html#%28def._%28%28lib._racket%2Fsystem..rkt%29._system%29%29) function suffices. Experimenting in a REPL (either the DrRacket interactions window or after entering racket on the command line) is helpful to understand how system works:

```scheme
> (system "echo Hello World!")
Hello World!

#t
```

The boolean is system's return value, which we don't much care for. If you're in DrRacket, you might notice that the "Hello World!" appears purple, and without quotes: it isn't a String or any other kind of primitive value. So how do we capture the output of a program?

## Ports

Racket uses the [current-output-port](https://docs.racket-lang.org/reference/port-ops.html#%28def._%28%28quote._~23~25kernel%29._current-output-port%29%29) to receive the output from whatever was called by system. There are very advanced features of ports, but there are functions that can simplify basic operations. If we want to run system but put all of its output into a string, we can use the [with-output-to-string](https://docs.racket-lang.org/reference/port-lib.html#%28def._%28%28lib._racket%2Fport..rkt%29._with-output-to-string%29%29) function.

However, the function has an extremely general signature, where its only argument is a function that takes in no arguments and returns a single "any." That doesn't match the signature of the system command, so we can use lambda to make it match up:

```scheme
> (with-output-to-string (λ() (system "echo Hello World!")))
"Hello World!\r\n"
```

This is much more useful, and we can use string functions to remove that stuff from the end:

```scheme
> (string-trim (with-output-to-string (λ() (system "echo Hello World!"))))
"Hello World!"
```

Working with ports can still be tricky. What if the output from system is large enough that a string can't handle it well? We can write it to a file using [with-output-to-file](https://docs.racket-lang.org/reference/file-ports.html#%28def._%28%28lib._racket%2Fprivate%2Fbase..rkt%29._with-output-to-file%29%29). That function takes in not just the function, but a path to a file as well. Below is an example program where you specify a file path and "Hello World!" is written to a new file created at that location:

```scheme
#! /usr/bin/racket
#lang racket
(define file-path (command-line
                   #:args (path)
                   path))
(with-output-to-file file-path
                     (λ() (system "echo Hello World!")))
```

But what if a file already exists at that path? As of right now, the above program would throw an error. We can use an optional flag on the with-output-to-file function to specify what it should do if the file already exists:

```scheme
#! /usr/bin/racket
#lang racket
(define file-path (command-line
                   #:args (path)
                   path))
(with-output-to-file file-path
                     (λ() (system "echo Hello World!"))
                     #:exists 'replace)
```

Now, the file at the location will be replaced. There are other symbols that can be given to the `scheme›#:exists` flag, given in the documentation for a related function, [open-output-file](https://docs.racket-lang.org/reference/file-ports.html#%28def._%28%28lib._racket%2Fprivate%2Fbase..rkt%29._open-output-file%29%29).

Reading back in a file is generally a more straight-forward process, documented in the [Racket Filesystem section](https://docs.racket-lang.org/reference/Filesystem.html#%28part._file-lib%29) of the documentation.

## When Lists Are Too Long

With some of what's given above, it is possible to generate data that for which runtime must be taken into account. Lists, in particular, can be inefficient, but Racket provides us with [sets](https://docs.racket-lang.org/reference/sets.html) and [dictionaries](https://docs.racket-lang.org/reference/dicts.html) that provide better runtime for lookups and other functions. Sets can be created very easily with `list->set` and `set->list`, and have a variety of operations like set-union, set-subtract, and set-intersect.
