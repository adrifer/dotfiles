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

Set-Alias -Name lg -Value lazygit
Set-Alias -Name code -Value code-insiders

Remove-Item alias:kstop -Force -ErrorAction SilentlyContinue
Remove-Item alias:kstart -Force -ErrorAction SilentlyContinue
function kstart { & komorebic start --whkd --bar @args }
function kstop { & komorebic stop --whkd --bar @args }
