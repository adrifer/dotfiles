$ErrorActionPreference = 'Stop'
$logDirectory = [Environment]::GetFolderPath('LocalApplicationData')
if (-not $logDirectory) { throw 'The Windows local application data folder is unavailable.' }
$errorLog = Join-Path $logDirectory 'whkd-startup.stderr.log'

try {
  $sessionId = [Diagnostics.Process]::GetCurrentProcess().SessionId
  if (Get-Process -Name whkd -ErrorAction SilentlyContinue | Where-Object SessionId -eq $sessionId) { return }
  $whkd = (Get-Command whkd.exe -ErrorAction Stop).Source
  $config = Join-Path ([Environment]::GetFolderPath('UserProfile')) '.config/whkdrc'
  if (-not (Test-Path -LiteralPath $config -PathType Leaf)) { throw "whkd configuration is missing: $config" }
  Start-Process -FilePath $whkd -ArgumentList @('--config', "`"$config`"") -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $logDirectory 'whkd-startup.stdout.log') `
    -RedirectStandardError $errorLog
} catch {
  $_ | Out-String | Add-Content -LiteralPath $errorLog -Encoding utf8
  throw
}
