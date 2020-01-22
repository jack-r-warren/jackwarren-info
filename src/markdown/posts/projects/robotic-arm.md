---
title: Robotic Arm
date: 2018-12-01
tags:
    - C/C++
    - Simulink
    - Matlab
---

The two projects of Northeastern's Embedded Design: Enabling Robotics course focus on manipulating a robotic arm connected to a Zedboard (a simple Linux computer with a field-programmable gate array). In both projects, my group applied knowledge from other classes to approach the tasks in an alternate manner from what was intended.

<!-- endexcerpt -->

## C++ Water Bottle Throwing

The midterm project consisted of knocking over two water bottles by throwing others at them. We were allowed to pick up and throw as many bottles as we wanted, but we were limited to fifteen seconds. Our strategy was to throw one bottle through both targets:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/tSOsMH7zz9Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The robotic arm has a total of five motors controlled via PWM. In C++, controlling a single motor is relatively easy: with knowledge of the arm's PWM period, a combination looping and waiting can write the correct pulses to the GPIO pin corresponding to a particular motor. This is complicated, though, by trying to control different motors simultaneously, since all of the pulses must be created by the same loop.

For example, a simple motor can be controlled by looping the following set of instructions:

1. Set the pin to "on"
1. Wait for the duration of the pulse
1. Set the pin to "off"
1. Wait for the duration of the rest of the period

Controlling two motors, with the first having a shorter period than the second, would have roughly the following set:

1. Set the pin for motor one to "on"
1. Set the pin for motor two to "on"
1. Wait for the duration of motor one's pulse
1. Set the pin for motor one to "off"
1. Wait for the rest of the duration of motor two's pulse
1. Set the pin for motor two to "off"
1. Wait for the duration of the rest of the period

At first glance, this is tractable, but the trick comes if suddenly motor two requires a shorter pulse. With five motors, the code becomes extremely difficult to maintain. The approach the course materials allude to is simply having multiple loops that run sequentially: rather than coding the logic to handle an arbitrary ordering of pulse lengths, students could figure that out and hard-code the loop for each stage of the program.

My group decided on a different approach. The project specification required us to use an object-oriented design, which we felt lent itself very well not to sequential loops, but to _parallel loops_. We used forked processes to run five loops simultaneously, instantly simplifying the process of controlling five motors at once.

There was a downside to this approach: the Zedboard's processor is slow and only has two cores. The performance hit of such frequent context-switching caused the entire arm to jitter, since the PWM signals weren't being sent with perfect timing. Our approach was flexible enough to still work: making adjustments to angles and timing was incredibly quick, so we easily overcame the slight inconsistencies in the arm's operation.

## Simulink Water Bottle Placement

The final project was similar to the midterm, but with a lower-level approach and a more precise task. We had to move two water bottles between three positions:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/VGL4NudnVOw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The arm was the same model as in the midterm, but rather than C++, we used Simulink's HDL coder to program the Zedboard's FPGA. This project was necessarily more tedious than the midterm, but we still applied programming concepts to ease the load. We used Simulink's Matlab script blocks to allow us to write a simple finite state machine, which would output an integer indicating the state. Each motor had a mapping of state to PWM period, allowing us centralized timing control while still maintaining ease of individual adjustments.

Much of the trick to this process was simply in writing the Matlab script: to be synthesizable, we had to adhere to restrictions on syntax, order of execution, and even what types of expressions were valid. There were other benefits to this process, though, as moving away from Simulink's block-based development to a text-based one improved how we could collaboratively work on the code.

[Source code for this project is available upon request.](/contact)
