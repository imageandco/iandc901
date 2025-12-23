// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const business = formData.get('business');
    const interest = formData.get('interest');
    const message = formData.get('message');
    
    // Create mailto link
    const subject = `New Inquiry from ${name}`;
    const body = `
Name: ${name}
Email: ${email}
Business/Brand: ${business || 'Not provided'}
Interest: ${interest}
Message: ${message}
    `.trim();
    
    // Open mailto
    window.location.href = `mailto:contact@imageandco901.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Show success message (optional)
    alert('Thank you for your inquiry! Opening your email client to send the message.');
    
    // Reset form
    this.reset();
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(241, 225, 233, 0.98)';
    } else {
        navbar.style.backgroundColor = 'rgba(241, 225, 233, 0.98)';
    }
});

// Scroll reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.pillar, .process-step, .service-group').forEach(el => {
    observer.observe(el);
});

// Lazy loading enhancement
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src; // Trigger native lazy loading
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}
