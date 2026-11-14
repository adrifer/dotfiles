#Requires -Version 5.1
<#
.SYNOPSIS
Checks for WinGet, downloads verified Winix bootstrap and starts setup for these dotfiles.
.EXAMPLE
.\windows.ps1 -HostName ADRIFER-VISION
.EXAMPLE
.\windows.ps1 -HostName ADRIFER-VISION -Version 0.3.0-preview.2
.PARAMETER HostName
Declared Winix host to activate. Required; this does not rename Windows.
.PARAMETER Channel
stable (default) selects the newest published stable release.
preview selects the newest published preview release. There is no channel fallback.
.PARAMETER Version
Exact bootstrap installer release, with or without the leading v.
Cannot be combined with Channel. No other release will be substituted.
This pins only the installer; the dotfiles package pin selects the Winix executable.
.PARAMETER Ref
Dotfiles branch, tag or commit; defaults to feat/windows-devbox-preview.
.PARAMETER Destination
Permanent dotfiles checkout; defaults to $HOME\dotfiles.
.PARAMETER PrepareOnly
Validate and preview the host without activating it.
.NOTES
If WinGet is missing, opens App Installer in Microsoft Store and waits for installation.
Git installation, cloning, checkout validation and activation belong to Winix.
For a private repository, download this file while signed into GitHub and let
Git use its credential helper when cloning. Never put tokens in this file or URL.
This script does not install npm dependencies. Review it before running and
respect execution policies. Release checksums are not publisher signatures.
#>
[CmdletBinding(DefaultParameterSetName = 'Channel')]
param(
    [string]$HostName,
    [Parameter(ParameterSetName = 'Channel')]
    [ValidateSet('stable', 'preview')]
    [string]$Channel = 'stable',
    [Parameter(Mandatory = $true, ParameterSetName = 'Version')]
    [ValidatePattern('\Av?[0-9]+\.[0-9]+\.[0-9]+(?:-preview\.[0-9]+)?\z')]
    [string]$Version,
    [string]$Ref = 'feat/windows-devbox-preview',
    [string]$Destination = (Join-Path $HOME 'dotfiles'),
    [switch]$PrepareOnly
)

function Initialize-DotfilesWinGet {
    if (Get-Command winget.exe -CommandType Application -ErrorAction SilentlyContinue) { return }

    Write-Host 'WinGet is missing. Install or update App Installer in Microsoft Store.'
    Write-Host 'If the Store is unavailable, see https://learn.microsoft.com/en-us/windows/package-manager/winget/#install-winget or use your organization-approved installation process.'
    Start-Process -FilePath 'ms-windows-store://pdp/?ProductId=9NBLGGH4NNS1' -ErrorAction Stop
    [void](Read-Host 'After installing App Installer, return here and press Enter (Ctrl+C to cancel)')

    if (-not (Get-Command winget.exe -CommandType Application -ErrorAction SilentlyContinue)) {
        throw 'WinGet is still unavailable. Finish installing App Installer, close and reopen Windows PowerShell, then rerun this setup.'
    }
}

function Get-WinixBootstrapRelease {
    [CmdletBinding(DefaultParameterSetName = 'Channel')]
    param(
        [Parameter(ParameterSetName = 'Channel')]
        [ValidateSet('stable', 'preview')][string]$Channel = 'stable',
        [Parameter(Mandatory = $true, ParameterSetName = 'Version')]
        [ValidatePattern('\Av?[0-9]+\.[0-9]+\.[0-9]+(?:-preview\.[0-9]+)?\z')]
        [string]$Version
    )
    $headers = @{ Accept = 'application/vnd.github+json'; 'User-Agent' = 'Winix-bootstrap-downloader' }
    if ($PSCmdlet.ParameterSetName -eq 'Version') {
        $tag = 'v' + ($Version -replace '^v', '')
        $selected = Invoke-RestMethod -Uri "https://api.github.com/repos/adrifer/winix/releases/tags/$tag" `
            -Headers $headers -TimeoutSec 90 -ErrorAction Stop
        if (-not $selected -or $selected.draft -or -not $selected.published_at -or $selected.tag_name -cne $tag) {
            throw "No published Winix release matching '$tag' was returned. No other release will be substituted."
        }
    } else {
        $releases = @()
        $page = 1
        do {
            $items = Invoke-RestMethod -Uri "https://api.github.com/repos/adrifer/winix/releases?per_page=100&page=$page" `
                -Headers $headers -TimeoutSec 90 -ErrorAction Stop
            $releases += @($items)
            $page++
        } while (@($items).Count -eq 100)
        $selected = $releases | Where-Object {
            $_ -and -not $_.draft -and
            (($Channel -eq 'preview' -and $_.prerelease) -or
                ($Channel -eq 'stable' -and -not $_.prerelease))
        } | Sort-Object { [DateTimeOffset]$_.published_at } -Descending | Select-Object -First 1
        if (-not $selected) { throw "No published '$Channel' Winix release found." }
    }
    if ($selected.tag_name -notmatch '^v\d+\.\d+\.\d+(?:-preview\.\d+)?$') {
        throw "Unrecognized Winix release tag: $($selected.tag_name)"
    }
    foreach ($name in @('bootstrap-windows.ps1', 'bootstrap-windows.ps1.sha256')) {
        $assets = @($selected.assets | Where-Object { $_.name -eq $name -and $_.state -eq 'uploaded' })
        if ($assets.Count -ne 1) {
            throw "Release $($selected.tag_name) does not provide exactly one uploaded $name. No older release or other channel will be substituted."
        }
    }
    return $selected
}

function Assert-WinixDownloadDirectory {
    param([string]$Path)
    $current = [IO.Path]::GetFullPath($Path)
    while ($current) {
        if (Test-Path -LiteralPath $current) {
            $item = Get-Item -LiteralPath $current -Force
            if (-not $item.PSIsContainer -or ($item.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
                throw "Unsafe download directory (not a directory or is a link): $current"
            }
        }
        $parent = Split-Path $current -Parent
        if ($parent -eq $current) { break }
        $current = $parent
    }
}

function Invoke-WinixBootstrapDownload {
    [CmdletBinding(DefaultParameterSetName = 'Channel')]
    param(
        [Parameter(ParameterSetName = 'Channel')]
        [ValidateSet('stable', 'preview')][string]$Channel = 'stable',
        [Parameter(Mandatory = $true, ParameterSetName = 'Version')]
        [ValidatePattern('\Av?[0-9]+\.[0-9]+\.[0-9]+(?:-preview\.[0-9]+)?\z')]
        [string]$Version,
        [string]$DestinationDirectory = (Join-Path $HOME 'winix-bootstrap')
    )
    $ErrorActionPreference = 'Stop'
    $directory = [IO.Path]::GetFullPath($DestinationDirectory)
    Assert-WinixDownloadDirectory $directory
    $destination = Join-Path $directory 'bootstrap-windows.ps1'
    if (Test-Path -LiteralPath $destination) {
        $item = Get-Item -LiteralPath $destination -Force
        if ($item.PSIsContainer -or ($item.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
            throw "Refusing linked or non-file installer destination: $destination"
        }
    }
    $selection = @{ Channel = $Channel }
    if ($PSCmdlet.ParameterSetName -eq 'Version') { $selection = @{ Version = $Version } }
    $release = Get-WinixBootstrapRelease @selection
    $base = "https://github.com/adrifer/winix/releases/download/$($release.tag_name)"
    $sums = (Invoke-WebRequest -UseBasicParsing -Uri "$base/bootstrap-windows.ps1.sha256" -TimeoutSec 90).Content
    if ($sums -is [byte[]]) { $sums = [Text.Encoding]::UTF8.GetString($sums) }
    $entries = @($sums -split '\r?\n' | Where-Object { $_ -match '^[a-fA-F0-9]{64}\s+\*?bootstrap-windows\.ps1$' })
    if ($entries.Count -ne 1) { throw 'Release checksum for bootstrap-windows.ps1 is missing, invalid or duplicated.' }
    $expected = ($entries[0] -split '\s+')[0]
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
    $temporary = Join-Path $directory ("bootstrap-windows.ps1." + [guid]::NewGuid().ToString('N') + '.download')
    try {
        Invoke-WebRequest -UseBasicParsing -Uri "$base/bootstrap-windows.ps1" -OutFile $temporary -TimeoutSec 90
        $algorithm = [Security.Cryptography.SHA256]::Create()
        try {
            $stream = [IO.File]::OpenRead($temporary)
            try { $actual = [BitConverter]::ToString($algorithm.ComputeHash($stream)).Replace('-', '') }
            finally { $stream.Dispose() }
        } finally { $algorithm.Dispose() }
        if ($actual -ne $expected) { throw "Checksum mismatch for $($release.tag_name); the existing installer has not been replaced." }
        if (Test-Path -LiteralPath $destination) {
            [IO.File]::Replace($temporary, $destination, [NullString]::Value)
        } else {
            [IO.File]::Move($temporary, $destination)
        }
    } finally {
        if (Test-Path -LiteralPath $temporary) { Remove-Item -LiteralPath $temporary -Force }
    }
    Write-Host "Verified Windows bootstrap from $($release.tag_name)."
    return $destination
}

function Start-DotfilesWindowsSetup {
    [CmdletBinding(DefaultParameterSetName = 'Channel')]
    param(
        [string]$HostName,
        [Parameter(ParameterSetName = 'Channel')]
        [ValidateSet('stable', 'preview')][string]$Channel = 'stable',
        [Parameter(Mandatory = $true, ParameterSetName = 'Version')]
        [ValidatePattern('\Av?[0-9]+\.[0-9]+\.[0-9]+(?:-preview\.[0-9]+)?\z')]
        [string]$Version,
        [string]$Ref = 'feat/windows-devbox-preview',
        [string]$Destination = (Join-Path $HOME 'dotfiles'),
        [switch]$PrepareOnly
    )
    $ErrorActionPreference = 'Stop'
    if (-not $HostName -or $HostName.StartsWith('-') -or $HostName -match '[\x00-\x20]') {
        throw 'Usage: .\windows.ps1 -HostName <declared-host> [-Channel stable|preview | -Version <version>] [-PrepareOnly]'
    }
    Initialize-DotfilesWinGet
    $selection = @{ Channel = $Channel }
    if ($PSCmdlet.ParameterSetName -eq 'Version') { $selection = @{ Version = $Version } }
    $installer = Invoke-WinixBootstrapDownload @selection
    $options = @{
        Repository = 'https://github.com/adrifer/dotfiles.git'
        Ref = $Ref
        Destination = $Destination
        ConfigDirectory = 'winix'
        HostName = $HostName
    }
    if ($PrepareOnly) { $options.PrepareOnly = $true }
    Write-Host "Starting Winix bootstrap for $HostName. Git handles repository authentication; Winix will ask before activation."
    & $installer @options
    if (-not $?) { throw 'Winix bootstrap failed. Resolve the reported error before rerunning this setup.' }
}

if ($MyInvocation.InvocationName -ne '.') {
    try {
        $selection = @{ Channel = $Channel }
        if ($PSCmdlet.ParameterSetName -eq 'Version') { $selection = @{ Version = $Version } }
        Start-DotfilesWindowsSetup -HostName $HostName @selection -Ref $Ref -Destination $Destination -PrepareOnly:$PrepareOnly
    }
    catch {
        Write-Error $_ -ErrorAction Continue
        exit 1
    }
}
