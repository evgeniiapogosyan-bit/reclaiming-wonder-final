# PowerShell script to generate 6 complex Kandinsky-inspired SVGs

$dir = "c:\Users\Evgenia\Desktop\Websote"

$svg1 = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <rect width="800" height="600" fill="#1b2a4a"/>
    <circle cx="400" cy="300" r="180" fill="#e0c070" opacity="0.85"/>
    <circle cx="550" cy="200" r="80" fill="#9e1b32" opacity="0.9"/>
    <path d="M 100 500 Q 300 200 700 100" stroke="#00b4d8" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M 200 100 C 400 400 500 500 750 400" stroke="#a84c1c" stroke-width="8" fill="none"/>
    <polygon points="150,150 250,50 350,200" fill="#c98a20" opacity="0.8"/>
    <rect x="600" y="450" width="120" height="120" rx="15" fill="#00b4d8" transform="rotate(25 660 510)" opacity="0.7"/>
    <circle cx="300" cy="450" r="40" fill="#a84c1c"/>
    <line x1="0" y1="350" x2="800" y2="250" stroke="#141416" stroke-width="4"/>
    <circle cx="650" cy="150" r="15" fill="#e0c070"/>
    <circle cx="200" cy="300" r="10" fill="#00b4d8"/>
</svg>
"@
Set-Content -Path "$dir\vibe_artwork_1.svg" -Value $svg1

$svg2 = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00b4d8" stroke-width="1" opacity="0.3"/>
        </pattern>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#e0c070" stop-opacity="1"/>
            <stop offset="100%" stop-color="#e0c070" stop-opacity="0"/>
        </radialGradient>
    </defs>
    <rect width="800" height="600" fill="#141416"/>
    <rect width="800" height="600" fill="url(#grid)"/>
    <polygon points="200,100 700,300 400,550" fill="#9e1b32" opacity="0.9"/>
    <rect x="100" y="200" width="600" height="80" fill="#1b2a4a" transform="rotate(-15 400 240)"/>
    <circle cx="500" cy="400" r="120" fill="url(#glow)"/>
    <path d="M 150 450 L 300 150 L 500 500 Z" fill="#c98a20" opacity="0.6" style="mix-blend-mode: screen;"/>
    <circle cx="250" cy="350" r="50" fill="#00b4d8"/>
    <line x1="50" y1="50" x2="750" y2="550" stroke="#a84c1c" stroke-width="6"/>
</svg>
"@
Set-Content -Path "$dir\vibe_artwork_2.svg" -Value $svg2

$svg3 = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <rect width="800" height="600" fill="#0d0d0f"/>
    <polygon points="100,600 400,0 700,600" fill="#00b4d8" opacity="0.15"/>
    <polygon points="300,600 500,0 800,600" fill="#00b4d8" opacity="0.2"/>
    <path d="M 0 300 C 200 100 600 500 800 200" stroke="#a84c1c" stroke-width="20" fill="none" opacity="0.85"/>
    <path d="M 0 350 C 250 150 550 550 800 250" stroke="#9e1b32" stroke-width="8" fill="none"/>
    <circle cx="450" cy="250" r="90" fill="#e0c070"/>
    <circle cx="350" cy="400" r="60" fill="#1b2a4a"/>
    <rect x="550" y="350" width="100" height="100" fill="#c98a20" transform="rotate(45 600 400)"/>
    <line x1="200" y1="0" x2="600" y2="600" stroke="#e0c070" stroke-width="3"/>
    <circle cx="650" cy="150" r="25" fill="#a84c1c"/>
</svg>
"@
Set-Content -Path "$dir\vibe_artwork_3.svg" -Value $svg3

$svg4 = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <defs>
        <radialGradient id="crimsonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#9e1b32" stop-opacity="1"/>
            <stop offset="100%" stop-color="#9e1b32" stop-opacity="0"/>
        </radialGradient>
    </defs>
    <rect width="800" height="600" fill="#1a1a1f"/>
    <path d="M 150 150 C 400 -50 600 300 400 500 C 200 700 -100 350 150 150 Z" fill="#a84c1c" opacity="0.8"/>
    <rect x="450" y="150" width="250" height="300" fill="#1b2a4a" rx="20"/>
    <line x1="0" y1="200" x2="800" y2="400" stroke="#00b4d8" stroke-width="5"/>
    <line x1="800" y1="200" x2="0" y2="400" stroke="#00b4d8" stroke-width="5"/>
    <circle cx="200" cy="450" r="140" fill="url(#crimsonGlow)"/>
    <circle cx="600" cy="450" r="60" fill="#c98a20"/>
    <polygon points="300,100 400,250 200,250" fill="#e0c070"/>
    <circle cx="100" cy="100" r="20" fill="#00b4d8"/>
</svg>
"@
Set-Content -Path "$dir\vibe_artwork_4.svg" -Value $svg4

$svg5 = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <rect width="800" height="600" fill="#141416"/>
    <path d="M 200 600 A 300 300 0 0 1 800 0" stroke="#e0c070" stroke-width="40" fill="none"/>
    <path d="M 0 400 A 400 400 0 0 0 600 600" stroke="#c98a20" stroke-width="25" fill="none"/>
    <polygon points="100,100 400,300 150,500" fill="#1b2a4a" opacity="0.9"/>
    <circle cx="600" cy="200" r="110" fill="#9e1b32"/>
    <circle cx="450" cy="450" r="80" fill="#00b4d8" opacity="0.85"/>
    <rect x="50" y="300" width="80" height="80" fill="#a84c1c" transform="rotate(15 90 340)"/>
    <line x1="300" y1="0" x2="300" y2="600" stroke="#e0c070" stroke-width="2" stroke-dasharray="10 10"/>
    <line x1="0" y1="300" x2="800" y2="300" stroke="#e0c070" stroke-width="2" stroke-dasharray="10 10"/>
    <circle cx="300" cy="300" r="15" fill="#ffffff"/>
</svg>
"@
Set-Content -Path "$dir\vibe_artwork_5.svg" -Value $svg5

$svg6 = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <rect width="800" height="600" fill="#08080a"/>
    <path d="M 100 100 Q 400 -100 700 200 T 500 550" stroke="#00b4d8" stroke-width="15" fill="none" stroke-linecap="round"/>
    <path d="M 50 500 Q 200 700 500 400 T 750 50" stroke="#9e1b32" stroke-width="25" fill="none" stroke-linecap="round" opacity="0.8"/>
    <rect x="300" y="200" width="200" height="200" fill="#1b2a4a" transform="rotate(45 400 300)"/>
    <rect x="150" y="250" width="100" height="100" fill="#e0c070" transform="rotate(20 200 300)"/>
    <rect x="550" y="350" width="120" height="120" fill="#c98a20" transform="rotate(60 610 410)"/>
    <circle cx="400" cy="300" r="60" fill="#a84c1c"/>
    <circle cx="400" cy="300" r="20" fill="#141416"/>
    <polygon points="600,100 700,200 600,300" fill="#00b4d8" opacity="0.7"/>
    <polygon points="200,400 300,500 100,500" fill="#9e1b32" opacity="0.9"/>
</svg>
"@
Set-Content -Path "$dir\vibe_artwork_6.svg" -Value $svg6

Write-Host "Generated 6 Vibe Artworks!"
