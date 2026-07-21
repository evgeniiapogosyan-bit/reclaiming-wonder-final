$htmlFile = "c:\Users\Evgenia\Desktop\Websote\index.html"
$htmlContent = Get-Content -Path $htmlFile -Raw

$newScript = @"
<!-- Scroll Distortion Effect -->
<script>
(function() {
    'use strict';
    var container = document.querySelector('.scroll-container');
    if (!container) return;

    var lastScrollY = window.scrollY;
    var scrollTimeout = null;

    window.addEventListener('scroll', function() {
        var currentScrollY = window.scrollY;
        var velocity = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        var skewStrength = velocity * 0.12;

        if (skewStrength > 6) skewStrength = 6;
        if (skewStrength < -6) skewStrength = -6;

        container.style.setProperty('--scroll-skew', skewStrength + 'deg');

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            container.style.setProperty('--scroll-skew', '0deg');
        }, 50);
    }, { passive: true });
})();
</script>
</body>
"@

$htmlContent = $htmlContent -replace '</body>', $newScript
Set-Content -Path $htmlFile -Value $htmlContent

Write-Host "Injected JS successfully"
