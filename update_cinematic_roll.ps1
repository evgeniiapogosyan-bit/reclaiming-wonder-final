# PowerShell Script to Transform Cinematic Roll Section in style.css and index.html

$cssFile = "c:\Users\Evgenia\Desktop\Websote\style.css"
$cssContent = Get-Content -Path $cssFile -Raw

# Replace Film Strip CSS section
$oldFilmCssPattern = '(?s)/\* =+\s*Film Strip Slider & Modal\s*=+ \*/.*?(?=/\* Modal Styles \*/)'

$newFilmCss = @"
/* ==========================================================================
   Cinematic Roll (35mm Analog Film Marquee)
   ========================================================================== */
.film-section {
    padding: 8vh 0;
    background-color: #08080a;
    overflow: hidden;
    position: relative;
}

.film-header {
    text-align: center;
    margin-bottom: 28px;
}

/* 35mm Film Container with Perforated Sprocket Holes */
.film-container {
    width: 100%;
    overflow: hidden;
    background: #0d0d0f;
    padding: 40px 0;
    position: relative;
    border-top: 2px solid rgba(255, 255, 255, 0.1);
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

/* Top Sprocket Perforations */
.film-container::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: 14px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='16'%3E%3Crect x='8' y='2' width='20' height='12' rx='3' fill='%23222228' stroke='%2308080a' stroke-width='1'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 2;
}

/* Bottom Sprocket Perforations */
.film-container::after {
    content: '';
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    height: 14px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='16'%3E%3Crect x='8' y='2' width='20' height='12' rx='3' fill='%23222228' stroke='%2308080a' stroke-width='1'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 2;
}

/* Infinite Marquee Strip */
.film-strip {
    display: flex;
    gap: 24px;
    width: max-content;
    animation: filmMarquee 38s linear infinite;
    will-change: transform;
}

.film-container:hover .film-strip {
    animation-play-state: paused;
}

@keyframes filmMarquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

/* 35mm Frame Card */
.film-frame {
    flex: 0 0 auto;
    width: 300px;
    background: #141417;
    border: 1px solid rgba(240, 232, 216, 0.12);
    border-radius: 8px;
    padding: 8px 10px 10px;
    cursor: pointer;
    position: relative;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
    transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1),
                border-color 0.3s ease,
                box-shadow 0.35s ease;
}

.film-frame:hover {
    transform: translateY(-5px) scale(1.02);
    border-color: rgba(201, 162, 39, 0.55);
    box-shadow:
        0 12px 36px rgba(0, 0, 0, 0.7),
        0 0 20px rgba(201, 162, 39, 0.2);
}

.film-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-sans);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: rgba(240, 232, 216, 0.5);
    margin-bottom: 6px;
    padding: 0 2px;
    text-transform: uppercase;
}

.exp-num {
    color: #c9a227;
}

.film-img-wrap {
    width: 100%;
    height: 180px;
    border-radius: 4px;
    overflow: hidden;
    background: #08080a;
}

.film-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: contrast(1.05) brightness(0.95);
    transition: filter 0.35s ease, transform 0.35s ease;
}

.film-frame:hover .film-img-wrap img {
    filter: contrast(1.1) brightness(1.08);
    transform: scale(1.04);
}

.film-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    font-family: var(--font-sans);
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    color: rgba(240, 232, 216, 0.4);
    padding: 0 2px;
}

.deconstruct-hint {
    color: rgba(201, 162, 39, 0.7);
    transition: color 0.3s ease;
}

.film-frame:hover .deconstruct-hint {
    color: #f0c850;
}
"@

$cssContent = $cssContent -replace $oldFilmCssPattern, $newFilmCss
Set-Content -Path $cssFile -Value $cssContent
Write-Host "Updated style.css with 35mm film marquee styles"

# Now update index.html HTML section for #film-slider
$htmlFile = "c:\Users\Evgenia\Desktop\Websote\index.html"
$htmlContent = Get-Content -Path $htmlFile -Raw

$newFilmHtml = @"
        <!-- Cinematic Roll Section (35mm Film Marquee) -->
        <section id="film-slider" class="section film-section">
            <div class="film-header">
                <span class="gallery-tag">analog inspiration</span>
                <h2 class="gallery-title" style="text-align: center; margin-bottom: 8px;">Cinematic Roll</h2>
                <p class="marketplace-sub" style="text-align: center;">Click any 35mm frame to deconstruct its colors &amp; shapes onto the canvas&thinsp;&darr;</p>
            </div>
            
            <div class="film-container">
                <div class="film-strip" id="film-strip">
                    <!-- Set 1 (Frames 1 - 6) -->
                    <div class="film-frame" data-frame-id="1" data-frame-num="EXP 01" data-stock="KODAK 400">
                        <div class="film-meta">
                            <span class="exp-num">EXP 01</span>
                            <span class="film-stock">KODAK 400</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e710499fcb41262e52dbee1b4a271dea.jpg" alt="Cinematic Frame 1" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 1A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <div class="film-frame" data-frame-id="2" data-frame-num="EXP 02" data-stock="SAFETY FILM">
                        <div class="film-meta">
                            <span class="exp-num">EXP 02</span>
                            <span class="film-stock">SAFETY FILM</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e79dcb217170cac92778cc83c4a556a0.jpg" alt="Cinematic Frame 2" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 2A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <div class="film-frame" data-frame-id="3" data-frame-num="EXP 03" data-stock="FUJI 800">
                        <div class="film-meta">
                            <span class="exp-num">EXP 03</span>
                            <span class="film-stock">FUJI 800</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e7b93fa6ca6d2a4c6e6d537a2a759bac.jpg" alt="Cinematic Frame 3" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 3A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <div class="film-frame" data-frame-id="4" data-frame-num="EXP 04" data-stock="TRI-X 400">
                        <div class="film-meta">
                            <span class="exp-num">EXP 04</span>
                            <span class="film-stock">TRI-X 400</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e8aeae4567e19576dc6a37a212da2475.jpg" alt="Cinematic Frame 4" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 4A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <div class="film-frame" data-frame-id="5" data-frame-num="EXP 05" data-stock="PORTRA 160">
                        <div class="film-meta">
                            <span class="exp-num">EXP 05</span>
                            <span class="film-stock">PORTRA 160</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e8e169d67d806cd1f74635a9a51db849.jpg" alt="Cinematic Frame 5" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 5A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <div class="film-frame" data-frame-id="6" data-frame-num="EXP 06" data-stock="ILFORD HP5">
                        <div class="film-meta">
                            <span class="exp-num">EXP 06</span>
                            <span class="film-stock">ILFORD HP5</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e96b70e4c3dd06f4859073171497b9e6.jpg" alt="Cinematic Frame 6" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 6A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <!-- Duplicate Set for Seamless Marquee Loop -->
                    <div class="film-frame" data-frame-id="1" data-frame-num="EXP 01" data-stock="KODAK 400">
                        <div class="film-meta">
                            <span class="exp-num">EXP 01</span>
                            <span class="film-stock">KODAK 400</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e710499fcb41262e52dbee1b4a271dea.jpg" alt="Cinematic Frame 1" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 1A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <div class="film-frame" data-frame-id="2" data-frame-num="EXP 02" data-stock="SAFETY FILM">
                        <div class="film-meta">
                            <span class="exp-num">EXP 02</span>
                            <span class="film-stock">SAFETY FILM</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e79dcb217170cac92778cc83c4a556a0.jpg" alt="Cinematic Frame 2" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 2A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <div class="film-frame" data-frame-id="3" data-frame-num="EXP 03" data-stock="FUJI 800">
                        <div class="film-meta">
                            <span class="exp-num">EXP 03</span>
                            <span class="film-stock">FUJI 800</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e7b93fa6ca6d2a4c6e6d537a2a759bac.jpg" alt="Cinematic Frame 3" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 3A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <div class="film-frame" data-frame-id="4" data-frame-num="EXP 04" data-stock="TRI-X 400">
                        <div class="film-meta">
                            <span class="exp-num">EXP 04</span>
                            <span class="film-stock">TRI-X 400</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e8aeae4567e19576dc6a37a212da2475.jpg" alt="Cinematic Frame 4" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 4A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <div class="film-frame" data-frame-id="5" data-frame-num="EXP 05" data-stock="PORTRA 160">
                        <div class="film-meta">
                            <span class="exp-num">EXP 05</span>
                            <span class="film-stock">PORTRA 160</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e8e169d67d806cd1f74635a9a51db849.jpg" alt="Cinematic Frame 5" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 5A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>

                    <div class="film-frame" data-frame-id="6" data-frame-num="EXP 06" data-stock="ILFORD HP5">
                        <div class="film-meta">
                            <span class="exp-num">EXP 06</span>
                            <span class="film-stock">ILFORD HP5</span>
                        </div>
                        <div class="film-img-wrap">
                            <img src="Nesproject/e96b70e4c3dd06f4859073171497b9e6.jpg" alt="Cinematic Frame 6" loading="lazy">
                        </div>
                        <div class="film-footer">
                            <span class="frame-code">&#9654; 6A</span>
                            <span class="deconstruct-hint">Deconstruct to Canvas &crarr;</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
"@

$oldFilmSectionPattern = '(?s)<section id="film-slider".*?</section>'
$htmlContent = $htmlContent -replace $oldFilmSectionPattern, $newFilmHtml

# Now add JS event delegation for film-strip deconstruct click in index.html
$oldSwJsPattern = '(?s)(/\* ── Event delegation - swatch ribbon ── \*/)'

$newFilmJs = @'
    /* ── Event delegation - Cinematic Roll (Frame clicks -> Deconstruct to Canvas) ── */
    var filmStrip = document.getElementById('film-strip');
    
    var frameDataMap = {
        '1': {
            num: 'EXP 01',
            shapes: [
                { type: 'rect', color: '#1b2a4a', nx: 0.28, ny: 0.30, nw: 0.22, nh: 0.32, angle: -8, rx: 6, ry: 6 },
                { type: 'circle', color: '#c98a20', nx: 0.52, ny: 0.40, nw: 0.18, nh: 0.18, angle: 0 },
                { type: 'triangle', color: '#9e1b32', nx: 0.65, ny: 0.25, nw: 0.15, nh: 0.25, angle: 15 }
            ]
        },
        '2': {
            num: 'EXP 02',
            shapes: [
                { type: 'circle', color: '#1a6648', nx: 0.35, ny: 0.32, nw: 0.24, nh: 0.24, angle: 0 },
                { type: 'rect', color: '#00b4d8', nx: 0.55, ny: 0.22, nw: 0.16, nh: 0.38, angle: 12, rx: 8, ry: 8 },
                { type: 'triangle', color: '#f0e8d8', nx: 0.22, ny: 0.48, nw: 0.14, nh: 0.20, angle: -10 }
            ]
        },
        '3': {
            num: 'EXP 03',
            shapes: [
                { type: 'rect', color: '#a84c1c', nx: 0.25, ny: 0.38, nw: 0.32, nh: 0.20, angle: 5, rx: 4, ry: 4 },
                { type: 'circle', color: '#3b2e8c', nx: 0.60, ny: 0.28, nw: 0.20, nh: 0.20, angle: 0 },
                { type: 'rect', color: '#e89060', nx: 0.48, ny: 0.45, nw: 0.14, nh: 0.28, angle: -15, rx: 6, ry: 6 }
            ]
        },
        '4': {
            num: 'EXP 04',
            shapes: [
                { type: 'triangle', color: '#9e1b32', nx: 0.30, ny: 0.25, nw: 0.20, nh: 0.30, angle: -12 },
                { type: 'circle', color: '#00a896', nx: 0.50, ny: 0.42, nw: 0.22, nh: 0.22, angle: 0 },
                { type: 'rect', color: '#c98a20', nx: 0.68, ny: 0.30, nw: 0.12, nh: 0.35, angle: 18, rx: 4, ry: 4 }
            ]
        },
        '5': {
            num: 'EXP 05',
            shapes: [
                { type: 'rect', color: '#3b2e8c', nx: 0.38, ny: 0.20, nw: 0.18, nh: 0.42, angle: 0, rx: 8, ry: 8 },
                { type: 'circle', color: '#ffe080', nx: 0.22, ny: 0.38, nw: 0.16, nh: 0.16, angle: 0 },
                { type: 'triangle', color: '#2aaa80', nx: 0.58, ny: 0.35, nw: 0.18, nh: 0.24, angle: 22 }
            ]
        },
        '6': {
            num: 'EXP 06',
            shapes: [
                { type: 'rect', color: '#2a2834', nx: 0.26, ny: 0.28, nw: 0.28, nh: 0.34, angle: -5, rx: 6, ry: 6 },
                { type: 'circle', color: '#c46028', nx: 0.58, ny: 0.32, nw: 0.22, nh: 0.22, angle: 0 },
                { type: 'triangle', color: '#00b4d8', nx: 0.42, ny: 0.45, nw: 0.15, nh: 0.22, angle: 14 }
            ]
        }
    };

    if (filmStrip) {
        filmStrip.addEventListener('click', function (e) {
            var frame = e.target.closest('.film-frame');
            if (!frame) return;

            var frameId = frame.getAttribute('data-frame-id') || '1';
            var frameNum = frame.getAttribute('data-frame-num') || ('EXP 0' + frameId);
            var info = frameDataMap[frameId] || frameDataMap['1'];

            var rect = frame.getBoundingClientRect();
            var img = frame.querySelector('img');

            var payload = {
                type: 'composition',
                label: 'Film ' + frameNum,
                shapes: info.shapes
            };

            showDock();
            spawnRipple(rect);

            if (img && typeof launchElement === 'function') {
                launchElement(img, rect, payload);
            } else if (typeof window.wsDeposit === 'function') {
                window.wsDeposit(payload);
            }

            showFilmNotification('Inspiration extracted from Frame #' + frameId + ' (' + frameNum + ') to Canvas!');
        });
    }

    function showFilmNotification(msg) {
        var notif = document.getElementById('film-notif');
        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'film-notif';
            notif.style.cssText = [
                'position:fixed',
                'bottom:32px',
                'left:50%',
                'transform:translateX(-50%) translateY(20px)',
                'background:rgba(18, 18, 22, 0.95)',
                'border:1px solid rgba(201, 162, 39, 0.6)',
                'box-shadow:0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(201, 162, 39, 0.25)',
                'border-radius:999px',
                'padding:12px 24px',
                'color:#f0e8d8',
                'font-family:var(--font-sans)',
                'font-size:0.82rem',
                'font-weight:500',
                'letter-spacing:0.04em',
                'pointer-events:none',
                'z-index:9999',
                'opacity:0',
                'transition:all 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
            ].join(';');
            document.body.appendChild(notif);
        }

        notif.textContent = '✨ ' + msg;
        requestAnimationFrame(function() {
            notif.style.opacity = '1';
            notif.style.transform = 'translateX(-50%) translateY(0)';
        });

        clearTimeout(notif._timer);
        notif._timer = setTimeout(function() {
            notif.style.opacity = '0';
            notif.style.transform = 'translateX(-50%) translateY(20px)';
        }, 2800);
    }

    $1
'@

$htmlContent = $htmlContent -replace $oldSwJsPattern, $newFilmJs

Set-Content -Path $htmlFile -Value $htmlContent
Write-Host "Updated index.html with 35mm film section and deconstruct logic"
