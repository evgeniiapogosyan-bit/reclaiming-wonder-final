$htmlFile = "c:\Users\Evgenia\Desktop\Websote\index.html"
$cssFile = "c:\Users\Evgenia\Desktop\Websote\style.css"

# 1. Update index.html
$htmlContent = Get-Content -Path $htmlFile -Raw

# Add Lenis Script to head
$lenisScript = @"
    <!-- Lenis for smooth scroll -->
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js"></script>
</head>
"@
$htmlContent = $htmlContent -replace '(?s)</head>', $lenisScript

# Move <section id="hero"> OUT of <main class="scroll-container">
# Find <main class="scroll-container"> and the entire <section id="hero">...</section> block.
$heroPattern = '(?s)(<main class="scroll-container">)\s*(<section id="hero" class="section hero-section">.*?</section>)'
if ($htmlContent -match $heroPattern) {
    # Replace with: Hero first, then main
    $htmlContent = $htmlContent -replace $heroPattern, "`$2`n    `$1"
}

# Add 'content-curtain' class to main
$htmlContent = $htmlContent -replace '<main class="scroll-container">', '<main class="scroll-container content-curtain">'

# Add Scroll Event Logic at the bottom
$scrollLogic = @"
<script>
// Scroll Animation Architecture
document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. DOM Elements
    const heroSection = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    const heroBgWrapper = document.querySelector('.hero-bg-video-wrapper');
    const gridItems = document.querySelectorAll('.gallery-grid .grid-item');
    
    // 3. Scroll Listener
    lenis.on('scroll', (e) => {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        // --- Hero Scale & Fade Effects ---
        if (scrollY <= heroHeight) {
            // Calculate progress 0 to 1
            const progress = scrollY / heroHeight;
            
            // Scale text (1 to 0.95)
            const scale = 1 - (progress * 0.05);
            heroContent.style.transform = `scale(` + scale + `)`;
            
            // Fade video wrapper opacity (1 to 0.3)
            const videoOpacity = 1 - (progress * 0.7);
            heroBgWrapper.style.opacity = videoOpacity;
            
            // Blur video (0px to 8px)
            const blurAmt = progress * 8;
            heroBgWrapper.style.filter = `blur(` + blurAmt + `px)`;
        }

        // --- Grid Items Micro-Parallax ---
        // We only calculate if they are somewhat near viewport to save performance,
        // but simplest is just apply to all for now.
        gridItems.forEach((item, index) => {
            // Alternating speeds based on column (assuming masonry flow)
            // Or just odd/even index
            const speed = (index % 2 === 0) ? 0.05 : 0.1;
            const itemRect = item.getBoundingClientRect();
            // Calculate relative to viewport center
            const distFromCenter = (itemRect.top + (itemRect.height/2)) - (window.innerHeight/2);
            const yOffset = distFromCenter * speed;
            item.style.transform = `translateY(` + yOffset + `px)`;
        });
    });
});
</script>
</body>
"@
$htmlContent = $htmlContent -replace '(?s)</body>', $scrollLogic

Set-Content -Path $htmlFile -Value $htmlContent

# 2. Update style.css
$cssContent = Get-Content -Path $cssFile -Raw

# Modify .hero-section
$oldHeroCss = '(?s)\.hero-section \{.*?\}'
$newHeroCss = @"
/* Hero Section (Sticky Background) */
.hero-section {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 2rem;
    z-index: 1; /* Below content curtain */
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}
"@
# Note: I need to be careful with regex replace if there are multiple .hero-section blocks.
# Let's just append overrides at the end to be safe, but wait, if it's position relative, it might clash.
# I'll just append it with !important or stronger specificity.

$scrollCss = @"

/* === Scroll Architecture Overrides === */
section.hero-section#hero {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1 !important;
}

.content-curtain {
    position: relative;
    z-index: 10;
    margin-top: 100vh;
    background-color: #050508; /* Dark curtain background */
    width: 100%;
}

/* Remove transition on grid-item transform to prevent parallax stutter */
.gallery-grid .grid-item {
    transition: opacity 0.4s ease, box-shadow 0.3s ease !important; /* Exclude transform */
    will-change: transform; /* Hint for performance */
}

/* Lenis recommended base CSS */
html.lenis, html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}
.lenis.lenis-stopped {
  overflow: hidden;
}
.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
"@
Add-Content -Path $cssFile -Value $scrollCss

Write-Host "Injected Lenis scroll architecture, curtain layout, and scroll listener."
