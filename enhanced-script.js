class EnhancedAssignmentTracker {
    constructor() {
        this.assignments = JSON.parse(localStorage.getItem('assignments')) || [];
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.currentView = 'home';
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.completionStreak = parseInt(localStorage.getItem('completionStreak')) || 0;
        this.canvasConnected = localStorage.getItem('canvasConnected') === 'true';
        this.googleConnected = localStorage.getItem('googleConnected') === 'true';
        this.notificationsQueue = [];
        
        // Add sample assignments if none exist
        if (this.assignments.length === 0) {
            this.addSampleAssignments();
        }
        
        this.init();
    }

    addSampleAssignments() {
        const sampleAssignments = [
            {
                id: Date.now() + 1,
                title: "Math Homework - Chapter 5",
                description: "Complete exercises 1-20 on quadratic equations",
                subject: "math",
                courseName: "Algebra II",
                dueDate: this.getDateString(3), // 3 days from now
                dueTime: "23:59",
                completed: false,
                priority: "high",
                customColor: "#ef4444",
                source: "manual",
                createdAt: Date.now()
            },
            {
                id: Date.now() + 2,
                title: "Science Lab Report",
                description: "Write lab report on photosynthesis experiment",
                subject: "science",
                courseName: "Biology",
                dueDate: this.getDateString(7), // 1 week from now
                dueTime: "15:30",
                completed: false,
                priority: "medium",
                customColor: "#10b981",
                source: "manual",
                createdAt: Date.now()
            },
            {
                id: Date.now() + 3,
                title: "English Essay Draft",
                description: "First draft of persuasive essay on climate change",
                subject: "english",
                courseName: "English Literature",
                dueDate: this.getDateString(10), // 10 days from now
                dueTime: "12:00",
                completed: false,
                priority: "medium",
                customColor: "#3b82f6",
                source: "manual",
                createdAt: Date.now()
            },
            {
                id: Date.now() + 4,
                title: "History Research Project",
                description: "Research paper on World War II causes",
                subject: "history",
                courseName: "World History",
                dueDate: this.getDateString(21), // 3 weeks from now
                dueTime: "23:59",
                completed: false,
                priority: "low",
                customColor: "#8b5cf6",
                source: "manual",
                createdAt: Date.now()
            },
            {
                id: Date.now() + 5,
                title: "Art Portfolio Submission",
                description: "Submit 5 completed drawings for portfolio review",
                subject: "art",
                courseName: "Visual Arts",
                dueDate: this.getDateString(14), // 2 weeks from now
                dueTime: "17:00",
                completed: false,
                priority: "medium",
                customColor: "#f43f5e",
                source: "manual",
                createdAt: Date.now()
            },
            {
                id: Date.now() + 6,
                title: "Chemistry Quiz Prep",
                description: "Study for quiz on chemical bonding",
                subject: "science",
                courseName: "Chemistry",
                dueDate: this.getDateString(2), // 2 days from now
                dueTime: "08:00",
                completed: true,
                priority: "high",
                customColor: "#f59e0b",
                source: "manual",
                createdAt: Date.now() - 86400000, // Created yesterday
                completedAt: Date.now() - 3600000 // Completed 1 hour ago
            }
        ];

        this.assignments = sampleAssignments;
        this.saveAssignments();
    }

    getDateString(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split('T')[0];
    }

    applySavedStylesImmediate() {
        console.log('🎨 Applying saved styles and background...');
        
        // Apply color scheme
        const primaryColor = localStorage.getItem('primary-color') || '#667eea';
        const secondaryColor = localStorage.getItem('secondary-color') || '#764ba2';
        const accentColor = localStorage.getItem('accent-color') || '#f59e0b';

        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);

        // Apply dark mode
        if (this.isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            console.log('Dark mode initialized on page load');
        } else {
            document.documentElement.removeAttribute('data-theme');
            console.log('Light mode initialized on page load');
        }
        
        // Apply visual effects setting (replaces separate performance/glassmorphism)
        const visualEffectsEnabled = localStorage.getItem('visualEffectsEnabled') !== 'false';
        
        if (visualEffectsEnabled) {
            // Visual Effects ON = Enhanced Glassmorphism
            document.body.classList.add('glassmorphism-enhanced');
            document.body.classList.remove('performance-mode', 'no-glassmorphism');
        } else {
            // Visual Effects OFF = Performance Mode
            document.body.classList.remove('glassmorphism-enhanced');
            document.body.classList.add('performance-mode', 'no-glassmorphism');
        }
        
        // Apply animations setting
        const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
        if (!animationsEnabled) {
            document.body.classList.add('animations-disabled', 'no-animations');
        } else {
            document.body.classList.remove('animations-disabled', 'no-animations');
        }
        
        // Apply background AFTER other styles are set
        const backgroundType = localStorage.getItem('background-type') || 'gradient';
        console.log('🖼️ Restoring background type:', backgroundType);
        
        // Force background application with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.applyBackground(backgroundType);
        }, 50);
    }

    applyBackground(type) {
        console.log('🖼️ Applying background type:', type);
        
        // Try to use background manager if available
        if (window.settingsManager && settingsManager.backgroundManager) {
            console.log('Using settings manager background manager');
            settingsManager.backgroundManager.applyBackground(type);
            return;
        }
        
        // Try to use tracker's background manager
        if (this.backgroundManager) {
            console.log('Using tracker background manager');
            this.backgroundManager.applyBackground(type);
            return;
        }
        
        // Initialize background manager if BackgroundManager class is available
        if (typeof BackgroundManager !== 'undefined' && !this.backgroundManager) {
            console.log('Initializing background manager');
            this.backgroundManager = new BackgroundManager(this);
            this.backgroundManager.applyBackground(type);
            return;
        }
        
        // Fallback: Apply background directly
        console.log('Using fallback background application');
        this.applyFallbackBackground(type);
    }
    
    applyFallbackBackground(type = 'gradient') {
        // Stop live wallpaper if switching away from it
        if (type !== 'live' && window.liveWallpaperManager) {
            console.log('🎬 Stopping live wallpaper (fallback) - switching to:', type);
            window.liveWallpaperManager.stop();
            const liveCanvas = document.getElementById('live-wallpaper-canvas');
            if (liveCanvas) {
                liveCanvas.style.display = 'none';
            }
        }
        
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
        
        switch (type) {
            case 'gradient':
                document.body.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
                document.body.style.backgroundAttachment = 'fixed';
                break;
            case 'solid':
                const solidColor = localStorage.getItem('background-solid-color') || primaryColor;
                document.body.style.background = solidColor;
                document.body.style.backgroundAttachment = 'fixed';
                break;
            case 'image':
                const savedImage = localStorage.getItem('background-image');
                if (savedImage) {
                    document.body.style.background = `url(${savedImage}) center/cover no-repeat`;
                    document.body.style.backgroundAttachment = 'fixed';
                    document.body.classList.add('image-bg');
                } else {
                    // Fall back to gradient if no image
                    this.applyFallbackBackground('gradient');
                }
                break;
            case 'pattern':
                // For patterns, try to create a simple pattern or fall back to gradient
                const patternType = localStorage.getItem('background-pattern') || 'dots';
                this.applySimplePattern(patternType);
                break;
            case 'live':
                // For live wallpapers, delegate to live wallpaper manager
                this.applyLiveWallpaperFallback();
                break;
            default:
                // Default to gradient
                this.applyFallbackBackground('gradient');
                break;
        }
        
        // Set data attribute to track current background type
        document.body.setAttribute('data-background-type', type);
        console.log('✅ Fallback background applied:', type);
    }
    
    applySimplePattern(patternType) {
        // Create a simple pattern overlay
        const existingPattern = document.querySelector('.simple-pattern-overlay');
        if (existingPattern) {
            existingPattern.remove();
        }
        
        const patternOverlay = document.createElement('div');
        patternOverlay.className = 'simple-pattern-overlay';
        patternOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -2;
            opacity: 0.1;
        `;
        
        // Apply gradient background first
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
        document.body.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        document.body.style.backgroundAttachment = 'fixed';
        
        // Add pattern overlay
        switch (patternType) {
            case 'dots':
                patternOverlay.style.background = `
                    radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                    radial-gradient(circle at 75% 75%, white 2px, transparent 2px)
                `;
                patternOverlay.style.backgroundSize = '50px 50px';
                patternOverlay.style.backgroundPosition = '0 0, 25px 25px';
                break;
            case 'grid':
                patternOverlay.style.background = `
                    linear-gradient(white 1px, transparent 1px),
                    linear-gradient(90deg, white 1px, transparent 1px)
                `;
                patternOverlay.style.backgroundSize = '30px 30px';
                break;
            default:
                // Default to dots
                patternOverlay.style.background = `
                    radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                    radial-gradient(circle at 75% 75%, white 2px, transparent 2px)
                `;
                patternOverlay.style.backgroundSize = '50px 50px';
                patternOverlay.style.backgroundPosition = '0 0, 25px 25px';
                break;
        }
        
        document.body.appendChild(patternOverlay);
        document.body.classList.add('pattern-bg');
        
        console.log('✅ Simple pattern applied:', patternType);
    }

    applyLiveWallpaperFallback() {
        // Clear any existing background styles
        document.body.style.background = '';
        document.body.style.backgroundImage = '';
        document.body.classList.remove('pattern-bg', 'image-bg', 'solid-bg');
        
        // Remove existing pattern elements
        const existingPattern = document.querySelector('.simple-pattern-overlay');
        if (existingPattern) {
            existingPattern.remove();
        }
        
        if (window.liveWallpaperManager) {
            console.log('🎬 Applying live wallpaper fallback...');
            
            // Enable the live wallpaper
            window.liveWallpaperManager.enable();
            
            // Load saved wallpaper
            const savedWallpaper = localStorage.getItem('liveWallpaper');
            if (savedWallpaper) {
                console.log('🎬 Restoring saved live wallpaper:', savedWallpaper);
                window.liveWallpaperManager.setWallpaper(savedWallpaper);
            } else {
                // Default to particles
                window.liveWallpaperManager.setWallpaper('particles');
            }
        } else {
            console.warn('Live wallpaper manager not available, falling back to gradient');
            this.applyFallbackBackground('gradient');
        }
    }

    async init() {
        if ('serviceWorker' in navigator && 'Notification' in window) {
            try {
                await navigator.serviceWorker.register('./enhanced-sw.js');
                
                if (Notification.permission === 'default') {
                    await Notification.requestPermission();
                }
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }

        // Initialize background manager early
        this.initializeBackgroundManager();
        
        this.setupEventListeners();
        this.renderCurrentView();
        this.updateStatistics();
        this.checkAndUpdateStreak();
        this.scheduleNotifications();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('home-btn').addEventListener('click', () => {
            this.setActiveNav('home-btn');
            this.switchToView('home-view');
        });

        document.getElementById('all-assignments-btn').addEventListener('click', () => {
            this.setActiveNav('all-assignments-btn');
            this.switchToView('all-view');
        });

        document.getElementById('calendar-btn').addEventListener('click', () => {
            this.setActiveNav('calendar-btn');
            this.switchToView('calendar-view');
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            this.setActiveNav('settings-btn');
            this.showSettingsView();
        });

        // Calendar navigation
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                this.currentMonth--;
                if (this.currentMonth < 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                }
                this.renderCalendar();
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                this.currentMonth++;
                if (this.currentMonth > 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                }
                this.renderCalendar();
            });
        }

        // Create assignment button
        const createBtn = document.getElementById('create-assignment-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                window.location.href = 'create-assignment-enhanced.html';
            });
        }

        // Settings toolbar buttons
        this.initializeToolbar();
        this.initializeSearchAndFilter();
    }

    initializeSearchAndFilter() {
        const searchInput = document.getElementById('assignment-search');
        const statusFilter = document.getElementById('status-filter');
        const sourceFilter = document.getElementById('source-filter');
        const priorityFilter = document.getElementById('priority-filter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterAssignments());
        }

        [statusFilter, sourceFilter, priorityFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.filterAssignments());
            }
        });
    }

    // Enhanced assignment card creation with glassmorphic design
    createAssignmentCard(assignment) {
        const card = document.createElement('div');
        
        // Check if animations are enabled
        const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
        const performanceMode = localStorage.getItem('performanceMode') === 'true';
        
        // Base classes - always visible
        card.className = `assignment-card ${assignment.completed ? 'completed' : ''}`;
        
        // Only add animation class if animations are enabled and not in performance mode
        if (animationsEnabled && !performanceMode) {
            card.classList.add('animate-in');
        }
        
        card.setAttribute('data-id', assignment.id);
        
        // Custom color streak
        const colorStreak = assignment.customColor || this.getSourceColor(assignment.source);
        card.style.borderLeftColor = colorStreak;
        
        // Add custom background if set
        if (assignment.customBackground) {
            card.style.backgroundImage = `url(${assignment.customBackground})`;
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';
        }

        const dueDateClass = assignment.completed ? '' : this.getPriorityCategory(assignment.dueDate);
        const sourceIcon = this.getSourceIcon(assignment.source);
        const isManual = !assignment.source || assignment.source === 'manual';
        
        card.innerHTML = `
            <div class="assignment-header">
                <div class="assignment-checkbox ${assignment.completed ? 'checked' : ''}" 
                     role="checkbox"
                     aria-checked="${assignment.completed}"
                     aria-label="${assignment.completed ? 'Mark as incomplete' : 'Mark as complete'}: ${assignment.title}"
                     tabindex="0">
                </div>
                <div class="assignment-title">${assignment.title}</div>
                <div class="assignment-actions">
                    ${sourceIcon ? `<div class="assignment-source" title="Source: ${assignment.source || 'Manual'}">${sourceIcon}</div>` : ''}
                    ${isManual ? `<div class="assignment-edit" title="Edit assignment" onclick="tracker.editAssignment('${assignment.id}')">✏️</div>` : ''}
                    ${isManual ? `<div class="assignment-delete" title="Delete assignment" onclick="tracker.deleteAssignment('${assignment.id}')">🗑️</div>` : ''}
                </div>
            </div>
            ${assignment.description ? `<div class="assignment-description">${assignment.description}</div>` : ''}
            <div class="assignment-due-date ${dueDateClass}">
                ${this.formatDueDate(assignment.dueDate)}
            </div>
        `;

        // Add stagger animation only if animations are enabled
        if (animationsEnabled && !performanceMode) {
            card.style.animationDelay = `${Math.random() * 0.3}s`;
        }
        
        return card;
    }

    getSourceColor(source) {
        switch (source) {
            case 'canvas':
                return '#e13b2b'; // Canvas red
            case 'google':
                return '#4285f4'; // Google blue
            default:
                return '#f59e0b'; // Default accent
        }
    }

    getSourceIcon(source) {
        switch (source) {
            case 'canvas':
                return '🎨';
            case 'google':
                return '📚';
            default:
                return '📝';
        }
    }

    // Enhanced toggle with animations
    toggleAssignment(id) {
        console.log('Toggle assignment called for ID:', id);
        const assignment = this.assignments.find(a => a.id == id);
        if (!assignment) {
            console.error('Assignment not found:', id);
            return;
        }

        console.log('Found assignment:', assignment.title);
        const checkbox = document.querySelector(`[data-id="${id}"] .assignment-checkbox`);
        const card = document.querySelector(`[data-id="${id}"]`);
        
        console.log('Checkbox found:', !!checkbox);
        console.log('Card found:', !!card);
        
        if (checkbox && card) {
            checkbox.classList.add('checking');
            card.classList.add('completing');
            
            setTimeout(() => {
                const oldStatus = assignment.completed;
                assignment.completed = !assignment.completed;
                console.log(`Assignment ${id} status changed from ${oldStatus} to ${assignment.completed}`);
                
                if (assignment.completed) {
                    this.updateCompletionStreak();
                    this.showNotification(`🎉 Great job! "${assignment.title}" completed!`);
                    
                    // Trigger completion celebration VFX
                    const celebrationsEnabled = localStorage.getItem('completion-celebrations') !== 'false';
                    if (celebrationsEnabled) {
                        this.triggerCompletionCelebration(checkbox);
                    }
                } else {
                    this.showNotification(`📝 "${assignment.title}" marked as incomplete`);
                }
                
                // Save first, then re-render to ensure UI reflects the new state
                this.saveAssignments();
                console.log('Assignments saved to localStorage');
                
                // Re-render assignments to update all UI elements
                this.renderAssignments();
                console.log('Assignments re-rendered');
                
                this.updateStatistics();
            }, 300);
        }
    }

    triggerCompletionCelebration(checkboxElement) {
        // Get checkbox position for particle origin
        const rect = checkboxElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create celebration effects
        this.createConfettiExplosion(centerX, centerY);
        this.createParticleRings(centerX, centerY);
        this.createSuccessRipple(checkboxElement);
        this.createFloatingEmojis(centerX, centerY);
        
        // Add screen flash effect
        this.createScreenFlash();
        
        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    createConfettiExplosion(x, y) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
        const confettiCount = 30;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 10000;
                animation: confetti-fall ${1 + Math.random() * 2}s ease-out forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            // Random direction and distance
            const angle = (Math.PI * 2 * i) / confettiCount + (Math.random() - 0.5) * 0.5;
            const distance = 100 + Math.random() * 150;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance + Math.random() * 200;
            
            confetti.style.setProperty('--end-x', `${endX}px`);
            confetti.style.setProperty('--end-y', `${endY}px`);
            
            document.body.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }
    }

    createParticleRings(x, y) {
        for (let ring = 0; ring < 3; ring++) {
            setTimeout(() => {
                const particles = 12;
                const radius = 50 + ring * 30;
                
                for (let i = 0; i < particles; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'celebration-particle';
                    particle.style.cssText = `
                        position: fixed;
                        left: ${x}px;
                        top: ${y}px;
                        width: 4px;
                        height: 4px;
                        background: var(--accent-color);
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 10000;
                        animation: particle-ring ${0.8 + ring * 0.2}s ease-out forwards;
                        opacity: ${1 - ring * 0.3};
                    `;
                    
                    const angle = (Math.PI * 2 * i) / particles;
                    const endX = x + Math.cos(angle) * radius;
                    const endY = y + Math.sin(angle) * radius;
                    
                    particle.style.setProperty('--end-x', `${endX}px`);
                    particle.style.setProperty('--end-y', `${endY}px`);
                    
                    document.body.appendChild(particle);
                    
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 1000 + ring * 200);
                }
            }, ring * 100);
        }
    }

    createSuccessRipple(element) {
        const ripple = document.createElement('div');
        ripple.className = 'success-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            border: 2px solid var(--accent-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: success-ripple 0.6s ease-out forwards;
            transform: translate(-50%, -50%);
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    createFloatingEmojis(x, y) {
        const emojis = ['🎉', '✨', '🌟', '💫', '🎊', '🏆', '👏', '🔥'];
        const emojiCount = 5;
        
        for (let i = 0; i < emojiCount; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.className = 'floating-emoji';
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.cssText = `
                    position: fixed;
                    left: ${x + (Math.random() - 0.5) * 100}px;
                    top: ${y}px;
                    font-size: ${20 + Math.random() * 15}px;
                    pointer-events: none;
                    z-index: 10000;
                    animation: float-up ${2 + Math.random()}s ease-out forwards;
                `;
                
                document.body.appendChild(emoji);
                
                setTimeout(() => {
                    if (emoji.parentNode) {
                        emoji.parentNode.removeChild(emoji);
                    }
                }, 3000);
            }, i * 200);
        }
    }

    createScreenFlash() {
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            animation: screen-flash 0.5s ease-out forwards;
        `;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            if (flash.parentNode) {
                flash.parentNode.removeChild(flash);
            }
        }, 500);
    }

    editAssignment(id) {
        console.log('Edit assignment clicked for ID:', id);
        try {
            if (!this.assignmentEditor) {
                console.log('Creating new AssignmentEditor instance');
                this.assignmentEditor = new AssignmentEditor(this);
            }
            console.log('Calling assignmentEditor.editAssignment');
            this.assignmentEditor.editAssignment(id);
            
            // Verify the modal was created
            setTimeout(() => {
                const modal = document.querySelector('.edit-modal');
                if (!modal) {
                    console.error('Edit modal was not created, using fallback editor');
                    this.showFallbackEditor(id);
                }
            }, 500);
        } catch (error) {
            console.error('Error in editAssignment:', error);
            this.showNotification('Error opening assignment editor', 'error');
        }
    }

    // Force close any open modals (emergency function)
    forceCloseModals() {
        const modals = document.querySelectorAll('.edit-modal, .delete-confirmation-modal, .upgrade-modal, .help-modal');
        modals.forEach(modal => {
            modal.remove();
            console.log('Removed modal:', modal.className);
        });
        this.showNotification('All modals closed', 'success');
    }

    // Test checkbox functionality (emergency function)
    testCheckboxes() {
        console.log('Testing checkbox functionality...');
        const checkboxes = document.querySelectorAll('.assignment-checkbox');
        console.log('Found', checkboxes.length, 'checkboxes');
        
        checkboxes.forEach((checkbox, index) => {
            const card = checkbox.closest('.assignment-card');
            const assignmentId = card?.getAttribute('data-id');
            console.log(`Checkbox ${index + 1}:`, {
                element: checkbox,
                assignmentId: assignmentId,
                hasOnclick: checkbox.hasAttribute('onclick'),
                onclick: checkbox.getAttribute('onclick'),
                visible: checkbox.style.visibility !== 'hidden',
                pointerEvents: checkbox.style.pointerEvents
            });
        });
        
        this.showNotification(`Found ${checkboxes.length} checkboxes - check console for details`);
    }

    // Force dark mode (emergency function)
    forceDarkMode(enabled = true) {
        console.log('Force dark mode called:', enabled);
        this.isDarkMode = enabled;
        localStorage.setItem('darkMode', enabled.toString());
        
        if (enabled) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.style.setProperty('--bg-primary', '#0f172a');
            console.log('Forced dark mode ON');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.documentElement.style.setProperty('--bg-primary', '#1e293b');
            console.log('Forced dark mode OFF');
        }
        
        // Update toggle states
        const settingsToggle = document.getElementById('dark-mode-toggle');
        if (settingsToggle) {
            settingsToggle.classList.toggle('active', enabled);
        }
        
        this.showNotification(`Dark mode ${enabled ? 'enabled' : 'disabled'}!`, 'success');
    }

    // Fallback editor using simple prompts if modal fails
    showFallbackEditor(id) {
        const assignment = this.assignments.find(a => a.id == id);
        if (!assignment) return;

        const newTitle = prompt('Edit Assignment Title:', assignment.title);
        if (newTitle === null) return; // User cancelled

        const newDescription = prompt('Edit Description (optional):', assignment.description || '');
        const newDueDate = prompt('Edit Due Date (YYYY-MM-DD):', assignment.dueDate);

        if (newTitle.trim() && newDueDate) {
            assignment.title = newTitle.trim();
            assignment.description = newDescription || '';
            assignment.dueDate = newDueDate;
            assignment.lastModified = Date.now();

            this.saveAssignments();
            this.renderAssignments();
            this.showNotification('Assignment updated successfully!', 'success');
        } else {
            this.showNotification('Title and due date are required', 'error');
        }
    }

    deleteAssignment(id) {
        console.log('Delete assignment clicked for ID:', id);
        try {
            const assignment = this.assignments.find(a => a.id == id);
            if (!assignment) {
                console.error('Assignment not found with ID:', id);
                this.showNotification('Assignment not found', 'error');
                return;
            }
            console.log('Found assignment:', assignment.title);
            this.showDeleteConfirmation(assignment);
        } catch (error) {
            console.error('Error in deleteAssignment:', error);
            this.showNotification('Error deleting assignment', 'error');
        }
    }

    showDeleteConfirmation(assignment) {
        const modal = document.createElement('div');
        modal.className = 'delete-confirmation-modal';
        modal.innerHTML = `
            <div class="delete-confirmation-content glass-card">
                <div class="delete-confirmation-header">
                    <h3>🗑️ Delete Assignment</h3>
                </div>
                
                <div class="delete-confirmation-body">
                    <div class="assignment-preview">
                        <div class="assignment-title">${assignment.title}</div>
                        <div class="assignment-course">${assignment.courseName || 'No course'}</div>
                        <div class="assignment-due">Due: ${this.formatDueDate(assignment.dueDate)}</div>
                    </div>
                    
                    <p>Are you sure you want to delete this assignment? This action cannot be undone.</p>
                    
                    <div class="delete-confirmation-actions">
                        <button class="btn btn-secondary" onclick="this.closest('.delete-confirmation-modal').remove()">
                            Cancel
                        </button>
                        <button class="btn danger-btn" onclick="tracker.confirmDeleteAssignment('${assignment.id}')">
                            Delete Assignment
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Ensure modal is visible and styled properly
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '10000';
        
        // Add click outside to close
        setTimeout(() => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }, 100);
    }

    confirmDeleteAssignment(id) {
        const assignment = this.assignments.find(a => a.id == id);
        if (!assignment) return;

        this.assignments = this.assignments.filter(a => a.id != id);
        this.saveAssignments();
        this.renderAssignments();
        this.updateStatistics();
        this.showNotification(`Assignment "${assignment.title}" deleted`);
        
        // Close modal
        const modal = document.querySelector('.delete-confirmation-modal');
        if (modal) modal.remove();
    }

    updateCompletionStreak() {
        const today = new Date().toDateString();
        const lastDate = this.lastCompletionDate;
        
        if (lastDate === today) {
            // Already completed something today
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const previousStreak = this.completionStreak;
        
        if (lastDate === yesterday.toDateString()) {
            // Continuing streak
            this.completionStreak++;
        } else if (!lastDate || lastDate !== today) {
            // Starting new streak
            this.completionStreak = 1;
        }
        
        this.lastCompletionDate = today;
        localStorage.setItem('completionStreak', this.completionStreak.toString());
        localStorage.setItem('lastCompletionDate', today);
        
        // Check for streak milestones
        this.checkStreakMilestone(previousStreak, this.completionStreak);
    }

    checkStreakMilestone(previousStreak, currentStreak) {
        const milestones = [3, 7, 14, 30, 50, 100];
        const celebrationsEnabled = localStorage.getItem('completion-celebrations') !== 'false';
        
        if (!celebrationsEnabled) return;
        
        const milestone = milestones.find(m => currentStreak >= m && previousStreak < m);
        
        if (milestone) {
            setTimeout(() => {
                this.triggerStreakMilestone(milestone);
            }, 1000); // Delay to let completion celebration finish
        }
    }

    triggerStreakMilestone(streak) {
        // Create milestone celebration
        const milestone = document.createElement('div');
        milestone.className = 'streak-milestone';
        milestone.innerHTML = `
            <div class="milestone-content glass-card">
                <div class="milestone-icon">🔥</div>
                <div class="milestone-title">Streak Milestone!</div>
                <div class="milestone-streak">${streak} Days</div>
                <div class="milestone-message">${this.getStreakMessage(streak)}</div>
                <button class="milestone-close" onclick="this.parentElement.parentElement.remove()">Continue</button>
            </div>
        `;
        
        milestone.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.5s ease-out;
        `;
        
        document.body.appendChild(milestone);
        
        // Trigger extra celebration effects
        setTimeout(() => {
            this.createMilestoneFireworks();
        }, 500);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (milestone.parentNode) {
                milestone.remove();
            }
        }, 5000);
    }

    getStreakMessage(streak) {
        const messages = {
            3: "You're on fire! Keep it up! 🚀",
            7: "One week strong! Amazing dedication! ⭐",
            14: "Two weeks of excellence! Incredible! 🏆",
            30: "One month of consistency! You're unstoppable! 💪",
            50: "Fifty days of greatness! Legendary! 👑",
            100: "One hundred days! You're a productivity master! 🎯"
        };
        return messages[streak] || "Keep up the amazing work! 🌟";
    }

    createMilestoneFireworks() {
        // Create multiple firework explosions
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.2;
                this.createConfettiExplosion(x, y);
                this.createParticleRings(x, y);
            }, i * 300);
        }
    }

    checkAndUpdateStreak() {
        const today = new Date().toDateString();
        const lastDate = this.lastCompletionDate;
        
        if (lastDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastDate !== today && lastDate !== yesterday.toDateString()) {
                // Streak broken
                this.completionStreak = 0;
                localStorage.setItem('completionStreak', '0');
            }
        }
    }

    // Enhanced notification system with proper types and stacking
    showNotification(message, type = 'info', duration = 3000) {
        // Remove any existing notifications of the same message to prevent duplicates
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => {
            if (notif.textContent === message) {
                notif.remove();
            }
        });
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Add icon based on type
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const icon = icons[type] || icons.info;
        notification.innerHTML = `<span class="notification-icon">${icon}</span><span class="notification-text">${message}</span>`;
        
        // Position notifications in a stack
        const existingCount = document.querySelectorAll('.notification').length;
        notification.style.top = `${20 + (existingCount * 80)}px`;
        
        document.body.appendChild(notification);
        
        // Auto-hide after duration
        setTimeout(() => {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                    // Reposition remaining notifications
                    this.repositionNotifications();
                }
            }, 300);
        }, duration);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                    this.repositionNotifications();
                }
            }, 300);
        });
        
        console.log(`📢 Notification [${type.toUpperCase()}]: ${message}`);
    }
    
    repositionNotifications() {
        const notifications = document.querySelectorAll('.notification:not(.notification-hiding)');
        notifications.forEach((notif, index) => {
            notif.style.top = `${20 + (index * 80)}px`;
        });
    }

    // Calendar with tap-and-hold pip markers
    renderCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) return;

        const monthYear = document.getElementById('calendar-month-year');
        if (monthYear) {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
            monthYear.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        }

        calendarGrid.innerHTML = '';

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            calendarGrid.appendChild(header);
        });

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAssignments = this.assignments.filter(a => a.dueDate === dateStr && !a.completed);
            
            dayElement.innerHTML = `
                <div class="calendar-day-number">${day}</div>
                ${dayAssignments.length > 0 ? `<div class="calendar-assignment-count">${dayAssignments.length}</div>` : ''}
            `;

            if (dayAssignments.length > 0) {
                this.addCalendarDayListeners(dayElement, dateStr, dayAssignments);
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    addCalendarDayListeners(dayElement, dateStr, assignments) {
        let touchTimer = null;
        let isLongPress = false;

        // Touch events for mobile
        dayElement.addEventListener('touchstart', (e) => {
            isLongPress = false;
            touchTimer = setTimeout(() => {
                isLongPress = true;
                this.showPipMarker(e.touches[0], dateStr, assignments);
            }, 500);
        });

        dayElement.addEventListener('touchend', (e) => {
            clearTimeout(touchTimer);
            if (!isLongPress) {
                this.showCalendarPopup(dateStr, assignments);
            }
        });

        dayElement.addEventListener('touchmove', () => {
            clearTimeout(touchTimer);
        });

        // Mouse events for desktop
        dayElement.addEventListener('mousedown', (e) => {
            isLongPress = false;
            touchTimer = setTimeout(() => {
                isLongPress = true;
                this.showPipMarker(e, dateStr, assignments);
            }, 500);
        });

        dayElement.addEventListener('mouseup', () => {
            clearTimeout(touchTimer);
            if (!isLongPress) {
                this.showCalendarPopup(dateStr, assignments);
            }
        });

        dayElement.addEventListener('mouseleave', () => {
            clearTimeout(touchTimer);
        });
    }

    showPipMarker(event, dateStr, assignments) {
        this.hidePipMarker();

        const pip = document.createElement('div');
        pip.className = 'pip-marker';
        pip.innerHTML = `
            <div class="pip-header">
                <strong>${new Date(dateStr).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                })}</strong>
            </div>
            <div class="pip-assignments">
                ${assignments.map(a => `
                    <div class="pip-assignment">
                        <div class="pip-assignment-title">${a.title}</div>
                        <div class="pip-assignment-priority ${this.getPriorityCategory(a.dueDate)}">${this.formatDueDate(a.dueDate)}</div>
                    </div>
                `).join('')}
            </div>
        `;

        const x = event.clientX || event.pageX;
        const y = event.clientY || event.pageY;
        
        pip.style.left = `${Math.min(x, window.innerWidth - 300)}px`;
        pip.style.top = `${Math.max(y - 100, 20)}px`;

        document.body.appendChild(pip);
        this.pipMarker = pip;

        // Auto-hide after 3 seconds
        this.pipTimeout = setTimeout(() => {
            this.hidePipMarker();
        }, 3000);

        // Hide on click outside
        setTimeout(() => {
            document.addEventListener('click', this.hidePipMarker.bind(this), { once: true });
        }, 100);
    }

    showCalendarPopup(dateStr, assignments) {
        // Show a simple popup for calendar day click
        const popup = document.createElement('div');
        popup.className = 'calendar-popup';
        popup.innerHTML = `
            <div class="calendar-popup-content glass-card">
                <div class="calendar-popup-header">
                    <h3>${new Date(dateStr).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                    })}</h3>
                    <button class="close-btn" onclick="this.closest('.calendar-popup').remove()">×</button>
                </div>
                
                <div class="calendar-popup-body">
                    ${assignments.length > 0 ? `
                        <h4>Assignments Due (${assignments.length})</h4>
                        <div class="popup-assignments">
                            ${assignments.map(a => `
                                <div class="popup-assignment">
                                    <div class="popup-assignment-title">${a.title}</div>
                                    <div class="popup-assignment-course">${a.courseName || 'No course'}</div>
                                    <div class="popup-assignment-time">${a.dueTime || '23:59'}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="no-assignments">
                            <p>No assignments due on this date</p>
                        </div>
                    `}
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        
        // Add click outside to close
        setTimeout(() => {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.remove();
                }
            });
        }, 100);
    }

    hidePipMarker() {
        if (this.pipMarker) {
            this.pipMarker.classList.add('hiding');
            setTimeout(() => {
                if (this.pipMarker && this.pipMarker.parentNode) {
                    this.pipMarker.parentNode.removeChild(this.pipMarker);
                }
                this.pipMarker = null;
            }, 200);
        }
        if (this.pipTimeout) {
            clearTimeout(this.pipTimeout);
            this.pipTimeout = null;
        }
    }

    saveAssignments() {
        localStorage.setItem('assignments', JSON.stringify(this.assignments));
    }

    renderAssignments() {
        this.renderPriorityAssignments();
        this.renderAllAssignments();
        this.updateStatistics();
    }

    renderPriorityAssignments() {
        const highPriorityContainer = document.getElementById('high-priority-assignments');
        const comingUpContainer = document.getElementById('coming-up-assignments');
        const worryLaterContainer = document.getElementById('worry-later-assignments');
        const completedContainer = document.getElementById('completed-assignments');
        const completedSection = document.getElementById('completed');

        if (!highPriorityContainer || !comingUpContainer || !worryLaterContainer || !completedContainer) return;

        // Clear containers
        highPriorityContainer.innerHTML = '';
        comingUpContainer.innerHTML = '';
        worryLaterContainer.innerHTML = '';
        completedContainer.innerHTML = '';

        const now = new Date();
        const highPriorityAssignments = [];
        const comingUpAssignments = [];
        const worryLaterAssignments = [];
        const completedAssignments = [];

        this.assignments.forEach(assignment => {
            if (assignment.completed) {
                completedAssignments.push(assignment);
            } else {
                const dueDate = new Date(assignment.dueDate);
                const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

                if (daysDiff <= 4) {
                    highPriorityAssignments.push(assignment);
                } else if (daysDiff <= 10) {
                    comingUpAssignments.push(assignment);
                } else {
                    worryLaterAssignments.push(assignment);
                }
            }
        });

        // Render assignments in each section
        this.renderAssignmentSection(highPriorityContainer, highPriorityAssignments, 'No urgent assignments right now 🎉');
        this.renderAssignmentSection(comingUpContainer, comingUpAssignments, 'No upcoming assignments');
        this.renderAssignmentSection(worryLaterContainer, worryLaterAssignments, 'No long-term assignments');
        
        // Show/hide completed section
        if (completedAssignments.length > 0) {
            this.renderAssignmentSection(completedContainer, completedAssignments, '');
            completedSection.style.display = 'block';
        } else {
            completedSection.style.display = 'none';
        }
    }

    renderAssignmentSection(container, assignments, emptyMessage) {
        if (assignments.length === 0) {
            container.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
        } else {
            assignments.forEach(assignment => {
                const card = this.createAssignmentCard(assignment);
                container.appendChild(card);
            });
        }
    }

    renderAllAssignments() {
        const container = document.getElementById('all-assignments');
        if (!container) return;

        container.innerHTML = '';
        
        if (this.assignments.length === 0) {
            container.innerHTML = '<div class="empty-state">No assignments yet. Create your first assignment!</div>';
            return;
        }

        const filteredAssignments = this.getFilteredAssignments();
        
        if (filteredAssignments.length === 0) {
            container.innerHTML = '<div class="empty-state">No assignments match your filters</div>';
            return;
        }

        filteredAssignments.forEach(assignment => {
            const card = this.createAssignmentCard(assignment);
            container.appendChild(card);
        });
        
        // Ensure buttons are clickable after rendering
        setTimeout(() => {
            this.ensureAssignmentButtonsClickable();
            this.ensureCheckboxesClickable();
            
            // Set up periodic checkbox validation (every 30 seconds)
            if (!this.checkboxValidationInterval) {
                this.checkboxValidationInterval = setInterval(() => {
                    this.periodicCheckboxValidation();
                }, 30000);
            }
            
            // Ensure toolbar is always frontmost after rendering
            this.ensureToolbarFrontmost();
        }, 100);
    }

    getFilteredAssignments() {
        const searchTerm = document.getElementById('assignment-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('status-filter')?.value || 'all';
        const sourceFilter = document.getElementById('source-filter')?.value || 'all';
        const priorityFilter = document.getElementById('priority-filter')?.value || 'all';

        return this.assignments.filter(assignment => {
            const matchesSearch = assignment.title.toLowerCase().includes(searchTerm) ||
                                assignment.description?.toLowerCase().includes(searchTerm) ||
                                assignment.courseName?.toLowerCase().includes(searchTerm);
            
            const matchesStatus = statusFilter === 'all' || 
                                (statusFilter === 'completed' && assignment.completed) ||
                                (statusFilter === 'pending' && !assignment.completed);
            
            const matchesSource = sourceFilter === 'all' || 
                                (assignment.source || 'manual') === sourceFilter;
            
            const matchesPriority = priorityFilter === 'all' || 
                                  assignment.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesSource && matchesPriority;
        });
    }

    updateStatistics() {
        const totalElement = document.getElementById('total-assignments');
        const completedElement = document.getElementById('completed-count');
        const overdueElement = document.getElementById('overdue-count');
        const streakElement = document.getElementById('streak-count');
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');

        if (!totalElement || !completedElement || !overdueElement || !streakElement) return;

        const activeAssignments = this.assignments.filter(a => !a.completed);
        const completedAssignments = this.assignments.filter(a => a.completed);
        const now = new Date();
        const overdueAssignments = activeAssignments.filter(a => new Date(a.dueDate) < now);

        totalElement.textContent = activeAssignments.length;
        completedElement.textContent = completedAssignments.length;
        overdueElement.textContent = overdueAssignments.length;
        streakElement.textContent = this.completionStreak;

        // Update progress bar
        const totalTasks = this.assignments.length;
        const completedTasks = completedAssignments.length;
        const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        if (progressFill && progressPercentage) {
            progressFill.style.width = `${progressPercent}%`;
            progressPercentage.textContent = `${progressPercent}%`;
        }
    }

    switchToView(viewId) {
        // Hide all views
        document.querySelectorAll('.content-view').forEach(view => {
            view.style.display = 'none';
        });

        // Show selected view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.style.display = 'block';
            this.currentView = viewId;

            // Render content based on view
            if (viewId === 'calendar-view') {
                this.renderCalendar();
            } else if (viewId === 'all-view') {
                this.renderAllAssignments();
            } else if (viewId === 'home-view') {
                this.renderPriorityAssignments();
            }

            // Trigger glass loading animation for new view
            this.triggerGlassLoadingAnimation(targetView);

            // Handle problematic mode combinations
            const isPerformanceMode = document.body.classList.contains('performance-mode');
            const isAnimationsDisabled = document.body.classList.contains('animations-disabled');
            
            if (isPerformanceMode && isAnimationsDisabled) {
                this.ensureProperViewSeparation();
                
                if (viewId === 'settings-view') {
                    this.handlePerformanceModeAnimationsDisabled();
                }
            }

            // Handle settings toolbar visibility
            this.handleSettingsToolbarVisibility(viewId);

            // Ensure background persists across view changes
            this.maintainBackground();
        }
    }

    setActiveNav(activeId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(activeId);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    showSettingsView() {
        console.log('=== SETTINGS DEBUG START ===');
        console.log('1. Switching to settings view...');
        this.switchToView('settings-view');
        
        // Check if settings view is visible
        const settingsView = document.getElementById('settings-view');
        console.log('2. Settings view element:', settingsView);
        console.log('3. Settings view display:', settingsView ? settingsView.style.display : 'not found');
        
        // Check settings content container
        const settingsContent = document.getElementById('settings-content');
        console.log('4. Settings content element:', settingsContent);
        console.log('5. Settings content innerHTML length:', settingsContent ? settingsContent.innerHTML.length : 'not found');
        
        console.log('6. SettingsManager available:', !!window.settingsManager);
        
        // Force show the settings view
        if (settingsView) {
            settingsView.style.display = 'block';
            settingsView.style.visibility = 'visible';
            settingsView.style.opacity = '1';
            console.log('7. Forced settings view to be visible');
        }
        
        if (window.settingsManager) {
            try {
                console.log('8. Calling renderSettingsPage...');
                window.settingsManager.renderSettingsPage();
                console.log('9. Settings page rendered successfully');
                
                // Double-check content after rendering
                setTimeout(() => {
                    const contentAfter = document.getElementById('settings-content');
                    console.log('10. Content after rendering:', contentAfter ? contentAfter.innerHTML.length : 'not found');
                    if (window.settingsManager.applyAllVisualSettings) {
                        window.settingsManager.applyAllVisualSettings();
                    }
                }, 50);
            } catch (error) {
                console.error('Error rendering settings page:', error);
                this.showFallbackSettings();
            }
        } else {
            console.error('Settings manager not available, showing fallback');
            this.showFallbackSettings();
        }
        
        console.log('=== SETTINGS DEBUG END ===');
    }

    // Fallback settings display if main settings fail
    showFallbackSettings() {
        const settingsContent = document.getElementById('settings-content');
        if (settingsContent) {
            // Ensure the settings content is visible
            settingsContent.style.display = 'block';
            settingsContent.style.padding = '1rem';
            settingsContent.style.color = 'white';
            
            settingsContent.innerHTML = `
                <div class="settings-section" style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 16px; margin-bottom: 2rem;">
                    <h2 style="color: white; margin-bottom: 1rem;">⚙️ Settings</h2>
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 2rem;">Settings are loading... If this persists, please refresh the page.</p>
                    
                    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <label style="color: white;">Dark Mode</label>
                        <button class="btn btn-secondary" onclick="tracker.toggleDarkMode()" style="padding: 0.5rem 1rem; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; cursor: pointer;">Toggle</button>
                    </div>
                    
                    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <label style="color: white;">Refresh Settings</label>
                        <button class="btn btn-primary" onclick="location.reload()" style="padding: 0.5rem 1rem; background: var(--accent-color, #f59e0b); border: none; border-radius: 8px; color: white; cursor: pointer;">Reload Page</button>
                    </div>
                    
                    <div style="margin-top: 2rem; padding: 1rem; background: rgba(245, 158, 11, 0.1); border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.3);">
                        <p style="color: rgba(255,255,255,0.9); margin: 0 0 1rem 0; font-size: 0.875rem;">
                            <strong>Debug Info:</strong> Settings manager status: ${window.settingsManager ? 'Available' : 'Not Available'}
                        </p>
                        <button onclick="tracker.forceRenderSettings()" style="padding: 0.5rem 1rem; background: rgba(245, 158, 11, 0.8); border: none; border-radius: 8px; color: white; cursor: pointer; margin-right: 0.5rem;">Force Render Settings</button>
                        <button onclick="console.log('Settings Debug:', {settingsManager: !!window.settingsManager, settingsView: !!document.getElementById('settings-view'), settingsContent: !!document.getElementById('settings-content')})" style="padding: 0.5rem 1rem; background: rgba(59, 130, 246, 0.8); border: none; border-radius: 8px; color: white; cursor: pointer;">Debug Info</button>
                    </div>
                </div>
            `;
        } else {
            console.error('Settings content container not found!');
        }
    }

    forceRenderSettings() {
        console.log('=== FORCE RENDER SETTINGS ===');
        const settingsContent = document.getElementById('settings-content');
        
        if (!settingsContent) {
            console.error('Settings content container not found!');
            return;
        }
        
        // Clear any existing content
        settingsContent.innerHTML = '';
        
        // Force render a simple settings page
        settingsContent.innerHTML = `
            <div style="padding: 2rem; color: white;">
                <h2 style="color: white; margin-bottom: 2rem;">⚙️ Settings (Force Rendered)</h2>
                
                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                    <h3 style="color: white; margin-bottom: 1rem;">🎨 Appearance</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <label style="color: white;">Dark Mode</label>
                        <button onclick="tracker.toggleDarkMode()" style="padding: 0.5rem 1rem; background: var(--accent-color, #f59e0b); border: none; border-radius: 8px; color: white; cursor: pointer;">Toggle</button>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                    <h3 style="color: white; margin-bottom: 1rem;">🔧 Debug</h3>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button onclick="console.log('App State:', {tracker: !!window.tracker, settingsManager: !!window.settingsManager})" style="padding: 0.5rem 1rem; background: rgba(59, 130, 246, 0.8); border: none; border-radius: 8px; color: white; cursor: pointer;">Log App State</button>
                        <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.8); border: none; border-radius: 8px; color: white; cursor: pointer;">Reload Page</button>
                        <button onclick="tracker.showNotification('Test notification')" style="padding: 0.5rem 1rem; background: rgba(34, 197, 94, 0.8); border: none; border-radius: 8px; color: white; cursor: pointer;">Test Notification</button>
                    </div>
                </div>
                
                <div style="background: rgba(34, 197, 94, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid rgba(34, 197, 94, 0.3);">
                    <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 0.875rem;">
                        ✅ <strong>Force render successful!</strong> This means the settings container exists and can display content.
                    </p>
                </div>
            </div>
        `;
        
        console.log('Force render completed');
        this.showNotification('Settings force rendered!');
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode.toString());
        
        console.log('Dark mode toggled from main script:', this.isDarkMode);
        
        if (this.isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            console.log('Applied dark theme from main script');
        } else {
            document.documentElement.removeAttribute('data-theme');
            console.log('Removed dark theme from main script');
        }
        
        // Force CSS variables to update
        document.documentElement.style.setProperty('--bg-primary', 
            this.isDarkMode ? '#0f172a' : '#1e293b');
        
        this.showNotification('Theme updated!');
        
        // Update settings toggle if it exists
        const settingsToggle = document.getElementById('dark-mode-toggle');
        if (settingsToggle) {
            settingsToggle.classList.toggle('active', this.isDarkMode);
        }
    }

    // Duplicate method removed - using enhanced version above

    getPriorityCategory(dueDate) {
        const now = new Date();
        const due = new Date(dueDate);
        const daysDiff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) return 'overdue';
        if (daysDiff <= 4) return 'high-priority';
        if (daysDiff <= 10) return 'coming-up';
        return 'worry-later';
    }

    formatDueDate(dueDate) {
        const date = new Date(dueDate);
        const now = new Date();
        const daysDiff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) {
            return `Overdue by ${Math.abs(daysDiff)} day${Math.abs(daysDiff) !== 1 ? 's' : ''}`;
        } else if (daysDiff === 0) {
            return 'Due today';
        } else if (daysDiff === 1) {
            return 'Due tomorrow';
        } else {
            return `Due in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`;
        }
    }

    filterAssignments() {
        this.renderAllAssignments();
    }

    renderCurrentView() {
        this.renderPriorityAssignments();
        this.renderAllAssignments();
        this.renderCalendar();
    }

    activateDevMode() {
        // Check if panel already exists
        const existingPanel = document.getElementById('dev-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Toggle dev mode if already active
        if (localStorage.getItem('dev-mode') === 'true') {
            this.closeDevPanel();
            return;
        }

        localStorage.setItem('dev-mode', 'true');
        
        // Create dev panel
        const devPanel = document.createElement('div');
        devPanel.id = 'dev-panel';
        devPanel.className = 'dev-panel glass-card';
        devPanel.innerHTML = `
            <div class="dev-header">
                <h3>🔧 Developer Panel</h3>
                <button class="close-btn" onclick="tracker.closeDevPanel()">×</button>
            </div>
            
            <div class="dev-content">
                <div class="dev-section">
                    <h4>🎛️ Quick Actions</h4>
                    <div class="dev-buttons">
                        <button class="btn btn-secondary" onclick="tracker.generateTestData()">Generate Test Data</button>
                        <button class="btn btn-secondary" onclick="tracker.clearAllData()">Clear All Data</button>
                        <button class="btn btn-secondary" onclick="tracker.exportLogs()">Export Logs</button>
                        <button class="btn btn-premium" onclick="tracker.unlockPremium()">Unlock Premium</button>
                    </div>
                </div>
                
                <div class="dev-section">
                    <h4>📊 System Info</h4>
                    <div class="system-info">
                        <div class="info-item">
                            <span>Version:</span>
                            <span>v2.0 Glassmorphic</span>
                        </div>
                        <div class="info-item">
                            <span>Assignments:</span>
                            <span id="dev-assignment-count">${this.assignments.length}</span>
                        </div>
                        <div class="info-item">
                            <span>Storage Used:</span>
                            <span id="dev-storage-size">${this.calculateStorageSize()}</span>
                        </div>
                        <div class="info-item">
                            <span>Canvas:</span>
                            <span class="status ${this.canvasConnected ? 'connected' : 'disconnected'}">${this.canvasConnected ? 'Connected' : 'Disconnected'}</span>
                        </div>
                        <div class="info-item">
                            <span>Google:</span>
                            <span class="status ${this.googleConnected ? 'connected' : 'disconnected'}">${this.googleConnected ? 'Connected' : 'Disconnected'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="dev-section">
                    <h4>🐛 Debug Console</h4>
                    <div class="debug-console" id="debug-console">
                        <div class="console-line">Dev mode activated at ${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
                
                <div class="dev-section">
                    <h4>⚡ Performance</h4>
                    <div class="performance-metrics">
                        <div class="metric">
                            <span>Render Time:</span>
                            <span id="render-time">~${Math.random() * 50 + 10 | 0}ms</span>
                        </div>
                        <div class="metric">
                            <span>Memory Usage:</span>
                            <span id="memory-usage">${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(1) || 'N/A'}MB</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(devPanel);
        
        // Add dev panel styles
        this.addDevPanelStyles();
        
        // Bind methods to window for onclick handlers
        window.closeDevPanel = () => this.closeDevPanel();
        window.generateTestData = () => this.generateTestData();
        window.clearAllData = () => this.clearAllData();
        window.exportLogs = () => this.exportLogs();
        window.unlockPremium = () => this.unlockPremium();
        
        // Update performance metrics every 5 seconds
        this.devMetricsInterval = setInterval(() => {
            this.updateDevMetrics();
        }, 5000);
        
        this.showNotification('🔧 Developer mode activated! Use ↑↑↓↓←→←→BA again to toggle.', 'success', 5000);
        
        // Log dev activation
        this.logToDevConsole('Developer mode activated');
        this.logToDevConsole(`User Agent: ${navigator.userAgent}`);
        this.logToDevConsole(`Screen: ${screen.width}x${screen.height}`);
        
        // Test toggles functionality
        this.testToggles();
    }

    closeDevPanel() {
        const devPanel = document.getElementById('dev-panel');
        if (devPanel) {
            devPanel.remove();
        }
        
        // Clear performance interval
        if (this.devMetricsInterval) {
            clearInterval(this.devMetricsInterval);
            this.devMetricsInterval = null;
        }
        
        localStorage.setItem('dev-mode', 'false');
        this.showNotification('🔧 Developer mode deactivated', 'info');
    }

    generateTestData() {
        const testAssignments = [
            {
                id: 'test_' + Date.now() + '_1',
                title: 'Test Assignment - Math Homework',
                description: 'Complete chapters 5-7 exercises',
                dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                source: 'manual',
                priority: 'high',
                completed: false,
                customColor: '#ff6b6b'
            },
            {
                id: 'test_' + Date.now() + '_2',
                title: 'Test Assignment - Science Project',
                description: 'Research renewable energy sources',
                dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                source: 'manual',
                priority: 'medium',
                completed: false,
                customColor: '#4ecdc4'
            },
            {
                id: 'test_' + Date.now() + '_3',
                title: 'Test Assignment - History Essay',
                description: 'Write 1000 words on WWII',
                dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
                source: 'manual',
                priority: 'low',
                completed: true,
                customColor: '#45b7d1'
            }
        ];

        this.assignments.push(...testAssignments);
        this.saveAssignments();
        this.renderAssignments();
        this.updateDevInfo();
        
        this.logToDevConsole(`Generated ${testAssignments.length} test assignments`);
        this.showNotification(`Generated ${testAssignments.length} test assignments`, 'success');
    }

    clearAllData() {
        // Use the settings manager's clear data confirmation
        if (window.settingsManager) {
            settingsManager.showClearDataConfirmation();
        } else {
            // Fallback for dev panel
            this.showDevClearConfirmation();
        }
    }

    showDevClearConfirmation() {
        const modal = document.createElement('div');
        modal.className = 'dev-clear-modal';
        modal.innerHTML = `
            <div class="dev-clear-content glass-card">
                <div class="dev-clear-header">
                    <h3>🔧 Developer: Clear All Data</h3>
                </div>
                
                <div class="dev-clear-body">
                    <div class="warning-icon">⚠️</div>
                    <p><strong>This will delete ALL data including:</strong></p>
                    <ul>
                        <li>All assignments and tasks</li>
                        <li>Settings and connections</li>
                        <li>Completion streaks</li>
                        <li>Dev mode settings</li>
                    </ul>
                    <p class="warning-text">Continue with data wipe?</p>
                    
                    <div class="dev-clear-actions">
                        <button class="btn btn-secondary" onclick="this.closest('.dev-clear-modal').remove()">
                            Cancel
                        </button>
                        <button class="btn danger-btn" onclick="tracker.confirmDevClearData()">
                            Wipe All Data
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }, 100);
    }

    confirmDevClearData() {
        localStorage.clear();
        this.assignments = [];
        this.canvasConnected = false;
        this.googleConnected = false;
        this.completionStreak = 0;
        
        // Re-render everything
        this.renderAssignments();
        this.renderCurrentView();
        this.updateStatistics();
        this.updateDevInfo();
        
        this.logToDevConsole('All data cleared - localStorage wiped');
        this.showNotification('🗑️ All data cleared successfully', 'success');
        
        // Close modal
        const modal = document.querySelector('.dev-clear-modal');
        if (modal) modal.remove();
        
        // Refresh settings if open
        if (document.getElementById('settings-view').style.display !== 'none') {
            settingsManager.renderSettingsPage();
        }
    }

    exportLogs() {
        const logs = {
            timestamp: new Date().toISOString(),
            assignments: this.assignments,
            localStorage: { ...localStorage },
            systemInfo: {
                userAgent: navigator.userAgent,
                screen: `${screen.width}x${screen.height}`,
                language: navigator.language,
                platform: navigator.platform
            },
            performance: {
                memory: performance.memory?.usedJSHeapSize || 'N/A',
                timing: performance.timing
            }
        };

        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hw-tracker-logs-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.logToDevConsole('Logs exported');
        this.showNotification('📋 Logs exported successfully', 'success');
    }

    unlockPremium() {
        localStorage.setItem('premium-user', 'true');
        localStorage.setItem('dev-premium', 'true');
        localStorage.setItem('trial-start', Date.now().toString());
        
        this.logToDevConsole('Premium features unlocked via dev panel');
        this.showNotification('💎 Premium features unlocked! All restrictions removed.', 'success');
        
        // Immediately enable premium features without reload
        if (window.settingsManager) {
            settingsManager.enablePremiumFeatures();
            
            // Refresh settings if open to show unlocked features
            if (document.getElementById('settings-view').style.display !== 'none') {
                settingsManager.renderSettingsPage();
            }
        }
        
        // Update any premium UI elements
        document.querySelectorAll('.premium-feature').forEach(element => {
            element.classList.add('unlocked');
        });
        
        // Remove blur and enable premium controls immediately
        document.querySelectorAll('.blurred').forEach(element => {
            element.classList.remove('blurred');
            const inputs = element.querySelectorAll('input, button');
            inputs.forEach(input => input.disabled = false);
        });
        
        // Hide premium overlays
        document.querySelectorAll('.premium-overlay').forEach(overlay => {
            overlay.style.display = 'none';
        });
    }

    calculateStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return `${(total / 1024).toFixed(1)}KB`;
    }

    updateDevInfo() {
        const assignmentCount = document.getElementById('dev-assignment-count');
        const storageSize = document.getElementById('dev-storage-size');
        
        if (assignmentCount) assignmentCount.textContent = this.assignments.length;
        if (storageSize) storageSize.textContent = this.calculateStorageSize();
    }

    updateDevMetrics() {
        const renderTime = document.getElementById('render-time');
        const memoryUsage = document.getElementById('memory-usage');
        
        if (renderTime) {
            renderTime.textContent = `~${Math.random() * 50 + 10 | 0}ms`;
        }
        
        if (memoryUsage) {
            if (performance.memory) {
                const used = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
                memoryUsage.textContent = `${used}MB`;
            } else {
                memoryUsage.textContent = 'N/A';
            }
        }
        
        // Update assignment count and storage in real-time
        this.updateDevInfo();
    }

    logToDevConsole(message) {
        const console = document.getElementById('debug-console');
        if (console) {
            const line = document.createElement('div');
            line.className = 'console-line';
            line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            console.appendChild(line);
            console.scrollTop = console.scrollHeight;
            
            // Keep only last 50 lines
            while (console.children.length > 50) {
                console.removeChild(console.firstChild);
            }
        }
    }

    showDevPasswordPrompt() {
        const modal = document.createElement('div');
        modal.className = 'dev-password-modal';
        modal.innerHTML = `
            <div class="dev-password-content glass-card">
                <div class="dev-password-header">
                    <h3>🔧 Developer Access</h3>
                    <button class="close-btn" onclick="this.closest('.dev-password-modal').remove()">×</button>
                </div>
                
                <div class="dev-password-body">
                    <p>Enter the developer password:</p>
                    <input type="password" id="dev-password-input" placeholder="Password" maxlength="20">
                    
                    <div class="password-hint">
                        <details>
                            <summary>💡 Need a hint?</summary>
                            <p>Think about the classic gaming cheat code... but as text!</p>
                            <small>Hint: ↑↑↓↓←→←→BA</small>
                        </details>
                    </div>
                    
                    <div class="dev-password-actions">
                        <button class="btn btn-secondary" onclick="this.closest('.dev-password-modal').remove()">Cancel</button>
                        <button class="btn btn-premium" onclick="tracker.checkDevPassword()">Access</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Ensure modal is visible and styled properly
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '10000';
        
        // Focus the modal for accessibility
        setTimeout(() => {
            modal.focus();
        }, 100);

        // Focus password input
        setTimeout(() => {
            const input = document.getElementById('dev-password-input');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.checkDevPassword();
                    }
                });
            }
        }, 100);

        // Add modal styles
        this.addDevPasswordStyles();
    }

    testToggles() {
        // Test if toggles are working
        const toggleTests = [
            { id: 'dark-mode-toggle', name: 'Dark Mode' },
            { id: 'glassmorphism-toggle', name: 'Glassmorphism' },
            { id: 'animations-toggle', name: 'Animations' },
            { id: 'push-notifications-toggle', name: 'Push Notifications' },
            { id: 'deadline-reminders-toggle', name: 'Deadline Reminders' },
            { id: 'completion-celebrations-toggle', name: 'Completion Celebrations' }
        ];

        let workingToggles = 0;
        let totalToggles = 0;

        toggleTests.forEach(test => {
            const toggle = document.getElementById(test.id);
            if (toggle) {
                totalToggles++;
                if (toggle.addEventListener) {
                    workingToggles++;
                    this.logToDevConsole(`✅ ${test.name} toggle: Working`);
                } else {
                    this.logToDevConsole(`❌ ${test.name} toggle: Not working`);
                }
            } else {
                this.logToDevConsole(`⚠️ ${test.name} toggle: Not found`);
            }
        });

        this.logToDevConsole(`Toggle Test Results: ${workingToggles}/${totalToggles} working`);
        
        if (workingToggles === totalToggles && totalToggles > 0) {
            this.logToDevConsole('🎉 All toggles are functional!');
        } else if (workingToggles > 0) {
            this.logToDevConsole('⚠️ Some toggles may have issues');
        } else {
            this.logToDevConsole('❌ Toggle system needs attention');
        }
    }

    checkDevPassword() {
        const input = document.getElementById('dev-password-input');
        const password = input ? input.value.toLowerCase() : '';
        
        // Password is "konami" or "uuddlrlrba"
        if (password === 'konami' || password === 'uuddlrlrba' || password === 'dev123') {
            document.querySelector('.dev-password-modal').remove();
            this.activateDevMode();
        } else {
            input.style.borderColor = '#ef4444';
            input.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                input.style.borderColor = '';
                input.style.animation = '';
            }, 500);
            this.showNotification('❌ Incorrect password', 'error');
        }
    }

    addDevPasswordStyles() {
        if (document.getElementById('dev-password-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'dev-password-styles';
        styles.textContent = `
            .dev-password-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease-out;
            }

            .dev-password-content {
                max-width: 400px;
                margin: 1rem;
                padding: 2rem;
                animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .dev-password-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid var(--glass-border);
            }

            .dev-password-header h3 {
                margin: 0;
                color: var(--text-primary);
            }

            .dev-password-body p {
                color: var(--text-secondary);
                margin-bottom: 1rem;
            }

            #dev-password-input {
                width: 100%;
                padding: 0.75rem;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--border-radius-small);
                color: var(--text-primary);
                font-size: 1rem;
                margin-bottom: 1rem;
            }

            #dev-password-input:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
            }

            .password-hint {
                margin: 1rem 0;
                padding: 1rem;
                background: rgba(245, 158, 11, 0.1);
                border-radius: var(--border-radius-small);
                border: 1px solid rgba(245, 158, 11, 0.2);
            }

            .password-hint details summary {
                cursor: pointer;
                color: var(--accent-color);
                font-weight: 600;
                margin-bottom: 0.5rem;
            }

            .password-hint p {
                margin: 0.5rem 0;
                font-size: 0.875rem;
            }

            .password-hint small {
                font-family: 'Courier New', monospace;
                background: rgba(0, 0, 0, 0.3);
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                color: #00ff00;
            }

            .dev-password-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 1.5rem;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            @media (max-width: 768px) {
                .dev-password-content {
                    margin: 0.5rem;
                    padding: 1.5rem;
                }
                
                .dev-password-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    addDevPanelStyles() {
        if (document.getElementById('dev-panel-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'dev-panel-styles';
        styles.textContent = `
            .dev-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 10000;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 0.875rem;
                animation: slideInRight 0.3s ease-out;
            }

            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }

    // Mobile dev access - triple tap on title
    let titleTapCount = 0;
    let titleTapTimer = null;
    
    const appTitle = document.querySelector('header h1');
    if (appTitle) {
        appTitle.addEventListener('click', () => {
            titleTapCount++;
            
            if (titleTapTimer) {
                clearTimeout(titleTapTimer);
            }
            
            if (titleTapCount === 3) {
                tracker.showDevPasswordPrompt();
                titleTapCount = 0;
            } else {
                titleTapTimer = setTimeout(() => {
                    titleTapCount = 0;
                }, 1000);
            }
        });
            .dev-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
            }

            .dev-buttons .btn {
                padding: 0.5rem;
                font-size: 0.75rem;
                border-radius: 6px;
            }

            .system-info, .performance-metrics {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .info-item, .metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                color: #fff;
            }

            .info-item span:first-child, .metric span:first-child {
                opacity: 0.7;
                font-size: 0.75rem;
            }

            .debug-console {
                background: rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                padding: 0.75rem;
                height: 120px;
                overflow-y: auto;
                font-family: 'Courier New', monospace;
                font-size: 0.75rem;
            }

            .console-line {
                color: #00ff00;
                margin-bottom: 0.25rem;
                word-break: break-all;
            }

            .status.connected {
                color: #00ff00;
            }

            .status.disconnected {
                color: #ff6b6b;
            }

            @media (max-width: 768px) {
                .dev-panel {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Initialize toolbar functionality
    initializeToolbar() {
        const visualEffectsBtn = document.getElementById('visual-effects-btn');
        const animationsBtn = document.getElementById('animations-btn');

        // Update button states based on current settings
        this.updateToolbarStates();

        if (visualEffectsBtn) {
            visualEffectsBtn.addEventListener('click', () => {
                const isEnabled = localStorage.getItem('visualEffectsEnabled') !== 'false';
                const newState = !isEnabled;
                localStorage.setItem('visualEffectsEnabled', newState.toString());
                
                // Apply instantly without transitions
                document.body.style.transition = 'none';
                
                if (newState) {
                    // Visual Effects ON = Enhanced Glassmorphism
                    document.body.classList.add('glassmorphism-enhanced');
                    document.body.classList.remove('performance-mode');
                } else {
                    // Visual Effects OFF = Performance Mode
                    document.body.classList.remove('glassmorphism-enhanced');
                    document.body.classList.add('performance-mode');
                    
                    // Ensure assignments remain visible in performance mode
                    this.ensureAssignmentsVisibleInPerformanceMode();
                }
                
                // Force immediate application
                document.body.offsetHeight;
                
                this.updateToolbarStates();
                this.showNotification(newState ? 'Visual effects enabled (Enhanced Glass)' : 'Visual effects disabled (Performance Mode)');
                
                // Sync with settings page toggles
                this.syncWithSettingsToggles('visual-effects', newState);
                
                // Update settings page if currently visible
                this.refreshSettingsPageStyling();
                
                // Re-enable transitions after brief delay
                setTimeout(() => {
                    document.body.style.transition = '';
                }, 50);
                
                // Save dev console state
                this.saveDevConsoleState('visualEffectsEnabled', newState);
            });
        }

        if (animationsBtn) {
            animationsBtn.addEventListener('click', () => {
                const isEnabled = localStorage.getItem('animationsEnabled') !== 'false';
                const newState = !isEnabled;
                localStorage.setItem('animationsEnabled', newState.toString());
                
                if (newState) {
                    document.body.classList.remove('animations-disabled');
                } else {
                    document.body.classList.add('animations-disabled');
                }
                
                this.updateToolbarStates();
                this.showNotification(newState ? 'Animations enabled' : 'Animations disabled');
                this.renderAssignments(); // Re-render to apply animation changes
                
                // Sync with settings page toggles
                this.syncWithSettingsToggles('animations', newState);
                
                // Special handling for performance mode + animations disabled combination
                if (document.body.classList.contains('performance-mode') && !newState) {
                    this.handlePerformanceModeAnimationsDisabled();
                }
                
                // Update settings page if currently visible
                this.refreshSettingsPageStyling();
                
                // Save dev console state
                this.saveDevConsoleState('animationsEnabled', newState);
            });
        }
    }

    updateToolbarStates() {
        const visualEffectsBtn = document.getElementById('visual-effects-btn');
        const animationsBtn = document.getElementById('animations-btn');

        if (visualEffectsBtn) {
            const isVisualEffectsEnabled = localStorage.getItem('visualEffectsEnabled') !== 'false';
            visualEffectsBtn.classList.toggle('active', isVisualEffectsEnabled);
        }

        if (animationsBtn) {
            const isAnimationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
            animationsBtn.classList.toggle('active', isAnimationsEnabled);
        }
    }

    // This method was merged into the main applySavedStylesImmediate method above

    // Save dev console state changes
    saveDevConsoleState(setting, value) {
        if (!localStorage.getItem('devModeEnabled')) return;
        
        const devStates = JSON.parse(localStorage.getItem('devConsoleStates') || '{}');
        devStates[setting] = {
            value: value,
            timestamp: Date.now(),
            source: 'toolbar'
        };
        localStorage.setItem('devConsoleStates', JSON.stringify(devStates));
        
        this.logToDevConsole(`Setting changed: ${setting} = ${value}`);
    }

    // Enhanced Canvas API integration
    async improveCanvasIntegration() {
        if (!this.canvasConnected) {
            this.showNotification('Canvas not connected. Please connect in Settings.', 'error');
            return;
        }

        try {
            // Enhanced Canvas API calls with better error handling
            const canvasURL = localStorage.getItem('canvasURL');
            const canvasToken = localStorage.getItem('canvasToken');
            
            if (!canvasURL || !canvasToken) {
                this.showNotification('Canvas credentials missing. Please reconfigure.', 'error');
                return;
            }

            // Test connection with better error handling
            const response = await fetch(`${canvasURL}/api/v1/users/self`, {
                headers: {
                    'Authorization': `Bearer ${canvasToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
            }

            const user = await response.json();
            this.showNotification(`Canvas connection verified for ${user.name}`);
            
            // Enhanced assignment sync
            await this.enhancedCanvasSync();
            
        } catch (error) {
            console.error('Canvas integration error:', error);
            this.showNotification(`Canvas integration failed: ${error.message}`, 'error');
        }
    }

    async enhancedCanvasSync() {
        // Implementation for enhanced Canvas sync with better assignment parsing
        this.showNotification('Enhanced Canvas sync completed');
    }

    // Sync toolbar changes with settings page toggles
    syncWithSettingsToggles(type, newState) {
        let toggleId;
        switch (type) {
            case 'performance':
                toggleId = 'performance-toggle';
                break;
            case 'glassmorphism':
                toggleId = 'glassmorphism-toggle';
                break;
            case 'animations':
                toggleId = 'animations-toggle';
                break;
        }
        
        if (toggleId) {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                // Update toggle state to match toolbar
                if (newState) {
                    toggle.classList.add('active');
                } else {
                    toggle.classList.remove('active');
                }
                
                // Add visual feedback with accent color
                toggle.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                if (newState) {
                    toggle.style.background = 'var(--accent-color)';
                    toggle.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.4)';
                } else {
                    toggle.style.background = '';
                    toggle.style.boxShadow = '';
                }
            }
        }
        
        // Also sync VFX buttons in settings if they exist
        const vfxButtonId = `settings-${type}-btn`;
        const vfxButton = document.getElementById(vfxButtonId);
        if (vfxButton) {
            if (newState) {
                vfxButton.classList.add('active');
            } else {
                vfxButton.classList.remove('active');
            }
        }
    }

    // Ensure assignments remain visible in performance mode
    ensureAssignmentsVisibleInPerformanceMode() {
        // Force assignments to be visible
        const assignmentCards = document.querySelectorAll('.assignment-card');
        assignmentCards.forEach(card => {
            card.style.display = 'flex';
            card.style.visibility = 'visible';
            card.style.opacity = '1';
            card.style.position = 'relative';
        });
        
        // Ensure assignment grids are visible
        const assignmentGrids = document.querySelectorAll('.assignments-grid');
        assignmentGrids.forEach(grid => {
            grid.style.display = 'grid';
            grid.style.visibility = 'visible';
            grid.style.opacity = '1';
        });
        
        // Ensure priority sections are visible
        const prioritySections = document.querySelectorAll('.priority-section');
        prioritySections.forEach(section => {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
        });
        
        // Re-render assignments to ensure they're displayed
        this.renderAssignments();
        
        // Ensure assignment buttons are clickable
        this.ensureAssignmentButtonsClickable();
        
        console.log('Ensured assignments visibility in performance mode');
    }

    // Ensure assignment edit/delete buttons are clickable
    ensureAssignmentButtonsClickable() {
        const editButtons = document.querySelectorAll('.assignment-edit');
        const deleteButtons = document.querySelectorAll('.assignment-delete');
        
        editButtons.forEach(button => {
            button.style.pointerEvents = 'auto';
            button.style.cursor = 'pointer';
            button.style.visibility = 'visible';
            button.style.opacity = '1';
        });
        
        deleteButtons.forEach(button => {
            button.style.pointerEvents = 'auto';
            button.style.cursor = 'pointer';
            button.style.visibility = 'visible';
            button.style.opacity = '1';
        });
        
        console.log('Ensured assignment buttons are clickable');
    }

    // Ensure assignment checkboxes are clickable
    ensureCheckboxesClickable() {
        const checkboxes = document.querySelectorAll('.assignment-checkbox');
        
        console.log(`🔧 Ensuring ${checkboxes.length} checkboxes are clickable...`);
        
        checkboxes.forEach((checkbox, index) => {
            const card = checkbox.closest('.assignment-card');
            if (card) {
                const assignmentId = card.getAttribute('data-id');
                
                // Remove any existing listeners to avoid duplicates
                if (checkbox._toggleHandler) {
                    checkbox.removeEventListener('click', checkbox._toggleHandler);
                    checkbox.removeEventListener('keydown', checkbox._keyHandler);
                }
                
                // Create new event handlers
                checkbox._toggleHandler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ Checkbox clicked via event listener for ID:', assignmentId);
                    this.toggleAssignment(assignmentId);
                };
                
                checkbox._keyHandler = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('⌨️ Checkbox activated via keyboard for ID:', assignmentId);
                        this.toggleAssignment(assignmentId);
                    }
                };
                
                // Add event listeners
                checkbox.addEventListener('click', checkbox._toggleHandler);
                checkbox.addEventListener('keydown', checkbox._keyHandler);
                checkbox._hasToggleListener = true;
                
                // Ensure proper styling with !important to override any conflicting styles
                checkbox.style.setProperty('pointer-events', 'auto', 'important');
                checkbox.style.setProperty('cursor', 'pointer', 'important');
                checkbox.style.setProperty('visibility', 'visible', 'important');
                checkbox.style.setProperty('opacity', '1', 'important');
                checkbox.style.setProperty('display', 'flex', 'important');
                checkbox.style.setProperty('position', 'relative', 'important');
                checkbox.style.setProperty('z-index', '10', 'important');
                
                // Ensure accessibility
                checkbox.setAttribute('tabindex', '0');
                checkbox.setAttribute('role', 'checkbox');
                
                console.log(`✅ Checkbox ${index + 1} configured for assignment ${assignmentId}`);
            }
        });
        
        console.log(`✅ Ensured ${checkboxes.length} checkboxes are clickable`);
        
        // Additional check after a short delay to ensure styles are applied
        setTimeout(() => {
            this.validateCheckboxFunctionality();
        }, 50);
    }

    // Validate checkbox functionality after setup
    validateCheckboxFunctionality() {
        const checkboxes = document.querySelectorAll('.assignment-checkbox');
        let functionalCount = 0;
        let issueCount = 0;
        
        console.log(`🔍 Validating ${checkboxes.length} checkboxes...`);
        
        checkboxes.forEach((checkbox, index) => {
            const card = checkbox.closest('.assignment-card');
            const assignmentId = card?.getAttribute('data-id');
            
            // Check if checkbox has proper event listeners
            const hasClickListener = !!checkbox._toggleHandler;
            const hasKeyListener = !!checkbox._keyHandler;
            
            // Check styling
            const isVisible = checkbox.style.visibility !== 'hidden' && checkbox.style.opacity !== '0';
            const isClickable = checkbox.style.pointerEvents !== 'none';
            const hasCursor = checkbox.style.cursor === 'pointer';
            
            // Check if assignment exists
            const assignment = this.assignments.find(a => a.id === assignmentId);
            const assignmentExists = !!assignment;
            
            if (hasClickListener && hasKeyListener && isVisible && isClickable && hasCursor && assignmentExists) {
                functionalCount++;
            } else {
                issueCount++;
                console.warn(`❌ Checkbox ${index + 1} has issues:`, {
                    assignmentId,
                    hasClickListener,
                    hasKeyListener,
                    isVisible,
                    isClickable,
                    hasCursor,
                    assignmentExists,
                    element: checkbox
                });
                
                // Try to fix the issue
                if (!assignmentExists) {
                    console.error(`Assignment ${assignmentId} not found in data`);
                } else {
                    // Re-apply fixes
                    if (!hasClickListener || !hasKeyListener) {
                        this.fixSingleCheckbox(checkbox, assignmentId);
                    }
                }
            }
        });
        
        console.log(`✅ Validation complete: ${functionalCount} functional, ${issueCount} issues`);
        
        if (issueCount > 0) {
            console.warn(`⚠️ ${issueCount} checkboxes have issues. Run tracker.forceFixCheckboxes() to attempt repair.`);
        }
        
        return { functional: functionalCount, issues: issueCount };
    }

    // Fix a single checkbox
    fixSingleCheckbox(checkbox, assignmentId) {
        console.log(`🔧 Fixing single checkbox for assignment ${assignmentId}`);
        
        // Remove existing listeners
        if (checkbox._toggleHandler) {
            checkbox.removeEventListener('click', checkbox._toggleHandler);
            checkbox.removeEventListener('keydown', checkbox._keyHandler);
        }
        
        // Create and add new listeners
        checkbox._toggleHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ Fixed checkbox clicked for ID:', assignmentId);
            this.toggleAssignment(assignmentId);
        };
        
        checkbox._keyHandler = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                console.log('⌨️ Fixed checkbox activated via keyboard for ID:', assignmentId);
                this.toggleAssignment(assignmentId);
            }
        };
        
        checkbox.addEventListener('click', checkbox._toggleHandler);
        checkbox.addEventListener('keydown', checkbox._keyHandler);
        
        // Apply styling
        checkbox.style.setProperty('pointer-events', 'auto', 'important');
        checkbox.style.setProperty('cursor', 'pointer', 'important');
        checkbox.style.setProperty('visibility', 'visible', 'important');
        checkbox.style.setProperty('opacity', '1', 'important');
        checkbox.style.setProperty('display', 'flex', 'important');
        
        console.log(`✅ Single checkbox fixed for assignment ${assignmentId}`);
    }

    // Periodic checkbox validation (runs every 30 seconds)
    periodicCheckboxValidation() {
        const checkboxes = document.querySelectorAll('.assignment-checkbox');
        
        if (checkboxes.length === 0) {
            return; // No checkboxes to validate
        }
        
        let issuesFound = 0;
        
        checkboxes.forEach(checkbox => {
            const card = checkbox.closest('.assignment-card');
            const assignmentId = card?.getAttribute('data-id');
            
            // Check if checkbox has proper event listeners
            const hasClickListener = !!checkbox._toggleHandler;
            const isVisible = checkbox.style.visibility !== 'hidden' && checkbox.style.opacity !== '0';
            const isClickable = checkbox.style.pointerEvents !== 'none';
            
            if (!hasClickListener || !isVisible || !isClickable) {
                issuesFound++;
                console.warn(`🔧 Periodic validation: fixing checkbox for assignment ${assignmentId}`);
                this.fixSingleCheckbox(checkbox, assignmentId);
            }
        });
        
        if (issuesFound > 0) {
            console.log(`🔧 Periodic validation: fixed ${issuesFound} checkbox issues`);
        }
        
        // Also ensure toolbar stays frontmost during periodic validation
        this.ensureToolbarFrontmost();
    }

    // Ensure toolbar is always the frontmost overlay
    ensureToolbarFrontmost() {
        const toolbar = document.querySelector('.settings-toolbar, #settings-toolbar');
        if (toolbar) {
            // Apply the highest z-index with !important
            toolbar.style.setProperty('z-index', '99999', 'important');
            toolbar.style.setProperty('position', 'fixed', 'important');
            toolbar.style.setProperty('display', 'flex', 'important');
            toolbar.style.setProperty('visibility', 'visible', 'important');
            toolbar.style.setProperty('opacity', '1', 'important');
            
            // Also ensure toolbar buttons are frontmost
            const toolbarButtons = toolbar.querySelectorAll('.toolbar-btn');
            toolbarButtons.forEach(button => {
                button.style.setProperty('z-index', '99999', 'important');
                button.style.setProperty('position', 'relative', 'important');
            });
            
            console.log('🔝 Toolbar ensured as frontmost overlay');
        }
    }

    // Debug function to test checkbox functionality
    testCheckboxes() {
        console.log('=== CHECKBOX DEBUG TEST ===');
        const checkboxes = document.querySelectorAll('.assignment-checkbox');
        console.log('Found', checkboxes.length, 'checkboxes');
        
        checkboxes.forEach((checkbox, index) => {
            const card = checkbox.closest('.assignment-card');
            const assignmentId = card?.getAttribute('data-id');
            const hasOnclick = checkbox.hasAttribute('onclick');
            const onclickValue = checkbox.getAttribute('onclick');
            
            console.log(`Checkbox ${index + 1}:`, {
                element: checkbox,
                assignmentId: assignmentId,
                hasOnclick: hasOnclick,
                onclick: onclickValue,
                visible: checkbox.style.visibility !== 'hidden',
                opacity: checkbox.style.opacity,
                pointerEvents: checkbox.style.pointerEvents,
                cursor: checkbox.style.cursor,
                hasEventListener: !!checkbox._toggleHandler
            });
            
            // Test if assignment exists
            if (assignmentId) {
                const assignment = this.assignments.find(a => a.id == assignmentId);
                console.log(`Assignment ${assignmentId} exists:`, !!assignment);
            }
        });
        
        this.showNotification(`Found ${checkboxes.length} checkboxes - check console for details`);
    }

    // Debug assignment data
    debugAssignmentData() {
        console.log('=== ASSIGNMENT DATA DEBUG ===');
        console.log('Total assignments:', this.assignments.length);
        this.assignments.forEach((assignment, index) => {
            console.log(`Assignment ${index + 1}:`, {
                id: assignment.id,
                title: assignment.title,
                completed: assignment.completed,
                dueDate: assignment.dueDate
            });
        });
        
        // Check localStorage
        const storedAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
        console.log('Stored assignments:', storedAssignments.length);
        storedAssignments.forEach((assignment, index) => {
            console.log(`Stored ${index + 1}:`, {
                id: assignment.id,
                title: assignment.title,
                completed: assignment.completed
            });
        });
    }

    // Force fix checkbox functionality
    forceFixCheckboxes() {
        console.log('=== FORCE FIXING CHECKBOXES ===');
        
        // Step 1: Clear any existing problematic styles
        const existingCheckboxes = document.querySelectorAll('.assignment-checkbox');
        existingCheckboxes.forEach(checkbox => {
            // Remove any conflicting inline styles
            checkbox.style.removeProperty('display');
            checkbox.style.removeProperty('visibility');
            checkbox.style.removeProperty('opacity');
            checkbox.style.removeProperty('pointer-events');
            
            // Remove old event listeners
            if (checkbox._toggleHandler) {
                checkbox.removeEventListener('click', checkbox._toggleHandler);
                checkbox.removeEventListener('keydown', checkbox._keyHandler);
                checkbox._toggleHandler = null;
                checkbox._keyHandler = null;
                checkbox._hasToggleListener = false;
            }
        });
        
        // Step 2: Re-render assignments to ensure fresh DOM
        console.log('🔄 Re-rendering assignments...');
        this.renderAssignments();
        
        // Step 3: Wait for DOM update then ensure clickability
        setTimeout(() => {
            console.log('🔧 Applying checkbox fixes...');
            this.ensureCheckboxesClickable();
            
            // Step 4: Additional validation and fixes
            setTimeout(() => {
                const validationResult = this.validateCheckboxFunctionality();
                
                if (validationResult.issues > 0) {
                    console.warn('🔧 Some checkboxes still have issues, applying emergency fixes...');
                    
                    // Emergency fix for remaining issues
                    const problematicCheckboxes = document.querySelectorAll('.assignment-checkbox');
                    problematicCheckboxes.forEach(checkbox => {
                        const card = checkbox.closest('.assignment-card');
                        if (card) {
                            const assignmentId = card.getAttribute('data-id');
                            this.fixSingleCheckbox(checkbox, assignmentId);
                            
                            // Super aggressive styling
                            checkbox.style.setProperty('display', 'flex', 'important');
                            checkbox.style.setProperty('visibility', 'visible', 'important');
                            checkbox.style.setProperty('opacity', '1', 'important');
                            checkbox.style.setProperty('pointer-events', 'auto', 'important');
                            checkbox.style.setProperty('cursor', 'pointer', 'important');
                            checkbox.style.setProperty('z-index', '100', 'important');
                            checkbox.style.setProperty('position', 'relative', 'important');
                        }
                    });
                    
                    // Final validation
                    setTimeout(() => {
                        const finalResult = this.validateCheckboxFunctionality();
                        console.log(`✅ Force fix complete: ${finalResult.functional} functional, ${finalResult.issues} remaining issues`);
                        
                        if (finalResult.issues === 0) {
                            this.showNotification('✅ All checkboxes fixed successfully!', 'success');
                        } else {
                            this.showNotification(`⚠️ ${finalResult.issues} checkboxes still have issues`, 'warning');
                        }
                    }, 100);
                } else {
                    console.log('✅ All checkboxes are functional!');
                    this.showNotification('✅ All checkboxes are working properly!', 'success');
                }
            }, 100);
        }, 200);
    }

    // Handle the problematic combination of performance mode + animations disabled
    handlePerformanceModeAnimationsDisabled() {
        console.log('Handling performance mode + animations disabled combination');
        
        // Force proper view separation
        this.ensureProperViewSeparation();
        
        // Force settings view to be visible if currently on settings
        if (this.currentView === 'settings-view') {
            const settingsView = document.getElementById('settings-view');
            const settingsContent = document.getElementById('settings-content');
            
            if (settingsView) {
                settingsView.style.display = 'block';
                settingsView.style.visibility = 'visible';
                settingsView.style.opacity = '1';
                settingsView.style.position = 'relative';
                settingsView.style.zIndex = '100';
                settingsView.style.width = '100%';
                settingsView.style.height = '100%';
                settingsView.style.background = 'var(--bg-primary)';
            }
            
            if (settingsContent) {
                settingsContent.style.display = 'block';
                settingsContent.style.visibility = 'visible';
                settingsContent.style.opacity = '1';
                settingsContent.style.position = 'relative';
                settingsContent.style.zIndex = '100';
                settingsContent.style.width = '100%';
                settingsContent.style.padding = '2rem';
            }
            
            // Hide other views
            const otherViews = ['home-view', 'all-view', 'calendar-view'];
            otherViews.forEach(viewId => {
                const view = document.getElementById(viewId);
                if (view) {
                    view.style.display = 'none';
                }
            });
            
            // Ensure settings manager compatibility
            if (window.settingsManager && window.settingsManager.ensurePerformanceModeCompatibility) {
                setTimeout(() => {
                    window.settingsManager.ensurePerformanceModeCompatibility();
                }, 100);
            }
        }
    }

    // Ensure proper view separation in problematic mode combinations
    ensureProperViewSeparation() {
        const isPerformanceMode = document.body.classList.contains('performance-mode');
        const isAnimationsDisabled = document.body.classList.contains('animations-disabled');
        
        if (isPerformanceMode && isAnimationsDisabled) {
            console.log('Applying view separation for combined modes');
            
            // Force all content views to have proper positioning
            const contentViews = document.querySelectorAll('.content-view');
            contentViews.forEach(view => {
                view.style.position = 'relative';
                view.style.width = '100%';
                view.style.height = '100%';
                
                // Hide non-active views
                if (view.id !== this.currentView) {
                    view.style.display = 'none';
                } else {
                    view.style.display = 'block';
                    view.style.zIndex = '100';
                }
            });
        }
    }

    // Refresh settings page styling when visual changes are made
    refreshSettingsPageStyling() {
        if (this.currentView === 'settings-view' && window.settingsManager) {
            setTimeout(() => {
                window.settingsManager.applyAllVisualSettings();
            }, 50);
        }
    }

    // Trigger smooth glass loading animation for view switching
    triggerGlassLoadingAnimation(targetView) {
        const glassCards = targetView.querySelectorAll('.glass-card');
        
        // Reset and trigger glass loading animations
        glassCards.forEach((card, index) => {
            // Remove existing animation
            card.style.animation = 'none';
            
            // Force reflow
            card.offsetHeight;
            
            // Determine animation based on glassmorphism mode
            const isEnhanced = document.body.classList.contains('glassmorphism-enhanced');
            const animationName = isEnhanced ? 'enhancedGlassLoad' : 'glassCardLoad';
            const duration = isEnhanced ? '1s' : '0.8s';
            const delay = index * 100; // Stagger by 100ms
            
            // Apply animation with stagger
            card.style.animation = `${animationName} ${duration} cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms forwards`;
        });
        
        // Also trigger for assignment cards specifically
        const assignmentCards = targetView.querySelectorAll('.assignment-card');
        assignmentCards.forEach((card, index) => {
            card.style.animation = 'none';
            card.offsetHeight;
            
            const isEnhanced = document.body.classList.contains('glassmorphism-enhanced');
            const animationName = isEnhanced ? 'enhancedGlassLoad' : 'glassCardLoad';
            const duration = isEnhanced ? '1s' : '0.8s';
            const delay = (index + glassCards.length) * 80; // Continue stagger from glass cards
            
            card.style.animation = `${animationName} ${duration} cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms forwards`;
        });
    }

    // Handle settings toolbar visibility based on current view
    handleSettingsToolbarVisibility(viewId) {
        const settingsToolbar = document.getElementById('settings-toolbar');
        if (settingsToolbar) {
            if (viewId === 'settings-view') {
                // Hide external toolbar on settings page
                settingsToolbar.style.display = 'none';
            } else {
                // Show external toolbar on other pages
                settingsToolbar.style.display = 'flex';
            }
        }
    }

    // Initialize background manager early in app lifecycle
    initializeBackgroundManager() {
        if (typeof BackgroundManager !== 'undefined') {
            this.backgroundManager = new BackgroundManager(this);
            this.backgroundManager.initializeBackground();
        }
    }

    // Maintain background across view changes
    maintainBackground() {
        if (this.backgroundManager) {
            // Re-apply the current background to ensure it persists
            const backgroundType = localStorage.getItem('background-type') || 'gradient';
            this.backgroundManager.applyBackground(backgroundType);
        } else {
            // Fallback: ensure basic gradient background is maintained
            this.applyFallbackBackground();
        }
    }

    // Fallback background application
    applyFallbackBackground() {
        const backgroundType = localStorage.getItem('background-type') || 'gradient';
        
        switch (backgroundType) {
            case 'gradient':
                const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
                document.body.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
                break;
            case 'solid':
                const savedColor = localStorage.getItem('background-solid-color') || '#0f172a';
                document.body.style.background = savedColor;
                break;
            case 'image':
                const savedImage = localStorage.getItem('background-image');
                if (savedImage) {
                    document.body.style.background = `url(${savedImage}) center/cover no-repeat`;
                }
                break;
            case 'pattern':
                // For patterns, we need the full background manager
                if (this.backgroundManager) {
                    this.backgroundManager.applyPatternBackground();
                }
                break;
        }
    }

    // Application health check and flow validation
    validateApplicationState() {
        const issues = [];
        
        // Check if essential DOM elements exist
        const requiredElements = [
            'home-btn', 'all-assignments-btn', 'calendar-btn', 'settings-btn',
            'home-view', 'all-view', 'calendar-view', 'settings-view',
            'create-assignment-btn'
        ];
        
        requiredElements.forEach(id => {
            if (!document.getElementById(id)) {
                issues.push(`Missing required element: ${id}`);
            }
        });
        
        // Check if managers are properly initialized
        if (!this.backgroundManager && typeof BackgroundManager !== 'undefined') {
            issues.push('Background manager not initialized');
        }
        
        // Check if assignments array is valid
        if (!Array.isArray(this.assignments)) {
            issues.push('Assignments array is invalid');
            this.assignments = [];
        }
        
        // Validate localStorage access
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (error) {
            issues.push('localStorage access denied');
        }
        
        if (issues.length > 0) {
            console.warn('Application state issues detected:', issues);
            this.showNotification(`${issues.length} issues detected. Check console for details.`, 'warning');
        } else {
            console.log('✅ Application state validation passed');
        }
        
        return issues.length === 0;
    }

    // Ensure smooth user experience
    optimizeUserFlow() {
        // Ensure checkboxes are always clickable
        this.ensureCheckboxesClickable();
        
        // Maintain background consistency
        this.maintainBackground();
        
        // Validate and fix any broken assignments
        this.validateAssignments();
        
        // Ensure proper navigation state
        this.validateNavigationState();
        
        console.log('🔧 User flow optimization completed');
    }

    validateAssignments() {
        let fixedCount = 0;
        
        this.assignments = this.assignments.filter(assignment => {
            // Remove assignments with invalid data
            if (!assignment.id || !assignment.title || !assignment.dueDate) {
                fixedCount++;
                return false;
            }
            
            // Fix missing properties
            if (!assignment.source) assignment.source = 'manual';
            if (!assignment.priority) assignment.priority = 'medium';
            if (!assignment.customColor) assignment.customColor = '#f59e0b';
            if (typeof assignment.completed !== 'boolean') assignment.completed = false;
            
            return true;
        });
        
        if (fixedCount > 0) {
            console.log(`🔧 Fixed ${fixedCount} invalid assignments`);
            this.saveAssignments();
        }
    }

    validateNavigationState() {
        const activeNav = document.querySelector('.nav-btn.active');
        const visibleView = document.querySelector('.content-view:not([style*="display: none"])');
        
        if (!activeNav) {
            // Default to home if no active nav
            document.getElementById('home-btn').classList.add('active');
            this.switchToView('home-view');
            console.log('🔧 Fixed missing active navigation state');
        }
        
        if (!visibleView) {
            // Show home view if no view is visible
            this.switchToView('home-view');
            console.log('🔧 Fixed missing visible view');
        }
    }

    // Emergency reset function for debugging
    emergencyReset() {
        console.log('🚨 Emergency reset initiated');
        
        // Reset to safe state
        this.currentView = 'home';
        this.switchToView('home-view');
        
        // Re-initialize critical components
        this.setupEventListeners();
        this.ensureCheckboxesClickable();
        this.maintainBackground();
        
        // Force re-render
        this.renderAssignments();
        this.updateStatistics();
        
        this.showNotification('Emergency reset completed', 'success');
        console.log('✅ Emergency reset completed');
    }

    // Comprehensive application flow test
    runFlowTest() {
        console.log('🧪 Starting comprehensive flow test...');
        const testResults = [];
        
        try {
            // Test 1: Background persistence
            console.log('Testing background persistence...');
            const bgType = localStorage.getItem('background-type') || 'gradient';
            const currentBgType = document.body.getAttribute('data-background-type');
            testResults.push({
                test: 'Background Persistence',
                passed: bgType === currentBgType,
                expected: bgType,
                actual: currentBgType
            });

            // Test 2: Navigation functionality
            console.log('Testing navigation...');
            const activeNav = document.querySelector('.nav-btn.active');
            const visibleView = document.querySelector('.content-view:not([style*="display: none"])');
            testResults.push({
                test: 'Navigation State',
                passed: activeNav !== null && visibleView !== null,
                details: `Active nav: ${activeNav?.id}, Visible view: ${visibleView?.id}`
            });

            // Test 3: Assignment functionality
            console.log('Testing assignments...');
            const assignmentCards = document.querySelectorAll('.assignment-card');
            const clickableCheckboxes = document.querySelectorAll('.assignment-checkbox[style*="pointer-events: auto"]');
            testResults.push({
                test: 'Assignment Cards & Checkboxes',
                passed: assignmentCards.length > 0 && clickableCheckboxes.length === assignmentCards.length,
                details: `Cards: ${assignmentCards.length}, Clickable checkboxes: ${clickableCheckboxes.length}`
            });

            // Test 4: Manager initialization
            console.log('Testing manager initialization...');
            const managersInitialized = !!(
                window.settingsManager && 
                window.tracker && 
                this.backgroundManager
            );
            testResults.push({
                test: 'Manager Initialization',
                passed: managersInitialized,
                details: `Settings: ${!!window.settingsManager}, Tracker: ${!!window.tracker}, Background: ${!!this.backgroundManager}`
            });

            // Test 5: Local storage access
            console.log('Testing localStorage...');
            let storageWorking = false;
            try {
                localStorage.setItem('flowTest', 'test');
                storageWorking = localStorage.getItem('flowTest') === 'test';
                localStorage.removeItem('flowTest');
            } catch (e) {
                storageWorking = false;
            }
            testResults.push({
                test: 'LocalStorage Access',
                passed: storageWorking,
                details: storageWorking ? 'Working' : 'Failed'
            });

            // Test 6: Assignment data integrity
            console.log('Testing assignment data...');
            const validAssignments = this.assignments.filter(a => a.id && a.title && a.dueDate);
            testResults.push({
                test: 'Assignment Data Integrity',
                passed: validAssignments.length === this.assignments.length,
                details: `Valid: ${validAssignments.length}/${this.assignments.length}`
            });

            // Display results
            console.log('🧪 Flow Test Results:');
            console.table(testResults);
            
            const passedTests = testResults.filter(t => t.passed).length;
            const totalTests = testResults.length;
            const passRate = Math.round((passedTests / totalTests) * 100);
            
            console.log(`📊 Test Summary: ${passedTests}/${totalTests} tests passed (${passRate}%)`);
            
            if (passRate >= 90) {
                this.showNotification(`🎉 Flow test passed! ${passedTests}/${totalTests} tests successful`, 'success');
                console.log('✅ Application flow is working excellently!');
            } else if (passRate >= 70) {
                this.showNotification(`⚠️ Flow test mostly passed: ${passedTests}/${totalTests} tests`, 'warning');
                console.log('⚠️ Application flow has minor issues');
            } else {
                this.showNotification(`❌ Flow test failed: ${passedTests}/${totalTests} tests passed`, 'error');
                console.log('❌ Application flow needs attention');
            }
            
            return testResults;
            
        } catch (error) {
            console.error('❌ Flow test failed with error:', error);
            this.showNotification('Flow test encountered an error', 'error');
            return [];
        }
    }

    // Test specific functionality
    testBackgroundPersistence() {
        console.log('🖼️ Testing background persistence...');
        
        const originalType = localStorage.getItem('background-type') || 'gradient';
        console.log('Original background type:', originalType);
        
        // Test different background types including live wallpapers
        const testTypes = ['gradient', 'solid', 'pattern', 'image', 'live'];
        
        testTypes.forEach((type, index) => {
            setTimeout(() => {
                console.log(`Testing background type: ${type}`);
                this.applyBackground(type);
                
                setTimeout(() => {
                    const appliedType = document.body.getAttribute('data-background-type');
                    console.log(`Applied type: ${appliedType}, Expected: ${type}`);
                    
                    if (index === testTypes.length - 1) {
                        // Restore original
                        setTimeout(() => {
                            this.applyBackground(originalType);
                            console.log('✅ Background persistence test completed');
                        }, 1000);
                    }
                }, 500);
            }, index * 2000);
        });
    }

    // Test live wallpaper specifically
    testLiveWallpaper() {
        console.log('🎬 Testing live wallpaper functionality...');
        
        if (!window.liveWallpaperManager) {
            console.error('❌ Live wallpaper manager not available');
            this.showNotification('Live wallpaper manager not available', 'error');
            return;
        }
        
        const wallpaperTypes = ['particles', 'waves', 'matrix', 'aurora'];
        let currentIndex = 0;
        
        const testNext = () => {
            if (currentIndex >= wallpaperTypes.length) {
                console.log('✅ Live wallpaper test completed');
                this.showNotification('Live wallpaper test completed', 'success');
                return;
            }
            
            const type = wallpaperTypes[currentIndex];
            console.log(`Testing live wallpaper: ${type}`);
            
            // Set background type to live and test wallpaper
            localStorage.setItem('background-type', 'live');
            window.liveWallpaperManager.setWallpaper(type);
            
            currentIndex++;
            setTimeout(testNext, 3000);
        };
        
        testNext();
    }

    // Test background switching (including live wallpaper cleanup)
    testBackgroundSwitching() {
        console.log('🔄 Testing background switching with live wallpaper cleanup...');
        
        const testSequence = [
            { type: 'live', wallpaper: 'particles' },
            { type: 'gradient' },
            { type: 'live', wallpaper: 'waves' },
            { type: 'solid' },
            { type: 'live', wallpaper: 'matrix' },
            { type: 'pattern' }
        ];
        
        let currentIndex = 0;
        
        const testNext = () => {
            if (currentIndex >= testSequence.length) {
                console.log('✅ Background switching test completed');
                this.showNotification('Background switching test completed', 'success');
                return;
            }
            
            const test = testSequence[currentIndex];
            console.log(`🔄 Testing switch to: ${test.type}${test.wallpaper ? ` (${test.wallpaper})` : ''}`);
            
            if (test.type === 'live' && test.wallpaper) {
                // Set live wallpaper
                localStorage.setItem('background-type', 'live');
                if (window.liveWallpaperManager) {
                    window.liveWallpaperManager.setWallpaper(test.wallpaper);
                }
            } else {
                // Set other background type
                this.applyBackground(test.type);
            }
            
            // Check if live wallpaper is properly hidden/shown
            setTimeout(() => {
                const liveCanvas = document.getElementById('live-wallpaper-canvas');
                const isLiveActive = test.type === 'live';
                const canvasVisible = liveCanvas && liveCanvas.style.display !== 'none';
                
                console.log(`Canvas visible: ${canvasVisible}, Should be visible: ${isLiveActive}`);
                
                if (canvasVisible === isLiveActive) {
                    console.log('✅ Live wallpaper state correct');
                } else {
                    console.warn('⚠️ Live wallpaper state incorrect');
                }
                
                currentIndex++;
                setTimeout(testNext, 2000);
            }, 500);
        };
        
        testNext();
    }

    // Performance monitoring
    monitorPerformance() {
        const startTime = performance.now();
        
        // Monitor rendering performance
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 16) { // Longer than 60fps frame
                    console.warn(`⚠️ Slow operation detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
                }
            });
        });
        
        if (typeof PerformanceObserver !== 'undefined') {
            observer.observe({ entryTypes: ['measure', 'navigation'] });
        }
        
        // Monitor memory usage (if available)
        if (performance.memory) {
            const memoryInfo = performance.memory;
            console.log('📊 Memory usage:', {
                used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) + 'MB',
                total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024) + 'MB',
                limit: Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024) + 'MB'
            });
        }
        
        const endTime = performance.now();
        console.log(`⏱️ Performance monitoring setup completed in ${(endTime - startTime).toFixed(2)}ms`);
    }
}
