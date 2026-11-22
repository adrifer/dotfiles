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
Replace a PowerShell 7 that winget can't upgrade without asking first.
.NOTES
Before Winix runs, an installed PowerShell 7 older than the version locked in
winix/winix-windows.lock is upgraded with winget. A copy winget can't upgrade
(installed by another installer) is replaced with winget's, after asking. This
only happens from Windows PowerShell, with no PowerShell 7 windows open.

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
# Dev Box images ship PowerShell 7 from another installer, which winget can't
# upgrade ("install technology is different") or can't find by id. Winix then
# keeps the old copy. Fixing it here works because this script runs in Windows
# PowerShell, before Winix uses PowerShell 7.
$WingetNoInstalledPackage = -1978335212  # 0x8A150014
$WingetUpdateNotApplicable = -1978335189 # 0x8A15002B
$WingetArguments = @('--source', 'winget', '--accept-source-agreements', '--disable-interactivity')

function ConvertTo-FullVersion([string]$Text) {
    $parts = @($Text -split '\.' | ForEach-Object { [int]$_ })
    while ($parts.Count -lt 4) { $parts += 0 }
    return [version]::new($parts[0], $parts[1], $parts[2], $parts[3])
}

function Get-InstalledPowerShell7 {
    # @{ Version; ById } as winget sees it, or $null when PowerShell 7 is absent.
    $output = & winget list --id Microsoft.PowerShell --exact @WingetArguments | Out-String
    $code = $LASTEXITCODE
    if ($code -eq 0) {
        if ($output -notmatch '\sMicrosoft\.PowerShell\s+v?(\d+(?:\.\d+){1,3})\s') { throw "Could not read the PowerShell 7 version from winget:`n$output" }
        return @{ Version = $Matches[1]; ById = $true }
    }
    if ($code -ne $WingetNoInstalledPackage) { throw "winget list failed ($code):`n$output" }
    # Not found by id: it may still be installed by another installer.
    $exe = Join-Path $env:ProgramFiles 'PowerShell\7\pwsh.exe'
    if ((Test-Path -LiteralPath $exe) -and (Get-Item -LiteralPath $exe).VersionInfo.ProductVersion -match '^(\d+(?:\.\d+){1,3})') {
        return @{ Version = $Matches[1]; ById = $false }
    }
    return $null
}

function Wait-PowerShell7Closed {
    while ($open = @(Get-Process pwsh -ErrorAction SilentlyContinue)) {
        Write-Host "Close these PowerShell 7 processes first (Terminal tabs, VS Code terminals...):"
        $open | ForEach-Object { Write-Host "  pwsh PID $($_.Id) $($_.MainWindowTitle)" }
        if ((Read-Host 'Press Enter once they are closed, or type s to skip') -eq 's') { return $false }
    }
    return $true
}

function Get-PowerShell7Remover($Installed) {
    # How to uninstall the installed copy, decided before anything changes.
    if ($Installed.ById) {
        return { & winget uninstall --id Microsoft.PowerShell --exact --silent @WingetArguments | Out-Host; $LASTEXITCODE -eq 0 }
    }
    $entry = Get-ItemProperty 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*' -ErrorAction SilentlyContinue |
        Where-Object { $_.DisplayName -like 'PowerShell 7*' -and $_.WindowsInstaller -eq 1 } | Select-Object -First 1
    if (-not $entry) { return $null }
    $productCode = $entry.PSChildName
    return {
        $process = Start-Process msiexec.exe -ArgumentList "/x $productCode /qn /norestart" -Verb RunAs -Wait -PassThru
        $process.ExitCode -in 0, 1605, 3010
    }.GetNewClosure()
}

function Replace-PowerShell7($Installed, [string]$Locked) {
    $remove = Get-PowerShell7Remover $Installed
    if (-not $remove) { Write-Warning "Could not tell how PowerShell 7 $($Installed.Version) was installed; leaving it."; return }
    # Download first, so a network failure can't leave this PC without PowerShell 7.
    $directory = Join-Path ([IO.Path]::GetTempPath()) "powershell-$Locked"
    & winget download --id Microsoft.PowerShell --exact --version $Locked --download-directory $directory --accept-package-agreements @WingetArguments | Out-Host
    $msi = Get-ChildItem -LiteralPath $directory -Filter *.msi -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($LASTEXITCODE -ne 0 -or -not $msi) { Write-Warning "Could not download PowerShell $Locked; nothing was changed."; return }
    Write-Host "Uninstalling PowerShell 7 $($Installed.Version) (approve the UAC prompt)..."
    if (-not (& $remove)) { Write-Warning "The uninstall failed or was refused (company policy?); keeping PowerShell 7 $($Installed.Version)."; return }
    Write-Host "Installing PowerShell $Locked with winget..."
    & winget install --id Microsoft.PowerShell --exact --version $Locked --silent --accept-package-agreements @WingetArguments | Out-Host
    if ($LASTEXITCODE -ne 0) {
        Write-Host "winget install failed ($LASTEXITCODE); installing the downloaded $($msi.Name) instead..."
        $process = Start-Process msiexec.exe -ArgumentList "/i `"$($msi.FullName)`" /qn /norestart" -Verb RunAs -Wait -PassThru
        if ($process.ExitCode -notin 0, 3010) {
            Write-Warning "PowerShell 7 is NOT installed now. Install it with: winget install --id Microsoft.PowerShell --exact --source winget --version $Locked"
            return
        }
    }
    Write-Host "PowerShell 7 is now winget's $Locked; Winix can upgrade it from here."
}

function Sync-PowerShell7 {
    $lock = Get-Text "https://raw.githubusercontent.com/adrifer/dotfiles/$Ref/winix/winix-windows.lock" | ConvertFrom-Json
    $locked = $lock.packages.'Microsoft.PowerShell'.version
    if (-not $locked -or -not (Get-Command winget -ErrorAction SilentlyContinue)) { return }
    $installed = Get-InstalledPowerShell7
    if (-not $installed -or (ConvertTo-FullVersion $installed.Version) -ge (ConvertTo-FullVersion $locked)) { return }

    $why = if ($installed.ById) { '' } else { ", and winget can't find it by id (another installer put it there)" }
    Write-Host "PowerShell 7 $($installed.Version) is older than the locked $locked$why."
    if ($DryRun -or $PrepareOnly) { Write-Host '  Preview only: leaving it as it is.'; return }
    if ($PSVersionTable.PSEdition -eq 'Core') {
        Write-Warning 'This script is running in PowerShell 7, so it cannot update or replace it. Rerun it from Windows PowerShell to do that; continuing with the installed copy.'
        return
    }
    if (-not (Wait-PowerShell7Closed)) { Write-Host 'Skipped; continuing with the installed copy.'; return }

    if ($installed.ById) {
        & winget upgrade --id Microsoft.PowerShell --exact --version $locked --silent --accept-package-agreements @WingetArguments | Out-Host
        if ($LASTEXITCODE -eq 0) { Write-Host "PowerShell 7 upgraded to $locked."; return }
        if ($LASTEXITCODE -ne $WingetUpdateNotApplicable) { Write-Warning "winget could not upgrade PowerShell 7 ($LASTEXITCODE); continuing with $($installed.Version)."; return }
        Write-Host 'winget cannot upgrade this copy: it was installed with a different installer.'
    }
    if (-not $ReplacePowerShell) {
        Write-Host "It can be replaced with winget's PowerShell ${locked}: download it, uninstall this copy, then install it."
        Write-Host 'If your company manages this copy, its policy may block the uninstall or put it back later.'
        if ((Read-Host "Replace PowerShell 7 $($installed.Version) with $locked? [y/N]") -notmatch '^(y|yes)$') { Write-Host 'Keeping it.'; return }
    }
    Replace-PowerShell7 $installed $locked
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
