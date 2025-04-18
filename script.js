/**
 * Promposal Interactive Page
 * Handles confetti effects, modal popups, and interactive buttons
 */
document.addEventListener('DOMContentLoaded', () => {
    // Animation timing constants
    const ANIMATION_TIMES = {
        SHORT_DELAY: 5,       // ms - Quick class application delay
        FADE_DELAY: 200,      // ms - Time for fade transition
        CONFETTI_SMALL: 2000, // ms - Duration for small confetti effect
        CONFETTI_LARGE: 3000  // ms - Duration for large confetti effect
    };
    
    // Confetti color palettes
    const CONFETTI_PALETTES = {
        simple: ["#FFC107", "#FF5722", "#4CAF50", "#2196F3", "#9C27B0"],
        expanded: ["#FFC107", "#FF5722", "#4CAF50", "#2196F3", "#9C27B0", "#FF1493", "#FFEB3B", "#00BCD4"]
    };
    
    /**
     * Creates a confetti explosion effect at a button's location
     * @param {HTMLElement} button - The button to center the effect on
     * @param {Object} options - Configuration for the confetti
     */
    function createConfetti(button, options = {}) {
        const defaults = {
            count: 40,
            colors: CONFETTI_PALETTES.simple,
            duration: ANIMATION_TIMES.CONFETTI_SMALL,
            xRange: 160,
            yRange: 160,
            rotationRange: 720,
            useVariedSizes: false
        };
        
        const config = { ...defaults, ...options };
        
        // Get button position
        const buttonRect = button.getBoundingClientRect();
        
        // Create confetti container
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti';
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = `${buttonRect.top + buttonRect.height/2}px`;
        confettiContainer.style.left = `${buttonRect.left + buttonRect.width/2}px`;
        
        document.body.appendChild(confettiContainer);
        
        // Create confetti pieces
        for (let i = 0; i < config.count; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            
            // Set color
            const randomColor = config.colors[Math.floor(Math.random() * config.colors.length)];
            piece.style.backgroundColor = randomColor;
            
            // Set size (if using varied sizes)
            if (config.useVariedSizes) {
                const size = Math.random() * 10 + 5;
                piece.style.width = `${size}px`;
                piece.style.height = `${size}px`;
            }
            
            // Set movement properties
            const dx = Math.round((Math.random() - 0.5) * config.xRange);
            const dy = config.yBias ? 
                       Math.round((Math.random() * config.yRange) - config.yBias) : 
                       Math.round((Math.random() - 0.5) * config.yRange);
            const rotate = `${Math.round(Math.random() * config.rotationRange - config.rotationRange/2)}deg`;
            
            piece.style.setProperty('--dx', dx);
            piece.style.setProperty('--dy', dy);
            piece.style.setProperty('--rotate', rotate);
            
            confettiContainer.appendChild(piece);
        }
        
        // Clean up after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, config.duration);
    }
    
    /**
     * Shows a popup modal with transition effects
     * @param {string} selector - CSS selector for the modal to show
     * @param {Array} classesToAdd - CSS classes to add after display is set
     */
    function showModal(selector, classesToAdd = ['fade-in']) {
        const modal = document.querySelector(selector);
        if (!modal) return;
        
        modal.style.display = 'block';
        setTimeout(() => {
            classesToAdd.forEach(className => modal.classList.add(className));
        }, ANIMATION_TIMES.SHORT_DELAY);
        
        // Special handling for the no-image if applicable
        if (selector === '.no-clicked') {
            const noImage = document.querySelector('.no-image');
            if (noImage) {
                setTimeout(() => {
                    noImage.classList.add('fade-in');
                }, ANIMATION_TIMES.SHORT_DELAY);
            }
        }
    }
    
    /**
     * Hides a popup modal with transition effects
     * @param {string} selector - CSS selector for the modal to hide
     * @param {Array} classesToRemove - CSS classes to remove before hiding
     */
    function hideModal(selector, classesToRemove = ['fade-in']) {
        const modal = document.querySelector(selector);
        if (!modal) return;
        
        classesToRemove.forEach(className => modal.classList.remove(className));
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, ANIMATION_TIMES.FADE_DELAY);
        
        // Special handling for the no-image if applicable
        if (selector === '.no-clicked') {
            const noImage = document.querySelector('.no-image');
            if (noImage) {
                setTimeout(() => {
                    noImage.classList.remove('fade-in');
                }, ANIMATION_TIMES.SHORT_DELAY);
            }
        }
    }
    
    // Yes button hover effect
    document.querySelectorAll('.yes-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            createConfetti(button);
        });
        
        button.addEventListener('click', () => {
            showModal('.yes-clicked', ['fade-in', 'zoom-in']);
        });
    });
    
    // No button click effect
    document.querySelectorAll('.no-button').forEach(button => {
        button.addEventListener('click', () => {
            showModal('.no-clicked');
        });
    });
    
    // "You're right" button effect
    document.querySelectorAll('.no-button2').forEach(button => {
        button.addEventListener('click', () => {
            hideModal('.no-clicked');
        });
    });
    
    // "Yippee!" button effect
    document.querySelectorAll('.yes-button2').forEach(button => {
        button.addEventListener('click', () => {
            // Create a larger, more dramatic confetti effect
            createConfetti(button, {
                count: 200,
                colors: CONFETTI_PALETTES.expanded,
                duration: ANIMATION_TIMES.CONFETTI_LARGE,
                xRange: 300,
                yRange: 300,
                yBias: 250,
                rotationRange: 1080,
                useVariedSizes: true
            });
        });
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', (event) => {
        const yesPopup = document.querySelector('.yes-clicked');
        const noPopup = document.querySelector('.no-clicked');
        
        // Handle yes popup
        if (yesPopup && yesPopup.style.display === 'block') {
            if (!yesPopup.contains(event.target) && !event.target.classList.contains('yes-button')) {
                hideModal('.yes-clicked', ['fade-in', 'zoom-in']);
            }
        }        
    });
});