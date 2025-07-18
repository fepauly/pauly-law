// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initCountUpAnimation();
    initScrollAnimations();
    initParticleAnimation();
});

// Counter Animation for Statistics
function initCountUpAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    setTimeout(() => animateCounter(counter), 200);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Add scroll animation classes
    const animatedElements = document.querySelectorAll('.card, .timeline-item, .achievement-content');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Set initial styles and observe elements
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(element);
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Particle Animation
function initParticleAnimation() {
    const particlesContainer = document.querySelector('.hero-particles');
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 4 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'rgba(255, 255, 255, 0.3)';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.pointerEvents = 'none';
    
    // Animate particle
    const duration = Math.random() * 10 + 10; // 10-20 seconds
    const direction = Math.random() * 360;
    const distance = Math.random() * 100 + 50;
    
    particle.style.animation = `floatParticle ${duration}s linear infinite`;
    
    // Add custom keyframes for each particle
    const keyframes = `
        @keyframes floatParticle {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translate(${Math.cos(direction) * distance}px, ${Math.sin(direction) * distance}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    
    // Add keyframes to stylesheet
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
        // Create new particle to maintain count
        setTimeout(() => createParticle(container), Math.random() * 5000);
    }, duration * 1000);
}

// Celebration Modal Functions
function showCelebration() {
    const modal = document.getElementById('celebrationModal');
    modal.style.display = 'block';
    
    // Add celebration effects
    createConfetti();
    playSuccessSound();
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        hideCelebration();
    }, 5000);
}

function hideCelebration() {
    const modal = document.getElementById('celebrationModal');
    modal.style.display = 'none';
}

// Confetti Animation
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 8 + 4 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

// Success Sound (Web Audio API)
function playSuccessSound() {
    // Create a simple success sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create multiple tones for a chord
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G (C major chord)
    const duration = 0.5;
    
    frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + duration + index * 0.1);
    });
}

// Smooth Scrolling for any future navigation links
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Timeline Item Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Card Hover Effects Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('celebrationModal');
    if (event.target === modal) {
        hideCelebration();
    }
});

// Keyboard accessibility for modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideCelebration();
    }
});

// Mobile touch interactions
if ('ontouchstart' in window) {
    // Add touch-friendly interactions for mobile devices
    const cta = document.querySelector('.cta-button');
    
    cta.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    cta.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
}

// Performance optimization: Debounce scroll events
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

// Apply debounce to scroll handler
window.addEventListener('scroll', debounce(() => {
    // Scroll-dependent animations can be added here
}, 10));
