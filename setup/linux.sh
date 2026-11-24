#!/usr/bin/env bash
# Sets up this Linux machine or NixOS-WSL distro from these dotfiles with Winix:
# clones them (or reuses ~/dotfiles), downloads the pinned Winix, installs the
# `winix` command and applies the host you choose. Safe to rerun.
#
#   curl -fsSL https://raw.githubusercontent.com/adrifer/dotfiles/main/setup/linux.sh -o /tmp/setup.sh
#   bash /tmp/setup.sh [--host HOST] [--prepare-only] [--dry-run]
#
# The Winix version comes from winix/package.json at --ref: its release's
# install.sh is checked against the release checksum before it runs.
# Winix does the rest (temporary Git/Python via Nix, clone, one confirmation).
set -euo pipefail

ref='main'
destination="$HOME/dotfiles"
options=()
while (($#)); do
  case "$1" in
    --host|--ref|--destination)
      [[ $# -ge 2 && -n "$2" && "$2" != -* ]] || { echo "Missing value for $1" >&2; exit 2; }
      case "$1" in
        --host) options+=(--host "$2") ;;
        --ref) ref="$2" ;;
        --destination) destination="$2" ;;
      esac
      shift 2 ;;
    --prepare-only|--dry-run|--yes) options+=("$1"); shift ;;
    -h|--help) sed -n '2,11p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $1 (see --help)" >&2; exit 2 ;;
  esac
done
[[ "$ref" =~ ^[A-Za-z0-9._/-]+$ ]] || { echo "Invalid --ref: $ref" >&2; exit 2; }
command -v curl >/dev/null 2>&1 || { echo 'curl is required (on NixOS: nix-shell -p curl).' >&2; exit 1; }
command -v sha256sum >/dev/null 2>&1 || { echo 'sha256sum (coreutils) is required.' >&2; exit 1; }

get() { curl --fail --silent --show-error --location --proto '=https' --proto-redir '=https' --max-time 90 "$@"; }

spec=$(get "https://raw.githubusercontent.com/adrifer/dotfiles/$ref/winix/package.json" |
  sed -nE 's/.*"@adrifer\/winix"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p' | head -n 1)
version='[0-9]+\.[0-9]+\.[0-9]+(-preview\.[0-9]+)?'
if [[ "$spec" =~ ^($version)$ || "$spec" =~ /releases/download/v($version)/ ]]; then
  version="${BASH_REMATCH[1]}"
else
  echo "winix/package.json at $ref does not pin an exact Winix release: ${spec:-nothing}" >&2; exit 1
fi

release="https://github.com/adrifer/winix/releases/download/v$version"
work=$(mktemp -d); trap 'rm -rf -- "$work"' EXIT
get "$release/install.sh" -o "$work/install.sh"
expected=$(get "$release/install.sh.sha256" | awk '{ print $1; exit }')
[[ "$expected" =~ ^[A-Fa-f0-9]{64}$ ]] || { echo "Missing checksum for the Winix $version install script; nothing was run." >&2; exit 1; }
printf '%s  %s\n' "${expected,,}" "$work/install.sh" | sha256sum --check --status ||
  { echo "Checksum mismatch for the Winix $version install script; nothing was run." >&2; exit 1; }
echo "Winix $version install script verified."

bash "$work/install.sh" --repository https://github.com/adrifer/dotfiles.git --ref "$ref" \
  --destination "$destination" --config-directory winix "${options[@]}" ||
  { echo 'Winix setup failed; fix the error above and rerun this script.' >&2; exit 1; }
