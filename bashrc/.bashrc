#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

export GALLIUM_DRIVER=d3d12
export LANG=en_US.UTF-8

eval "$(starship init bash)"
eval "$(zoxide init bash)"
source /usr/share/nvm/init-nvm.sh

alias ls='eza --long --no-filesize --color=always --icons=always --no-user'
alias grep='grep --color=auto'
alias i='sudo pacman -Syu'
alias lg='lazygit'
alias work-auth='cp /mnt/c/Users/adrifer/.npmrc ~/.npmrc'

PS1='[\u@\h \W]\$ '
fastfetch
