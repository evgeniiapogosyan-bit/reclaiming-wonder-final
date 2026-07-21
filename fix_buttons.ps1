$cssFile = "c:\Users\Evgenia\Desktop\Websote\style.css"
$cssContent = Get-Content -Path $cssFile -Raw

$cssContent = $cssContent -replace '(?s)(\.workshop-toolbar\s*\{)', '$1 position: relative; z-index: 9999; pointer-events: auto; '
$cssContent = $cssContent -replace '(?s)(\.ambient-player\s*\{)', '$1 z-index: 99999 !important; pointer-events: auto !important; '

Set-Content -Path $cssFile -Value $cssContent

$htmlFile = "c:\Users\Evgenia\Desktop\Websote\index.html"
$htmlContent = Get-Content -Path $htmlFile -Raw

# Replace helper function to log clicks
$htmlContent = $htmlContent -replace '(?s)function btn\(id, fn\) \{(.*?)\s*if \(el\) el\.addEventListener\(''click'', fn\);\s*\}', "function btn(id, fn) {$1 if (el) el.addEventListener('click', function(e) { console.log('Button ' + id + ' clicked'); fn(e); }); }"

# Add log to togglePlay
$htmlContent = $htmlContent -replace 'function togglePlay\(\) \{', 'function togglePlay() { console.log("Button ap-play clicked"); '
$htmlContent = $htmlContent -replace 'apNext\.addEventListener\(''click'', function\(\) \{', 'apNext.addEventListener(''click'', function() { console.log("Button ap-next clicked"); '
$htmlContent = $htmlContent -replace 'apPrev\.addEventListener\(''click'', function\(\) \{', 'apPrev.addEventListener(''click'', function() { console.log("Button ap-prev clicked"); '

Set-Content -Path $htmlFile -Value $htmlContent

Write-Host "Z-index fixes and console logs applied."
