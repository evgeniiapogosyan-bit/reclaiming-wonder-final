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
    const rotateBtn = document.getElementById('rotate-film-btn');
    const filmStrip = document.getElementById('film-strip');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close-modal');

    if (!rotateBtn || !filmStrip || !modal) return;

    // --- Rotate Logic ---
    // Moves the first frame to the end of the strip to create a looping effect
    rotateBtn.addEventListener('click', () => {
        // Move by the width of one frame + gap (300px + 15px = 315px)
        filmStrip.style.transform = 'translateX(-315px)';
        
        // Wait for the transition to finish, then move the element in the DOM
        setTimeout(() => {
            // Disable transition temporarily to instantly reset position
            filmStrip.style.transition = 'none';
            filmStrip.appendChild(filmStrip.firstElementChild);
            filmStrip.style.transform = 'translateX(0)';
            
            // Re-enable transition for the next click
            // Need a tiny timeout to let the browser apply the 'none' transition first
            setTimeout(() => {
                filmStrip.style.transition = 'transform 0.5s ease-in-out';
            }, 10);
        }, 500); // 500ms matches the CSS transition time
    });

    // --- Modal Logic ---
    filmStrip.addEventListener('click', (e) => {
        // Check if we clicked on an image inside a film-frame
        if (e.target.tagName === 'IMG' && e.target.closest('.film-frame')) {
            modalImg.src = e.target.src;
            modal.style.display = 'flex';
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
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
