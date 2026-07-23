$htmlFile = "c:\Users\Evgenia\Desktop\Websote\index.html"
$html = Get-Content $htmlFile -Raw

# 1. Replace the entire faw-widget HTML
$oldWidget = '(?s)<div id="faw-widget" class="faw-widget">.*?</div>\s*</div>\s*</div>'
$newWidget = @"
    <div id="faw-widget" class="faw-widget">
        <div class="faw-header">
            <span class="faw-header-title">NOW PLAYING</span>
            <button id="faw-toggle" class="faw-toggle-btn" title="Minimize/Expand">( &ndash; )</button>
        </div>
        <div class="faw-body">
            <div class="faw-media-frame">
                <!-- Interactive Canvas Fluid Blob -->
                <canvas id="hologram-canvas"></canvas>
            </div>
            <div class="faw-info-controls">
                <span id="faw-track-name" class="faw-track-name">Arvo P&auml;rt &mdash; Fratres</span>
                <div class="faw-controls">
                    <button class="faw-btn faw-play-btn" id="faw-play">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                </div>
                <div class="faw-progress-container">
                    <div class="faw-progress-bar" id="faw-progress-bar"></div>
                </div>
            </div>
        </div>
    </div>
"@
$html = $html -replace $oldWidget, $newWidget

# 2. Replace the Premium Floating Audio Widget JS
$oldJs = '(?s)<script>\s*// Premium Floating Audio Widget.*?</script>'
$newJs = @"
<script>
// Premium Floating Audio Widget & Interactive Canvas Blob Logic
document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Audio Logic ---
    var apPlay = document.getElementById('faw-play');
    var apTrackName = document.getElementById('faw-track-name');
    var apProgress = document.getElementById('faw-progress-bar');
    var apToggle = document.getElementById('faw-toggle');
    var apWidget = document.getElementById('faw-widget');

    const playSvg = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    const pauseSvg = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

    if (apPlay) {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.loop = true; // Seamless loop for the single ambient track
        audio.src = "audio/fratres.mp3";

        function togglePlay() {
            if (audio.paused) {
                audio.play().then(() => {
                    console.log("Audio playing successfully");
                    apPlay.innerHTML = pauseSvg;
                }).catch((e) => {
                    console.error("Audio play error:", e);
                });
            } else {
                audio.pause();
                apPlay.innerHTML = playSvg;
            }
        }

        apPlay.addEventListener('click', togglePlay);

        audio.addEventListener('play', function() { apPlay.innerHTML = pauseSvg; });
        audio.addEventListener('playing', function() { apPlay.innerHTML = pauseSvg; });
        audio.addEventListener('pause', function() { apPlay.innerHTML = playSvg; });
        audio.addEventListener('timeupdate', function() {
            if (audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                if(apProgress) apProgress.style.width = percent + '%';
            }
        });
    }

    if (apToggle && apWidget) {
        // Minimize toggle
        apToggle.addEventListener('click', function() {
            apWidget.classList.toggle('minimized');
            if (apWidget.classList.contains('minimized')) {
                apToggle.innerHTML = '( + )';
            } else {
                apToggle.innerHTML = '( &ndash; )';
            }
        });
    }

    // --- 2. Canvas Holographic Blob Logic ---
    const canvas = document.getElementById('hologram-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        let mouseX = width / 2;
        let mouseY = height / 2;
        let targetX = width / 2;
        let targetY = height / 2;
        let isHovered = false;
        
        // Listen to global mouse moves for parallax
        window.addEventListener('mousemove', function(e) {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        canvas.addEventListener('mouseenter', () => isHovered = true);
        canvas.addEventListener('mouseleave', () => isHovered = false);

        // Resize handler
        window.addEventListener('resize', function() {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        });

        let time = 0;
        let distortionVal = 0;
        
        function drawHologram() {
            time += 0.02;
            
            // Smooth distortion on hover
            const targetDistortion = isHovered ? 25 : 10;
            distortionVal += (targetDistortion - distortionVal) * 0.05;

            ctx.clearRect(0, 0, width, height);

            // Lerp mouse position for smooth trailing effect
            const localTargetX = width/2 + ((targetX - window.innerWidth/2) * 0.15);
            const localTargetY = height/2 + ((targetY - window.innerHeight/2) * 0.15);
            
            mouseX += (localTargetX - mouseX) * 0.05;
            mouseY += (localTargetY - mouseY) * 0.05;

            // Background
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;
            const baseRadius = Math.min(width, height) * 0.35;

            // Draw glowing aura (shifting colors)
            const hue1 = (Math.sin(time * 0.5) * 50 + 200) % 360;
            const hue2 = (Math.cos(time * 0.3) * 50 + 280) % 360;

            const auraGrad = ctx.createRadialGradient(mouseX, mouseY, baseRadius * 0.1, centerX, centerY, baseRadius * 3);
            auraGrad.addColorStop(0, `hsla(` + hue1 + `, 80%, 60%, 0.4)`);
            auraGrad.addColorStop(0.5, `hsla(` + hue2 + `, 70%, 40%, 0.1)`);
            auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = auraGrad;
            ctx.fillRect(0, 0, width, height);

            // Create fluid blob path
            ctx.beginPath();
            for(let i = 0; i <= Math.PI * 2.1; i += 0.1) {
                // Liquid physics distortion
                const noise = Math.sin(i * 3 + time) * distortionVal + Math.cos(i * 2 - time * 1.5) * (distortionVal * 0.5);
                const r = baseRadius + noise;
                const x = centerX + Math.cos(i) * r;
                const y = centerY + Math.sin(i) * r;
                if(i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            
            // Draw holographic core (iridescent liquid)
            const orbGrad = ctx.createRadialGradient(
                mouseX, mouseY + Math.sin(time)*5, baseRadius * 0.1, 
                centerX, centerY, baseRadius * 1.5
            );
            orbGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
            orbGrad.addColorStop(0.2, `hsla(` + hue1 + `, 90%, 75%, 0.8)`);
            orbGrad.addColorStop(0.6, `hsla(` + hue2 + `, 80%, 50%, 0.4)`);
            orbGrad.addColorStop(1, 'rgba(10,10,20,0.6)');
            
            ctx.fillStyle = orbGrad;
            ctx.fill();

            // Inner mesh / wireframe lines simulation
            ctx.save();
            ctx.clip(); // clip to the blob shape
            
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            for(let i = -baseRadius*2; i < baseRadius*2; i+=12) {
                ctx.beginPath();
                // Parallax shift for lines
                ctx.moveTo(centerX - baseRadius*2, centerY + i + Math.sin(time*2 + i*0.1)*10);
                ctx.lineTo(centerX + baseRadius*2, centerY + i + Math.sin(time*2 + i*0.1)*10);
                ctx.stroke();
            }
            ctx.restore();

            // Core rim light
            ctx.lineWidth = 2;
            ctx.strokeStyle = `hsla(` + hue1 + `, 100%, 80%, 0.5)`;
            ctx.stroke();

            requestAnimationFrame(drawHologram);
        }
        
        drawHologram();
    }
});
</script>
"@
$html = $html -replace $oldJs, $newJs

Set-Content $htmlFile -Value $html

Write-Host "Widget overhauled with SVGs and fluid blob."
