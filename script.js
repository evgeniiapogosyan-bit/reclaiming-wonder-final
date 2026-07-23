// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize animations only after ALL assets (images, stylesheets, fonts) are fully loaded.
// This ensures that ScrollTrigger's offset calculations are 100% accurate.
window.addEventListener("load", () => {
    initHeroEntrance();
    initHeroScroll();
    initFilters();
    initFilmStrip();
    initIntersectionObserver();
    initScrollBackground();
});

/**
 * Handles the initial load animations for the hero section:
 * Scrambles text and staggers the fade-ins.
 */
function initHeroEntrance() {
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const indicator = document.querySelector('.scroll-indicator');

    if (!title) return;

    const finalTitleText = title.textContent;
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let scrambleStartTime = null;

    // Apply inline CSS transitions
    title.style.transition = 'opacity 1.5s ease';
    if (subtitle) subtitle.style.transition = 'opacity 1s ease 1s'; // 1s delay
    if (indicator) indicator.style.transition = 'opacity 1s ease 1s'; // 1s delay

    // Trigger reflow to ensure transitions apply
    void title.offsetWidth;

    // Set target opacity
    title.style.opacity = '1';
    if (subtitle) subtitle.style.opacity = '1';
    if (indicator) indicator.style.opacity = '1';

    // Scramble function
    function scramble(timestamp) {
        if (!scrambleStartTime) scrambleStartTime = timestamp;
        const progress = timestamp - scrambleStartTime;
        
        if (progress < 800) { // Scramble for 0.8 seconds
            let currentText = "";
            for (let i = 0; i < finalTitleText.length; i++) {
                if (finalTitleText[i] === " ") {
                    currentText += " ";
                } else {
                    currentText += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            title.textContent = currentText;
            requestAnimationFrame(scramble);
        } else {
            // Settle on final text
            title.textContent = finalTitleText;
        }
    }

    // Start text scramble
    requestAnimationFrame(scramble);

    // Cleanup transitions so they don't interfere with GSAP scroll parallax later
    setTimeout(() => {
        title.style.transition = '';
        if (subtitle) subtitle.style.transition = '';
        if (indicator) indicator.style.transition = '';
    }, 2100); // 1s delay + 1s duration + buffer
}

/**
 * Initializes the parallax scroll effects on the Hero screen.
 * The title, subtitle, and indicator fade out and move upwards at different speeds (staggered parallax).
 */
function initHeroScroll() {
    // Parallax fade-out for the hero title
    gsap.to(".hero-title", {
        y: -140,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom 30%",
            scrub: true,
            invalidateOnRefresh: true
        }
    });

    // Parallax fade-out for the subtitle and the scroll indicator line
    gsap.to([".hero-subtitle", ".scroll-indicator"], {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom 50%",
            scrub: true,
            invalidateOnRefresh: true
        }
    });
}

/**
 * Filters gallery items by category using display: none / block.
 * The grid CSS is never touched — items simply drop out of the flow.
 */
function filterGallery(category) {
    const items = document.querySelectorAll('.grid-item');
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Attaches click listeners to all .filter-btn elements.
 */
function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Run filter
            filterGallery(btn.dataset.filter);
        });
    });
}

/**
 * Initializes the film strip slider and modal functionality.
 */
function initFilmStrip() {
    const filmStrip = document.getElementById('film-strip');
    const frames = document.querySelectorAll('.film-frame');

    if (!filmStrip && !frames.length) return;

    const paletteMap = {
        '1': ['#1b2a4a', '#c98a20', '#9e1b32'],
        '2': ['#1a6648', '#00b4d8', '#f0e8d8'],
        '3': ['#a84c1c', '#e89060', '#3b2e8c'],
        '4': ['#9e1b32', '#00a896', '#c98a20'],
        '5': ['#3b2e8c', '#2aaa80', '#ffe080'],
        '6': ['#c46028', '#00b4d8', '#2a2834']
    };

    function handleFrameClick(e, frameEl) {
        // Step 2: Log verification
        console.log('Film frame clicked!');

        // Step 6: Brief CSS opacity flash (0.5 to 1 over 0.2s)
        const targetFrame = frameEl || e.currentTarget || e.target.closest('.film-frame');
        if (targetFrame) {
            targetFrame.style.transition = 'opacity 0.1s ease';
            targetFrame.style.opacity = '0.5';
            setTimeout(() => {
                targetFrame.style.transition = 'opacity 0.2s ease';
                targetFrame.style.opacity = '1';
            }, 100);
        }

        const frameId = targetFrame ? (targetFrame.getAttribute('data-frame-id') || '1') : '1';
        const frameNum = targetFrame ? (targetFrame.getAttribute('data-frame-num') || ('EXP 0' + frameId)) : 'EXP 01';
        
        // Step 3: 3-color palette representative of clicked image
        const colors = paletteMap[frameId] || ['#1b2a4a', '#c98a20', '#9e1b32'];

        // Step 4 & 5: Fabric.js Canvas Shape Generation & renderAll()
        const canvas = window.fabricCanvas || (typeof fabricCanvas !== 'undefined' ? fabricCanvas : null);

        if (canvas && typeof fabric !== 'undefined') {
            const cW = canvas.getWidth() || 800;
            const cH = canvas.getHeight() || 500;
            const centerX = cW / 2;
            const centerY = cH / 2;

            const numShapes = 2 + Math.floor(Math.random() * 2); // 2 or 3 shapes
            const shapeTypes = ['Circle', 'Rect', 'Triangle'];

            for (let i = 0; i < numShapes; i++) {
                const color = colors[i % colors.length];
                const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                const size = 70 + Math.random() * 70;
                
                const posX = centerX + (Math.random() - 0.5) * (cW * 0.35);
                const posY = centerY + (Math.random() - 0.5) * (cH * 0.35);
                const angle = Math.floor(Math.random() * 50) - 25;

                let shape;
                if (type === 'Circle') {
                    shape = new fabric.Circle({
                        radius: size / 2,
                        fill: color,
                        left: posX,
                        top: posY,
                        originX: 'center',
                        originY: 'center',
                        opacity: 0.85,
                        angle: angle
                    });
                } else if (type === 'Rect') {
                    shape = new fabric.Rect({
                        width: size,
                        height: size * (0.6 + Math.random() * 0.8),
                        fill: color,
                        rx: 6,
                        ry: 6,
                        left: posX,
                        top: posY,
                        originX: 'center',
                        originY: 'center',
                        opacity: 0.85,
                        angle: angle
                    });
                } else {
                    shape = new fabric.Triangle({
                        width: size,
                        height: size,
                        fill: color,
                        left: posX,
                        top: posY,
                        originX: 'center',
                        originY: 'center',
                        opacity: 0.85,
                        angle: angle
                    });
                }

                shape._wsLabel = 'Film Frame Shape (' + color + ')';
                canvas.add(shape);
                canvas.setActiveObject(shape);
            }

            canvas.renderAll();

            // Smooth scroll to canvas workshop
            const ws = document.getElementById('canvas-workshop');
            if (ws) ws.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            console.warn('Fabric.js canvas instance not found on window.fabricCanvas');
        }

        showFilmNotification('Inspiration extracted from Frame #' + frameId + ' (' + frameNum + ') to Canvas!');
    }

    frames.forEach(frame => {
        frame.addEventListener('click', (e) => handleFrameClick(e, frame));
    });
}

function showFilmNotification(msg) {
    let notif = document.getElementById('film-notif');
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
            'font-family:sans-serif',
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
    requestAnimationFrame(() => {
        notif.style.opacity = '1';
        notif.style.transform = 'translateX(-50%) translateY(0)';
    });

    clearTimeout(notif._timer);
    notif._timer = setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2800);
}

/**
 * Initializes the intersection observer for scroll-triggered reveal animations.
 */
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before fully in view
        threshold: 0.1
    };

    let delayCounter = 0;
    let resetTimeout;

    const observer = new IntersectionObserver((entries, obs) => {
        const intersecting = entries.filter(entry => entry.isIntersecting);
        
        intersecting.forEach(entry => {
            // Apply stagger delay using animationDelay
            entry.target.style.animationDelay = `${delayCounter * 0.2}s`;
            
            // Add revealed class to trigger CSS animation
            entry.target.classList.add('is-revealed');
            
            // Stop observing once revealed
            obs.unobserve(entry.target);
            
            delayCounter++;
        });

        // Reset the stagger counter after a batch finishes processing
        clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
            delayCounter = 0;
        }, 100);
    }, observerOptions);

    // Target elements to animate in sections below the hero
    const elementsToReveal = document.querySelectorAll('#gallery .hanging-item, #leaf-section .floating-leaf, #pinterest-gallery .grid-item, #film-slider .film-frame, .poetry-section .poetry-content');
    
    elementsToReveal.forEach(el => {
        el.classList.add('reveal-item');
        observer.observe(el);
    });
}

/**
 * Initializes the dynamic scroll-based background color transition.
 * Updates the --color-bg CSS variable based on scroll progress.
 */
function initScrollBackground() {
    window.addEventListener('scroll', () => {
        // Calculate scroll progress (0 to 1) dynamically
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Prevent division by zero on very short pages
        if (docHeight <= 0) return;
        
        const scrollProgress = Math.max(0, Math.min(1, scrollTop / docHeight));

        // Interpolate colors: e.g., Black (#000000) to Dark Slate (#111118)
        // Adjust these RGB values to change the start/end colors
        const startRGB = { r: 0, g: 0, b: 0 };
        const endRGB = { r: 17, g: 17, b: 24 };

        const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * scrollProgress);
        const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * scrollProgress);
        const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * scrollProgress);
        
        const newColor = `rgb(${r}, ${g}, ${b})`;

        // Update the CSS variable on the root element.
        // Because we set all sections to use var(--color-bg) in CSS,
        // this single update smoothly transitions the entire page background.
        document.documentElement.style.setProperty('--color-bg', newColor);
    });
}

