#Requires -Version 5.1
<#
.SYNOPSIS
Sets up this PC from these dotfiles with Winix: clones them, installs what Winix
needs, and applies the host you choose. Safe to rerun (for example after a restart).
.EXAMPLE
.\windows.ps1
.EXAMPLE
.\windows.ps1 -HostName work-devbox-2 -PrepareOnly
.PARAMETER HostName
Declared Winix host for this PC (see the README). Omit it to choose from a list;
the choice is remembered. This does not rename Windows.
.PARAMETER Ref
Dotfiles branch, tag or commit.
.PARAMETER Destination
Permanent checkout location; linked app configs point into it.
.PARAMETER PrepareOnly
Prepare and preview without applying anything.
.PARAMETER DryRun
Only show what would happen: no installs, clone or configuration.
.NOTES
The Winix version comes from winix/package.json at -Ref: its release's bootstrap
script is downloaded and checked against the release checksum before it runs.
Winix does the rest (WinGet check, Git, clone, prerequisites, one confirmation).
#>
[CmdletBinding()]
param(
    [string]$HostName,
    [ValidatePattern('\A[A-Za-z0-9._/-]+\z')]
    [string]$Ref = 'feat/windows-devbox-preview',
    [string]$Destination = (Join-Path $HOME 'dotfiles'),
    [switch]$PrepareOnly,
    [switch]$DryRun
)
$ErrorActionPreference = 'Stop'
# No Windows PowerShell progress block over the console (it also slows downloads);
# the Winix bootstrap run below inherits this.
$ProgressPreference = 'SilentlyContinue'
function Get-Text([string]$Uri) {
    $content = (Invoke-WebRequest -UseBasicParsing -Uri $Uri -TimeoutSec 90).Content
    if ($content -is [byte[]]) { $content = [Text.Encoding]::UTF8.GetString($content) }
    return $content
}
try {
    $manifest = Get-Text "https://raw.githubusercontent.com/adrifer/dotfiles/$Ref/winix/package.json" | ConvertFrom-Json
    $spec = $manifest.dependencies.'@adrifer/winix'
    if ($spec -match '^(\d+\.\d+\.\d+(?:-preview\.\d+)?)$' -or $spec -match '/releases/download/v(\d+\.\d+\.\d+(?:-preview\.\d+)?)/') {
        $version = $Matches[1]
    } else {
        throw "winix/package.json at $Ref does not pin an exact Winix release: $spec"
    }
    $release = "https://github.com/adrifer/winix/releases/download/v$version"
    $script = Join-Path ([IO.Path]::GetTempPath()) "winix-bootstrap-$version.ps1"
    Invoke-WebRequest -UseBasicParsing -Uri "$release/bootstrap-windows.ps1" -OutFile $script -TimeoutSec 90
    $expected = ((Get-Text "$release/bootstrap-windows.ps1.sha256").Trim() -split '\s+')[0]
    if ((Get-FileHash -LiteralPath $script -Algorithm SHA256).Hash -ne $expected) {
        Remove-Item -LiteralPath $script -Force
        throw "Checksum mismatch for the Winix $version bootstrap; nothing was run."
    }
    Write-Host "Winix $version bootstrap verified."
    $options = @{
        Repository = 'https://github.com/adrifer/dotfiles.git'; Ref = $Ref; Destination = $Destination; ConfigDirectory = 'winix'
    }
    if ($HostName) { $options.HostName = $HostName }
    if ($PrepareOnly) { $options.PrepareOnly = $true }
    if ($DryRun) { $options.DryRun = $true }
    $global:LASTEXITCODE = 0
    & $script @options
    if ($LASTEXITCODE -ne 0) { throw 'Winix bootstrap failed; fix the error above and rerun this script.' }
} catch {
    Write-Error $_ -ErrorAction Continue
    exit 1
}
