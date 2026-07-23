$cssFile = "c:\Users\Evgenia\Desktop\Websote\style.css"
$css = Get-Content $cssFile -Raw

# Remove skew from .scroll-container
$css = $css -replace '(?s)\.scroll-container \{ width: 100%; position: relative; transform: skewY\(var\(--scroll-skew, 0deg\)\);.*?\}', '.scroll-container { width: 100%; position: relative; }'

# Remove any sway animations from grid items if they exist
$css = $css -replace '(?s)@keyframes sway-.*?\}', ''

Set-Content $cssFile -Value $css

$htmlFile = "c:\Users\Evgenia\Desktop\Websote\index.html"
$html = Get-Content $htmlFile -Raw

# Remove the scroll listener that applies --scroll-skew
$html = $html -replace '(?s)var lastScroll = window\.pageYOffset;.*?container\.style\.setProperty\(''--scroll-skew'', ''0deg''\);.*?\}, 50\);\s*\}, \{ passive: true \}\);', ''

# Since the regex might be tricky to get right, let's just find the whole block and remove it.
# The block is inside a DOMContentLoaded listener, probably old.
# I will use a more robust regex or just string replacement if I know it.
$html = $html -replace '(?s)// Add scroll velocity skew.*?\}\);', ''

Set-Content $htmlFile -Value $html

# Also clean quotes.html
$quotesHtml = "c:\Users\Evgenia\Desktop\Websote\quotes.html"
$qHtml = Get-Content $quotesHtml -Raw
$qHtml = $qHtml -replace '(?s)// Add scroll velocity skew.*?\}\);', ''
Set-Content $quotesHtml -Value $qHtml

Write-Host "Skew logic removed."
