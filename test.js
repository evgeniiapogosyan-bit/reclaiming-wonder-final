
(function() {
    'use strict';
    /* ── NEW Ambient Audio Player Logic ── */
    var apPlay = document.getElementById('ap-play');
    var apPrev = document.getElementById('ap-prev');
    var apNext = document.getElementById('ap-next');
    var apTrackName = document.getElementById('ap-track-name');

    if (!apPlay) return;

    var tracks = [
        { name: "SoundHelix 1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { name: "SoundHelix 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
    ];
    var currentTrackIdx = 0;

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.loop = true;

    function loadTrack(idx) {
        apTrackName.textContent = tracks[idx].name;
        audio.src = tracks[idx].url;
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => {
                console.log("Audio playing successfully");
                apPlay.innerHTML = '&#10074;&#10074;';
            }).catch((error) => {
                console.error("Audio playback failed:", error);
            });
        } else {
            audio.pause();
            apPlay.innerHTML = '&#9654;';
        }
    }

    apPlay.addEventListener('click', togglePlay);

    // Keep visual state in sync with actual audio events
    audio.addEventListener('play', function() { apPlay.innerHTML = '&#10074;&#10074;'; });
    audio.addEventListener('playing', function() { apPlay.innerHTML = '&#10074;&#10074;'; });
    audio.addEventListener('pause', function() { apPlay.innerHTML = '&#9654;'; });

    apNext.addEventListener('click', function() {
        currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
        loadTrack(currentTrackIdx);
        audio.play().then(() => {
            console.log("Audio playing successfully");
        }).catch((error) => {
            console.error("Audio playback failed:", error);
        });
    });

    apPrev.addEventListener('click', function() {
        currentTrackIdx = (currentTrackIdx - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIdx);
        audio.play().then(() => {
            console.log("Audio playing successfully");
        }).catch((error) => {
            console.error("Audio playback failed:", error);
        });
    });

    loadTrack(0);
})();


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


(function () {
    'use strict';

    /* --- Config --- */
    const PARTICLE_COUNT = 12;   // max particles alive at once
    const LIFESPAN       = 500;  // ms before a particle fully fades
    const SIZE_MIN       = 3;    // px
    const SIZE_MAX       = 8;    // px
    const COLOR          = '#e0e0e0';
    const GLOW           = '0 0 6px 2px rgba(224,224,224,0.6)';

    /* --- State --- */
    const pool = [];             // pre-allocated DOM nodes
    let mouseX = -999, mouseY = -999;
    let lastSpawnTime = 0;
    const SPAWN_THROTTLE = 30;   // ms between spawns

    /* --- Build DOM pool (avoids createElement on every frame) --- */
    const container = document.createElement('div');
    container.style.cssText = [
        'position:fixed',
        'top:0', 'left:0',
        'width:100%', 'height:100%',
        'pointer-events:none',
        'z-index:9999',
        'overflow:hidden'
    ].join(';');
    document.body.appendChild(container);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const el = document.createElement('span');
        el.style.cssText = [
            'position:absolute',
            'border-radius:50%',
            `background:${COLOR}`,
            `box-shadow:${GLOW}`,
            'pointer-events:none',
            'will-change:transform,opacity',
            'display:none'
        ].join(';');
        container.appendChild(el);
        pool.push({ el, active: false, born: 0, x: 0, y: 0, size: 0 });
    }

    /* --- Track mouse --- */
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    /* --- Spawn a particle from the pool --- */
    function spawn(now) {
        for (let i = 0; i < pool.length; i++) {
            const p = pool[i];
            if (!p.active) {
                p.active = true;
                p.born   = now;
                p.x      = mouseX;
                p.y      = mouseY;
                p.size   = SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN);

                const el = p.el;
                el.style.width   = p.size + 'px';
                el.style.height  = p.size + 'px';
                /* Centre on cursor */
                el.style.left    = (p.x - p.size / 2) + 'px';
                el.style.top     = (p.y - p.size / 2) + 'px';
                el.style.opacity = '1';
                el.style.display = 'block';
                return;
            }
        }
    }

    /* --- rAF loop --- */
    function tick(now) {
        /* Spawn */
        if (now - lastSpawnTime > SPAWN_THROTTLE && mouseX > -900) {
            spawn(now);
            lastSpawnTime = now;
        }

        /* Update each active particle */
        for (let i = 0; i < pool.length; i++) {
            const p = pool[i];
            if (!p.active) continue;

            const age      = now - p.born;
            const progress = age / LIFESPAN; // 0 → 1

            if (progress >= 1) {
                /* Recycle */
                p.active = false;
                p.el.style.display = 'none';
            } else {
                /* Fade out + drift slightly upward (natural feel) */
                const drift = progress * 20;           // px upward drift
                p.el.style.opacity   = (1 - progress).toFixed(3);
                p.el.style.transform = `translateY(-${drift}px) scale(${1 - progress * 0.5})`;
            }
        }

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

        
}());


(function () {
    'use strict';

    var turb = document.getElementById('water-turbulence');
    if (!turb) return;

    // Observe section visibility — only run rAF when on screen
    var section = document.getElementById('leaf-section');
    var active  = false;

    if (section && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            active = entries[0].isIntersecting;
        }, { threshold: 0.01 }).observe(section);
    } else {
        active = true; // fallback: always run
    }

    var t = 0; // time accumulator (seconds)

    var lastTS = 0;
    function step(ts) {
        requestAnimationFrame(step);
        if (!active) return;

        var dt = Math.min((ts - lastTS) / 1000, 0.05);
        lastTS = ts;
        t     += dt;

        // Gently oscillate baseFrequency around resting values
        // Small amplitude so the distortion stays subtle
        var bfx = (0.012 + Math.sin(t * 0.07) * 0.003).toFixed(5);
        var bfy = (0.008 + Math.cos(t * 0.05) * 0.002).toFixed(5);
        turb.setAttribute('baseFrequency', bfx + ' ' + bfy);

        // Slowly walk the seed — integer steps every ~8 s give smooth morphing
        var seed = Math.floor(t / 8) % 512;
        turb.setAttribute('seed', seed);
    }

    requestAnimationFrame(step);

        
}());


(function () {
    'use strict';

    /* ── Configuration ─────────────────────────────────────────── */
    var CFG = {
        duration   : 820,          // ms for the full flight
        easing     : 'cubic-bezier(0.4, 0, 0.6, 1)',
        landScale  : 0.12,         // final size as fraction of original
        landY      : 0.92,         // vertical landing position (fraction of vh)
        landX      : 0.5,          // horizontal landing position (fraction of vw)
        rippleDur  : 500,          // ms for the source ripple ring
        maxClones  : 6             // max simultaneous in-flight clones
    };

    /* ── Dock indicator (bottom-centre glow dot) ──────────────── */
    var dock = document.createElement('div');
    dock.id  = 'fly-dock';
    dock.style.cssText = [
        'position:fixed',
        'left:50%',
        'bottom:32px',
        'transform:translateX(-50%) scale(0)',
        'width:36px',
        'height:36px',
        'border-radius:50%',
        'background:rgba(255,255,255,0.08)',
        'border:1px solid rgba(255,255,255,0.22)',
        'box-shadow:0 0 18px 4px rgba(200,200,255,0.18)',
        'pointer-events:none',
        'z-index:9998',
        'transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),opacity 0.4s ease',
        'opacity:0'
    ].join(';');
    document.body.appendChild(dock);

    var dockHideTimer = null;

    function showDock() {
        clearTimeout(dockHideTimer);
        dock.style.transform = 'translateX(-50%) scale(1)';
        dock.style.opacity   = '1';
    }

    function hideDock() {
        dockHideTimer = setTimeout(function () {
            dock.style.transform = 'translateX(-50%) scale(0)';
            dock.style.opacity   = '0';
        }, 900);
    }

    /* ── Source ripple ring (stays on the original card) ─────── */
    function spawnRipple(rect) {
        var ring = document.createElement('div');
        ring.style.cssText = [
            'position:fixed',
            'border-radius:12px',
            'border:2px solid rgba(255,255,255,0.55)',
            'pointer-events:none',
            'z-index:9997',
            'box-sizing:border-box',
            'top:'    + rect.top    + 'px',
            'left:'   + rect.left   + 'px',
            'width:'  + rect.width  + 'px',
            'height:' + rect.height + 'px'
        ].join(';');
        document.body.appendChild(ring);

        ring.animate([
            { opacity: 1,   transform: 'scale(1)',    borderColor: 'rgba(255,255,255,0.55)' },
            { opacity: 0,   transform: 'scale(1.06)', borderColor: 'rgba(255,255,255,0)'   }
        ], {
            duration : CFG.rippleDur,
            easing   : 'ease-out',
            fill     : 'forwards'
        }).onfinish = function () { ring.remove(); };
    }

    /* ── Flying clone ─────────────────────────────────────────── */
    var activeClones = 0;

    function launchClone(img, rect) {
        if (activeClones >= CFG.maxClones) return;
        activeClones++;

        /* Build a fixed-position clone at the exact source position */
        var clone = document.createElement('img');
        clone.src = img.src;
        clone.style.cssText = [
            'position:fixed',
            'top:'     + rect.top    + 'px',
            'left:'    + rect.left   + 'px',
            'width:'   + rect.width  + 'px',
            'height:'  + rect.height + 'px',
            'object-fit:cover',
            'border-radius:12px',
            'pointer-events:none',
            'z-index:9998',
            'will-change:transform,opacity',
            'transform-origin:center center',
            'box-shadow:0 8px 32px rgba(0,0,0,0.5)'
        ].join(';');
        document.body.appendChild(clone);

        /* Calculate where the centre of the clone needs to travel */
        var startCX  = rect.left + rect.width  / 2;
        var startCY  = rect.top  + rect.height / 2;
        var endCX    = window.innerWidth  * CFG.landX;
        var endCY    = window.innerHeight * CFG.landY;

        /* Delta in pixels from the clone's top-left origin */
        var dx = endCX - startCX;
        var dy = endCY - startCY;

        /* Mid-arc control — arc outward slightly for a natural throw */
        var midDX = dx * 0.45 + (Math.random() - 0.5) * 60;
        var midDY = dy * 0.5  - 40;                          // slight upward bow

        clone.animate([
            {
                transform : 'translate(0, 0) scale(1)',
                opacity   : 1,
                offset    : 0
            },
            {
                transform : 'translate(' + midDX + 'px, ' + midDY + 'px) scale(0.6)',
                opacity   : 0.85,
                offset    : 0.4
            },
            {
                transform : 'translate(' + dx + 'px, ' + dy + 'px) scale(' + CFG.landScale + ')',
                opacity   : 0,
                offset    : 1
            }
        ], {
            duration : CFG.duration,
            easing   : CFG.easing,
            fill     : 'forwards'
        }).onfinish = function () {
            clone.remove();
            activeClones--;
            hideDock();

            /* Dock pulse on landing */
            dock.animate([
                { transform: 'translateX(-50%) scale(1.4)', opacity: 0.9 },
                { transform: 'translateX(-50%) scale(1)',   opacity: 0   }
            ], { duration: 380, easing: 'ease-out' });
        };
    }

    /* ── Shared clone launcher — works for both <img> and .mkt-item ─ */
    function launchElement(sourceEl, rect, depositPayload) {
        if (activeClones >= CFG.maxClones) return;
        activeClones++;

        var clone;

        if (sourceEl.tagName === 'IMG') {
            /* Image clone — identical pixel-perfect copy */
            clone = document.createElement('img');
            clone.src = sourceEl.src;
            clone.style.cssText = [
                'position:fixed',
                'top:'    + rect.top    + 'px',
                'left:'   + rect.left   + 'px',
                'width:'  + rect.width  + 'px',
                'height:' + rect.height + 'px',
                'object-fit:cover',
                'border-radius:12px',
                'pointer-events:none',
                'z-index:9998',
                'will-change:transform,opacity',
                'transform-origin:center center',
                'box-shadow:0 8px 32px rgba(0,0,0,0.5)'
            ].join(';');

        } else {
            /* Marketplace card clone — deep clone of the DOM node */
            clone = sourceEl.cloneNode(true);

            /* Reset the hover-lift the source card may currently have */
            clone.style.cssText = [
                'position:fixed',
                'top:'           + rect.top    + 'px',
                'left:'          + rect.left   + 'px',
                'width:'         + rect.width  + 'px',
                'height:'        + rect.height + 'px',
                'border-radius:16px',
                'pointer-events:none',
                'z-index:9998',
                'will-change:transform,opacity',
                'transform-origin:center center',
                'transform:none',
                /* Preserve card's visual style */
                'background:rgba(255,255,255,0.06)',
                'border:1px solid rgba(240,232,216,0.22)',
                'display:flex',
                'flex-direction:column',
                'align-items:center',
                'justify-content:center',
                'gap:18px',
                'padding:28px 20px 22px',
                'box-shadow:0 12px 40px rgba(0,0,0,0.6)',
                'box-sizing:border-box',
                'overflow:hidden'
            ].join(';');
        }

        document.body.appendChild(clone);

        /* Travel vectors */
        var startCX = rect.left + rect.width  / 2;
        var startCY = rect.top  + rect.height / 2;
        var endCX   = window.innerWidth  * CFG.landX;
        var endCY   = window.innerHeight * CFG.landY;
        var dx      = endCX - startCX;
        var dy      = endCY - startCY;
        var midDX   = dx * 0.45 + (Math.random() - 0.5) * 60;
        var midDY   = dy * 0.5  - 40;

        clone.animate([
            { transform: 'translate(0, 0) scale(1)',
              opacity: 1, offset: 0 },
            { transform: 'translate(' + midDX + 'px,' + midDY + 'px) scale(0.6)',
              opacity: 0.85, offset: 0.4 },
            { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + CFG.landScale + ')',
              opacity: 0, offset: 1 }
        ], {
            duration : CFG.duration,
            easing   : CFG.easing,
            fill     : 'forwards'
        }).onfinish = function () {
            clone.remove();
            activeClones--;
            hideDock();
            dock.animate([
                { transform: 'translateX(-50%) scale(1.4)', opacity: 0.9 },
                { transform: 'translateX(-50%) scale(1)',   opacity: 0   }
            ], { duration: 380, easing: 'ease-out' });
            /* FIX: payload is captured directly in this closure — no DOM lookup needed */
            if (depositPayload && typeof window.wsDeposit === 'function') {
                window.wsDeposit(depositPayload);
            }
        };
    }

    /* ── Composition Extraction helpers ───────────────────────── */
    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(function (v) {
            return Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
        }).join('');
    }

    /* Seeded LCG — deterministic randomness per image src */
    function makeRng(src) {
        var h = 0;
        for (var i = 0; i < src.length; i++) h = Math.imul(31, h) + src.charCodeAt(i) | 0;
        h = Math.abs(h) || 1;
        return function () { h = Math.imul(1664525, h) + 1013904223 | 0; return (h >>> 0) / 4294967296; };
    }

    /* Algorithmic fallback composition (no CORS needed) */
    function algorithmicComposition(src, label) {
        /* Seeded Kandinsky-style fallback — vivid, dramatic, no pixel access needed */
        var rng = makeRng(src);

        /* Bold Kandinsky palette: primaries, deep earth, high-chroma accents */
        var palette = [
            '#c4381e','#e8a020','#2a5c8a','#6b9e2a','#8a3a7a',
            '#d4802a','#1e4a2e','#c8c028','#3a1a5a','#1a3a5a',
            '#a02828','#285880','#8a7a20','#4a1a3a','#c86820'
        ];
        var angles = [0, 30, 45, -30, -45, 60, -60, 90, -90, 15, -15];
        var shapes = [];

        /* 2-3 large background rectangles anchoring the composition */
        var bgCount = 2 + Math.floor(rng() * 2);
        for (var b = 0; b < bgCount; b++) {
            shapes.push({
                kind   : 'rect',
                nx     : rng() * 0.45,
                ny     : rng() * 0.45,
                nw     : 0.38 + rng() * 0.38,
                nh     : 0.32 + rng() * 0.32,
                color  : palette[Math.floor(rng() * palette.length)],
                angle  : angles[Math.floor(rng() * angles.length)],
                opacity: 0.52 + rng() * 0.22
            });
        }

        /* 3-5 triangles — Kandinsky's dynamic tension element */
        var triCount = 3 + Math.floor(rng() * 3);
        for (var t = 0; t < triCount; t++) {
            shapes.push({
                kind   : 'triangle',
                nx     : rng() * 0.78,
                ny     : rng() * 0.78,
                nw     : 0.10 + rng() * 0.24,
                nh     : 0.12 + rng() * 0.20,
                color  : palette[Math.floor(rng() * palette.length)],
                angle  : angles[Math.floor(rng() * angles.length)],
                opacity: 0.62 + rng() * 0.30
            });
        }

        /* 2-3 circles — Kandinsky's spiritual focal points */
        var cirCount = 2 + Math.floor(rng() * 2);
        for (var c = 0; c < cirCount; c++) {
            var sz = 0.06 + rng() * 0.13;
            shapes.push({
                kind   : 'circle',
                nx     : 0.08 + rng() * 0.72,
                ny     : 0.08 + rng() * 0.72,
                nw     : sz, nh: sz,
                color  : palette[Math.floor(rng() * palette.length)],
                angle  : 0,
                opacity: 0.72 + rng() * 0.22
            });
        }

        /* 2-4 tension lines connecting visual masses */
        var lineCount = 2 + Math.floor(rng() * 3);
        for (var l = 0; l < lineCount; l++) {
            shapes.push({
                kind       : 'line',
                nx1        : rng(),
                ny1        : rng(),
                nx2        : rng(),
                ny2        : rng(),
                color      : palette[Math.floor(rng() * palette.length)],
                strokeWidth: 2 + Math.floor(rng() * 5),
                opacity    : 0.50 + rng() * 0.40
            });
        }

        return { type: 'composition', label: label, shapes: shapes };
    }

    /* Pixel-sampling Kandinsky composition — derives masses from actual image colors */
    function pixelComposition(imgEl, label) {
        var TW = 300, TH = 300;
        var tmp = document.createElement('canvas');
        tmp.width = TW; tmp.height = TH;
        var ctx = tmp.getContext('2d');
        ctx.drawImage(imgEl, 0, 0, TW, TH);
        var data = ctx.getImageData(0, 0, TW, TH).data;

        var COLS = 5, ROWS = 4;          /* 20 zones — fewer, bolder shapes */
        var cw = TW / COLS, ch = TH / ROWS;
        var rng = makeRng(imgEl.src);

        /* Kandinsky dramatic angles */
        var angles = [0, 30, 45, -30, -45, 60, -60, 90, 15, -15, -90];
        function pickAngle() { return angles[Math.floor(rng() * angles.length)]; }

        /* Saturation boost: push sampled colors away from gray */
        function boostColor(r, g, b) {
            var gray  = (r + g + b) / 3;
            var BOOST = 1.55;
            return rgbToHex(
                gray + (r - gray) * BOOST,
                gray + (g - gray) * BOOST,
                gray + (b - gray) * BOOST
            );
        }

        /* Sample all zones */
        var zones = [];
        for (var row = 0; row < ROWS; row++) {
            for (var col = 0; col < COLS; col++) {
                var x0 = Math.floor(col * cw), x1 = Math.floor((col + 1) * cw);
                var y0 = Math.floor(row * ch), y1 = Math.floor((row + 1) * ch);
                var sumR = 0, sumG = 0, sumB = 0, n = 0;
                for (var py = y0; py < y1; py += 4) {
                    for (var px = x0; px < x1; px += 4) {
                        var di = (py * TW + px) * 4;
                        sumR += data[di]; sumG += data[di+1]; sumB += data[di+2];
                        n++;
                    }
                }
                var aR = sumR/n, aG = sumG/n, aB = sumB/n;
                zones.push({
                    col: col, row: row,
                    nx: col / COLS, ny: row / ROWS,
                    nw: 1 / COLS,   nh: 1 / ROWS,
                    color: boostColor(aR, aG, aB),
                    lum  : (aR * 0.299 + aG * 0.587 + aB * 0.114) / 255
                });
            }
        }

        /* Separate zones into luminosity bands */
        var dark  = zones.filter(function(z) { return z.lum <  0.28; });
        var mid   = zones.filter(function(z) { return z.lum >= 0.28 && z.lum < 0.65; });
        var light = zones.filter(function(z) { return z.lum >= 0.65; });

        var shapes = [];

        /* DARK zones → heavy triangles & rectangles (grounded masses) */
        dark.slice(0, 4).forEach(function(z) {
            var kind = rng() > 0.5 ? 'triangle' : 'rect';
            shapes.push({
                kind   : kind,
                nx     : Math.max(0, z.nx - z.nw * 0.15),
                ny     : Math.max(0, z.ny - z.nh * 0.10),
                nw     : z.nw * (1.10 + rng() * 0.70),
                nh     : z.nh * (1.05 + rng() * 0.55),
                color  : z.color,
                angle  : pickAngle(),
                opacity: 0.68 + rng() * 0.24
            });
        });

        /* MID zones → triangles + rectangles at dynamic angles */
        mid.slice(0, 5).forEach(function(z, i) {
            shapes.push({
                kind   : i % 3 === 0 ? 'rect' : 'triangle',
                nx     : z.nx + (rng() - 0.5) * 0.08,
                ny     : z.ny + (rng() - 0.5) * 0.08,
                nw     : z.nw * (0.65 + rng() * 0.65),
                nh     : z.nh * (0.70 + rng() * 0.50),
                color  : z.color,
                angle  : pickAngle(),
                opacity: 0.58 + rng() * 0.30
            });
        });

        /* LIGHT zones → circles (Kandinsky’s spiritual element) */
        light.slice(0, 4).forEach(function(z) {
            var sz = 0.055 + rng() * 0.105;
            shapes.push({
                kind   : 'circle',
                nx     : z.nx + z.nw / 2,
                ny     : z.ny + z.nh / 2,
                nw     : sz, nh: sz,
                color  : z.color,
                angle  : 0,
                opacity: 0.74 + rng() * 0.20
            });
        });

        /* TENSION LINES → connect contrasting zones */
        var lineCount = 2 + Math.floor(rng() * 3);
        for (var li = 0; li < lineCount; li++) {
            var za = zones[Math.floor(rng() * zones.length)];
            var zb = zones[Math.floor(rng() * zones.length)];
            shapes.push({
                kind       : 'line',
                nx1        : za.nx + za.nw / 2,
                ny1        : za.ny + za.nh / 2,
                nx2        : zb.nx + zb.nw / 2,
                ny2        : zb.ny + zb.nh / 2,
                color      : za.color,
                strokeWidth: 2 + Math.floor(rng() * 4),
                opacity    : 0.52 + rng() * 0.36
            });
        }

        return { type: 'composition', label: label, shapes: shapes };
    }

    function extractComposition(imgEl) {
        var label = imgEl.alt || 'Composition';
        try {
            return pixelComposition(imgEl, label);
        } catch (err) {
            /* CORS / security error — fall back to seeded algorithmic layout */
            return algorithmicComposition(imgEl.src, label);
        }
    }

    /* ── Event delegation — gallery grid (img clicks) ────────────── */
    var grid = document.querySelector('.gallery-grid');
    if (grid) {
        grid.addEventListener('click', function (e) {
            var img = e.target;
            if (img.tagName !== 'IMG' || !img.src) return;
            var rect = img.getBoundingClientRect();
            showDock();
            spawnRipple(rect);
            /* Extract composition and pass directly into the closure — no DOM hacks */
            var payload = extractComposition(img);
            launchElement(img, rect, payload);
        });
    }

    /* ── Event delegation — marketplace (card clicks) ────────────── */
    var mktGrid = document.querySelector('.marketplace-grid');
    if (mktGrid) {
        mktGrid.addEventListener('click', function (e) {
            var item = e.target;
            while (item && item !== mktGrid) {
                if (item.classList && item.classList.contains('mkt-item')) break;
                item = item.parentElement;
            }
            if (!item || !item.classList.contains('mkt-item')) return;

            var rect  = item.getBoundingClientRect();
            var svgEl = item.querySelector('svg');
            var payload = {
                type  : svgEl ? 'svg' : 'element',
                label : item.dataset.label || 'Element',
                svg   : svgEl ? (new XMLSerializer()).serializeToString(svgEl) : null
            };
            showDock();
            spawnRipple(rect);
            /* FIX: pass payload directly — no setTimeout/querySelectorAll needed */
            launchElement(item, rect, payload);
        });
    }

    /* ── Event delegation — swatch ribbon ────────────────────────── */
    var swatchTrack = document.getElementById('swatch-track');
    if (swatchTrack) {
        swatchTrack.addEventListener('click', function (e) {
            /* Ignore clicks that were part of a drag-scroll gesture */
            if (swatchTrack._dragged) return;

            var sw = e.target;
            while (sw && sw !== swatchTrack) {
                if (sw.classList && sw.classList.contains('swatch')) break;
                sw = sw.parentElement;
            }
            if (!sw || !sw.classList.contains('swatch')) return;

            var rect  = sw.getBoundingClientRect();
            var color = sw.dataset.color || '#888';
            var name  = sw.dataset.name  || 'Pigment';

            /* For swatches, clone is a solid colour block — cleaner in flight */
            if (activeClones >= CFG.maxClones) return;
            activeClones++;

            var clone = document.createElement('div');
            clone.style.cssText = [
                'position:fixed',
                'top:'    + rect.top    + 'px',
                'left:'   + rect.left   + 'px',
                'width:'  + rect.width  + 'px',
                'height:' + rect.height + 'px',
                'background:' + sw.style.background,
                'border-radius:12px',
                'pointer-events:none',
                'z-index:9998',
                'will-change:transform,opacity',
                'transform-origin:center center',
                'box-shadow:0 8px 32px rgba(0,0,0,0.55)',
                'border:1px solid rgba(255,255,255,0.1)'
            ].join(';');
            document.body.appendChild(clone);

            showDock();
            spawnRipple(rect);

            var startCX = rect.left + rect.width  / 2;
            var startCY = rect.top  + rect.height / 2;
            var endCX   = window.innerWidth  * CFG.landX;
            var endCY   = window.innerHeight * CFG.landY;
            var dx      = endCX - startCX;
            var dy      = endCY - startCY;
            var midDX   = dx * 0.4 + (Math.random() - 0.5) * 50;
            var midDY   = dy * 0.5 - 50;

            clone.animate([
                { transform: 'translate(0,0) scale(1)',
                  opacity: 1,    offset: 0   },
                { transform: 'translate(' + midDX + 'px,' + midDY + 'px) scale(0.55)',
                  opacity: 0.9,  offset: 0.4 },
                { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + CFG.landScale + ')',
                  opacity: 0,    offset: 1   }
            ], {
                duration: CFG.duration,
                easing:   CFG.easing,
                fill:     'forwards'
            }).onfinish = function () {
                clone.remove();
                activeClones--;
                hideDock();

                /* Dock landing pulse — briefly show pigment colour */
                dock.style.background = color;
                dock.animate([
                    { transform: 'translateX(-50%) scale(1.5)', opacity: 1 },
                    { transform: 'translateX(-50%) scale(1)',   opacity: 0 }
                ], { duration: 420, easing: 'ease-out' }).onfinish = function () {
                    dock.style.background = 'rgba(255,255,255,0.08)';
                };

                /* Deposit colour to canvas workshop */
                if (typeof window.wsDeposit === 'function') {
                    window.wsDeposit({ type: 'color', color: color, name: name });
                }
            };
        });
    }


        
}());


(function () {
    'use strict';
    var track = document.getElementById('swatch-track');
    if (!track) return;

    var isDown = false;
    var startX, scrollLeft;
    var DRAG_THRESHOLD = 5; /* px — moves smaller than this count as clicks */

    track.addEventListener('mousedown', function (e) {
        isDown = true;
        track._dragged = false;
        startX     = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', function () {
        isDown = false;
        track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var x    = e.pageX - track.offsetLeft;
        var walk = x - startX;
        if (Math.abs(walk) > DRAG_THRESHOLD) track._dragged = true;
        track.scrollLeft = scrollLeft - walk;
    });

    /* Touch support */
    var touchStartX = 0, touchScrollLeft = 0;
    track.addEventListener('touchstart', function (e) {
        touchStartX    = e.touches[0].pageX;
        touchScrollLeft = track.scrollLeft;
        track._dragged = false;
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
        var diff = touchStartX - e.touches[0].pageX;
        if (Math.abs(diff) > DRAG_THRESHOLD) track._dragged = true;
        track.scrollLeft = touchScrollLeft + diff;
    }, { passive: true });

        
}());


(function () {
    'use strict';

    /* ── Wait for DOM + Fabric to be ready ─────────────────────── */
    function init() {
        if (typeof fabric === 'undefined') {
            setTimeout(init, 80);
            return;
        }

        var wrap   = document.getElementById('workshop-canvas-wrap');
        var hint   = document.getElementById('workshop-hint');
        var status = document.getElementById('ws-status');
        var count  = document.getElementById('ws-object-count');
        if (!wrap) return;

        /* ── Responsive canvas sizing ─────────────────────────── */
        var CANVAS_H = Math.max(520, Math.round(window.innerHeight * 0.72));
        var CANVAS_W = wrap.clientWidth || Math.max(800, window.innerWidth - 80);

        var fc = new fabric.Canvas('workshop-canvas', {
            width               : CANVAS_W,
            height              : CANVAS_H,
            backgroundColor     : '#0c0c0c',
            preserveObjectStacking: true,
            selection           : true,
            selectionColor      : 'rgba(200,185,150,0.1)',
            selectionBorderColor: 'rgba(240,232,216,0.5)',
            selectionLineWidth  : 1
        });

        window.fabricCanvas = fc;   /* expose for external access */

        /* Fabric control styling */
        fabric.Object.prototype.set({
            cornerColor      : 'rgba(240,232,216,0.9)',
            cornerStrokeColor: 'rgba(0,0,0,0.4)',
            borderColor      : 'rgba(240,232,216,0.55)',
            cornerSize       : 10,
            transparentCorners: false,
            borderScaleFactor: 1.5
        });

        /* ── Status helpers ───────────────────────────────────── */
        function setStatus(msg) {
            if (status) status.textContent = msg;
        }

        function refreshCount() {
            var n = fc.getObjects().length;
            if (count) count.textContent = n + (n === 1 ? ' object' : ' objects');
            if (hint) {
                if (n === 0) hint.classList.remove('hidden');
                else         hint.classList.add('hidden');
            }
        }

        function flashStatus(msg) {
            setStatus(msg);
            setTimeout(function () {
                var sel = fc.getActiveObject();
                setStatus(sel ? 'Selected: ' + (sel._wsLabel || sel.type) : 'Canvas ready');
            }, 2200);
        }

        /* ── Scatter helper — land near centre with slight variance */
        function scatter() {
            return {
                left: fc.getWidth()  * 0.35 + Math.random() * fc.getWidth()  * 0.3,
                top : fc.getHeight() * 0.25 + Math.random() * fc.getHeight() * 0.45
            };
        }

        /* ── wsDeposit — receives payloads from fly-down ─────── */
        window.wsDeposit = function (payload) {
            if (!payload) return;

            /* Scroll canvas into view */
            var ws = document.getElementById('canvas-workshop');
            if (ws) ws.scrollIntoView({ behavior: 'smooth', block: 'center' });

            var pos = scatter();

            if (payload.type === 'image') {
                /* Gallery photo — kept for completeness; gallery now uses composition type */
                if (!payload.src) { console.error('[WS] image payload has no src'); return; }
                fabric.Image.fromURL(payload.src, function (img, isError) {
                    if (isError || !img || !img.width) {
                        console.error('[WS] fromURL failed for image:', payload.src, '(isError=' + isError + ')');
                        return;
                    }
                    var maxW = fc.getWidth()  * 0.38;
                    var maxH = fc.getHeight() * 0.48;
                    var scale = Math.min(maxW / img.width, maxH / img.height, 1);
                    img.set({
                        left   : pos.left,
                        top    : pos.top,
                        scaleX : scale,
                        scaleY : scale,
                        originX: 'center',
                        originY: 'center'
                    });
                    img._wsLabel = payload.alt || 'Gallery Image';
                    fc.add(img);
                    fc.setActiveObject(img);
                    fc.renderAll();
                    refreshCount();
                    flashStatus('\u2713 Added: ' + img._wsLabel);
                }, { crossOrigin: 'anonymous' });

            } else if (payload.type === 'svg') {
                /* FIX: Use fabric.loadSVGFromString — far more reliable than Blob+fromURL */
                var svgStr = payload.svg || '';
                if (!svgStr) {
                    console.error('[WS] SVG payload is empty for:', payload.label);
                    return;
                }
                /* Substitute currentColor with visible warm-cream so shapes render */
                svgStr = svgStr.replace(/currentColor/g, '#d4c5a5');

                try {
                    fabric.loadSVGFromString(svgStr, function (svgObjects, svgOptions) {
                        if (!svgObjects || !svgObjects.length) {
                            console.error('[WS] loadSVGFromString returned no objects for:', payload.label, '\nSVG snippet:', svgStr.substring(0, 300));
                            return;
                        }
                        var svgGroup = fabric.util.groupSVGElements(svgObjects, svgOptions);
                        var sz = Math.min(fc.getWidth() * 0.26, 240);
                        var sc = sz / Math.max(svgGroup.width || 1, svgGroup.height || 1);
                        svgGroup.set({
                            left   : pos.left,
                            top    : pos.top,
                            scaleX : sc,
                            scaleY : sc,
                            originX: 'center',
                            originY: 'center'
                        });
                        svgGroup._wsLabel = payload.label || 'Element';
                        fc.add(svgGroup);
                        fc.setActiveObject(svgGroup);
                        fc.renderAll();
                        refreshCount();
                        flashStatus('\u2713 Added: ' + svgGroup._wsLabel);
                    });
                } catch (svgErr) {
                    console.error('[WS] loadSVGFromString threw:', svgErr, '\nPayload label:', payload.label);
                }

            } else if (payload.type === 'color') {
                /* Pigment swatch — lands as a rectangular colour block */
                var col = payload.color || '#888';
                var nm  = payload.name  || 'Pigment';
                var rect = new fabric.Rect({
                    left   : pos.left,
                    top    : pos.top,
                    width  : 120,
                    height : 180,
                    fill   : col,
                    rx     : 10,
                    ry     : 10,
                    originX: 'center',
                    originY: 'center',
                    shadow : new fabric.Shadow({
                        color  : 'rgba(0,0,0,0.55)',
                        blur   : 24,
                        offsetX: 0,
                        offsetY: 8
                    })
                });
                /* Label text beneath the swatch */
                var lbl = new fabric.Text(nm, {
                    left       : pos.left,
                    top        : pos.top + 102,
                    originX    : 'center',
                    originY    : 'center',
                    fontFamily : 'Playfair Display, serif',
                    fontStyle  : 'italic',
                    fontSize   : 12,
                    fill       : 'rgba(240,232,216,0.7)',
                    selectable : false
                });
                /* Group rect + label */
                var grp = new fabric.Group([rect, lbl], {
                    left   : pos.left,
                    top    : pos.top,
                    originX: 'center',
                    originY: 'center'
                });
                grp._wsLabel = nm;
                fc.add(grp);
                fc.setActiveObject(grp);
                fc.renderAll();
                refreshCount();
                flashStatus('\u2713 Added pigment: ' + nm);
            } else if (payload.type === 'composition') {
                /* -- Composition Extraction: each shape is INDIVIDUAL on the canvas -- */
                if (!payload.shapes || !payload.shapes.length) {
                    console.error('[WS] composition payload has no shapes:', payload);
                    return;
                }
                try {
                    var cW       = fc.getWidth();
                    var cH       = fc.getHeight();
                    var margin   = 50;
                    var zW       = cW - margin * 2;
                    var zH       = cH - margin * 2;
                    var oX       = margin;
                    var oY       = margin;
                    var lbl      = payload.label || 'Composition';
                    var STAGGER  = 22;
                    var LAND_DUR = 420;
                    var landEase = fabric.util.ease.easeOutQuart;
                    var landingQueue = [];

                    payload.shapes.forEach(function (s, idx) {
                        var sx = oX + s.nx * zW;
                        var sy = oY + s.ny * zH;
                        var sw = Math.max(8, s.nw * zW);
                        var sh = Math.max(8, s.nh * zH);
                        var initProps = {
                            left        : sx,
                            top         : sy + 48,
                            fill        : s.color   || '#888',
                            opacity     : 0,
                            angle       : s.angle   || 0,
                            selectable  : true,
                            evented     : true,
                            hasControls : true,
                            hasBorders  : true
                        };
                        var shape;
                        try {
                            if (s.kind === 'circle') {
                                shape = new fabric.Circle(Object.assign({}, initProps, {
                                    radius: Math.min(sw, sh) / 2
                                }));

                            } else if (s.kind === 'triangle') {
                                /* fabric.Triangle — Kandinsky’s tension element */
                                shape = new fabric.Triangle(Object.assign({}, initProps, {
                                    width : sw,
                                    height: sh
                                }));

                            } else if (s.kind === 'line') {
                                /* Tension line — uses absolute canvas coords from nx1/ny1/nx2/ny2 */
                                var lx1 = oX + (s.nx1 || 0) * zW;
                                var ly1 = oY + (s.ny1 || 0) * zH;
                                var lx2 = oX + (s.nx2 || 1) * zW;
                                var ly2 = oY + (s.ny2 || 1) * zH;
                                shape = new fabric.Line([lx1, ly1, lx2, ly2], {
                                    stroke      : s.color  || '#d4c5a5',
                                    strokeWidth : s.strokeWidth || 3,
                                    strokeLineCap: 'round',
                                    opacity     : 0,
                                    fill        : null,
                                    selectable  : true,
                                    evented     : true,
                                    hasControls : true,
                                    hasBorders  : true,
                                    padding     : 6   /* easier to click thin lines */
                                });

                            } else if (s.kind === 'polygon') {
                                var jx = sw * 0.12, jy = sh * 0.12;
                                var pts = [
                                    { x: jx,           y: jy           },
                                    { x: sw - jx / 2,  y: jy / 2      },
                                    { x: sw - jx,      y: sh - jy      },
                                    { x: jx / 2,       y: sh - jy / 2  }
                                ];
                                shape = new fabric.Polygon(pts, Object.assign({}, initProps));

                            } else {
                                shape = new fabric.Rect(Object.assign({}, initProps, {
                                    width: sw, height: sh, rx: 2, ry: 2
                                }));
                            }
                        } catch (shapeErr) {
                            console.error('[WS] shape #' + idx + ' (' + s.kind + ') failed:', shapeErr);
                            shape = new fabric.Rect(Object.assign({}, initProps, { width: sw, height: sh }));
                        }
                        shape._wsLabel = lbl + ' · ' + (s.kind || 'shape') + ' ' + (idx + 1);
                        fc.add(shape);   /* individual add — NEVER a group */
                        /* Lines animate opacity-only; solids slide up + fade */
                        landingQueue.push({
                            shape         : shape,
                            targetTop     : sy,
                            targetOpacity : s.opacity || 0.72,
                            isLine        : (s.kind === 'line')
                        });
                    });

                    refreshCount();

                    /* Staggered cascade land-in animation */
                    var landCompleted = 0;
                    var landTotal     = landingQueue.length;
                    landingQueue.forEach(function (item, idx) {
                        setTimeout(function () {
                            /* Lines fade-in only; other shapes slide up AND fade in */
                            var animTarget = item.isLine
                                ? { opacity: item.targetOpacity }
                                : { top: item.targetTop, opacity: item.targetOpacity };

                            item.shape.animate(
                                animTarget,
                                {
                                    duration  : LAND_DUR,
                                    easing    : landEase,
                                    onChange  : function () { fc.renderAll(); },
                                    onComplete: function () {
                                        item.shape.setCoords();
                                        landCompleted++;
                                        if (landCompleted === landTotal) {
                                            var allNew = landingQueue.map(function (x) { return x.shape; });
                                            var sel = new fabric.ActiveSelection(allNew, { canvas: fc });
                                            fc.setActiveObject(sel);
                                            fc.renderAll();
                                            flashStatus(
                                                '\u2713 ' + landTotal + ' Kandinsky shapes landed' +
                                                ' \u2014 click any shape to select it individually'
                                            );
                                        }
                                    }
                                }
                            );
                        }, idx * STAGGER);
                    });

                } catch (compErr) {
                    console.error('[WS] composition creation failed:', compErr, 'Payload:', payload);
                }
            }
        };

        /* ── Canvas event hooks ───────────────────────────────── */
        fc.on('selection:created', function (e) {
            var obj = e.selected && e.selected[0];
            if (obj) setStatus('Selected: ' + (obj._wsLabel || obj.type));
            syncOpacity();
        });
        fc.on('selection:updated', function (e) {
            var obj = e.selected && e.selected[0];
            if (obj) setStatus('Selected: ' + (obj._wsLabel || obj.type));
            syncOpacity();
        });
        fc.on('selection:cleared', function () {
            setStatus('Canvas ready');
            if (opacityInput) opacityInput.value = 100;
            if (opacityVal)   opacityVal.textContent = '100%';
        });
        fc.on('object:added',   refreshCount);
        fc.on('object:removed', refreshCount);

        /* ── Toolbar buttons ──────────────────────────────────── */
        function btn(id, fn) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('click', fn);
        }

        btn('ws-bring-front', function () {
            var o = fc.getActiveObject();
            if (!o) return;
            fc.bringToFront(o);
            fc.renderAll();
            flashStatus('Brought to front');
        });

        btn('ws-send-back', function () {
            var o = fc.getActiveObject();
            if (!o) return;
            fc.sendToBack(o);
            fc.renderAll();
            flashStatus('Sent to back');
        });

        /* ── Ungroup — decompose composition into free shapes ─────── */
        function ungroupActive() {
            var o = fc.getActiveObject();
            if (!o || o.type !== 'group') {
                flashStatus('Select a grouped composition first');
                return;
            }
            var lbl   = o._wsLabel || 'Composition';
            var items = o.getObjects();
            var grpMx = o.calcTransformMatrix()   /* world-space matrix of the group */;

            /* Remove the group before re-adding children */
            fc.remove(o);

            items.forEach(function (child) {
                /* Calculate the child's absolute world-space transform */
                var childMx = fabric.util.multiplyTransformMatrices(
                    grpMx,
                    child.calcOwnMatrix()
                );
                var decomp = fabric.util.qrDecompose(childMx);

                child.set({
                    left        : decomp.translateX,
                    top         : decomp.translateY,
                    scaleX      : decomp.scaleX,
                    scaleY      : decomp.scaleY,
                    angle       : decomp.angle,
                    skewX       : decomp.skewX,
                    skewY       : decomp.skewY,
                    originX     : 'left',
                    originY     : 'top',
                    flipX       : false,
                    flipY       : false
                });
                child.setCoords();
                child._wsLabel = lbl + ' fragment';
                fc.add(child);
            });

            /* Select all released fragments so user can immediately work with them */
            var sel = new fabric.ActiveSelection(fc.getObjects().slice(-items.length), { canvas: fc });
            fc.setActiveObject(sel);
            fc.renderAll();
            refreshCount();
            flashStatus('\u2713 Ungrouped “' + lbl + '\u201d into ' + items.length + ' shapes — click any to select individually');
        }

        btn('ws-ungroup', ungroupActive);

        btn('ws-duplicate', function () {
            var o = fc.getActiveObject();
            if (!o) return;
            o.clone(function (cl) {
                cl.set({ left: o.left + 22, top: o.top + 22 });
                cl._wsLabel = (o._wsLabel || 'Object') + ' (copy)';
                fc.add(cl);
                fc.setActiveObject(cl);
                fc.renderAll();
                flashStatus('Duplicated');
            });
        });

        btn('ws-delete', function () {
            var o = fc.getActiveObject();
            if (!o) return;
            var lbl = o._wsLabel || o.type;
            fc.remove(o);
            fc.discardActiveObject();
            fc.renderAll();
            flashStatus('Deleted: ' + lbl);
        });

        btn('ws-clear', function () {
            if (!fc.getObjects().length) return;
            if (!confirm('Clear the canvas? This cannot be undone.')) return;
            fc.clear();
            fc.backgroundColor = document.getElementById('ws-bg-color').value || '#0c0c0c';
            fc.renderAll();
            setStatus('Canvas cleared');
            refreshCount();
        });

        btn('ws-download', function () {
            /* Temporarily deselect to avoid selection UI in export */
            fc.discardActiveObject();
            fc.renderAll();
            var dataURL = fc.toDataURL({ format: 'png', multiplier: 2 });
            var a = document.createElement('a');
            var d = new Date();
            var stamp = d.getFullYear() + '-' +
                        String(d.getMonth()+1).padStart(2,'0') + '-' +
                        String(d.getDate()).padStart(2,'0');
            a.download = 'canvas-workshop-' + stamp + '.png';
            a.href = dataURL;
            a.click();
            flashStatus('\u2713 Downloaded as PNG');
        });

        /* ── Auto Compose ───────────────────────────────────────── */
        btn('ws-auto-compose', function () {
            var objects = fc.getObjects();
            if (!objects.length) {
                flashStatus('Add objects to the canvas first');
                return;
            }

            /* Deselect everything so individual transforms aren’t constrained */
            fc.discardActiveObject();
            fc.renderAll();

            var cW        = fc.getWidth();
            var cH        = fc.getHeight();
            var INNER_PAD = 60;        /* keep objects inside this margin */
            var DURATION  = 800;       /* base animation ms */
            var STAGGER   = 140;       /* max per-object delay ms */
            var completed = 0;
            var total     = objects.length;
            var ease      = fabric.util.ease.easeOutQuart;

            /* Visual feedback — pulse the button */
            var acBtn = document.getElementById('ws-auto-compose');
            if (acBtn) { acBtn.classList.add('ws-btn--composing'); }

            setStatus('Auto-composing…');

            objects.forEach(function (obj, i) {
                /* Object’s unscaled dimensions */
                var ow = (obj.width  || 100) * (obj.scaleX || 1);
                var oh = (obj.height || 100) * (obj.scaleY || 1);
                /* Compute safe bounding area accounting for diagonal at any rotation */
                var diag = Math.ceil(Math.sqrt(ow * ow + oh * oh) / 2) + INNER_PAD;

                var safeLeft = diag;
                var safeTop  = diag;
                var safeW    = Math.max(1, cW - diag * 2);
                var safeH    = Math.max(1, cH - diag * 2);

                /* Randomised target state */
                var newLeft  = safeLeft  + Math.random() * safeW;
                var newTop   = safeTop   + Math.random() * safeH;
                var newAngle = Math.round(Math.random() * 360);

                /* Scale variation: 75% – 135% of current scale (clamped) */
                var sf       = 0.75 + Math.random() * 0.60;
                var newSX    = Math.max(0.08, Math.min(8, (obj.scaleX || 1) * sf));
                var newSY    = Math.max(0.08, Math.min(8, (obj.scaleY || 1) * sf));

                /* Stagger so objects cascade into motion */
                var delay = Math.floor(Math.random() * STAGGER);

                setTimeout(function () {
                    var dur = DURATION + Math.round(Math.random() * 200);

                    obj.animate(
                        { left: newLeft, top: newTop, angle: newAngle, scaleX: newSX, scaleY: newSY },
                        {
                            duration  : dur,
                            easing    : ease,
                            onChange  : function () { fc.renderAll(); },
                            onComplete: function () {
                                obj.setCoords();
                                completed++;
                                if (completed === total) {
                                    fc.renderAll();
                                    if (acBtn) { acBtn.classList.remove('ws-btn--composing'); }
                                    flashStatus('\u2736 New composition generated — click again for another');
                                }
                            }
                        }
                    );
                }, delay);
            });
        });

        /* ── Background colour picker ─────────────────────────── */
        var bgInput = document.getElementById('ws-bg-color');
        if (bgInput) {
            bgInput.addEventListener('input', function () {
                fc.backgroundColor = bgInput.value;
                fc.renderAll();
            });
        }

        /* ── Opacity slider ───────────────────────────────────── */
        var opacityInput = document.getElementById('ws-opacity');
        var opacityVal   = document.getElementById('ws-opacity-val');

        function syncOpacity() {
            var o = fc.getActiveObject();
            if (!o || !opacityInput) return;
            var v = Math.round((o.opacity || 1) * 100);
            opacityInput.value = v;
            if (opacityVal) opacityVal.textContent = v + '%';
        }

        if (opacityInput) {
            opacityInput.addEventListener('input', function () {
                var o = fc.getActiveObject();
                if (!o) return;
                var v = parseInt(opacityInput.value, 10) / 100;
                o.set('opacity', v);
                fc.renderAll();
                if (opacityVal) opacityVal.textContent = opacityInput.value + '%';
            });
        }

        /* ── Keyboard shortcuts ───────────────────────────────── */
        document.addEventListener('keydown', function (e) {
            /* Only act when focus is not in an input */
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            var o = fc.getActiveObject();
            if (!o) return;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                fc.remove(o);
                fc.renderAll();
                flashStatus('Deleted');
            }
            if (e.key === ']') { fc.bringToFront(o); fc.renderAll(); }
            if (e.key === '[') { fc.sendToBack(o);   fc.renderAll(); }
            if (e.key === 'u' || e.key === 'U') { ungroupActive(); }
        });

        /* ── Double-click a group to instantly ungroup ────────────── */
        fc.on('mouse:dblclick', function (opt) {
            var o = fc.findTarget(opt.e);
            if (o && o.type === 'group') { ungroupActive(); }
        });

        /* ── Highlight Ungroup button when a group is selected ─────── */
        var ungroupBtn = document.getElementById('ws-ungroup');
        function updateUngroupBtn() {
            if (!ungroupBtn) return;
            var o = fc.getActiveObject();
            var isGrp = o && o.type === 'group';
            ungroupBtn.style.opacity      = isGrp ? '1'    : '0.4';
            ungroupBtn.style.borderColor  = isGrp ? 'rgba(201,162,39,0.55)' : '';
            ungroupBtn.style.color        = isGrp ? '#c9a227' : '';
            ungroupBtn.title              = isGrp
                ? 'Ungroup \u201c' + (o._wsLabel || 'Group') + '\u201d into individual shapes'
                : 'Select a grouped composition first';
        }
        fc.on('selection:created', updateUngroupBtn);
        fc.on('selection:updated', updateUngroupBtn);
        fc.on('selection:cleared', updateUngroupBtn);
        updateUngroupBtn();   /* initial state */

        /* ── Responsive resize ────────────────────────────────── */
        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                var w = wrap.clientWidth;
                if (!w || Math.abs(w - fc.getWidth()) < 4) return;
                fc.setWidth(w);
                fc.renderAll();
            }, 220);
        });

        /* Initial state */
        refreshCount();
        setStatus('Canvas ready \u2014 fly elements from above to begin composing');
    }

    /* Kick off after page load */
    if (document.readyState === 'complete') { init(); }
    else { window.addEventListener('load', init); }


        
    }());


