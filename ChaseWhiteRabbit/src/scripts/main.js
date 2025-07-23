// ChaseWhiteRabbit Celtic Theme JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize collapsible sections
    initCollapsibles();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add Celtic decorative elements
    addCelticDecorations();
    
    // Initialize color transitions
    initColorTransitions();
    
    console.log('ChaseWhiteRabbit Celtic theme loaded successfully!');
});

/**
 * Initialize collapsible sections with smooth animations
 */
function initCollapsibles() {
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(collapsible => {
        const header = collapsible.querySelector('.collapsible-header');
        const content = collapsible.querySelector('.collapsible-content');
        const arrow = collapsible.querySelector('.collapsible-arrow');
        
        // Add arrow if it doesn't exist
        if (header && !arrow) {
            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'collapsible-arrow';
            arrowSpan.innerHTML = '▼';
            header.appendChild(arrowSpan);
        }
        
        if (header) {
            header.addEventListener('click', function() {
                const isActive = collapsible.classList.contains('active');
                
                // Close all other collapsibles (accordion behavior)
                collapsibles.forEach(other => {
                    if (other !== collapsible) {
                        other.classList.remove('active');
                    }
                });
                
                // Toggle current collapsible
                collapsible.classList.toggle('active');
                
                // Smooth animation
                if (content) {
                    if (!isActive) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    } else {
                        content.style.maxHeight = '0px';
                    }
                }
                
                // Add ripple effect
                addRippleEffect(header, event);
            });
        }
    });
}

/**
 * Initialize scroll reveal animations
 */
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = function() {
        scrollElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    };
    
    // Check on load
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
}

/**
 * Add Celtic decorative elements dynamically
 */
function addCelticDecorations() {
    // Add decorative lines after headers
    const headers = document.querySelectorAll('h2, h3');
    headers.forEach(header => {
        if (!header.nextElementSibling || !header.nextElementSibling.classList.contains('decorative-line')) {
            const line = document.createElement('div');
            line.className = 'decorative-line';
            header.parentNode.insertBefore(line, header.nextSibling);
        }
    });
}

/**
 * Initialize color transitions and hover effects
 */
function initColorTransitions() {
    // Add color transition class to interactive elements
    const interactiveElements = document.querySelectorAll('button, .btn, .card, .collapsible-header, a');
    interactiveElements.forEach(element => {
        element.classList.add('color-transition');
    });
    
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = '#aa0000';
            this.style.boxShadow = '0 8px 20px rgba(204, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = '#cc0000';
            this.style.boxShadow = '0 4px 8px rgba(44, 24, 16, 0.3)';
        });
    });
}

/**
 * Add ripple effect to clickable elements
 */
function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Create and add collapsible sections programmatically
 */
function createCollapsibleSection(title, content, container) {
    const collapsible = document.createElement('div');
    collapsible.className = 'collapsible scroll-reveal';
    
    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
        ${title}
        <span class="collapsible-arrow">▼</span>
    `;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'collapsible-content';
    contentDiv.innerHTML = content;
    
    collapsible.appendChild(header);
    collapsible.appendChild(contentDiv);
    
    if (container) {
        container.appendChild(collapsible);
    }
    
    return collapsible;
}

/**
 * Utility function to create Celtic-styled cards
 */
function createCelticCard(title, content, className = '') {
    const card = document.createElement('div');
    card.className = `card scroll-reveal ${className}`;
    
    if (title) {
        const cardHeader = document.createElement('h3');
        cardHeader.textContent = title;
        card.appendChild(cardHeader);
    }
    
    if (content) {
        const cardContent = document.createElement('div');
        cardContent.innerHTML = content;
        card.appendChild(cardContent);
    }
    
    return card;
}

/**
 * Utility function to create Celtic-styled buttons
 */
function createCelticButton(text, onClick, className = 'btn') {
    const button = document.createElement('button');
    button.className = className;
    button.textContent = text;
    
    if (onClick) {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

/**
 * Add smooth scrolling to anchor links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Celtic theme utilities for dynamic content
 */
const CelticTheme = {
    colors: {
        red: '#cc0000',
        cream: '#efefde',
        white: '#ffffff',
        darkRed: '#aa0000'
    },
    
    // Create themed elements
    createElement: (type, className, content) => {
        const element = document.createElement(type);
        if (className) element.className = className;
        if (content) element.innerHTML = content;
        return element;
    },
    
    // Apply theme to existing elements
    applyTheme: (element) => {
        element.classList.add('color-transition', 'scroll-reveal');
        return element;
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CelticTheme, createCollapsibleSection, createCelticCard, createCelticButton };
}

// Initialize smooth scrolling
initSmoothScrolling();
