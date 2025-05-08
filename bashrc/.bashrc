#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

export GALLIUM_DRIVER=d3d12
export LANG=en_US.UTF-8
export EDITOR=nvim

eval "$(starship init bash)"
eval "$(zoxide init bash)"
source /usr/share/nvm/init-nvm.sh

alias ls='eza --long --no-filesize --color=always --icons=always --no-user'
alias grep='grep --color=auto'
alias i='sudo pacman -Syu'
alias lg='lazygit'
alias work-auth='cp /mnt/c/Users/adrifer/.npmrc ~/.npmrc'

# Remove sound when pressing backspace
bind 'set bell-style none'

# Configure Yazi
function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	yazi "$@" --cwd-file="$tmp"
	if cwd="$(command cat -- "$tmp")" && [ -n "$cwd" ] && [ "$cwd" != "$PWD" ]; then
		builtin cd -- "$cwd"
	fi
	rm -f -- "$tmp"
}

PS1='[\u@\h \W]\$ '
fastfetch
