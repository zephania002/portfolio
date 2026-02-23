const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const circleMenu = document.getElementById('circle-menu');
const headerProgressBar = document.querySelector('.header-progress-bar');

if(menuToggle){
    menuToggle.addEventListener("click", () => {
        const opening = !navLinks.classList.contains('active');
        navLinks.classList.toggle("active");
        // animate expanding circular menu with GSAP when available
        if(window.gsap && circleMenu){
            if(opening){
                gsap.set(circleMenu, { transformOrigin: '50% 50%', scale: 0, autoAlpha: 1 });
                gsap.to(circleMenu, { scale: 30, duration: 0.7, ease: 'power4.out' });
                gsap.from('.nav-links li', { y: 20, opacity: 0, stagger: 0.06, duration: 0.45, ease: 'power3.out' });
            } else {
                gsap.to(circleMenu, { scale: 0, duration: 0.5, ease: 'power3.in' });
            }
        }
    });
}

// Fade in on scroll (progressively handled by AOS too)
const sections = document.querySelectorAll(".section");
sections.forEach(sec => {
    sec.style.opacity = 0;
    sec.style.transform = "translateY(40px)";
    sec.style.transition = "all 0.6s ease";
});

window.addEventListener("scroll", () => {
    sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if(top < window.innerHeight - 100){
            sec.style.opacity = "1";
            sec.style.transform = "translateY(0)";
        }
    });
    // progress bar
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const bar = document.getElementById('progress-bar');
    if(bar) bar.style.width = pct + '%';
    // header progress indicator
    if(headerProgressBar) headerProgressBar.style.width = pct + '%';
});

// Trigger a scroll event once on load to reveal any sections
// that may already be in view (e.g., when navigating to an anchor).
window.dispatchEvent(new Event('scroll'));

// AOS init (if loaded)
if(window.AOS){
    AOS.init({ once: true, duration: 900, easing: 'ease-out-cubic' });
}



// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
function setTheme(dark){
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('dark', dark ? '1' : '0');
    if(themeToggle) themeToggle.textContent = dark ? '☀️' : '🌙';
}
const saved = localStorage.getItem('dark');
if(saved !== null) setTheme(saved === '1');
else setTheme(false);
if(themeToggle){
    themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));
}

// Preloader
window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    if(pre){
        pre.style.opacity = '0';
        pre.style.pointerEvents = 'none';
        setTimeout(()=>pre.remove(), 600);
    }
    // refresh AOS after load
    if(window.AOS) AOS.refresh();
    // Navbar entrance animation via GSAP
    if(window.gsap) gsap.from('.navbar', { y: -40, opacity: 0, duration: 0.9, ease: 'power3.out' });
    
    // Initialize glass hero effects
    initGlassHero();
});

// ====== GLASSMORPHISM HERO EFFECTS ======
function initGlassHero(){
    const heroSection = document.querySelector('.glass-hero');
    const glassGlows = document.querySelectorAll('.hero-glow-light');
    const glassCard = document.querySelector('.glass-card');
    const videoElement = document.querySelector('.hero-video-bg');
    
    if(!heroSection) return;

    // Ensure video plays (handle autoplay policies)
    if(videoElement){
        const playPromise = videoElement.play();
        if(playPromise !== undefined){
            playPromise.catch(error => {
                console.log('Video autoplay failed:', error);
                videoElement.play();
            });
        }
    }

    // Mouse tracking for subtle light gradient effect
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        glassGlows.forEach((glow, index) => {
            const moveX = (x / window.innerWidth) * 30 - 15;
            const moveY = (y / window.innerHeight) * 30 - 15;
            
            if(window.gsap){
                gsap.to(glow, {
                    x: moveX * (index + 1) * 0.3,
                    y: moveY * (index + 1) * 0.3,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        });
    });
    
    // Subtle card tilt effect on mouse move (if GSAP available)
    if(glassCard && window.gsap){
        document.addEventListener('mousemove', (e) => {
            const rect = glassCard.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotX = (y / rect.height) * 1.5;
            const rotY = (x / rect.width) * 1.5;
            
            gsap.to(glassCard, {
                rotationX: rotX,
                rotationY: rotY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        document.addEventListener('mouseleave', () => {
            gsap.to(glassCard, {
                rotationX: 0,
                rotationY: 0,
                duration: 1.2,
                ease: 'power3.out'
            });
        });
    }
}



// Custom cursor (DOM elements already appended earlier)
const cursor = document.createElement('div');
cursor.className = 'cursor';
const follower = document.createElement('div');
follower.className = 'cursor-follower';
document.body.appendChild(cursor);
document.body.appendChild(follower);
let mx = 0, my = 0;
// use GSAP for smooth follower animation when available
window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    // immediate small cursor
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    if(window.gsap){
        gsap.to(follower, { x: mx, y: my, duration: 0.18, ease: 'power3.out' });
    } else {
        // fallback lerp
        follower.style.left = mx + 'px'; follower.style.top = my + 'px';
    }
});
// click effect using GSAP
window.addEventListener('mousedown', ()=>{
    if(window.gsap) gsap.to(follower, { scale: 0.85, duration: 0.12, ease: 'power2.out' });
    else follower.style.transform = 'translate(-50%,-50%) scale(0.85)';
});
window.addEventListener('mouseup', ()=>{
    if(window.gsap) gsap.to(follower, { scale: 1, duration: 0.18, ease: 'power2.out' });
    else follower.style.transform = 'translate(-50%,-50%) scale(1)';
});







// ===== ABOUT SECTION INTERACTIONS =====
// Animate counters and skill bars when About enters viewport
const aboutSection = document.getElementById('about');
if(aboutSection){
    const aboutObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                // counters
                document.querySelectorAll('#about .count').forEach(el => {
                    const target = +el.getAttribute('data-target') || 0;
                    let current = 0;
                    const step = Math.max(1, Math.floor(target / 50));
                    const t = setInterval(()=>{
                        current += step;
                        if(current >= target){ el.textContent = target; clearInterval(t); }
                        else el.textContent = current;
                    }, 18);
                });

                // circular skill charts
                document.querySelectorAll('#about .skill-circle').forEach(circle => {
                    const pct = +circle.getAttribute('data-percent') || 0;
                    const fg = circle.querySelector('.skill-fg');
                    if(fg){
                        const r = fg.getAttribute('r');
                        const radius = +r;
                        const circumference = 2 * Math.PI * radius;
                        fg.style.strokeDasharray = circumference;
                        const offset = circumference * (1 - pct / 100);
                        // animate with GSAP if available
                        if(window.gsap){
                            gsap.to(fg, { strokeDashoffset: offset, duration: 1.2, ease: 'power3.out' });
                        } else {
                            setTimeout(()=>{ fg.style.strokeDashoffset = offset; }, 120);
                        }
                    }
                });

                // simple GSAP entrance for timeline and cards
                if(window.gsap){
                    gsap.from('#about .timeline-item', { y: 20, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out' });
                    gsap.from('#about .spec-card', { y: 18, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out' });
                }

                obs.disconnect();
            }
        });
    }, { threshold: 0.2 });
    aboutObserver.observe(aboutSection);
}

// 3D hover tilt for specialty cards
document.querySelectorAll('.spec-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;
        const rotX = (y / rect.height) * 6;
        const rotY = (x / rect.width) * -6;
        if(window.gsap) gsap.to(card, { rotationX: rotX, rotationY: rotY, duration: 0.35, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
        if(window.gsap) gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' });
    });
});

// Lottie avatar load (loads assets/avatar.json if present)
if(window.lottie){
    try{
        const container = document.getElementById('lottie-avatar');
        if(container){
            const anim = lottie.loadAnimation({
                container,
                path: 'assets/avatar.json',
                renderer: 'svg',
                loop: true,
                autoplay: true,
                rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
            });
            anim.addEventListener('DOMLoaded', ()=>{
                // hide fallback svg if present
                const fallback = container.parentElement.querySelector('.avatar-fallback');
                if(fallback) fallback.style.display = 'none';
            });
        }
    }catch(e){
        // silently fail and keep fallback
        console.warn('Lottie avatar failed to load', e);
    }
}

// Magnetic hover for nav items
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width/2)) / rect.width;
        const dy = (e.clientY - (rect.top + rect.height/2)) / rect.height;
        if(window.gsap) gsap.to(item, { x: dx * 8, y: dy * 6, duration: 0.35, ease: 'power3.out' });
    });
    item.addEventListener('mouseleave', () => {
        if(window.gsap) gsap.to(item, { x: 0, y: 0, duration: 0.45, ease: 'power3.out' });
    });
});

// ====== PREMIUM FOOTER ANIMATIONS ======

// Particle system for footer
function createFooterParticles(){
    const container = document.querySelector('.footer-particles');
    if(!container) return;
    const particleCount = 25;
    for(let i = 0; i < particleCount; i++){
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.background = `rgba(0, 245, 212, ${Math.random() * 0.6 + 0.2})`;
        particle.style.animation = `floatParticle ${Math.random() * 8 + 6}s infinite ease-in-out`;
        particle.style.boxShadow = `0 0 ${size * 3}px rgba(0, 245, 212, 0.6)`;
        container.appendChild(particle);
    }
}

// Particle float animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0%, 100% { transform: translate(0, 0); opacity: 0.3; }
        50% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * -40}px); opacity: 0.8; }
    }
`;
document.head.appendChild(style);

createFooterParticles();

// Mouse-follow glow in footer
const footerGlow = document.querySelector('.footer-glow');
if(footerGlow){
    document.addEventListener('mousemove', (e) => {
        const footerTop = document.querySelector('.footer').offsetTop;
        const footerHeight = document.querySelector('.footer').offsetHeight;
        const scrollTop = window.scrollY;
        
        if(e.clientY + scrollTop > footerTop && e.clientY + scrollTop < footerTop + footerHeight){
            if(window.gsap){
                gsap.to(footerGlow, { x: e.clientX, y: e.clientY + scrollTop - footerTop, duration: 0.6, ease: 'power2.out' });
            } else {
                footerGlow.style.left = e.clientX + 'px';
                footerGlow.style.top = (e.clientY + scrollTop - footerTop) + 'px';
            }
        }
    });
}

// Magnetic social buttons with GSAP
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width/2)) / rect.width;
        const dy = (e.clientY - (rect.top + rect.height/2)) / rect.height;
        if(window.gsap){
            gsap.to(btn, { x: dx * 6, y: dy * 4, duration: 0.3, ease: 'power3.out' });
        }
    });
    btn.addEventListener('mouseleave', () => {
        if(window.gsap){
            gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' });
        }
    });
});

// GSAP cinematic footer entrance
window.addEventListener('load', () => {
    if(window.gsap){
        const tl = gsap.timeline();
        tl.from('.footer-glass', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' })
          .from('.footer-title', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
          .from('.footer-socials', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.5)
          .from('.copyright', { opacity: 0, duration: 0.6, ease: 'power1.out' }, 0.6);
    }
});

// ====== DEVELOPER TERMINAL CONTACT FORM ======
document.addEventListener('DOMContentLoaded', () => {
    const devForm = document.getElementById('devTerminalForm');
    const feedback = document.getElementById('devFeedback');

    if(devForm) {
        devForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('devName').value.trim();
            const email = document.getElementById('devEmail').value.trim();
            const message = document.getElementById('devMessage').value.trim();

            // Clear previous feedback
            feedback.className = '';
            feedback.textContent = '';

            // Validation
            if(!name || !email || !message) {
                showDevFeedback('error', '✗ error: all fields are required');
                return;
            }

            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showDevFeedback('error', '✗ error: invalid email format');
                return;
            }

            // Show success message
            showDevFeedback('success', '✓ message sent successfully!');

            // Animate form reset
            if(window.gsap) {
                gsap.to(devForm, {
                    opacity: 0.6,
                    duration: 0.3,
                    onComplete: () => {
                        devForm.reset();
                        gsap.to(devForm, { opacity: 1, duration: 0.3 });
                    }
                });
            } else {
                devForm.reset();
            }

            // Clear feedback after 4 seconds
            setTimeout(() => {
                feedback.classList.remove('show', 'success', 'error');
                feedback.textContent = '';
            }, 4000);
        });
    }
});

function showDevFeedback(type, message) {
    const feedback = document.getElementById('devFeedback');
    feedback.textContent = message;
    feedback.className = `terminal-feedback-output show ${type}`;
}

// ===== PROJECT EXPAND/COLLAPSE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
    const expandButtons = document.querySelectorAll('.btn-expand');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = button.closest('.project-card');
            const projectDetails = projectCard.querySelector('.project-details');
            
            // Toggle expanded state
            projectDetails.classList.toggle('expanded');
            button.classList.toggle('expanded');
            
            // Update button text
            if (projectDetails.classList.contains('expanded')) {
                button.textContent = 'Hide Details ↑';
            } else {
                button.textContent = 'Details ↓';
            }
        });
    });
});


