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

// AOS init (if loaded)
if(window.AOS){
    AOS.init({ once: true, duration: 900, easing: 'ease-out-cubic' });
}

// Typed.js init (if loaded) - HERO ROLES
if(window.Typed){
    const typed = new Typed('#typed-hero', {
        strings: ["Web Developer", "UI Engineer", "Problem Solver", "Creative Developer", "Full-Stack Enthusiast"],
        typeSpeed: 60,
        backSpeed: 45,
        backDelay: 1800,
        loop: true,
        smartBackspace: true
    });
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
    
    // ====== HERO CINEMATIC ENTRANCE ======
    if(window.gsap){
        const heroTl = gsap.timeline();
        heroTl
            .from('.hero-logo-intro', { scale: 0, opacity: 0, duration: 0.7, ease: 'back.out' }, 0.2)
            .from('.hero-name', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.4)
            .from('.hero-role', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.6)
            .from('.hero-tagline', { y: 25, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.7)
            .from('.hero-ctas', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.8)
            .from('.hero-socials', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.9);
        
        // Scroll indicator entrance
        gsap.from('.scroll-indicator', { opacity: 0, y: -10, duration: 0.8, delay: 1.2 });
    }
});

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

// ====== HERO SECTION INTERACTIONS ======

// 3D Tilt effect on hero card with mouse movement
const heroCard = document.querySelector('.hero-card');
if(heroCard){
    document.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        if(e.clientY > rect.top && e.clientY < rect.bottom){
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            const rotX = (y / rect.height) * 6;
            const rotY = (x / rect.width) * -6;
            if(window.gsap){
                gsap.to(heroCard, { rotationX: rotX, rotationY: rotY, duration: 0.4, ease: 'power2.out' });
            }
        }
    });
    document.addEventListener('mouseleave', () => {
        if(window.gsap){
            gsap.to(heroCard, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'power3.out' });
        }
    });
}

// Magnetic hover on CTA buttons
document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width/2)) / rect.width;
        const dy = (e.clientY - (rect.top + rect.height/2)) / rect.height;
        if(window.gsap) gsap.to(btn, { x: dx * 6, y: dy * 4, duration: 0.3, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => {
        if(window.gsap) gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' });
    });
});

// Social icon hover effects
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        if(window.gsap) gsap.to(icon, { scale: 1.15, duration: 0.3, ease: 'back.out' });
    });
    icon.addEventListener('mouseleave', () => {
        if(window.gsap) gsap.to(icon, { scale: 1, duration: 0.3, ease: 'back.out' });
    });
});

// Smooth scroll indicator behavior
const scrollIndicator = document.querySelector('.scroll-indicator');
if(scrollIndicator){
    window.addEventListener('scroll', () => {
        const heroBottom = document.querySelector('.hero').offsetTop + document.querySelector('.hero').offsetHeight;
        const scrollPos = window.scrollY;
        if(scrollPos > heroBottom * 0.1){
            if(scrollIndicator.style.opacity !== '0'){
                gsap.to(scrollIndicator, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
            }
        } else {
            if(scrollIndicator.style.opacity !== '0.7'){
                gsap.to(scrollIndicator, { opacity: 0.7, pointerEvents: 'auto', duration: 0.5 });
            }
        }
    });
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

// 3D tilt effect on footer-glass with mouse movement
const footerGlass = document.querySelector('.footer-glass');
if(footerGlass){
    document.addEventListener('mousemove', (e) => {
        const rect = footerGlass.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;
        const rotX = (y / rect.height) * 8;
        const rotY = (x / rect.width) * -8;
        if(window.gsap){
            gsap.to(footerGlass, { rotationX: rotX, rotationY: rotY, duration: 0.5, ease: 'power2.out' });
        } else {
            footerGlass.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }
    });
    document.addEventListener('mouseleave', () => {
        if(window.gsap){
            gsap.to(footerGlass, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'power3.out' });
        }
    });
}
