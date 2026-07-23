$cssPath = 'c:\Users\Evgenia\Desktop\Websote\style.css'
$css = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)

# Replace the old water-bg block using regex
$oldPattern = '(?s)\.water-bg \{.*?inset: 0;.*?z-index: 1;.*?animation: waterDrift.*?\}.*?@keyframes waterDrift \{.*?\}'
$newBlock = @"
/* Layer 1: Water background container - has SVG filter, clips children */
.water-bg {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;
    filter: url(#water-filter);
}

/* The actual background image - animated with GPU-composited transform only */
.water-bg__img {
    position: absolute;
    inset: -8%;
    width: 116%;
    height: 116%;
    background-image: url('Leaf/pexels-plato-terentev-3804555-6288566.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    animation: waterFlow 25s ease-in-out infinite alternate;
    will-change: transform;
}

@keyframes waterFlow {
    0%   { transform: scale(1)    translate(0%,    0%);    }
    25%  { transform: scale(1.03) translate(1.5%,  -0.5%); }
    50%  { transform: scale(1.05) translate(0.5%,  1%);    }
    75%  { transform: scale(1.03) translate(-1%,   0.5%);  }
    100% { transform: scale(1)    translate(0%,    -0.5%); }
}
"@

$updated = [regex]::Replace($css, $oldPattern, $newBlock)

if ($updated -eq $css) {
    Write-Host "WARNING: Pattern not matched - no replacement made"
    Write-Host ("waterDrift count: " + ([regex]::Matches($css, "waterDrift")).Count)
} else {
    [System.IO.File]::WriteAllText($cssPath, $updated, [System.Text.Encoding]::UTF8)
    Write-Host "CSS updated successfully"
}
