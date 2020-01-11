---
title: WSL Configuration
date: 2020-01-10
---

My Linux shell configuration is used exclusively with Cmder and WSL; I've included some basic installation and setup instructions here.

<!-- endexcerpt -->

## Installation

If you don't have [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and [Cmder](https://cmder.net/), you'll need those if you want to mirror my setup exactly. My Cmder config is [right here](/posts/guides/console/cmder-tasks).

Run the following in your WSL shell (the `bash::Ubuntu` task from my Cmder config):

```bash
sudo apt install zsh
chsh -s $(which zsh)
```

Restart your shell (closing and re-opening the Cmder tab is sufficient) and you should be greeted with a configuration page. Choose option `0`, and then enter the following:

```bash
curl -Lo install.sh https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh
sh install.sh
```

## Configuration

Below is my `~/.zshrc` configuration (comments in-line):

```bash{outputLines: 1-100}
export PATH=$HOME/bin:/usr/local/bin:$PATH

export ZSH="/home/jackw/.oh-my-zsh"

ZSH_THEME="agnoster"

# Windows is case-sensitive
CASE_SENSITIVE="true"

plugins=(git ssh-agent)

# Use with caution, you need to trust the servers
# you connect to if you have this on and enabled
zstyle :omz:plugins:ssh-agent agent-forwarding on

source $ZSH/oh-my-zsh.sh

# Used by git automatically, so needs to be something
# basic and in-console
export EDITOR='vim'

# I use Visual Studio Code - Insiders but I'm used to
# "code" being on my path
alias code="code-insiders"
```

### SSH Keys

If you already have a private `id_rsa` key in your Windows user `.ssh` folder, you can copy it to your WSL user folder to seamlessly make use of it there too:

```bash{outputLines: 1-2}
# Assuming you are in
# your Windows user folder
mkdir ~/.ssh
cp .ssh/id_rsa ~/.ssh/
chmod 400 ~/.ssh/id_rsa
```

Restart your console or run `source ~/.zshrc` and the key should be read in.
