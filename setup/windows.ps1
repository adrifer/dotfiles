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
.PARAMETER ReplacePowerShell
Replace an outdated PowerShell 7 from another installer without asking first.
.NOTES
Before Winix runs, PowerShell 7 is brought to the version locked in
winix/winix-windows.lock. winget's PowerShell is an MSIX package; a copy from the
classic installer (as Dev Box images ship) can't be upgraded by winget, so it is
replaced: winget's MSIX is installed first, then the classic copy is removed,
after asking. This only happens from Windows PowerShell, with no PowerShell 7
windows open.

The Winix version comes from winix/package.json at -Ref: its release's bootstrap
script is downloaded and checked against the release checksum before it runs.
Winix does the rest (WinGet check, Git, clone, prerequisites, one confirmation).
#>
[CmdletBinding()]
param(
    [string]$HostName,
    [ValidatePattern('\A[A-Za-z0-9._/-]+\z')]
    [string]$Ref = 'main',
    [string]$Destination = (Join-Path $HOME 'dotfiles'),
    [switch]$PrepareOnly,
    [switch]$DryRun,
    [switch]$ReplacePowerShell
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

# --- PowerShell 7 ------------------------------------------------------------
# winget's Microsoft.PowerShell is an MSIX package. A classic copy (the .exe or
# .msi installer, as Dev Box images ship) can't be upgraded by it ("install
# technology is different"), and it comes first on PATH: even with winget's MSIX
# installed next to it, `pwsh` still starts the old copy. Fixing it here works
# because this script runs in Windows PowerShell, before Winix uses PowerShell 7.
$WingetArguments = @('--source', 'winget', '--accept-source-agreements', '--disable-interactivity')

function ConvertTo-FullVersion([string]$Text) {
    if ($Text -notmatch '^(\d+(?:\.\d+){0,3})') { return $null }
    $parts = @($Matches[1] -split '\.' | ForEach-Object { [int]$_ })
    while ($parts.Count -lt 4) { $parts += 0 }
    return [version]::new($parts[0], $parts[1], $parts[2], $parts[3])
}

function Get-ClassicPowerShell7 {
    # The Program Files copy from the classic installer: @{ Version; Uninstall }, or $null.
    $exe = Join-Path $env:ProgramFiles 'PowerShell\7\pwsh.exe'
    if (-not (Test-Path -LiteralPath $exe)) { return $null }
    # The .exe installer's own entry is in the 32-bit view (WOW6432Node).
    $entries = @(Get-ItemProperty 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
        'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*' -ErrorAction SilentlyContinue |
        Where-Object { $_.DisplayName -like 'PowerShell 7*' -and $_.DisplayName -notlike '*preview*' })
    # The .exe installer registers itself and the .msi it wraps: uninstall through the .exe.
    $bundle = $entries | Where-Object { $_.QuietUninstallString -match '\.exe"?\s+/uninstall' } | Select-Object -First 1
    $msi = $entries | Where-Object { $_.WindowsInstaller -eq 1 } | Select-Object -First 1
    $uninstall = $null
    if ($bundle -and $bundle.QuietUninstallString -match '^"([^"]+)"\s*(.*)$') {
        $uninstall = @{ File = $Matches[1]; Arguments = "$($Matches[2]) /norestart".Trim() }
    } elseif ($msi) {
        $uninstall = @{ File = 'msiexec.exe'; Arguments = "/x $($msi.PSChildName) /qn /norestart" }
    }
    return @{ Version = ConvertTo-FullVersion (Get-Item -LiteralPath $exe).VersionInfo.ProductVersion; Uninstall = $uninstall }
}

function Get-MsixPowerShell7Version {
    try {
        $package = Get-AppxPackage -Name Microsoft.PowerShell -ErrorAction Stop |
            Sort-Object { [version]$_.Version } -Descending | Select-Object -First 1
        if ($package) { return ConvertTo-FullVersion $package.Version }
    } catch { }
    return $null
}

function Wait-PowerShell7Closed {
    while ($open = @(Get-Process pwsh -ErrorAction SilentlyContinue)) {
        Write-Host 'Close these PowerShell 7 processes first (Terminal tabs, VS Code terminals...):'
        $open | ForEach-Object { Write-Host "  pwsh PID $($_.Id) $($_.MainWindowTitle)" }
        if ((Read-Host 'Press Enter once they are closed, or type s to skip') -eq 's') { return $false }
    }
    return $true
}

function Install-PowerShell7Msix([string]$Version) {
    $directory = Join-Path ([IO.Path]::GetTempPath()) "powershell-$Version"
    & winget download --id Microsoft.PowerShell --exact --version $Version --download-directory $directory --accept-package-agreements @WingetArguments | Out-Host
    $code = $LASTEXITCODE
    $package = Get-ChildItem -LiteralPath $directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Extension -in '.msixbundle', '.msix' } | Select-Object -First 1
    if ($code -ne 0 -or -not $package) { Write-Warning "Could not download PowerShell $Version ($code); nothing was changed."; return $false }
    Write-Host "Installing PowerShell $Version (MSIX)..."
    try { Add-AppxPackage -Path $package.FullName } catch {
        Write-Warning "Could not install PowerShell ${Version}: $($_.Exception.Message) Nothing was removed."
        return $false
    }
    $installed = Get-MsixPowerShell7Version
    if (-not $installed -or $installed -lt (ConvertTo-FullVersion $Version)) {
        Write-Warning "PowerShell $Version did not register as installed; nothing was removed."
        return $false
    }
    return $true
}

function Sync-PowerShell7 {
    $lock = Get-Text "https://raw.githubusercontent.com/adrifer/dotfiles/$Ref/winix/winix-windows.lock" | ConvertFrom-Json
    $lockedText = $lock.packages.'Microsoft.PowerShell'.version
    $locked = ConvertTo-FullVersion $lockedText
    if (-not $locked) { return }
    $classic = Get-ClassicPowerShell7
    $msix = Get-MsixPowerShell7Version
    # A classic copy comes first on PATH, so it is the `pwsh` that runs.
    if ($classic) {
        if (-not $classic.Version -or $classic.Version -ge $locked) { return }
        Write-Host "PowerShell 7 $($classic.Version) in Program Files is older than the locked $lockedText. It came from another installer, so winget (whose PowerShell is an MSIX package) can't upgrade it."
        if ($msix -and $msix -ge $locked) { Write-Host "winget's PowerShell $msix is installed too, but this older copy comes first on PATH, so pwsh still starts it." }
    } elseif (-not $msix -or $msix -ge $locked) {
        return
    } else {
        Write-Host "PowerShell 7 $msix is older than the locked $lockedText."
    }
    if ($DryRun -or $PrepareOnly) { Write-Host '  Preview only: leaving it as it is.'; return }
    if ($PSVersionTable.PSEdition -eq 'Core') {
        Write-Warning 'This script is running in PowerShell 7, so it cannot update or replace it. Rerun it from Windows PowerShell to do that; continuing with the installed copy.'
        return
    }
    if (-not (Wait-PowerShell7Closed)) { Write-Host 'Skipped; continuing with the installed copy.'; return }

    if (-not $classic) {
        & winget upgrade --id Microsoft.PowerShell --exact --version $lockedText --silent --accept-package-agreements @WingetArguments | Out-Host
        if ($LASTEXITCODE -eq 0) { Write-Host "PowerShell 7 upgraded to $lockedText." }
        else { Write-Warning "winget could not upgrade PowerShell 7 ($LASTEXITCODE); continuing with $msix." }
        return
    }
    if (-not $classic.Uninstall) { Write-Warning "Could not tell how PowerShell 7 $($classic.Version) was installed; leaving it."; return }
    if (-not $ReplacePowerShell) {
        Write-Host "It can be replaced: install winget's PowerShell $lockedText (MSIX) first, then uninstall $($classic.Version)."
        Write-Host 'If your company manages this copy, its policy may block the uninstall or put it back later.'
        if ((Read-Host "Replace PowerShell 7 $($classic.Version) with $lockedText? [y/N]") -notmatch '^(y|yes)$') { Write-Host 'Keeping it.'; return }
    }
    if (-not $msix -or $msix -lt $locked) {
        if (-not (Install-PowerShell7Msix $lockedText)) { return }
    }
    Write-Host "Uninstalling PowerShell 7 $($classic.Version) (approve the UAC prompt)..."
    $code = try {
        (Start-Process $classic.Uninstall.File -ArgumentList $classic.Uninstall.Arguments -Verb RunAs -Wait -PassThru).ExitCode
    } catch { -1 }
    if ($code -in 0, 1605, 3010) {
        Write-Host "PowerShell 7 is now winget's $lockedText; Winix can upgrade it from here."
        if ($code -eq 3010) { Write-Host 'Windows wants a restart to finish removing the old copy.' }
    } else {
        Write-Warning "Could not uninstall PowerShell 7 $($classic.Version) ($code; refused, or company policy?). Both copies are installed and pwsh still starts $($classic.Version); remove it from Settings > Apps."
    }
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
    try { Sync-PowerShell7 } catch { Write-Warning "PowerShell 7 check skipped: $($_.Exception.Message)" }
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
