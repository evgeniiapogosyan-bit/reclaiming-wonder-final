$htmlFile = "c:\Users\Evgenia\Desktop\Websote\index.html"
$cssFile = "c:\Users\Evgenia\Desktop\Websote\style.css"

# 1. HTML Update: Fix JS Logic
$htmlContent = Get-Content -Path $htmlFile -Raw

$oldJsPattern = '(?s)<script>\s*document\.addEventListener\(''DOMContentLoaded'', function\(\) \{\s*var synthLever = document\.getElementById\(''shuffle-lever-trigger''\);.*?</script>\s*</body>'

$newJs = @"
<script>
document.addEventListener('DOMContentLoaded', function() {
    var synthLever = document.getElementById('shuffle-lever-trigger');
    var grid = document.querySelector('.gallery-grid');
    
    if (synthLever && grid) {
        synthLever.addEventListener('click', function() {
            console.log('SHUFFLE CLICKED');
            
            if (grid.classList.contains('shuffling')) return;
            
            // Trigger animation
            synthLever.classList.add('pulled');
            grid.classList.add('shuffling');
            
            setTimeout(function() {
                // Revert lever pull animation
                synthLever.classList.remove('pulled');
                
                // Fisher-Yates shuffle logic using .grid-item instead of .gallery-card
                var cards = Array.from(grid.querySelectorAll('.grid-item'));
                for (var i = cards.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = cards[i];
                    cards[i] = cards[j];
                    cards[j] = temp;
                }
                
                // Clear grid and re-append shuffled items
                grid.innerHTML = '';
                cards.forEach(function(card) {
                    grid.appendChild(card);
                });
                
                // Remove shuffle blur to trigger fade-in transition
                setTimeout(function() {
                    grid.classList.remove('shuffling');
                }, 50);
            }, 300);
        });
    }
});
</script>
</body>
"@

if ($htmlContent -match $oldJsPattern) {
    $htmlContent = $htmlContent -replace $oldJsPattern, $newJs
} else {
    Write-Host "Failed to match JS block."
}

Set-Content -Path $htmlFile -Value $htmlContent

# 2. Update CSS for lever and grid blur
$cssContent = Get-Content -Path $cssFile -Raw

$oldCssPattern = '(?s)\.elegant-synth-lever-wrap \{.*?\}'
$newCss = @"
.elegant-synth-lever-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer !important;
    pointer-events: auto !important;
    z-index: 100;
}
"@

$cssContent = $cssContent -replace $oldCssPattern, $newCss

# Make sure grid shuffle transitions affect .grid-item
$oldGridEffectPattern = '(?s)\.gallery-grid \.gallery-card \{.*?\}\s*\.gallery-grid\.shuffling \.gallery-card \{.*?\}'
$newGridEffect = @"
.gallery-grid .grid-item {
    transition: filter 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
}
.gallery-grid.shuffling .grid-item {
    filter: blur(8px) contrast(1.2);
    transform: translateY(20px) scale(0.95);
    opacity: 0;
}
"@

if ($cssContent -match $oldGridEffectPattern) {
    $cssContent = $cssContent -replace $oldGridEffectPattern, $newGridEffect
} else {
    Write-Host "Failed to match slot machine CSS block, injecting at end."
    $cssContent += "`n" + $newGridEffect
}

Set-Content -Path $cssFile -Value $cssContent
Write-Host "Applied failsafe shuffle JS and strict pointer-events CSS."
