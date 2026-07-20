$ErrorActionPreference = 'Stop'
$bundledPython = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'

$python = if (Test-Path -LiteralPath $bundledPython) {
    $bundledPython
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    (Get-Command py).Source
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    (Get-Command python).Source
} else {
    throw 'Python 3 was not found.'
}

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  1:09 local website is running' -ForegroundColor Green
Write-Host '  URL: http://127.0.0.1:8099' -ForegroundColor Yellow
Write-Host '  Keep this window open. Close it to stop.'
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
& $python -m http.server 8099 --bind 127.0.0.1 --directory "$PSScriptRoot\site"
