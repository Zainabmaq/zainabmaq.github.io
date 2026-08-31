// ==================== ADVANCED ANIMATIONS ====================

// Performance check - disable heavy animations on low-end devices
const isLowPerformance = () => {
    return navigator.hardwareConcurrency < 4 || window.innerWidth < 768;
};

// ==================== PARTICLE BACKGROUND EFFECT ====================
function createParticles() {
    // Skip on mobile/low-end devices
    if (isLowPerformance()) {
        console.log('⚡ Particles disabled for better performance');
        return;
    }

    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
        opacity: 0.6;
    `;
    
    document.body.appendChild(particleContainer);
    
    // Reduce particle count on smaller screens
    const particleCount = window.innerWidth < 1024 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const opacity = Math.random() * 0.5 + 0.2;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(100, 255, 218, ${opacity});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particle-float ${duration}s infinite ease-in-out;
            animation-delay: ${delay}s;
            will-change: transform;
        `;
        particleContainer.appendChild(particle);
    }
}

// Particle float animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particle-float {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
        }
        25% {
            transform: translate(20px, -20px) scale(1.1);
            opacity: 0.6;
        }
        50% {
            transform: translate(-20px, -40px) scale(0.9);
            opacity: 0.4;
        }
        75% {
            transform: translate(-40px, -20px) scale(1.05);
            opacity: 0.5;
        }
    }
    
    .dud {
        color: rgba(100, 255, 218, 0.5);
    }
`;
document.head.appendChild(particleStyle);

// Initialize particles after DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createParticles);
} else {
    createParticles();
}

// ==================== MOUSE PARALLAX EFFECT ====================
function initParallax() {
    // Skip on mobile
    if (window.innerWidth < 768) return;

    let rafId = null;
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!rafId) {
            rafId = requestAnimationFrame(updateParallax);
        }
    });

    function updateParallax() {
        const moveX = (mouseX - window.innerWidth / 2) / 50;
        const moveY = (mouseY - window.innerHeight / 2) / 50;
        
        document.querySelectorAll('.parallax, .hero-image, .image-container').forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            element.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });

        rafId = null;
    }
}

// Initialize parallax
initParallax();

// ==================== TEXT SCRAMBLE EFFECT ====================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply text scramble to hero title (optional - can be heavy)
function initTextScramble() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !isLowPerformance()) {
        const originalText = heroTitle.textContent;
        const scramble = new TextScramble(heroTitle);
        
        // Scramble on page load
        setTimeout(() => {
            scramble.setText(originalText);
        }, 500);
    }
}

// Initialize text scramble
window.addEventListener('load', initTextScramble);

// ==================== MAGNETIC BUTTON EFFECT ====================
function initMagneticButtons() {
    // Skip on mobile
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.btn, .btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Initialize magnetic buttons
initMagneticButtons();

// ==================== 3D CARD TILT EFFECT ====================
function init3DCardTilt() {
    // Skip on mobile and low-end devices
    if (isLowPerformance()) return;

    document.querySelectorAll('.project-card, .cert-card, .timeline-card').forEach(card => {
        let rafId = null;
        let currentX = 0;
        let currentY = 0;

        card.addEventListener('mousemove', (e) => {
            if (!rafId) {
                rafId = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    currentX = (y - centerY) / 15;
                    currentY = (centerX - x) / 15;
                    
                    card.style.transform = `
                        perspective(1000px) 
                        rotateX(${currentX}deg) 
                        rotateY(${currentY}deg) 
                        scale3d(1.02, 1.02, 1.02)
                    `;
                    
                    rafId = null;
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Initialize 3D tilt
init3DCardTilt();

// ==================== CUSTOM CURSOR TRAIL ====================
function initCursorTrail() {
    // Skip on mobile and low-end devices
    if (isLowPerformance()) return;

    const trail = [];
    const trailLength = 8;
    let rafId = null;

    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        // Keep only recent trail points
        while (trail.length > trailLength) {
            trail.shift();
        }

        if (!rafId) {
            rafId = requestAnimationFrame(drawTrail);
        }
    });

    function drawTrail() {
        // Remove old trail elements
        document.querySelectorAll('.cursor-trail').forEach(el => {
            const age = Date.now() - parseInt(el.dataset.time);
            if (age > 500) {
                el.remove();
            }
        });
        
        trail.forEach((point, index) => {
            // Check if dot already exists
            if (document.querySelector(`[data-index="${index}"]`)) return;
            
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.dataset.index = index;
            dot.dataset.time = Date.now();
            
            const size = 8 - (index * 0.8);
            const opacity = 1 - (index / trailLength);
            
            dot.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: rgba(100, 255, 218, ${opacity * 0.6});
                border-radius: 50%;
                pointer-events: none;
                left: ${point.x}px;
                top: ${point.y}px;
                transform: translate(-50%, -50%);
                z-index: 9998;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(dot);
            
            // Fade out
            setTimeout(() => {
                dot.style.opacity = '0';
                setTimeout(() => dot.remove(), 300);
            }, 100);
        });

        rafId = null;
    }
}

// Initialize cursor trail
initCursorTrail();

// ==================== SMOOTH SCROLL REVEAL ====================
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate', 'fade-in');
                
                // Add stagger effect for children
                const children = entry.target.querySelectorAll('.stagger-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('aos-animate');
                    }, index * 100);
                });
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with data-aos attribute
    document.querySelectorAll('[data-aos], .reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll reveal
initScrollReveal();

// ==================== PAGE TRANSITION EFFECT ====================
function initPageTransition() {
    // Fade in on load
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });

    // Fade out on unload (optional)
    window.addEventListener('beforeunload', () => {
        document.body.style.opacity = '0';
    });
}

// Initialize page transition
initPageTransition();

// ==================== FLOATING ELEMENTS ====================
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.float, .floating');
    
    floatingElements.forEach((element, index) => {
        const delay = index * 0.2;
        const duration = 3 + (index % 3);
        
        element.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
}

// Float animation CSS
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(floatStyle);

// Initialize floating elements
initFloatingElements();

// ==================== GLITCH EFFECT (ON HOVER) ====================
function initGlitchEffect() {
    document.querySelectorAll('.glitch-trigger').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('glitch');
            setTimeout(() => {
                element.classList.remove('glitch');
            }, 500);
        });
    });
}

// Glitch animation CSS
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(-2px, -2px);
        }
        60% {
            transform: translate(2px, 2px);
        }
        80% {
            transform: translate(2px, -2px);
        }
        100% {
            transform: translate(0);
        }
    }
    
    .glitch {
        animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both;
    }
`;
document.head.appendChild(glitchStyle);

// Initialize glitch effect
initGlitchEffect();

// ==================== GRADIENT ANIMATION ====================
function initGradientAnimation() {
    const gradientElements = document.querySelectorAll('.gradient-animate');
    
    gradientElements.forEach(element => {
        element.style.backgroundSize = '400% 400%';
        element.style.animation = 'gradientShift 15s ease infinite';
    });
}

// Gradient animation CSS
const gradientStyle = document.createElement('style');
gradientStyle.textContent = `
    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
`;
document.head.appendChild(gradientStyle);

// Initialize gradient animation
initGradientAnimation();

// ==================== TYPEWRITER EFFECT (ALTERNATIVE) ====================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Export for external use
window.portfolioAnimations = {
    TextScramble,
    typeWriter,
    createParticles,
    initMagneticButtons,
    init3DCardTilt
};

// ==================== PERFORMANCE MONITORING ====================
console.log('%c🎨 Advanced animations initialized!', 'color: #64ffda; font-weight: bold; font-size: 14px;');

// Log performance impact
if (window.performance) {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
        console.log(`%c⚡ Animation overhead: ~${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`, 'color: #8892b0;');
    }
}

// ==================== CLEANUP ON PAGE UNLOAD ====================
window.addEventListener('beforeunload', () => {
    // Cancel all animation frames
    document.querySelectorAll('.particle, .cursor-trail').forEach(el => el.remove());
});

// ==================== REDUCE MOTION SUPPORT (ACCESSIBILITY) ====================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    console.log('⚠️ Reduced motion preference detected - disabling heavy animations');
    
    // Disable heavy animations
    document.querySelectorAll('.particles-container, .cursor-trail').forEach(el => {
        el.style.display = 'none';
    });
    
    // Reduce animation durations
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
}

console.log('%c✅ All animations ready!', 'color: #10b981; font-weight: bold;');