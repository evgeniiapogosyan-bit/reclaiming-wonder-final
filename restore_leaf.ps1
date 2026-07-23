$htmlFile = "c:\Users\Evgenia\Desktop\Websote\index.html"
$cssFile = "c:\Users\Evgenia\Desktop\Websote\style.css"

$html = Get-Content $htmlFile -Raw

# 1. Inject the missing leaf content into leaf-section
$oldLeafSection = '(?s)(<div class="leaf-drifter">\s*<img src="Nesproject/leaf.png" alt="Floating Leaf" class="floating-leaf" loading="lazy">\s*</div>\s*</div>\s*)(</section>)'
$missingLeafSnippet = @"
            <div class="leaf-content">
                <h2>The weight of a single moment</h2>
                <p>Caught in the current of time, resting on the surface tension of memory.</p>
            </div>
            
            <!-- SVG Filter Definition for the water distortion -->
            <svg style="position: absolute; width: 0; height: 0;" aria-hidden="true">
                <defs>
                    <filter id="water-ripple">
                        <feTurbulence id="water-turbulence" type="fractalNoise" baseFrequency="0.012 0.025" numOctaves="3" seed="1" result="noise" />
                        <!-- High scale gives strong, glossy distortion -->
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>
        </section>
"@
$html = $html -replace $oldLeafSection, "`$1$missingLeafSnippet"

# 2. Delete the old redundant water-svg-defs at the top of the body
$oldSvgDefs = '(?s)<!-- SVG Filters for organic distortion effects.*?</svg>'
$html = $html -replace $oldSvgDefs, ''

Set-Content $htmlFile -Value $html

# 3. Update CSS to use the new water-ripple filter ID
$cssContent = Get-Content $cssFile -Raw
$cssContent = $cssContent -replace 'url\(#water-filter\)', 'url(#water-ripple)'

# 4. Append missing CSS for .leaf-content
$newCss = @"
/* Restored Leaf Content Styling */
.leaf-content {
    position: absolute;
    bottom: 15vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 15;
    text-align: center;
    pointer-events: none;
    width: 90%;
    max-width: 600px;
}
.leaf-content h2 {
    font-size: 2.5rem;
    font-weight: 300;
    letter-spacing: 0.08em;
    color: #f0e8d8;
    margin-bottom: 12px;
    text-transform: lowercase;
    text-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.leaf-content p {
    font-size: 1.1rem;
    color: rgba(240, 232, 216, 0.7);
    line-height: 1.5;
    font-weight: 300;
    font-style: italic;
    text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}
"@
Add-Content $cssFile -Value $newCss

Write-Host "Leaf section restored successfully."
