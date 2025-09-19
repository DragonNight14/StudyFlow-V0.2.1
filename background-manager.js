// Background Manager - Pattern and Image Upload Functionality

class BackgroundManager {
    constructor(tracker) {
        this.tracker = tracker;
        this.patterns = {
            dots: this.generateDotsPattern,
            grid: this.generateGridPattern,
            waves: this.generateWavesPattern,
            hexagon: this.generateHexagonPattern
        };
    }

    applyBackground(type) {
        const body = document.body;
        
        // Store the background type for persistence
        localStorage.setItem('background-type', type);
        
        // IMPORTANT: Stop live wallpaper if switching away from it
        if (type !== 'live' && window.liveWallpaperManager) {
            console.log('🎬 Stopping live wallpaper - switching to:', type);
            window.liveWallpaperManager.stop();
            // Hide the live wallpaper canvas
            const liveCanvas = document.getElementById('live-wallpaper-canvas');
            if (liveCanvas) {
                liveCanvas.style.display = 'none';
            }
        }
        
        // Remove existing background classes
        body.classList.remove('pattern-bg', 'image-bg', 'solid-bg');
        
        // Remove existing pattern elements
        const existingPattern = document.querySelector('.background-pattern');
        if (existingPattern) {
            existingPattern.remove();
        }

        // Clear any inline background styles that might conflict and disable transitions
        body.style.backgroundImage = '';
        body.style.backgroundColor = '';
        body.style.transition = 'none'; // Instant application
        
        // Force immediate style application
        body.offsetHeight; // Trigger reflow

        switch (type) {
            case 'gradient':
                this.applyGradientBackground();
                break;
            case 'pattern':
                this.applyPatternBackground();
                break;
            case 'image':
                this.applyImageBackground();
                break;
            case 'solid':
                this.applySolidBackground();
                break;
            case 'live':
                this.applyLiveWallpaper();
                break;
        }
        
        // Ensure the background persists by setting a data attribute
        body.setAttribute('data-background-type', type);
        
        // Re-enable transitions after a brief moment (for other elements)
        setTimeout(() => {
            body.style.transition = '';
        }, 50);
    }

    applyGradientBackground() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
        
        // Apply instantly without transitions
        document.body.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        document.body.style.backgroundAttachment = 'fixed';
    }

    applyPatternBackground() {
        const savedPattern = localStorage.getItem('background-pattern') || 'dots';
        this.applyPattern(savedPattern);
    }

    applyPattern(patternName) {
        if (!this.patterns[patternName]) return;

        const patternElement = document.createElement('div');
        patternElement.className = 'background-pattern';
        patternElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -2;
            opacity: 0.1;
            transition: none;
        `;

        this.patterns[patternName](patternElement);
        document.body.appendChild(patternElement);
        document.body.classList.add('pattern-bg');

        // Force immediate display
        patternElement.offsetHeight;

        localStorage.setItem('background-pattern', patternName);
    }

    generateDotsPattern(element) {
        element.style.background = `
            radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, white 2px, transparent 2px)
        `;
        element.style.backgroundSize = '50px 50px';
        element.style.backgroundPosition = '0 0, 25px 25px';
    }

    generateGridPattern(element) {
        element.style.background = `
            linear-gradient(white 1px, transparent 1px),
            linear-gradient(90deg, white 1px, transparent 1px)
        `;
        element.style.backgroundSize = '30px 30px';
    }

    generateWavesPattern(element) {
        const svg = `
            <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 30c15 0 15-30 30-30s15 30 30 30v30H0V30z" fill="white" opacity="0.3"/>
            </svg>
        `;
        const encodedSvg = encodeURIComponent(svg);
        element.style.backgroundImage = `url("data:image/svg+xml,${encodedSvg}")`;
        element.style.backgroundSize = '60px 60px';
    }

    generateHexagonPattern(element) {
        const svg = `
            <svg width="56" height="100" viewBox="0 0 56 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 66L0 50V16l28-16 28 16v34L28 66z" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
                <path d="M28 0L0 16v34l28 16 28-16V16L28 0z" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
            </svg>
        `;
        const encodedSvg = encodeURIComponent(svg);
        element.style.backgroundImage = `url("data:image/svg+xml,${encodedSvg}")`;
        element.style.backgroundSize = '56px 100px';
    }

    applyImageBackground() {
        const savedImage = localStorage.getItem('background-image');
        if (savedImage) {
            // Apply instantly without transitions
            document.body.style.background = `url(${savedImage}) center/cover no-repeat`;
            document.body.style.backgroundAttachment = 'fixed';
            document.body.classList.add('image-bg');
            
            // Force immediate application
            document.body.offsetHeight;
        }
    }

    applySolidBackground() {
        const savedColor = localStorage.getItem('background-solid-color') || '#0f172a';
        
        // Apply instantly without transitions
        document.body.style.background = savedColor;
        document.body.style.backgroundAttachment = 'fixed';
        document.body.classList.add('solid-bg');
        
        // Force immediate application
        document.body.offsetHeight;
    }

    applyLiveWallpaper() {
        // Clear any existing background styles
        document.body.style.background = '';
        document.body.style.backgroundImage = '';
        document.body.classList.remove('pattern-bg', 'image-bg', 'solid-bg');
        
        // Remove existing pattern elements
        const existingPattern = document.querySelector('.background-pattern');
        if (existingPattern) {
            existingPattern.remove();
        }
        
        // Ensure live wallpaper manager is available and initialized
        if (window.liveWallpaperManager) {
            console.log('🎬 Activating live wallpaper...');
            
            // Enable the live wallpaper
            window.liveWallpaperManager.enable();
            
            // Load saved wallpaper if available
            const savedWallpaper = localStorage.getItem('liveWallpaper');
            if (savedWallpaper) {
                console.log('🎬 Restoring saved live wallpaper:', savedWallpaper);
                window.liveWallpaperManager.setWallpaper(savedWallpaper);
            } else {
                // Default to particles if no saved wallpaper
                window.liveWallpaperManager.setWallpaper('particles');
            }
        } else {
            console.warn('Live wallpaper manager not available');
            // Fallback to gradient
            this.applyGradientBackground();
        }
    }

    handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.tracker.showNotification('Please select a valid image file', 'error');
            return;
        }

        // Check file size (max 20MB)
        if (file.size > 20 * 1024 * 1024) {
            this.tracker.showNotification('Image file too large. Please choose a file under 20MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            localStorage.setItem('background-image', imageData);
            localStorage.setItem('background-type', 'image');
            
            this.applyImageBackground();
            this.tracker.showNotification('Background image updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }

    updateSolidColor(color) {
        localStorage.setItem('background-solid-color', color);
        localStorage.setItem('background-type', 'solid');
        this.applySolidBackground();
    }

    // Initialize background on app load
    initializeBackground() {
        const backgroundType = localStorage.getItem('background-type') || 'gradient';
        this.applyBackground(backgroundType);
        
        // Set up a periodic check to ensure background persists
        this.setupBackgroundPersistence();
    }

    // Ensure background persists across view changes and dynamic content updates
    setupBackgroundPersistence() {
        // Check every 2 seconds if background is still applied
        setInterval(() => {
            this.checkAndRestoreBackground();
        }, 2000);
        
        // Also check when the page becomes visible again
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => this.checkAndRestoreBackground(), 100);
            }
        });
    }

    checkAndRestoreBackground() {
        const body = document.body;
        const expectedType = localStorage.getItem('background-type') || 'gradient';
        const currentType = body.getAttribute('data-background-type');
        
        // If the background type doesn't match or is missing, restore it
        if (currentType !== expectedType || !this.hasValidBackground()) {
            this.applyBackground(expectedType);
        }
    }

    hasValidBackground() {
        const body = document.body;
        const computedStyle = getComputedStyle(body);
        const backgroundType = localStorage.getItem('background-type') || 'gradient';
        
        switch (backgroundType) {
            case 'gradient':
                return computedStyle.background.includes('gradient') || computedStyle.backgroundImage.includes('gradient');
            case 'image':
                const savedImage = localStorage.getItem('background-image');
                return savedImage && (computedStyle.backgroundImage.includes('url') || body.style.background.includes('url'));
            case 'solid':
                return computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && computedStyle.backgroundColor !== 'transparent';
            case 'pattern':
                return document.querySelector('.background-pattern') !== null;
            default:
                return true;
        }
    }

    // Create background preview for settings
    createPatternPreview(patternName) {
        const preview = document.createElement('div');
        preview.style.cssText = `
            width: 60px;
            height: 60px;
            border-radius: 8px;
            border: 2px solid var(--glass-border);
            overflow: hidden;
            position: relative;
            background: var(--glass-bg);
        `;

        const patternDiv = document.createElement('div');
        patternDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.5;
        `;

        if (this.patterns[patternName]) {
            this.patterns[patternName](patternDiv);
        }

        preview.appendChild(patternDiv);
        return preview;
    }

    // Export/Import background settings
    exportBackgroundSettings() {
        return {
            type: localStorage.getItem('background-type'),
            pattern: localStorage.getItem('background-pattern'),
            image: localStorage.getItem('background-image'),
            solidColor: localStorage.getItem('background-solid-color')
        };
    }

    importBackgroundSettings(settings) {
        if (settings.type) localStorage.setItem('background-type', settings.type);
        if (settings.pattern) localStorage.setItem('background-pattern', settings.pattern);
        if (settings.image) localStorage.setItem('background-image', settings.image);
        if (settings.solidColor) localStorage.setItem('background-solid-color', settings.solidColor);
        
        this.initializeBackground();
    }
}

// Add CSS for background patterns
const backgroundStyles = document.createElement('style');
backgroundStyles.textContent = `
    body {
        background-attachment: fixed !important;
    }

    body.pattern-bg {
        position: relative;
    }

    body.image-bg {
        background-attachment: fixed !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
    }

    body.image-bg::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        z-index: -1;
        pointer-events: none;
    }

    body.solid-bg {
        background-attachment: fixed !important;
    }

    .background-pattern {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: -2 !important;
        animation: patternFloat 20s ease-in-out infinite;
    }

    @keyframes patternFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
    }

    /* Ensure content views don't interfere with background */
    .content-view {
        position: relative;
        z-index: 1;
    }

    .app-container {
        position: relative;
        z-index: 1;
    }

    /* Pattern options in settings */
    .pattern-option {
        position: relative;
        overflow: hidden;
    }

    .pattern-option::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.2;
        pointer-events: none;
    }

    .pattern-option[data-pattern="dots"]::before {
        background: radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px),
                   radial-gradient(circle at 75% 75%, currentColor 2px, transparent 2px);
        background-size: 20px 20px;
        background-position: 0 0, 10px 10px;
    }

    .pattern-option[data-pattern="grid"]::before {
        background: linear-gradient(currentColor 1px, transparent 1px),
                   linear-gradient(90deg, currentColor 1px, transparent 1px);
        background-size: 15px 15px;
    }

    .pattern-option[data-pattern="waves"]::before {
        background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20c10 0 10-20 20-20s10 20 20 20v20H0V20z' fill='%23ffffff' opacity='0.3'/%3E%3C/svg%3E");
        background-size: 40px 40px;
    }

    .pattern-option[data-pattern="hexagon"]::before {
        background-image: url("data:image/svg+xml,%3Csvg width='28' height='50' viewBox='0 0 28 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 33L0 25V8l14-8 14 8v17L14 33z' fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.3'/%3E%3C/svg%3E");
        background-size: 28px 50px;
    }
`;

document.head.appendChild(backgroundStyles);
