---
title: Making a Racket Command Line Program
date: 2018-01-26
tags:
    - Racket
---

This guide is aimed at bridging some of the gap between using Racket to learn the basics of coding and using it to build simple command line programs.

<!-- endexcerpt -->

For context, I developed this guide as I worked to adapt what I learned in Northeastern University's CS 2500 Fundamentals I class to assignments in CS 2550 Foundations of Cybersecurity.

This guide is by no means extensive; rather, it is intended to fill in some of the gaps in the language documentation.

### From BSL/ISL to Racket

Assuming you're using the DrRacket development environment and you've used BSL, ISL, or their variants in the past, you'll need to switch to using Racket proper. In the bottom left of DrRacket, click on your language, and then on Choose Language. Select The Racket Language in the popup window and click okay.

You'll notice that the line #lang racket appears at the top of your file. This is important: it indicates to DrRacket or any other system what dialect of Racket to use.

## Setting Up for Command Line Execution

There's three basic things that need to happen in order for your program to work on the command line: run, take arguments, and return values.

### Running

Racket supports using [shebang notation](<https://en.wikipedia.org/wiki/Shebang_(Unix)>) on Unix systems so that the file can be run as a program without any compiling. If Racket is in your command line's path, the two lines at the top of your file should be the following:

```scheme
#! /usr/bin/env racket
#lang racket
```

You can tell if Racket is in your path if typing racket at the command prompt informs you of the current version installed. Northeastern's CCIS machines have Racket installed in their command path, and if you run Linux as your desktop operating system then you may have it in your path as well. You don't need to have Racket in your own command path to develop your program: you can run it from DrRacket as normal. There's more on running your file later in the guide; for now, I'd suggest keeping the above example.

If Racket isn't installed in your command path but you know where it is installed on the computer you want to run your program on, you can enter the absolute path to Racket instead. The following works on Northeastern's CCIS machines, since the racket file is in the /usr/bin directory:

```scheme
#! /usr/bin/racket
#lang racket
```

If you plan to run your program on from the Windows command line (i.e., not using WSL), instructions will be somewhat different and are beyond the (admittedly limited) scope of this guide. The [Racket documentation](https://docs.racket-lang.org/guide/scripts.html#%28part._.Windows_.Batch_.Files%29) gives an example of setting your program up as a Windows Batch File.

### Taking Arguments

Beyond just calling your program, you'll want to tell it what to do. This is where arguments come in, and Racket has a build in system to help you use them in your program. It consists of two parts: your parameters and your parser.

#### Parameters

Your parameters are what you want to know when your program runs. You set them up with default values, but you can change them based on what arguments your program is called with (we'll get to that later). For now, write parameters like the following:

```scheme
; my-parameter is a number with a default value of 1
(define my-parameter (make-parameter 1))

; another-parameter is a boolean with a default value of #false
(define another-parameter (make-parameter #false))

; a-string is a string with a default value of ""
(define a-string (make-parameter "))
```

The values you give your parameters are the defaults for your program: if your program is called with no arguments, the default values are used. If your program is called with an argument for a specific parameter, then that parameter will get the new values but the others will stick with their defaults.

Parameters have some weird syntax. To assign a parameter, you call it like a function, like `scheme›(my-parameter 2)` assigns 2 to my-parameter. If I want to read what a parameter is currently storing, I call it like a function that takes no arguments, like `scheme›(my-parameter)`.

#### Parsing

So how do we actually get arguments into our program? Racket gives us a super easy way to say what kind of arguments our program takes. Below your parameters, define something like the following:

```scheme
(define parser
  (command-line
   #:usage-help
   "Here you can write a general description of your program"
   "You can have multiple strings to make multiple lines"

   #:once-each
   [("-m" "--my-parameter") MY-PARAMETER-NAME
    "write a short description of what setting MY-PARAMETER-NAME does"
    (my-parameter (string->number MY-PARAMETER-NAME))]
   [("-a" "--another-parameter") ANOTHER-PARAM
    "a little description of ANOTHER-PARAM"
    (another-parameter (string=? "true" ANOTHER-PARAM))]
   [("-s" "--string") A-STRING
    "what is A-STRING?"
    (a-string A-STRING)]

   #:args () (void)))
```

The key part of this is in the #:once-each section. Within those square brackets, you define the different flags that are used to pass the arguments `scheme›(("-m" "--my-parameter"))`, name that gets assigned to that argument if it is passed in `scheme›(MY-PARAMETER-NAME)`, a description of that argument, and what parameter to assign it to `scheme›((my-parameter (string->number MY-PARAMETER-NAME))`. A few notes:

-   Remember the syntax for parameters: `scheme›(parameter-name x)` assigns x to a parameter-name that you've already defined, and `scheme›(parameter-name)` gets the value of that parameter-name
-   Arguments always come in as strings, so you need to use functions like `string->number` to turn them into what you want
-   The descriptions might not seem important, but Racket automatically generates "-h" and "--help" flags for your function using the descriptions

The `scheme›#:args` section is a way for your program to take in more data when it is initialized. If you don't need that functionality, `scheme›#:args () (void)` tells your program that you only take in the arguments you defined earlier.

There is more that the command line parser can do; the Racket documentation has a good entry for the [command-line function](https://docs.racket-lang.org/reference/Command-Line_Parsing.html).

### Returning Values

To have your program return something, you'll need to print to the command line. Don't worry about calling the parser we just defined: it will do its thing on its own. You just need to refer to your parameters.

```scheme
(printf "~a\n" (string-append "The value of my string argument is " (a-string))
```

The `printf` command prints data without the normal quotes that Racket puts around strings. The string that immediately follows it (`"~a\n"`) is notation from [this Racket documentation page](https://docs.racket-lang.org/reference/Writing.html#%28def._%28%28quote._~23~25kernel%29._fprintf%29%29). The `~a` means "display the next argument to printf" and the `\n` means "and put a new line after it." That next argument to `printf` is the output of the string-append function.

You can use that notation to do some pretty cool things. Another way I could code the above example is with the following:

```scheme
(printf "~a~a\n" "The value of my string argument is " (a-string))
```

Rather than using `string-append`, I used two `~a` display markers and gave `printf` two extra arguments rather than one.

## The Final (Example) Product

```scheme
#! usr/bin/env racket
#lang racket

;; parameter My-Name is one of:
;; - #false
;; - String
(define my-name (make-parameter #false))

;; command line parser
(define parser
  (command-line
   #:usage-help
   "Have the computer greet you!"

   #:once-each
   [("-n" "--name") NAME
                    "Set your name"
                    (my-name NAME)]

   #:args () (void)))

;; get-greeting : My-Name -> String
;; Gets the greeting for the given My-Name
(define (get-greeting mn)
  (cond
    [(boolean? mn) "Hello, unknown person!"]
    [(string? mn) (string-append "Hello, " mn "!")]))

;; prints result to the command line
(printf "~a\n" (get-greeting (my-name)))
```

With this framework, you can now begin adding in your own functions or definitions. Remember that the `printf` command is what will get triggered when your program is run, so have your functions be called from there. Lastly, note that you may have to rearrange some of your functions and definitions: that is perfectly alright, the `printf` and `parser` will work regardless of where they are in your program as long as they're below the parameter definitions.

To test your program, the best way is to change the default values given to your parameters and hit run in DrRacket. There isn't a way to actually call your function from the command line in DrRacket, so the parser will never be activated and your program will just use its default values.

## Another Example

Below is an example of a greeting program. I use this example in the next section.

```scheme
#! usr/bin/env racket
#lang racket

;; parameter My-Name is one of:
;; - #false
;; - String
(define my-name (make-parameter #false))

;; command line parser
(define parser
  (command-line
   #:usage-help
   "Have the computer greet you!"

   #:once-each
   [("-n" "--name") NAME
                    "Set your name"
                    (my-name NAME)]

   #:args () (void)))

;; get-greeting : My-Name -> String
;; Gets the greeting for the given My-Name
(define (get-greeting mn)
  (cond
    [(boolean? mn) "Hello, unknown person!"]
    [(string? mn) (string-append "Hello, " mn "!")]))

;; prints result to the command line
(printf "~a\n" (get-greeting (my-name)))
```

## Running Your Program

This part of the guide very much assumes you're using a Linux command line. Windows 10 with WSL will work, as will Mac OS, though I have no experience with the latter beyond knowing that commands will be different.

### Installing Racket

You'll need to have Racket installed into your command path. Even if you have DrRacket installed on your computer, Racket likely isn't part of your Linux command line path. Here’s how you can check:

```bash
racket -v
```

If that command doesn't work, then you’ll need to install Racket:

```bash
sudo add-apt-repository ppa:plt/racket
sudo apt-get update
sudo apt install racket
```

Once you’ve done that, I’d run the `racket -v` command up above to double check that it works.

### Running Your File

Whatever you name the file will be the command you will enter to invoke it. I'm going to use the greeting example directly above this section; if that were a file called `greetme.rkt` and your command prompt was in the directory that contained that file, the following command would start it:

```bash
./greetme.rkt
```

Your file doesn't need an extension though: if you renamed it to just `greetme` without the `.rkt`, the command becomes the following:

```bash
./greetme
```

Before you can run the file though, you have to set it as being executable. Assuming your file is called `greetme`, enter the following:

```bash
chmod a+x greeting
```

If you're submitting a Racket command line program for a project, you should do your best to make sure it runs on whatever machine it will be graded on. **Racket can take a very, very long time to load**: there is little way around this. Once it has loaded consecutive executions of your program will run quickly.

The `command-line` function we used gives us the flags we defined ourselves and the "-h" and "--help" flags based on our description text we wrote into our program. The following are all valid invocations of our `greetme` program:

```bash
./greetme
./greetme -h
./greetme --help
./greetme -n Jack
./greetme --name Jack
```

My suggestion is to copy the code I wrote and play around with it before you start in on writing your own program: it would be a shame to write your whole program in Racket only to find out issues preventing you from using it.

## Useful Extras

### Relative File Paths

Here's a problem: your program needs to access another file. All you know is that the file will be in the same directory as your program, but that directory could be anywhere. The solution is below:

```scheme
(require racket/runtime-path)

(define-runtime-path MY-RAW-PATH "my_file.txt")
```

From there, any of the [Racket file functions](http://docs.racket-lang.org/reference/Filesystem.html?q=file-%3Elist#%28mod-path._racket%2Ffile%29) will work on `MY-RAW-PATH`.
