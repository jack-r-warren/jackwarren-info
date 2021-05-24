---
title: Add Case Brief
date: 2019-01-18
tags:
    - Python
---

Northeastern's IA 5240 Cyberlaw: Privacy, Ethics, and Digital Rights course doesn't require any coding, but it does require _a lot_ of legal case briefs. In an attempt to productively procrastinate on reading, I had the idea to make a script to generate templates for the briefs. I decided to write about it here because its a rare example of code that I can actually post online.

Predictably, I was barely a few lines into writing a shell script when feature bloat got the best of me and I moved to Python. The basic operation is as follows:

1. Run `./add-case.py name` where name can have spaces without needing quotes
2. Select the desired filename from several suggestions based on the name
3. Script creates template file and opens using Windows' default handler for markdown files

The main tricky aspect is the second step. Parsing case names is a unique problem because there's actually fairly little syntactic structure. Parties in the cases vary enough to ruin parsing from the left side of the citation, while there are [varying citation formats](http://guides.lib.uchicago.edu/c.php?g=620002&p=4316691) (some with optional components) that ruin parsing from the right side.

My solution is to strip the name of periods and split it based on commas, and then display the first nine results. For example, using a case from [this Georgetown Law Library article](http://guides.ll.georgetown.edu/bluebook/citing-cases):

```
> ./add-case.py "Am. Geophysical Union v. Texaco, Inc., 60 F.3d 913, 915 (2d Cir. 1994)"
1. Am Geophysical Union v Texaco.md
2. Am Geophysical Union v Texaco Inc.md
3. Am Geophysical Union v Texaco Inc 60 F3d 913.md
4. Am Geophysical Union v Texaco Inc 60 F3d 913 915 (2d Cir 1994).md
Select filename:

```

With that menu up, I simply enter a number and the file is immediately created without me needing to press enter. For that functionality I'd like to thank Jon Witts, since his [sample code for key handling](http://www.jonwitts.co.uk/archives/896) actually worked with [my console setup](/posts/guides/console).

The resulting file is in markdown format with headers made for a basic case brief:

```markdown
### **Case Brief** | Jack Warren | 01/18/2019

# Am. Geophysical Union v. Texaco, Inc., 60 F.3d 913, 915 (2d Cir. 1994)

### Relevant Facts

-

### Procedural History

-

| Issue | Holding |
| :---: | :-----: |

|

### Reasoning

### Conclusion
```

That file is opened via Windows' default handler for the `.md` file extension. This is accomplished by using Windows Explorer sice the Windows path is still available in WSL. That does mean, however, that the script will fail if it _can't_ find an `explorer.exe` on the path.

Below is the code of the script itself. It is by no means designed as well as it could be, but as a short script it works well enough for my use case.

```python
#!/usr/bin/env python3
import argparse, sys, termios, tty, os, time
from datetime import date


# Character reading code from Jon Witts at http://www.jonwitts.co.uk/archives/896
# Void -> String
def getch():
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    try:
        tty.setraw(sys.stdin.fileno())
        ch = sys.stdin.read(1)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
    return ch


# Arguments
parser = argparse.ArgumentParser(description='Create a new document for writing a case brief',
                                 epilog='This program assumes it is running on WSL and will attempt to open the '
                                        'created file via explorer.exe')
parser.add_argument('name', nargs='+', type=str, help='The name of the case')
args = parser.parse_args()
name = ' '.join(args.name)

# Create filenames
name_parts = name.replace('.', '').split(',')
number_of_options = min(name_parts.__len__(), 9)
file_name_options = []
for x in range(number_of_options):
    file_name_options.append(''.join(name_parts[:x + 1]))
    print(str(x + 1) + '. ' + file_name_options[x] + '.md')

# Select filename
selected = None
print('Select filename:')
while selected is None:
    char = getch()
    try:
        selected = int(char)
    except ValueError:
        selected = None
        time.sleep(0.2)
        print('Invalid input, enter a number between 1 and ' + str(number_of_options) + ':')

# Write file
try:
    file = open(file_name_options[selected - 1] + '.md', 'x')
    file.write('### **Case Brief** | Jack Warren | ' + date.today().strftime('%m/%d/%Y') + '\n')
    file.write('# ' + name + '\n')
    file.write('### Relevant Facts\n')
    file.write(' - \n')
    file.write('### Procedural History\n')
    file.write(' - \n\n')
    file.write('| Issue | Holding |\n')
    file.write('| :--: | :--: |\n')
    file.write('| \n\n')
    file.write('### Reasoning\n\n')
    file.write('### Conclusion\n')
    file.close()
    os.system('explorer.exe "' + file_name_options[selected - 1] + '.md"')
except FileExistsError:
    print('Filename already exists, exiting...')
    exit(1)
except IOError:
    print('An error occurred writing to the file, exiting...')
    exit(1)
```
