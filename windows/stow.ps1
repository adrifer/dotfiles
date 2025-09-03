param(
  [Parameter(Mandatory)]
  [string]$Package,
  [string]$Source = (Join-Path $PWD $Package),
  [string]$Target = $HOME
)

function Ensure-Dir($p) {
  if (-not (Test-Path -LiteralPath $p)) { New-Item -ItemType Directory -Path $p | Out-Null }
}

function Is-Link($p) {
  (Test-Path -LiteralPath $p) -and ((Get-Item -LiteralPath $p).Attributes -band [IO.FileAttributes]::ReparsePoint)
}

function New-FileLink($dest, $src) {
  if (Test-Path -LiteralPath $dest) {
    Write-Host "Skip (exists): $dest"
    return
  }
  try {
    New-Item -ItemType SymbolicLink -Path $dest -Target $src -ErrorAction Stop | Out-Null
    Write-Host "Symlink -> $dest"
  } catch {
    # Fallback: hardlink (same volume only), helpful if symlink perms/dev-mode are missing
    try {
      New-Item -ItemType HardLink -Path $dest -Target $src -ErrorAction Stop | Out-Null
      Write-Host "Hardlink -> $dest"
    } catch {
      Write-Warning "Failed to link $dest => $src : $($_.Exception.Message)"
    }
  }
}

function Link-Tree($src, $dst) {
  $item = Get-Item -LiteralPath $src
  if ($item.PSIsContainer) {
    # MERGE behavior: ensure directory exists, then recurse
    Ensure-Dir $dst
    Get-ChildItem -Force -LiteralPath $src | ForEach-Object {
      Link-Tree -src $_.FullName -dst (Join-Path $dst $_.Name)
    }
  } else {
    New-FileLink -dest $dst -src $src
  }
}

# Kick off linking for everything inside the package into $Target
Get-ChildItem -Force -LiteralPath $Source | ForEach-Object {
  Link-Tree -src $_.FullName -dst (Join-Path $Target $_.Name)
}
