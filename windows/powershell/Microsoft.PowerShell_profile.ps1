Import-Module -Name Terminal-Icons -ErrorAction Stop

$env:STARSHIP_CONFIG = Join-Path $HOME '.config\starship.toml'
$starshipInit = & (Get-Command starship -ErrorAction Stop).Source init powershell
if ($LASTEXITCODE -ne 0) { throw "starship init failed with exit code $LASTEXITCODE" }
Invoke-Expression ($starshipInit | Out-String)

$zoxideInit = & (Get-Command zoxide -ErrorAction Stop).Source init powershell
if ($LASTEXITCODE -ne 0) { throw "zoxide init failed with exit code $LASTEXITCODE" }
Invoke-Expression ($zoxideInit | Out-String)

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

Set-Alias -Name lg -Value lazygit
Set-Alias -Name g -Value lazygit
Set-Alias -Name code -Value code-insiders
Set-Alias -Name ci -Value code-insiders
Set-Alias -Name n -Value nvim

# Same shortcuts as zsh (features/zsh.ts).
# eza is only on some hosts: keep PowerShell's own ls where it is missing.
if (Get-Command eza -CommandType Application -ErrorAction SilentlyContinue) {
    Remove-Item alias:ls -Force -ErrorAction SilentlyContinue
    function ls {
        # Without a path, eza reads paths from stdin when that is not a terminal (scripts, pipes).
        $paths = @($args | Where-Object { -not "$_".StartsWith('-') })
        & eza -lh --group-directories-first --icons=auto @args @(if (-not $paths.Count) { '.' })
    }
    function lsa { ls -a @args }
}
function .. { Set-Location .. }
function ... { Set-Location ../.. }

function co { & copilot --add-dir $PWD.ProviderPath --yolo @args }
function coc { co --continue @args }
function cor { co --resume @args }
function cou { & copilot update @args }

# The pinned Winix for this PC's dotfiles, with the remembered host (setup/windows.ps1).
function i { & winix switch @args }
function u { & winix update --windows @args }

# cd like zsh's zd: no argument goes home, an existing path is a normal cd
# (including cd -, drives and ~), anything else is a zoxide jump.
Remove-Item alias:cd -Force -ErrorAction SilentlyContinue
function cd {
    if ($args.Count -eq 0) { Set-Location -LiteralPath $HOME; return }
    try {
        Set-Location @args -ErrorAction Stop
        return
    } catch [System.Management.Automation.ItemNotFoundException], [System.Management.Automation.ParameterBindingException] {
        # Not a path (or several keywords): ask zoxide.
    }
    $before = $PWD.ProviderPath
    z @args
    if ($PWD.ProviderPath -ne $before) { Write-Host "$([char]::ConvertFromUtf32(0xF17A9)) $($PWD.ProviderPath)" }
}

Remove-Item alias:kstop -Force -ErrorAction SilentlyContinue
Remove-Item alias:kstart -Force -ErrorAction SilentlyContinue
function kstart { & komorebic start --whkd --bar @args }
function kstop { & komorebic stop --whkd --bar @args }
