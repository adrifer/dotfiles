Import-Module -Name Terminal-Icons -ErrorAction Stop

$env:STARSHIP_CONFIG = Join-Path $HOME '.config\starship.toml'
$starshipInit = & (Get-Command starship -ErrorAction Stop).Source init powershell
if ($LASTEXITCODE -ne 0) { throw "starship init failed with exit code $LASTEXITCODE" }
Invoke-Expression ($starshipInit | Out-String)

$zoxideInit = & (Get-Command zoxide -ErrorAction Stop).Source init powershell
if ($LASTEXITCODE -ne 0) { throw "zoxide init failed with exit code $LASTEXITCODE" }
Invoke-Expression ($zoxideInit | Out-String)

# Windows-only helpers. Aliases shared with zsh (ls, cd, g, n, co, i, u, ...)
# are in features/cli/shell.ts, which writes them to the file loaded below.
function repos { Set-Location -LiteralPath $env:WINIX_REPOS }
function dl { Set-Location -LiteralPath (Join-Path $HOME 'Downloads') }
function desk { Set-Location -LiteralPath ([Environment]::GetFolderPath('Desktop')) }

# Restart the Entra ID (AAD) sign-in broker when Microsoft sign-in gets stuck.
function reset-aad {
    Get-Process Microsoft.AAD.BrokerPlugin -ErrorAction SilentlyContinue | Stop-Process -Force
}

# Make a monitor the primary display. Needs NirSoft MultiMonitorTool (not in
# winget) unpacked to C:\Tools\MultiMonitorTool; skipped on machines without it.
$global:MultiMonitorTool = 'C:\Tools\MultiMonitorTool\MultiMonitorTool.exe'
if (Test-Path -LiteralPath $global:MultiMonitorTool) {
    function Set-PrimaryDisplay([int]$Number) { & $global:MultiMonitorTool /SetPrimary "\\.\DISPLAY$Number" }
    function display1 { Set-PrimaryDisplay 1 }
    function display2 { Set-PrimaryDisplay 2 }
    function display3 { Set-PrimaryDisplay 3 }
}

Remove-Item alias:kstop -Force -ErrorAction SilentlyContinue
Remove-Item alias:kstart -Force -ErrorAction SilentlyContinue
function kstart { & komorebic start --whkd --bar @args }
function kstop { & komorebic stop --whkd --bar @args }

# Last: cd uses zoxide's z, defined above.
$sharedAliases = Join-Path $HOME '.config\powershell\aliases.ps1'
if (Test-Path -LiteralPath $sharedAliases) { . $sharedAliases }
