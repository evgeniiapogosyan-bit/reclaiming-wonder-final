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
/**
 * Cinematic Roll - Deconstruct Frame to Fabric.js Canvas Workflow
 */
            shape._wsLabel = 'Film Shape (' + color + ')';
            canvas.add(shape);
            canvas.setActiveObject(shape);
        }

        canvas.renderAll();
    } else {
        console.warn('window.fabricCanvas not found yet');
    }

    // 5. Auto-Scroll IMMEDIATELY to Canvas Workshop container
    var wsContainer = document.querySelector('#canvas-workshop') || document.getElementById('canvas-workshop');
    if (wsContainer) {
        wsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 6. Visual Toast Notification
    showExtractToast('✨ Colors & shapes extracted to canvas!');
}

function showExtractToast(message) {
    var toast = document.getElementById('extract-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'extract-toast';
        toast.style.cssText = [
            'position:fixed',
            'top:24px',
            'left:50%',
            'transform:translateX(-50%) translateY(-20px)',
            'background:rgba(18, 18, 22, 0.95)',
            'border:1px solid rgba(201, 162, 39, 0.6)',
            'box-shadow:0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(201, 162, 39, 0.25)',
            'border-radius:999px',
            'padding:12px 28px',
            'color:#f0e8d8',
            'font-family:sans-serif',
            'font-size:0.85rem',
            'font-weight:600',
            'letter-spacing:0.04em',
            'pointer-events:none',
            'z-index:99999',
            'opacity:0',
            'transition:all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
        ].join(';');
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    requestAnimationFrame(function() {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
    }, 2800);
}

function initFilmStrip() {
    var frames = document.querySelectorAll('.film-frame');
    frames.forEach(function (frame) {
        frame.addEventListener('click', function (e) {
            e.stopPropagation();
            extractFrameToCanvas(frame);
        });
    });

    var filmStrip = document.getElementById('film-strip');
    if (filmStrip) {
        filmStrip.addEventListener('click', function (e) {
            var frame = e.target.closest('.film-frame');
            if (frame) {
                extractFrameToCanvas(frame);
            }
        });
    }
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





