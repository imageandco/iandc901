// Image & Company - Main JavaScript
// Handles animations, interactions, and form functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initScrollAnimations();
    initNavigation();
    initHeroAnimations();
    initFormHandling();
    initMobileMenu();
    initSmoothScrolling();
    initParallaxEffect();
    
    console.log('Image & Company website initialized');
});

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(241, 225, 233, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(52, 4, 23, 0.1)';
        } else {
            navbar.style.background = 'rgba(241, 225, 233, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active nav link highlighting
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Hero section animations
function initHeroAnimations() {
    // Typewriter effect for hero title
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        // Split text into words for better animation control
        const words = heroTitle.textContent.split(' ');
        heroTitle.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
        
        // Animate words with stagger
        anime({
            targets: '.hero .word',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(200),
            duration: 800,
            easing: 'easeOutExpo'
        });
    }

    // Animate hero content on load
    anime.timeline({
        easing: 'easeOutExpo',
    })
    .add({
        targets: '.hero-content h1',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000
    })
    .add({
        targets: '.hero-subtitle',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800
    }, '-=500')
    .add({
        targets: '.cta-buttons',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600
    }, '-=400');
}

// Form handling with validation and mailto fallback
function initFormHandling() {
    const form = document.getElementById('inquiry-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        if (!validateForm(data)) {
            return;
        }
        
        // Create mailto link as fallback
        const subject = `New Inquiry from ${data.name} - ${data.business || 'No Business Name'}`;
        const body = `
Inquiry Details:
Name: ${data.name}
Email: ${data.email}
Business: ${data.business || 'Not provided'}
Interest: ${data.interest}

Message:
${data.message}

---
Sent from Image & Company website
        `.trim();
        
        // Try to open mailto (works on most devices)
        const mailtoLink = `mailto:contact@imageandco901.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Show success message
        showFormSuccess();
        
        // Attempt to open mailto (may be blocked by some browsers)
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 1000);
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
        }, 2000);
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Form validation functions
function validateForm(data) {
    let isValid = true;
    
    // Check required fields
    const requiredFields = ['name', 'email', 'interest', 'message'];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        const emailInput = document.getElementById('email');
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    
    // Required field validation
    if (input.hasAttribute('required') && !value) {
        showFieldError(input, 'This field is required');
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value && !isValidEmail(value)) {
        showFieldError(input, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(input);
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(input, message) {
    // Remove existing error
    clearFieldError(input);
    
    // Add error styling
    input.style.borderColor = '#340417';
    input.style.boxShadow = '0 0 0 3px rgba(52, 4, 23, 0.1)';
    
    // Create error message element
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = `
        color: #340417;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        font-weight: 500;
    `;
    
    input.parentNode.appendChild(error);
}

function clearFieldError(input) {
    input.style.borderColor = '#e0e0e0';
    input.style.boxShadow = 'none';
    
    const error = input.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
}

function showFormSuccess() {
    // Create success message
    const success = document.createElement('div');
    success.innerHTML = `
        <div style="
            background: #4C04CD;
            color: white;
            padding: 1.5rem;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 2rem;
            animation: slideIn 0.5s ease;
        ">
            <h4 style="margin-bottom: 0.5rem;">Thank you for your inquiry!</h4>
            <p style="margin: 0; opacity: 0.9;">We'll respond within 1-2 business days. Your email client should open with a pre-filled message.</p>
        </div>
    `;
    
    const form = document.getElementById('inquiry-form');
    form.parentNode.insertBefore(success, form);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        success.remove();
    }, 5000);
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animate hamburger
        if (hamburger.classList.contains('active')) {
            hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            hamburger.children[1].style.opacity = '0';
            hamburger.children[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            
            // Show mobile menu
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(241, 225, 233, 0.98)';
            navLinks.style.backdropFilter = 'blur(10px)';
            navLinks.style.padding = '2rem 5%';
            navLinks.style.boxShadow = '0 10px 30px rgba(52, 4, 23, 0.1)';
            navLinks.style.animation = 'slideDown 0.3s ease';
        } else {
            hamburger.children[0].style.transform = 'none';
            hamburger.children[1].style.opacity = '1';
            hamburger.children[2].style.transform = 'none';
            navLinks.style.display = 'none';
        }
    });
    
    // Close mobile menu when clicking on a link
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            hamburger.classList.remove('active');
            navLinks.style.display = 'none';
            hamburger.children[0].style.transform = 'none';
            hamburger.children[1].style.opacity = '1';
            hamburger.children[2].style.transform = 'none';
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effect for hero background
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3; // Subtle parallax effect
        
        hero.style.transform = `translateY(${rate}px)`;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Service card hover animations
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

// Process card animations
function initProcessCards() {
    const processCards = document.querySelectorAll('.process-card');
    
    processCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card.querySelector('.process-number'),
                scale: 1.1,
                color: '#340417',
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card.querySelector('.process-number'),
                scale: 1,
                color: '#340417',
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

// Button hover effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (button.classList.contains('btn-primary')) {
                anime({
                    targets: button,
                    scale: 1.05,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });
        
        button.addEventListener('mouseleave', () => {
            anime({
                targets: button,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Performance optimization: Debounced scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize additional interactions after DOM load
window.addEventListener('load', () => {
    initServiceCards();
    initProcessCards();
    initButtonEffects();
    initLazyLoading();
    
    // Add loaded class for any post-load animations
    document.body.classList.add('loaded');
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .loaded .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .loaded .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);