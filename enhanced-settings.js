// Enhanced Settings Management for HW Tracker

class SettingsManager {
    constructor(tracker) {
        this.tracker = tracker;
        this.isInitialized = false;
        this.colorPalettes = {
            ocean: { primary: '#0ea5e9', secondary: '#06b6d4', accent: '#0891b2' },
            sunset: { primary: '#f97316', secondary: '#ea580c', accent: '#dc2626' },
            forest: { primary: '#16a34a', secondary: '#15803d', accent: '#166534' },
            lavender: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#6d28d9' },
            rose: { primary: '#f43f5e', secondary: '#e11d48', accent: '#be123c' },
            midnight: { primary: '#1e293b', secondary: '#334155', accent: '#475569' }
        };
    }

    renderSettingsPage() {
        console.log('SettingsManager.renderSettingsPage() called');
        
        // Mark as initialized
        this.isInitialized = true;
        
        const settingsContainer = document.getElementById('settings-content');
        if (!settingsContainer) {
            console.error('Settings container not found!');
            
            // Create settings container if it doesn't exist
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                const settingsView = document.createElement('div');
                settingsView.className = 'content-view';
                settingsView.id = 'settings-view';
                settingsView.innerHTML = '<div id="settings-content"></div>';
                mainContent.appendChild(settingsView);
                
                console.log('Created missing settings container');
                // Try again with the newly created container
                return this.renderSettingsPage();
            } else {
                console.error('Main content container not found!');
                return;
            }
        }
        console.log('Settings container found, rendering...');

        settingsContainer.innerHTML = `
            <section class="priority-section">
                <h2>⚙️ Settings</h2>
                <p>Settings loaded successfully!</p>
                
                <div class="settings-section">
                    <h3>🔗 API Integrations</h3>
                    <div class="integration-item">
                        <div class="integration-info">
                            <strong>Canvas LMS</strong>
                            <div class="integration-details">
                                <span id="canvas-status" class="status ${this.tracker.canvasConnected ? 'connected' : 'disconnected'}">
                                    ${this.tracker.canvasConnected ? 'Connected' : 'Not connected'}
                                </span>
                                ${this.tracker.canvasConnected ? `<div class="account-info">
                                    <span class="account-name" id="canvas-account-name">${localStorage.getItem('canvas-user-name') || 'Loading...'}</span>
                                    <span class="account-email" id="canvas-account-email">${localStorage.getItem('canvas-user-email') || ''}</span>
                                </div>` : `
                                <div class="canvas-config" style="margin-top: 0.5rem;">
                                    <div class="config-row">
                                        <input type="url" id="canvas-url" placeholder="Canvas URL (e.g., https://school.instructure.com)" 
                                               value="${localStorage.getItem('canvasURL') || ''}" style="margin-bottom: 0.5rem; width: 100%;">
                                    </div>
                                    <div class="config-row">
                                        <input type="password" id="canvas-token" placeholder="Canvas API Token (Optional - for enhanced sync)" 
                                               value="${localStorage.getItem('canvasToken') || ''}" style="width: 100%;">
                                    </div>
                                    <small style="color: var(--text-secondary); font-size: 0.75rem;">
                                        API Token is optional. Without it, basic sync will be used. 
                                        <a href="#" id="canvas-help-link" style="color: var(--accent-color);">How to get API token?</a>
                                    </small>
                                </div>`}
                            </div>
                        </div>
                        <button id="canvas-settings-btn" class="btn ${this.tracker.canvasConnected ? 'btn-secondary' : 'btn-primary'}">
                            ${this.tracker.canvasConnected ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                    <div class="integration-item">
                        <div class="integration-info">
                            <strong>Google Classroom</strong>
                            <div class="integration-details">
                                <span id="google-status" class="status ${this.tracker.googleConnected ? 'connected' : 'disconnected'}">
                                    ${this.tracker.googleConnected ? 'Connected' : 'Not connected'}
                                </span>
                                ${this.tracker.googleConnected ? `<div class="account-info">
                                    <span class="account-name" id="google-account-name">${localStorage.getItem('google-user-name') || 'Loading...'}</span>
                                    <span class="account-email" id="google-account-email">${localStorage.getItem('google-user-email') || ''}</span>
                                </div>` : ''}
                            </div>
                        </div>
                        <button id="google-settings-btn" class="btn ${this.tracker.googleConnected ? 'btn-secondary' : 'btn-primary'}">
                            ${this.tracker.googleConnected ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                    <div class="integration-note" style="margin-top: 1rem; padding: 1rem; background: rgba(245, 158, 11, 0.1); border-radius: 8px; font-size: 0.875rem; color: var(--text-secondary);">
                        <strong>Note:</strong> API integrations sync your assignments automatically. No API keys required - we handle authentication securely.
                    </div>
                </div>

                <!-- Appearance Settings -->
                <div class="settings-section">
                    <h3>🎨 Appearance & Visual Effects</h3>
                    
                    <!-- Quick VFX Controls -->
                    <div class="vfx-controls-section">
                        <h4>Quick Visual Controls</h4>
                        <div class="vfx-controls-grid">
                            <button class="vfx-btn ${localStorage.getItem('visualEffectsEnabled') !== 'false' ? 'active' : ''}" id="settings-visual-effects-btn" title="Toggle Visual Effects (Glass/Performance)">
                                ✨ Visual Effects
                            </button>
                            <button class="vfx-btn ${localStorage.getItem('animationsEnabled') !== 'false' ? 'active' : ''}" id="settings-animations-btn" title="Toggle Animations">
                                🎬 Animations
                            </button>
                        </div>
                    </div>

                    <!-- Detailed Toggle Settings -->
                    <div class="detailed-settings">
                        <div class="setting-item">
                            <label for="dark-mode">Dark Mode</label>
                            <div class="toggle-switch ${this.tracker.isDarkMode ? 'active' : ''}" id="dark-mode-toggle"></div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label-container">
                                <label for="visual-effects">Visual Effects</label>
                                <small class="setting-description">ON: Enhanced glassmorphism | OFF: Performance mode</small>
                            </div>
                            <div class="toggle-switch ${localStorage.getItem('visualEffectsEnabled') !== 'false' ? 'active' : ''}" id="visual-effects-toggle"></div>
                        </div>
                        <div class="setting-item">
                            <label for="animations">Smooth Animations</label>
                            <div class="toggle-switch ${localStorage.getItem('animationsEnabled') !== 'false' ? 'active' : ''}" id="animations-toggle"></div>
                        </div>
                    </div>
                </div>

                <!-- Color Themes -->
                <div class="settings-section">
                    <h3>🎨 Color Themes</h3>
                    
                    <div class="color-palettes">
                        <h4>Quick Palettes</h4>
                        <div class="palette-grid">
                            <div class="palette-option" data-palette="ocean">
                                <div class="palette-preview">
                                    <div class="color-swatch" style="background: #667eea;"></div>
                                    <div class="color-swatch" style="background: #764ba2;"></div>
                                    <div class="color-swatch" style="background: #f093fb;"></div>
                                </div>
                                <span>Ocean</span>
                            </div>
                            <div class="palette-option" data-palette="sunset">
                                <div class="palette-preview">
                                    <div class="color-swatch" style="background: #ff9a9e;"></div>
                                    <div class="color-swatch" style="background: #fecfef;"></div>
                                    <div class="color-swatch" style="background: #fecfef;"></div>
                                </div>
                                <span>Sunset</span>
                            </div>
                            <div class="palette-option" data-palette="forest">
                                <div class="palette-preview">
                                    <div class="color-swatch" style="background: #134e5e;"></div>
                                    <div class="color-swatch" style="background: #71b280;"></div>
                                    <div class="color-swatch" style="background: #10b981;"></div>
                                </div>
                                <span>Forest</span>
                            </div>
                            <div class="palette-option" data-palette="lavender">
                                <div class="palette-preview">
                                    <div class="color-swatch" style="background: #8b5cf6;"></div>
                                    <div class="color-swatch" style="background: #a78bfa;"></div>
                                    <div class="color-swatch" style="background: #c4b5fd;"></div>
                                </div>
                                <span>Lavender</span>
                            </div>
                            <div class="palette-option" data-palette="rose">
                                <div class="palette-preview">
                                    <div class="color-swatch" style="background: #f43f5e;"></div>
                                    <div class="color-swatch" style="background: #fb7185;"></div>
                                    <div class="color-swatch" style="background: #fda4af;"></div>
                                </div>
                                <span>Rose Gold</span>
                            </div>
                            <div class="palette-option" data-palette="monochrome">
                                <div class="palette-preview">
                                    <div class="color-swatch" style="background: #374151;"></div>
                                    <div class="color-swatch" style="background: #6b7280;"></div>
                                    <div class="color-swatch" style="background: #9ca3af;"></div>
                                </div>
                                <span>Monochrome</span>
                            </div>
                        </div>
                    </div>

                    <div class="custom-colors premium-feature">
                        <h4>Custom Colors <span class="premium-badge">💎 Premium</span></h4>
                        <div class="premium-overlay">
                            <div class="premium-content">
                                <div class="premium-icon">🎨</div>
                                <h5>Unlock Custom Colors</h5>
                                <p>Create your own unique color schemes with unlimited customization options.</p>
                                <button class="btn btn-premium" onclick="settingsManager.showUpgradeModal('custom-colors')">Upgrade to Premium</button>
                            </div>
                        </div>
                        <div class="color-controls blurred">
                            <div class="control-group">
                                <label for="primary-color">Primary Color</label>
                                <input type="color" id="primary-color" value="${localStorage.getItem('primary-color') || '#667eea'}" disabled>
                            </div>
                            <div class="control-group">
                                <label for="secondary-color">Secondary Color</label>
                                <input type="color" id="secondary-color" value="${localStorage.getItem('secondary-color') || '#764ba2'}" disabled>
                            </div>
                            <div class="control-group">
                                <label for="accent-color">Accent Color</label>
                                <input type="color" id="accent-color" value="${localStorage.getItem('accent-color') || '#f59e0b'}" disabled>
                            </div>
                        </div>
                    </div>

                    <div class="background-options">
                        <h4>Background Style</h4>
                        <div class="background-selector">
                            <select id="background-type">
                                <option value="gradient">Gradient</option>
                                <option value="pattern">Pattern</option>
                                <option value="image">Custom Image</option>
                                <option value="solid">Solid Color</option>
                                <option value="live">Live Wallpaper 💎</option>
                            </select>
                            <input type="color" id="background-color" value="${localStorage.getItem('background-solid-color') || '#0f172a'}" style="display: none;">
                        </div>
                        
                        <!-- Gradient Color Controls (only show when gradient is selected) -->
                        <div class="gradient-controls" id="gradient-controls" style="display: none;">
                            <div class="color-inputs">
                                <div class="color-input-group">
                                    <label for="primary-color">Primary Color</label>
                                    <input type="color" id="primary-color" value="${localStorage.getItem('primary-color') || '#667eea'}">
                                </div>
                                <div class="color-input-group">
                                    <label for="secondary-color">Secondary Color</label>
                                    <input type="color" id="secondary-color" value="${localStorage.getItem('secondary-color') || '#764ba2'}">
                                </div>
                            </div>
                        </div>
                        
                        <div class="pattern-options" id="pattern-options" style="display: none;">
                            <div class="pattern-grid">
                                <div class="pattern-option" data-pattern="dots">Dots</div>
                                <div class="pattern-option" data-pattern="grid">Grid</div>
                                <div class="pattern-option" data-pattern="waves">Waves</div>
                                <div class="pattern-option" data-pattern="hexagon">Hexagon</div>
                            </div>
                        </div>
                        
                        <div class="image-upload-section premium-feature" id="image-upload-section" style="display: none;">
                            <div class="premium-overlay">
                                <div class="premium-content">
                                    <div class="premium-icon">🖼️</div>
                                    <h5>Unlock Custom Images</h5>
                                    <p>Upload your own background images for a truly personalized experience.</p>
                                    <button class="btn btn-premium" onclick="settingsManager.showUpgradeModal('custom-images')">Upgrade to Premium</button>
                                </div>
                            </div>
                            <div class="upload-area blurred" id="upload-area">
                                <div class="upload-content">
                                    <span class="upload-icon">📷</span>
                                    <p>Click to upload or drag & drop</p>
                                    <small>Supports JPG, PNG, GIF (max 20MB)</small>
                                </div>
                                <input type="file" id="background-image-input" accept="image/*" style="display: none;" disabled>
                            </div>
                            <button class="btn btn-secondary blurred" id="remove-bg-image" style="display: none;" disabled>Remove Image</button>
                        </div>
                        
                        <div class="live-wallpaper-section premium-feature" id="live-wallpaper-section" style="display: none;">
                            <div class="premium-overlay">
                                <div class="premium-content">
                                    <div class="premium-icon">🌊</div>
                                    <h5>Unlock Live Wallpapers</h5>
                                    <p>Experience dynamic animated backgrounds that bring your workspace to life.</p>
                                    <button class="btn btn-premium" onclick="settingsManager.showUpgradeModal('live-wallpapers')">Upgrade to Premium</button>
                                </div>
                            </div>
                            <div class="live-wallpaper-grid blurred">
                                <div class="wallpaper-option" data-wallpaper="particles">
                                    <div class="wallpaper-preview">
                                        <div class="particles-demo"></div>
                                    </div>
                                    <span>Floating Particles</span>
                                </div>
                                <div class="wallpaper-option" data-wallpaper="waves">
                                    <div class="wallpaper-preview">
                                        <div class="waves-demo"></div>
                                    </div>
                                    <span>Ocean Waves</span>
                                </div>
                                <div class="wallpaper-option" data-wallpaper="matrix">
                                    <div class="wallpaper-preview">
                                        <div class="matrix-demo"></div>
                                    </div>
                                    <span>Digital Rain</span>
                                </div>
                                <div class="wallpaper-option" data-wallpaper="aurora">
                                    <div class="wallpaper-preview">
                                        <div class="aurora-demo"></div>
                                    </div>
                                    <span>Aurora Borealis</span>
                                </div>
                            </div>
                            
                            <!-- Video Upload Section -->
                            <div class="video-upload-section" id="video-upload-section" style="margin-top: 1rem;">
                                <h5>🎬 Upload Video Wallpaper</h5>
                                <div class="video-upload-area" id="video-upload-area">
                                    <div class="upload-content">
                                        <span class="upload-icon">🎬</span>
                                        <p>Click to upload MP4 video</p>
                                        <small>Supports MP4, WebM, OGG (max 100MB)</small>
                                    </div>
                                    <input type="file" id="video-wallpaper-input" accept="video/*" style="display: none;">
                                </div>
                                <div class="current-video-info" id="current-video-info" style="display: none;">
                                    <p>Current video: <span id="current-video-name"></span></p>
                                    <button class="btn btn-secondary" id="remove-video-wallpaper">Remove Video</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Apply Background Changes Button -->
                        <div class="background-apply-section">
                            <button class="btn btn-primary" id="apply-background-btn">
                                <span class="apply-icon">✨</span>
                                Apply Background Changes
                            </button>
                            <small style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem; display: block;">
                                Preview your selections, then click to apply the new background
                            </small>
                        </div>
                    </div>
                </div>

                <!-- Notifications -->
                <div class="settings-section">
                    <h3>🔔 Notifications</h3>
                    <div class="setting-item">
                        <label for="push-notifications">Push Notifications</label>
                        <div class="toggle-switch active" id="push-notifications-toggle"></div>
                    </div>
                    <div class="setting-item">
                        <label for="deadline-reminders">Deadline Reminders</label>
                        <div class="toggle-switch active" id="deadline-reminders-toggle"></div>
                    </div>
                    <div class="setting-item">
                        <label for="completion-celebrations">Completion Celebrations</label>
                        <div class="toggle-switch active" id="completion-celebrations-toggle"></div>
                    </div>
                </div>

                <!-- Data Management -->
                <div class="settings-section">
                    <h3>💾 Data Management</h3>
                    <div class="setting-item">
                        <label>Export Data</label>
                        <button class="btn btn-secondary" id="export-data-btn">Export JSON</button>
                    </div>
                    <div class="setting-item">
                        <label>Import Data</label>
                        <input type="file" id="import-data-input" accept=".json" style="display: none;">
                        <button class="btn btn-secondary" id="import-data-btn">Import JSON</button>
                    </div>
                    <div class="setting-item">
                        <label>Clear All Data</label>
                        <button id="clear-data-btn" class="btn danger-btn">Clear All</button>
                    </div>
                </div>

                <!-- Translation Support -->
                <div class="settings-section">
                    <h3>🌍 Translation Support</h3>
                    <div class="setting-item">
                        <label for="language-select">Language</label>
                        <select id="language-select">
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="it">Italiano</option>
                            <option value="pt">Português</option>
                            <option value="ru">Русский</option>
                            <option value="zh">中文</option>
                            <option value="ja">日本語</option>
                            <option value="ko">한국어</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label for="auto-translate">Auto-translate assignments</label>
                        <div class="toggle-switch ${localStorage.getItem('autoTranslate') === 'true' ? 'active' : ''}" id="auto-translate-toggle"></div>
                    </div>
                    <div class="translation-note" style="margin-top: 1rem; padding: 1rem; background: rgba(34, 197, 94, 0.1); border-radius: 8px; font-size: 0.875rem; color: var(--text-secondary);">
                        <strong>Free Feature:</strong> Translation support is completely free and uses browser-based translation services.
                    </div>
                </div>

                <!-- Ideas Backlog - Hidden -->
                <!-- 
                <div class="settings-section">
                    <h3>💡 Ideas Backlog</h3>
                    <div class="ideas-list">
                        <div class="idea-item">
                            <strong>Advanced Analytics</strong>
                            <p>Detailed performance insights and study patterns analysis</p>
                        </div>
                        <div class="debug-info">
                        <strong>Debug Info:</strong> Settings manager status: ${this.isInitialized ? 'Ready' : 'Initializing...'}
                        <div class="debug-actions">
                            <button onclick="window.settingsManager.renderSettingsPage()" class="debug-btn">Force Reload Settings</button>
                            <button onclick="console.log(window.settingsManager)" class="debug-btn">Debug Info</button>
                        </div>
                    </div>
                </div>
                -->
            </section>
```
        `;

        console.log('Settings HTML rendered, initializing event listeners...');
        
        // Ensure settings container is visible
        settingsContainer.style.display = 'block';
        settingsContainer.style.opacity = '1';
        settingsContainer.style.visibility = 'visible';
        
        // Extra protection for performance mode and animations disabled
        if (document.body.classList.contains('performance-mode')) {
            settingsContainer.style.position = 'relative';
            settingsContainer.style.zIndex = '1';
            console.log('Applied performance mode protection to settings container');
        }
        
        // Additional protection when both performance mode and animations are disabled
        if (document.body.classList.contains('performance-mode') && document.body.classList.contains('animations-disabled')) {
            const settingsView = document.getElementById('settings-view');
            if (settingsView) {
                settingsView.style.display = 'block';
                settingsView.style.visibility = 'visible';
                settingsView.style.opacity = '1';
                settingsView.style.position = 'relative';
                settingsView.style.zIndex = '10';
            }
            
            settingsContainer.style.display = 'block';
            settingsContainer.style.visibility = 'visible';
            settingsContainer.style.opacity = '1';
            settingsContainer.style.position = 'relative';
            settingsContainer.style.zIndex = '10';
            
            console.log('Applied combined performance mode + animations disabled protection');
        }
        
        try {
            this.initializeEventListeners();
            console.log('Event listeners initialized successfully');
        } catch (error) {
            console.error('Error initializing event listeners:', error);
        }
        console.log('Settings page rendering completed successfully!');
        
        // Initialize background manager if not already initialized
        try {
            if (!this.tracker.backgroundManager) {
                if (typeof BackgroundManager !== 'undefined') {
                    this.backgroundManager = new BackgroundManager(this.tracker);
                    this.tracker.backgroundManager = this.backgroundManager;
                    console.log('BackgroundManager initialized successfully');
                } else {
                    console.warn('BackgroundManager class not available');
                }
            } else {
                this.backgroundManager = this.tracker.backgroundManager;
                console.log('Using existing BackgroundManager');
            }
        } catch (error) {
            console.error('Error initializing BackgroundManager:', error);
            // Continue without background manager
        }
        
        // Apply saved settings on load and ensure settings page inherits styling
        try {
            this.applySavedSettings();
            console.log('Saved settings applied successfully');
        } catch (error) {
            console.error('Error applying saved settings:', error);
        }
        
        // Apply styling to the newly rendered settings page
        setTimeout(() => {
            try {
                this.applySettingsPageStyling();
                console.log('Settings page styling applied');
                
                // Additional check for performance mode
                if (document.body.classList.contains('performance-mode')) {
                    this.ensurePerformanceModeCompatibility();
                }
            } catch (error) {
                console.error('Error applying settings page styling:', error);
            }
        }, 100);
        
        // Update premium UI state based on current status
        setTimeout(() => {
            try {
                this.updatePremiumUIState();
                console.log('Premium UI state updated');
            } catch (error) {
                console.error('Error updating premium UI state:', error);
            }
        }, 150);
        
        // Initialize background state
        setTimeout(() => {
            try {
                this.initializeBackgroundState();
                console.log('Background state initialized');
            } catch (error) {
                console.error('Error initializing background state:', error);
            }
        }, 200);
    }

    initializeEventListeners() {
        
        try {
            this.initializeToggleSwitches();
            console.log('Toggle switches initialized');
        } catch (error) {
            console.error('Error initializing toggle switches:', error);
        }
        
        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.tracker.isDarkMode = !this.tracker.isDarkMode;
                localStorage.setItem('darkMode', this.tracker.isDarkMode.toString());
                
                console.log('Dark mode toggled:', this.tracker.isDarkMode);
                
                if (this.tracker.isDarkMode) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    console.log('Applied dark theme attribute');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    console.log('Removed dark theme attribute');
                }
                
                // Force CSS variables to update
                document.documentElement.style.setProperty('--bg-primary', 
                    this.tracker.isDarkMode ? '#0f172a' : '#1e293b');
                
                darkModeToggle.classList.toggle('active');
                this.tracker.showNotification('Theme updated successfully!');
                
                // Ensure settings remain visible after theme change
                setTimeout(() => {
                    this.protectSettingsVisibility();
                }, 100);
            });
        }

        // Visual Effects toggle (replaces separate performance/glassmorphism toggles)
        const visualEffectsToggle = document.getElementById('visual-effects-toggle');
        if (visualEffectsToggle) {
            visualEffectsToggle.addEventListener('click', () => {
                const isEnabled = localStorage.getItem('visualEffectsEnabled') !== 'false';
                const newState = !isEnabled;
                
                // Use the new centralized method
                this.applyVisualEffects(newState);
                
                // Update UI
                visualEffectsToggle.classList.toggle('active', newState);
                this.tracker.showNotification(newState ? 'Visual effects enabled (Enhanced Glass)' : 'Visual effects disabled (Performance Mode)');
                
                // Sync with toolbar buttons
                this.syncWithToolbar('visual-effects', newState);
                
                // Apply styling to all toggle switches immediately
                this.applyToggleSwitchStyling();
            });
        }

        // Animations toggle
        const animationsToggle = document.getElementById('animations-toggle');
        if (animationsToggle) {
            animationsToggle.addEventListener('click', () => {
                const isEnabled = localStorage.getItem('animationsEnabled') !== 'false';
                const newState = !isEnabled;
                localStorage.setItem('animationsEnabled', newState.toString());
                
                console.log(`🎬 Animations toggle: ${newState ? 'ENABLED' : 'DISABLED'}`);
                
                // CRITICAL: Protect settings visibility BEFORE making changes
                this.protectSettingsVisibility();
                
                // Apply instantly without transitions
                if (newState) {
                    document.body.classList.remove('animations-disabled');
                    console.log('✅ Removed animations-disabled class');
                } else {
                    document.body.classList.add('animations-disabled');
                    console.log('🚫 Added animations-disabled class');
                    
                    // Ensure toolbar remains visible when animations are disabled
                    const toolbar = document.querySelector('.settings-toolbar, .toolbar, .app-toolbar, [role="toolbar"]');
                    if (toolbar) {
                        toolbar.style.setProperty('display', 'flex', 'important');
                        toolbar.style.setProperty('visibility', 'visible', 'important');
                        toolbar.style.setProperty('opacity', '1', 'important');
                        toolbar.style.setProperty('position', 'fixed', 'important');
                        toolbar.style.setProperty('z-index', '99999', 'important'); // Ensure highest z-index
                    }
                }
                
                // Force immediate application and style recalculation
                document.body.offsetHeight;
                
                // Update toggle visual state
                animationsToggle.classList.toggle('active', newState);
                
                // Show notification
                this.tracker.showNotification(newState ? 'Animations enabled' : 'Animations disabled');
                
                // Sync with toolbar buttons
                this.syncWithToolbar('animations', newState);
                
                // CRITICAL: Re-apply settings page styling after changes
                setTimeout(() => {
                    this.applySettingsPageStyling();
                    this.forceSettingsVisibility();
                    this.protectSettingsVisibility(); // Ensure settings remain visible
                    
                    // Double-check toolbar visibility and ensure it's frontmost
                    const toolbar = document.querySelector('.settings-toolbar, .toolbar, .app-toolbar, [role="toolbar"]');
                    if (toolbar) {
                        toolbar.style.setProperty('display', 'flex', 'important');
                        toolbar.style.setProperty('visibility', 'visible', 'important');
                        toolbar.style.setProperty('opacity', '1', 'important');
                        toolbar.style.setProperty('position', 'fixed', 'important');
                        toolbar.style.setProperty('z-index', '99999', 'important'); // Always frontmost
                    }
                    
                    console.log('🔧 Settings and toolbar visibility re-applied after animations toggle');
                }, 10);
                
                // Additional protection after a longer delay
                setTimeout(() => {
                    this.protectSettingsVisibility();
                }, 100);
                
                // Re-render assignments to apply animation changes
                this.tracker.renderAssignments();
                
                // Apply styling to all toggle switches immediately
                this.applyToggleSwitchStyling();
                
                console.log(`🎬 Animations toggle complete: ${newState ? 'ENABLED' : 'DISABLED'}`);
            });
        }

    // Language selection
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = localStorage.getItem('selectedLanguage') || 'en';
        languageSelect.addEventListener('change', (e) => {
            const language = e.target.value;
            localStorage.setItem('selectedLanguage', language);
            this.tracker.showNotification(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
                
            // Apply translation if auto-translate is enabled
            if (localStorage.getItem('autoTranslate') === 'true') {
                this.applyTranslation(language);
            }
        });
    }

    // Auto-translate toggle
    const autoTranslateToggle = document.getElementById('auto-translate-toggle');
    if (autoTranslateToggle) {
        autoTranslateToggle.addEventListener('click', () => {
            const isEnabled = localStorage.getItem('autoTranslate') === 'true';
            const newState = !isEnabled;
            localStorage.setItem('autoTranslate', newState.toString());
                
            autoTranslateToggle.classList.toggle('active');
            this.tracker.showNotification(newState ? 'Auto-translation enabled' : 'Auto-translation disabled');
                
            if (newState) {
                const language = localStorage.getItem('selectedLanguage') || 'en';
                this.applyTranslation(language);
            }
        });
    }

    // Settings page VFX buttons
    this.initializeSettingsVFXButtons();

    // Color palette selection
    document.querySelectorAll('.palette-option').forEach(option => {
        option.addEventListener('click', () => {
            const palette = option.dataset.palette;
            this.applyColorPalette(palette);
                
            // Update visual selection
            document.querySelectorAll('.palette-option').forEach(p => p.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    // Custom color inputs - Premium feature check
    ['primary-color', 'secondary-color', 'accent-color'].forEach(colorType => {
        const input = document.getElementById(colorType);
        if (input) {
            input.addEventListener('click', (e) => {
                if (!this.isPremiumUser()) {
                    e.preventDefault();
                    this.showUpgradeModal('custom-colors');
                    return false;
                }
            });
                
            input.addEventListener('change', (e) => {
                if (!this.isPremiumUser()) {
                    e.preventDefault();
                    return false;
                }
                const color = e.target.value;
                    
                // Apply color instantly without transitions
                document.documentElement.style.transition = 'none';
                document.documentElement.style.setProperty(`--${colorType}`, color);
                    
                // Force immediate application
                document.documentElement.offsetHeight;
                    
                localStorage.setItem(colorType, color);
                    
                // Re-enable transitions after brief delay
                setTimeout(() => {
                    document.documentElement.style.transition = '';
                }, 50);
            });
        }
    });

    // Background type change handler
    const backgroundType = document.getElementById('background-type');
    if (backgroundType) {
        backgroundType.addEventListener('change', (e) => {
            this.handleBackgroundTypeChange(e.target.value);
        });
    }

    // Language selection
    if (languageSelect) {
            languageSelect.value = localStorage.getItem('selectedLanguage') || 'en';
            languageSelect.addEventListener('change', (e) => {
                const language = e.target.value;
                localStorage.setItem('selectedLanguage', language);
                this.tracker.showNotification(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
                
                // Apply translation if auto-translate is enabled
                if (localStorage.getItem('autoTranslate') === 'true') {
                    this.applyTranslation(language);
                }
            });
        }

        // Settings page VFX buttons
        this.initializeSettingsVFXButtons();

        // Color palette selection
        document.querySelectorAll('.palette-option').forEach(option => {
            option.addEventListener('click', () => {
                const palette = option.dataset.palette;
                this.applyColorPalette(palette);
                
                // Update visual selection
                document.querySelectorAll('.palette-option').forEach(p => p.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Custom color inputs - Premium feature check
        ['primary-color', 'secondary-color', 'accent-color'].forEach(colorType => {
            const input = document.getElementById(colorType);
            if (input) {
                input.addEventListener('click', (e) => {
                    if (!this.isPremiumUser()) {
                        e.preventDefault();
                        this.showUpgradeModal('custom-colors');
                        return false;
                    }
                });
                
                input.addEventListener('change', (e) => {
                    if (!this.isPremiumUser()) {
                        e.preventDefault();
                        return false;
                    }
                    const color = e.target.value;
                    
                    // Apply color instantly without transitions
                    document.documentElement.style.transition = 'none';
                    document.documentElement.style.setProperty(`--${colorType}`, color);
                    
                    // Force immediate application
                    document.documentElement.offsetHeight;
                    
                    localStorage.setItem(colorType, color);
                    
                    // Re-enable transitions after brief delay
                    setTimeout(() => {
                        document.documentElement.style.transition = '';
                    }, 50);
                });
            }
        });

        // Apply background changes button
        const applyBackgroundBtn = document.getElementById('apply-background-btn');
        if (applyBackgroundBtn) {
            applyBackgroundBtn.addEventListener('click', () => {
                this.applyBackgroundChanges();
            });
        }

        // Image upload functionality
        const uploadArea = document.getElementById('upload-area');
        const imageInput = document.getElementById('background-image-input');
        const removeBgBtn = document.getElementById('remove-bg-image');

        if (uploadArea && imageInput) {
            uploadArea.addEventListener('click', () => {
                if (!this.isPremiumUser()) {
                    this.showUpgradeModal('custom-images');
                    return;
                }
                imageInput.click();
            });
            
            uploadArea.addEventListener('dragover', (e) => {
                if (!this.isPremiumUser()) {
                    e.preventDefault();
                    this.showUpgradeModal('custom-images');
                    return;
                }
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                if (!this.isPremiumUser()) {
                    this.showUpgradeModal('custom-images');
                    return;
                }
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.backgroundManager.handleImageUpload(files[0]);
                }
            });
            
            imageInput.addEventListener('change', (e) => {
                if (!this.isPremiumUser()) {
                    this.showUpgradeModal('custom-images');
                    return;
                }
                if (e.target.files.length > 0) {
                    this.backgroundManager.handleImageUpload(e.target.files[0]);
                }
            });
        }

        if (removeBgBtn) {
            removeBgBtn.addEventListener('click', () => {
                localStorage.removeItem('background-image');
                this.backgroundManager.applyBackground('gradient');
                removeBgBtn.style.display = 'none';
            });
        }

        // Pattern selection
        const patternOptions = document.querySelectorAll('.pattern-option');
        patternOptions.forEach(option => {
            option.addEventListener('click', () => {
                patternOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.backgroundManager.applyPattern(option.dataset.pattern);
            });
        });

        // Solid color picker
        const backgroundColorInput = document.getElementById('background-color');
        if (backgroundColorInput) {
            backgroundColorInput.addEventListener('change', (e) => {
                this.backgroundManager.updateSolidColor(e.target.value);
            });
        }

        // API Integration buttons
        const canvasBtn = document.getElementById('canvas-settings-btn');
        const googleBtn = document.getElementById('google-settings-btn');
        
        if (canvasBtn) {
            canvasBtn.addEventListener('click', () => this.toggleCanvasIntegration());
        }
        
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.toggleGoogleIntegration());
        }

        // Canvas help link
        const canvasHelpLink = document.getElementById('canvas-help-link');
        if (canvasHelpLink) {
            canvasHelpLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCanvasHelp();
            });
        }

        // Save Canvas URL and token when changed
        const canvasUrl = document.getElementById('canvas-url');
        const canvasToken = document.getElementById('canvas-token');
        
        if (canvasUrl) {
            canvasUrl.addEventListener('blur', () => {
                localStorage.setItem('canvasURL', canvasUrl.value);
            });
        }
        
        if (canvasToken) {
            canvasToken.addEventListener('blur', () => {
                localStorage.setItem('canvasToken', canvasToken.value);
            });
        }

        // Data management
        const exportBtn = document.getElementById('export-data-btn');
        const importBtn = document.getElementById('import-data-btn');
        const importInput = document.getElementById('import-data-input');
        const clearBtn = document.getElementById('clear-data-btn');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        if (importBtn && importInput) {
            importBtn.addEventListener('click', () => importInput.click());
            importInput.addEventListener('change', (e) => this.importData(e));
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllData());
        }

        // Upgrade button handlers
        const upgradeAnalyticsBtn = document.getElementById('upgrade-analytics-btn');
        const upgradeSyncBtn = document.getElementById('upgrade-sync-btn');
        const upgradeThemesBtn = document.getElementById('upgrade-themes-btn');

        if (upgradeAnalyticsBtn) {
            upgradeAnalyticsBtn.addEventListener('click', () => this.purchaseFeature('advanced-analytics'));
        }

        if (upgradeSyncBtn) {
            upgradeSyncBtn.addEventListener('click', () => this.purchaseFeature('cloud-sync'));
        }

        if (upgradeThemesBtn) {
            upgradeThemesBtn.addEventListener('click', () => this.purchaseFeature('premium-themes'));
        }
    }

    initializeToggleSwitches() {
        // Glassmorphism toggle
        const glassmorphismToggle = document.getElementById('glassmorphism-toggle');
        if (glassmorphismToggle) {
            const isEnabled = localStorage.getItem('glassmorphism-enabled') !== 'false';
            if (!isEnabled) glassmorphismToggle.classList.remove('active');
            
            glassmorphismToggle.addEventListener('click', () => {
                const enabled = glassmorphismToggle.classList.contains('active');
                if (enabled) {
                    glassmorphismToggle.classList.remove('active');
                    localStorage.setItem('glassmorphism-enabled', 'false');
                    document.body.classList.add('no-glassmorphism');
                    this.tracker.showNotification('Glassmorphism effects disabled');
                } else {
                    glassmorphismToggle.classList.add('active');
                    localStorage.setItem('glassmorphism-enabled', 'true');
                    document.body.classList.remove('no-glassmorphism');
                    this.tracker.showNotification('Glassmorphism effects enabled');
                }
            });
        }

        // Animations toggle
        const animationsToggle = document.getElementById('animations-toggle');
        if (animationsToggle) {
            const isEnabled = localStorage.getItem('animations-enabled') !== 'false';
            if (!isEnabled) animationsToggle.classList.remove('active');
            
            animationsToggle.addEventListener('click', () => {
                const enabled = animationsToggle.classList.contains('active');
                if (enabled) {
                    animationsToggle.classList.remove('active');
                    localStorage.setItem('animations-enabled', 'false');
                    document.body.classList.add('no-animations');
                    this.tracker.showNotification('Animations disabled');
                } else {
                    animationsToggle.classList.add('active');
                    localStorage.setItem('animations-enabled', 'true');
                    document.body.classList.remove('no-animations');
                    this.tracker.showNotification('Animations enabled');
                }
            });
        }

        // Push notifications toggle
        const pushNotificationsToggle = document.getElementById('push-notifications-toggle');
        if (pushNotificationsToggle) {
            const isEnabled = localStorage.getItem('push-notifications') !== 'false';
            if (!isEnabled) pushNotificationsToggle.classList.remove('active');
            
            pushNotificationsToggle.addEventListener('click', () => {
                const enabled = pushNotificationsToggle.classList.contains('active');
                if (enabled) {
                    pushNotificationsToggle.classList.remove('active');
                    localStorage.setItem('push-notifications', 'false');
                    this.tracker.showNotification('Push notifications disabled');
                } else {
                    pushNotificationsToggle.classList.add('active');
                    localStorage.setItem('push-notifications', 'true');
                    this.tracker.showNotification('Push notifications enabled');
                }
            });
        }

        // Deadline reminders toggle
        const deadlineRemindersToggle = document.getElementById('deadline-reminders-toggle');
        if (deadlineRemindersToggle) {
            const isEnabled = localStorage.getItem('deadline-reminders') !== 'false';
            if (!isEnabled) deadlineRemindersToggle.classList.remove('active');
            
            deadlineRemindersToggle.addEventListener('click', () => {
                const enabled = deadlineRemindersToggle.classList.contains('active');
                if (enabled) {
                    deadlineRemindersToggle.classList.remove('active');
                    localStorage.setItem('deadline-reminders', 'false');
                    this.tracker.showNotification('Deadline reminders disabled');
                } else {
                    deadlineRemindersToggle.classList.add('active');
                    localStorage.setItem('deadline-reminders', 'true');
                    this.tracker.showNotification('Deadline reminders enabled');
                }
            });
        }

        // Completion celebrations toggle
        const completionCelebrationsToggle = document.getElementById('completion-celebrations-toggle');
        if (completionCelebrationsToggle) {
            const isEnabled = localStorage.getItem('completion-celebrations') !== 'false';
            if (!isEnabled) completionCelebrationsToggle.classList.remove('active');
            
            completionCelebrationsToggle.addEventListener('click', () => {
                const enabled = completionCelebrationsToggle.classList.contains('active');
                if (enabled) {
                    completionCelebrationsToggle.classList.remove('active');
                    localStorage.setItem('completion-celebrations', 'false');
                    this.tracker.showNotification('Completion celebrations disabled');
                } else {
                    completionCelebrationsToggle.classList.add('active');
                    localStorage.setItem('completion-celebrations', 'true');
                    this.tracker.showNotification('Completion celebrations enabled');
                }
            });
        }
    }

    applySavedSettings() {
        // Apply all visual settings to ensure settings page inherits them
        this.applyAllVisualSettings();
        
        // Apply dark mode if saved
        if (this.tracker.isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    // Apply all visual settings to ensure consistency across all pages
    applyAllVisualSettings() {
        // Apply performance mode
        if (localStorage.getItem('performanceMode') === 'true') {
            document.body.classList.add('performance-mode');
        }
        
        // Apply glassmorphism enhancement
        if (localStorage.getItem('glassmorphismEnhanced') === 'true') {
            document.body.classList.add('glassmorphism-enhanced');
        }
        
        // Apply animations setting
        if (localStorage.getItem('animationsEnabled') === 'false') {
            document.body.classList.add('animations-disabled');
        }
        
        // Ensure settings page elements inherit the styling
        this.applySettingsPageStyling();
    }

    // Ensure settings page elements inherit all visual changes
    applySettingsPageStyling() {
        const settingsContent = document.getElementById('settings-content');
        if (!settingsContent) return;

        // Apply performance mode to settings elements
        if (localStorage.getItem('performanceMode') === 'true') {
            settingsContent.classList.add('performance-mode');
        } else {
            settingsContent.classList.remove('performance-mode');
        }

        // Apply glassmorphism enhancement to settings elements
        if (localStorage.getItem('glassmorphismEnhanced') === 'true') {
            settingsContent.classList.add('glassmorphism-enhanced');
        } else {
            settingsContent.classList.remove('glassmorphism-enhanced');
        }

        // Apply animations setting to settings elements
        if (localStorage.getItem('animationsEnabled') === 'false') {
            settingsContent.classList.add('animations-disabled');
        } else {
            settingsContent.classList.remove('animations-disabled');
        }

        // Apply styling to individual toggle switches
        this.applyToggleSwitchStyling();
    }

    // Apply visual styling specifically to toggle switches
    applyToggleSwitchStyling() {
        const toggleSwitches = document.querySelectorAll('.toggle-switch');
        
        toggleSwitches.forEach(toggle => {
            // Remove existing classes
            toggle.classList.remove('performance-mode', 'glassmorphism-enhanced', 'animations-disabled');
            
            // Apply current visual settings
            if (localStorage.getItem('performanceMode') === 'true') {
                toggle.classList.add('performance-mode');
            }
            
            if (localStorage.getItem('glassmorphismEnhanced') === 'true') {
                toggle.classList.add('glassmorphism-enhanced');
            }
            
            if (localStorage.getItem('animationsEnabled') === 'false') {
                toggle.classList.add('animations-disabled');
            }
        });
    }

    // Initialize VFX buttons in settings page
    initializeSettingsVFXButtons() {
        const settingsVisualEffectsBtn = document.getElementById('settings-visual-effects-btn');
        const settingsAnimationsBtn = document.getElementById('settings-animations-btn');

        if (settingsVisualEffectsBtn) {
            settingsVisualEffectsBtn.addEventListener('click', () => {
                const isEnabled = localStorage.getItem('visualEffectsEnabled') !== 'false';
                const newState = !isEnabled;
                localStorage.setItem('visualEffectsEnabled', newState.toString());
                
                if (newState) {
                    // Visual Effects ON = Enhanced Glassmorphism
                    document.body.classList.add('glassmorphism-enhanced');
                    document.body.classList.remove('performance-mode');
                } else {
                    // Visual Effects OFF = Performance Mode
                    document.body.classList.remove('glassmorphism-enhanced');
                    document.body.classList.add('performance-mode');
                }
                
                settingsVisualEffectsBtn.classList.toggle('active');
                this.tracker.showNotification(newState ? 'Visual effects enabled (Enhanced Glass)' : 'Visual effects disabled (Performance Mode)');
                
                // Sync with toolbar and toggle switch
                this.syncWithToolbar('visual-effects', newState);
                this.syncVFXControls();
                this.applyToggleSwitchStyling();
            });
        }

        if (settingsAnimationsBtn) {
            settingsAnimationsBtn.addEventListener('click', () => {
                const isEnabled = localStorage.getItem('animationsEnabled') !== 'false';
                const newState = !isEnabled;
                localStorage.setItem('animationsEnabled', newState.toString());
                
                if (newState) {
                    document.body.classList.remove('animations-disabled');
                } else {
                    document.body.classList.add('animations-disabled');
                }
                
                settingsAnimationsBtn.classList.toggle('active');
                this.tracker.showNotification(newState ? 'Animations enabled' : 'Animations disabled');
                this.tracker.renderAssignments(); // Re-render to apply animation changes
                
                // Sync with toolbar and toggle switch
                this.syncWithToolbar('animations', newState);
                this.syncVFXControls();
                this.applyToggleSwitchStyling();
            });
        }
    }

    // Sync VFX controls between buttons and toggle switches
    syncVFXControls() {
        // Update toggle switches to match VFX button states
        const visualEffectsToggle = document.getElementById('visual-effects-toggle');
        const animationsToggle = document.getElementById('animations-toggle');

        if (visualEffectsToggle) {
            const isActive = localStorage.getItem('visualEffectsEnabled') !== 'false';
            visualEffectsToggle.classList.toggle('active', isActive);
        }

        if (animationsToggle) {
            const isActive = localStorage.getItem('animationsEnabled') !== 'false';
            animationsToggle.classList.toggle('active', isActive);
        }

        // Apply visual settings
        this.applyAllVisualSettings();
    }

    // Sync settings toggles with toolbar buttons
    syncWithToolbar(type, newState) {
        let toolbarButtonId;
        switch (type) {
            case 'visual-effects':
                toolbarButtonId = 'visual-effects-btn';
                break;
            case 'animations':
                toolbarButtonId = 'animations-btn';
                break;
        }
        
        if (toolbarButtonId) {
            const toolbarButton = document.getElementById(toolbarButtonId);
            if (toolbarButton) {
                // Update toolbar button state to match toggle
                if (newState) {
                    toolbarButton.classList.add('active');
                } else {
                    toolbarButton.classList.remove('active');
                }
                
                // Add visual feedback with accent color and glow
                toolbarButton.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                if (newState) {
                    toolbarButton.style.background = 'var(--accent-color)';
                    toolbarButton.style.borderColor = 'var(--accent-color)';
                    toolbarButton.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)';
                    toolbarButton.style.transform = 'translateY(-2px)';
                } else {
                    toolbarButton.style.background = '';
                    toolbarButton.style.borderColor = '';
                    toolbarButton.style.boxShadow = '';
                    toolbarButton.style.transform = '';
                }
            }
        }
    }

    // Ensure assignments remain visible and functional in performance mode
    ensureAssignmentsVisible() {
        const assignments = document.querySelectorAll('.assignment-card');
        assignments.forEach(card => {
            card.style.display = 'block';
            card.style.visibility = 'visible';
            card.style.opacity = '1';
        });
        
        const containers = document.querySelectorAll('.assignments-container, .assignments-grid');
        containers.forEach(container => {
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '0.75rem';
        });
        
        console.log('Ensured assignments visibility in performance mode');
    }

    // Fix visual effects application
    applyVisualEffects(enabled) {
        console.log(`🎨 Applying visual effects: ${enabled ? 'ON' : 'OFF'}`);
        
        // Remove conflicting classes first
        document.body.classList.remove('glassmorphism-enhanced', 'performance-mode', 'no-glassmorphism');
        
        // Force style recalculation
        document.body.offsetHeight;
        
        if (enabled) {
            // Enhanced glassmorphism mode
            document.body.classList.add('glassmorphism-enhanced');
            console.log('✨ Enhanced glassmorphism enabled');
            
            // Ensure assignments remain visible when enabling visual effects
            this.ensureAssignmentsVisible();
        } else {
            // Performance mode
            document.body.classList.add('performance-mode', 'no-glassmorphism');
            console.log('⚡ Performance mode enabled');
        }
        
        // Ensure content remains visible and settings are protected
        this.ensureAssignmentsVisible();
        this.protectSettingsVisibility();
        
        // Ensure toolbar stays frontmost
        if (window.tracker && window.tracker.ensureToolbarFrontmost) {
            window.tracker.ensureToolbarFrontmost();
        }
        
        // Update all toggles and buttons
        this.syncVFXControls();
        
        // Save state
    }

    // Protect settings visibility during toggles to prevent disappearing
    protectSettingsVisibility() {
        const settingsView = document.getElementById('settings-view');
        const settingsContent = document.getElementById('settings-content');
        
        if (settingsView) {
            settingsView.style.display = 'block';
            settingsView.style.visibility = 'visible';
            settingsView.style.opacity = '1';
            settingsView.style.position = 'relative';
            settingsView.style.zIndex = '10';
        }
        
        if (settingsContent) {
            settingsContent.style.display = 'block';
            settingsContent.style.visibility = 'visible';
            settingsContent.style.opacity = '1';
            settingsContent.style.position = 'relative';
            settingsContent.style.zIndex = '10';
        }
        
        // Force all settings sections to remain visible
        const settingsSections = settingsContent?.querySelectorAll('.settings-section');
        settingsSections?.forEach(section => {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
        });
        
        // Ensure all toggles remain functional
        const toggles = settingsContent?.querySelectorAll('.toggle-switch');
        toggles?.forEach(toggle => {
            toggle.style.pointerEvents = 'auto';
            toggle.style.visibility = 'visible';
            toggle.style.opacity = '1';
        });
    }

    // Ensure settings page works properly in performance mode and with animations disabled
    ensurePerformanceModeCompatibility() {
        console.log('Ensuring performance mode compatibility...');
        
        const settingsContent = document.getElementById('settings-content');
        const settingsView = document.getElementById('settings-view');
        const isAnimationsDisabled = document.body.classList.contains('animations-disabled');
        
        if (settingsContent) {
            // Force visibility and functionality
            settingsContent.style.display = 'block';
            settingsContent.style.visibility = 'visible';
            settingsContent.style.opacity = '1';
            settingsContent.style.position = 'relative';
            settingsContent.style.zIndex = isAnimationsDisabled ? '10' : '1';
            
            // Ensure all sections are visible
            const settingsSections = settingsContent.querySelectorAll('.settings-section');
            settingsSections.forEach(section => {
                section.style.display = 'block';
                section.style.visibility = 'visible';
                section.style.opacity = '1';
                section.style.position = 'relative';
                section.style.zIndex = '1';
            });
        }
        
        if (settingsView) {
            // Ensure settings view is visible
            settingsView.style.display = 'block';
            settingsView.style.visibility = 'visible';
            settingsView.style.opacity = '1';
            settingsView.style.position = 'relative';
            settingsView.style.zIndex = isAnimationsDisabled ? '10' : '1';
        }
        
        // Ensure all interactive elements are functional
        const interactiveElements = settingsContent?.querySelectorAll('button, input, select, .toggle-switch');
        interactiveElements?.forEach(element => {
            element.style.pointerEvents = 'auto';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            element.style.position = 'relative';
        });
        
        console.log('Performance mode compatibility ensured');
    }

    // Update premium UI state based on current premium/trial status
    updatePremiumUIState() {
        const isPremium = this.isPremiumUser();
        
        if (isPremium) {
            // User has premium access (trial or paid)
            this.enablePremiumFeatures();
            this.hidePremiumBanners();
            this.updateTrialStatus();
        } else {
            // User doesn't have premium access
            this.disablePremiumFeatures();
            this.showPremiumBanners();
        }
    }

    enablePremiumFeatures() {
        // Remove blur and enable premium controls
        document.querySelectorAll('.premium-feature .premium-overlay').forEach(overlay => {
            overlay.style.display = 'none';
        });
        
        document.querySelectorAll('.premium-feature .blurred').forEach(element => {
            element.classList.remove('blurred');
            const inputs = element.querySelectorAll('input, button');
            inputs.forEach(input => input.disabled = false);
        });
        
        // Enable custom color inputs
        ['primary-color', 'secondary-color', 'accent-color'].forEach(colorType => {
            const input = document.getElementById(colorType);
            if (input) {
                input.disabled = false;
            }
        });
        
        // Enable image upload
        const imageInput = document.getElementById('background-image-input');
        if (imageInput) {
            imageInput.disabled = false;
        }
    }

    disablePremiumFeatures() {
        // Show blur and disable premium controls
        document.querySelectorAll('.premium-feature .premium-overlay').forEach(overlay => {
            overlay.style.display = 'flex';
        });
        
        document.querySelectorAll('.premium-feature .color-controls, .premium-feature .upload-area').forEach(element => {
            element.classList.add('blurred');
            const inputs = element.querySelectorAll('input, button');
            inputs.forEach(input => input.disabled = true);
        });
    }

    hidePremiumBanners() {
        // Hide premium upgrade banners
        document.querySelectorAll('.premium-badge').forEach(badge => {
            badge.style.display = 'none';
        });
    }

    showPremiumBanners() {
        // Show premium upgrade banners
        document.querySelectorAll('.premium-badge').forEach(badge => {
            badge.style.display = 'inline';
        });
    }

    updateTrialStatus() {
        const trialStart = localStorage.getItem('trial-start');
        if (trialStart) {
            const trialDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
            const now = Date.now();
            const timeLeft = trialDuration - (now - parseInt(trialStart));
            const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));
            
            if (daysLeft > 0) {
                // Show trial status
                this.showTrialStatus(daysLeft);
            }
        }
    }

    showTrialStatus(daysLeft) {
        // Add trial status indicator if not already present
        let trialIndicator = document.querySelector('.trial-status');
        if (!trialIndicator) {
            trialIndicator = document.createElement('div');
            trialIndicator.className = 'trial-status';
            trialIndicator.innerHTML = `
                <div class="trial-info">
                    <span class="trial-icon">💎</span>
                    <span class="trial-text">Premium Trial Active - ${daysLeft} days left</span>
                </div>
            `;
            
            // Insert at the top of settings content
            const settingsContent = document.getElementById('settings-content');
            if (settingsContent && settingsContent.firstChild) {
                settingsContent.insertBefore(trialIndicator, settingsContent.firstChild);
            }
        } else {
            // Update existing indicator
            const trialText = trialIndicator.querySelector('.trial-text');
            if (trialText) {
                trialText.textContent = `Premium Trial Active - ${daysLeft} days left`;
            }
        }
    }

    applyColorPalette(paletteName) {
        const palette = this.colorPalettes[paletteName];
        if (!palette) return;

        // Disable transitions for instant application
        document.documentElement.style.transition = 'none';
        
        // Apply colors instantly
        document.documentElement.style.setProperty('--primary-color', palette.primary);
        document.documentElement.style.setProperty('--secondary-color', palette.secondary);
        document.documentElement.style.setProperty('--accent-color', palette.accent);

        // Force immediate style application
        document.documentElement.offsetHeight;

        localStorage.setItem('primary-color', palette.primary);
        localStorage.setItem('secondary-color', palette.secondary);
        localStorage.setItem('accent-color', palette.accent);

        // Update color inputs
        const primaryInput = document.getElementById('primary-color');
        const secondaryInput = document.getElementById('secondary-color');
        const accentInput = document.getElementById('accent-color');

        if (primaryInput) primaryInput.value = palette.primary;
        if (secondaryInput) secondaryInput.value = palette.secondary;
        if (accentInput) accentInput.value = palette.accent;

        // Re-enable transitions after brief delay
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 50);

        this.tracker.showNotification(`${paletteName.charAt(0).toUpperCase() + paletteName.slice(1)} palette applied!`);
    }

    isPremiumUser() {
        const isPremium = localStorage.getItem('premium-user') === 'true';
        const trialStart = localStorage.getItem('trial-start');
        
        if (isPremium && trialStart) {
            const trialDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
            const now = Date.now();
            const trialExpired = (now - parseInt(trialStart)) > trialDuration;
            
            if (trialExpired) {
                // Trial expired, remove premium status
                localStorage.removeItem('premium-user');
                localStorage.removeItem('trial-start');
                return false;
            }
        }
        
        return isPremium;
    }

    showUpgradeModal(feature) {
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal';
        modal.innerHTML = `
            <div class="upgrade-content glass-card">
                <div class="upgrade-header">
                    <h2>💎 Upgrade to Premium</h2>
                    <button class="close-btn" onclick="this.closest('.upgrade-modal').remove()">×</button>
                </div>
                
                <div class="upgrade-body">
                    <div class="feature-highlight">
                        ${this.getFeatureContent(feature)}
                    </div>
                    
                    <div class="premium-benefits">
                        <h3>Premium Benefits Include:</h3>
                        <ul>
                            <li>🎨 Custom color schemes</li>
                            <li>🖼️ Custom background images</li>
                            <li>📊 Advanced analytics</li>
                            <li>☁️ Cloud sync across devices</li>
                            <li>✨ Premium themes & effects</li>
                            <li>🔔 Enhanced notifications</li>
                        </ul>
                    </div>
                    
                    <div class="pricing">
                        <div class="price-tag">
                            <span class="price">$4.99</span>
                            <span class="period">/month</span>
                        </div>
                        <p class="price-note">Cancel anytime • 7-day free trial</p>
                    </div>
                </div>
                
                <div class="upgrade-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.upgrade-modal').remove()">
                        Maybe Later
                    </button>
                    <button class="btn btn-premium" onclick="settingsManager.startTrial()">
                        Start Free Trial
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add click outside to close
        setTimeout(() => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }, 100);
    }

    getFeatureContent(feature) {
        switch (feature) {
            case 'custom-colors':
                return `
                    <div class="feature-icon">🎨</div>
                    <h4>Custom Color Schemes</h4>
                    <p>Create unlimited custom color palettes to match your personal style and preferences.</p>
                `;
            case 'custom-images':
                return `
                    <div class="feature-icon">🖼️</div>
                    <h4>Custom Background Images</h4>
                    <p>Upload your own photos and images to create a truly personalized workspace.</p>
                `;
            default:
                return `
                    <div class="feature-icon">💎</div>
                    <h4>Premium Features</h4>
                    <p>Unlock advanced customization and productivity features.</p>
                `;
        }
    }

    startTrial() {
        // Check if activated through dev controls
        const devActivated = localStorage.getItem('dev-premium') === 'true';
        
        if (devActivated) {
            // Dev activation - no card required
            localStorage.setItem('premium-user', 'true');
            localStorage.setItem('trial-start', Date.now().toString());
            
            // Close modal
            const modal = document.querySelector('.upgrade-modal');
            if (modal) modal.remove();
            
            // Show success message
            this.tracker.showNotification('🎉 Premium trial started via dev controls!', 'success');
            
            // Refresh premium UI state
            this.updatePremiumUIState();
        } else {
            // Regular user - require card entry
            this.showCardEntryModal();
        }
    }

    enablePremiumFeatures() {
        // Remove blur and enable premium controls
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

    handleBackgroundTypeChange(type) {
        const patternOptions = document.getElementById('pattern-options');
        const imageUploadSection = document.getElementById('image-upload-section');
        const liveWallpaperSection = document.getElementById('live-wallpaper-section');
        const backgroundColorInput = document.getElementById('background-color');
        const gradientControls = document.getElementById('gradient-controls');
        
        // Hide all sections first
        if (patternOptions) patternOptions.style.display = 'none';
        if (imageUploadSection) imageUploadSection.style.display = 'none';
        if (liveWallpaperSection) liveWallpaperSection.style.display = 'none';
        if (backgroundColorInput) backgroundColorInput.style.display = 'none';
        if (gradientControls) gradientControls.style.display = 'none';
        
        switch (type) {
            case 'gradient':
                if (gradientControls) gradientControls.style.display = 'block';
                break;
            case 'pattern':
                patternOptions.style.display = 'block';
                break;
            case 'image':
                imageUploadSection.style.display = 'block';
                break;
            case 'live':
                if (liveWallpaperSection) liveWallpaperSection.style.display = 'block';
                if (!this.isPremiumUser()) {
                    this.showUpgradeModal('live-wallpapers');
                } else {
                    // Initialize live wallpaper manager if premium
                    if (window.liveWallpaperManager) {
                        window.liveWallpaperManager.loadSavedWallpaper();
                    }
                }
                break;
            case 'solid':
                backgroundColorInput.style.display = 'block';
                break;
            case 'gradient':
                if (this.backgroundManager) {
                    this.backgroundManager.applyGradientBackground();
                }
                break;
        }

        localStorage.setItem('background-type', type);
    }

    async connectToCanvas(canvasUrl, canvasToken) {
        try {
            // Validate URL format
            if (!canvasUrl || !canvasUrl.startsWith('http')) {
                throw new Error('Please enter a valid Canvas URL (e.g., https://yourschool.instructure.com)');
            }

            // Remove trailing slash if present
            canvasUrl = canvasUrl.replace(/\/$/, '');
            
            // Test the connection by fetching user data
            const response = await fetch(`${canvasUrl}/api/v1/users/self`, {
                headers: {
                    'Authorization': `Bearer ${canvasToken || ''}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API token. Please check your token and try again.');
                } else if (response.status === 404) {
                    throw new Error('Invalid Canvas URL. Please check the URL and try again.');
                } else {
                    throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
                }
            }

            const userData = await response.json();
            
            // Store the actual user data
            localStorage.setItem('canvas-user-name', userData.name || 'Canvas User');
            localStorage.setItem('canvas-user-email', userData.login_id || userData.email || '');
            localStorage.setItem('canvas-user-id', userData.id);
            
            // Store the connection details
            localStorage.setItem('canvasURL', canvasUrl);
            if (canvasToken) {
                localStorage.setItem('canvasToken', canvasToken);
            }
            
            // Update the UI
            document.getElementById('canvas-status').textContent = 'Connected';
            document.getElementById('canvas-status').className = 'status connected';
            
            // Update account info display
            const accountName = document.getElementById('canvas-account-name');
            const accountEmail = document.getElementById('canvas-account-email');
            if (accountName) accountName.textContent = userData.name || 'Canvas User';
            if (accountEmail) accountEmail.textContent = userData.login_id || userData.email || '';
            
            // Enable sync button if available
            const syncButton = document.getElementById('sync-now-btn');
            if (syncButton) {
                syncButton.disabled = false;
            }
            
            return userData;
            
        } catch (error) {
            console.error('Canvas connection error:', error);
            
            // Clear any stored credentials on error
            localStorage.removeItem('canvasToken');
            localStorage.removeItem('canvas-user-name');
            localStorage.removeItem('canvas-user-email');
            localStorage.removeItem('canvas-user-id');
            
            // Update UI to show error state
            const statusElement = document.getElementById('canvas-status');
            if (statusElement) {
                statusElement.textContent = 'Connection failed';
                statusElement.className = 'status error';
            }
            
            throw error; // Re-throw to be caught by the caller
        }
    }

    async toggleGoogleIntegration() {
        if (this.tracker.googleConnected) {
            // Disconnect
            this.tracker.googleConnected = false;
            localStorage.setItem('googleConnected', 'false');
            this.tracker.showNotification('Google Classroom disconnected');
        } else {
            // Connect
            try {
                await this.connectToGoogle();
                this.tracker.googleConnected = true;
                localStorage.setItem('googleConnected', 'true');
                this.tracker.showNotification('Google Classroom connected successfully!');
            } catch (error) {
                this.tracker.showNotification('Failed to connect to Google Classroom', 'error');
            }
        }
        
        // Update UI after toggle
        this.updateIntegrationUI();
    }

    // Apply background changes when the apply button is clicked
    applyBackgroundChanges() {
        const backgroundType = document.getElementById('background-type');
        const backgroundColor = document.getElementById('background-color');
        const selectedPattern = document.querySelector('.pattern-option.selected');
        
        if (!backgroundType) return;
        
        const type = backgroundType.value;
        
        // Apply the background based on selected type
        switch (type) {
            case 'gradient':
                if (this.backgroundManager) {
                    this.backgroundManager.applyGradientBackground();
                }
                break;
            case 'pattern':
                if (selectedPattern && this.backgroundManager) {
                    const patternName = selectedPattern.dataset.pattern;
                    this.backgroundManager.applyPattern(patternName);
                }
                break;
            case 'image':
                if (this.backgroundManager) {
                    this.backgroundManager.applyImageBackground();
                }
                break;
            case 'solid':
                if (backgroundColor && this.backgroundManager) {
                    const color = backgroundColor.value;
                    localStorage.setItem('background-solid-color', color);
                    this.backgroundManager.applySolidBackground();
                }
                break;
        }
        
        // Save the background type
        localStorage.setItem('background-type', type);
        
        // Show success notification
        this.tracker.showNotification(`Background applied successfully! (${type.charAt(0).toUpperCase() + type.slice(1)})`, 'success');
        
        // Add visual feedback to the button
        const applyBtn = document.getElementById('apply-background-btn');
        if (applyBtn) {
            const originalText = applyBtn.innerHTML;
            applyBtn.innerHTML = '<span class="apply-icon">✅</span>Applied!';
            applyBtn.style.background = 'var(--success-color, #10b981)';
            
            setTimeout(() => {
                applyBtn.innerHTML = originalText;
                applyBtn.style.background = '';
            }, 2000);
        }
    }

    async toggleCanvasIntegration() {
        if (this.tracker.canvasConnected) {
            // Disconnect
            this.tracker.canvasConnected = false;
            localStorage.setItem('canvasConnected', 'false');
            localStorage.removeItem('canvas-user-name');
            localStorage.removeItem('canvas-user-email');
            this.tracker.showNotification('Canvas LMS disconnected');
        } else {
            // Connect
            const canvasUrl = document.getElementById('canvas-url')?.value;
            const canvasToken = document.getElementById('canvas-token')?.value;
            
            if (!canvasUrl) {
                this.tracker.showNotification('Please enter your Canvas URL', 'error');
                return;
            }
            
            try {
                // Save the URL and token
                localStorage.setItem('canvasURL', canvasUrl);
                if (canvasToken) {
                    localStorage.setItem('canvasToken', canvasToken);
                }
                
                await this.connectToCanvas(canvasUrl, canvasToken);
                this.tracker.canvasConnected = true;
                localStorage.setItem('canvasConnected', 'true');
                this.tracker.showNotification('Canvas LMS connected successfully!');
            } catch (error) {
                this.tracker.showNotification('Failed to connect to Canvas LMS: ' + error.message, 'error');
            }
        }
        
        // Update UI after toggle
        this.updateIntegrationUI();
    }

    async connectToGoogle() {
        // Simulate Google Classroom API connection
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // In a real implementation, this would handle Google OAuth
                resolve();
            }, 1000);
        });
    }

    updateIntegrationUI() {
        try {
            // Update Canvas integration UI
            const canvasToggle = document.getElementById('canvas-toggle');
            if (canvasToggle) {
                canvasToggle.classList.toggle('active', this.tracker.canvasConnected);
            }
            
            // Update Google integration UI  
            const googleToggle = document.getElementById('google-toggle');
            if (googleToggle) {
                googleToggle.classList.toggle('active', this.tracker.googleConnected);
            }
            
            // Re-render settings page to reflect changes
            this.renderSettingsPage();
        } catch (error) {
            console.error('Error updating integration UI:', error);
        }
    }

    showCanvasHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'help-modal';
        helpModal.innerHTML = `
            <div class="help-content glass-card">
                <div class="help-header">
                    <h2>🎨 Canvas API Token Setup</h2>
                    <button class="close-btn" onclick="this.closest('.help-modal').remove()">×</button>
                </div>
                
                <div class="help-body">
                    <h3>How to get your Canvas API Token:</h3>
                    <ol>
                        <li>Log into your Canvas account</li>
                        <li>Go to <strong>Account → Settings</strong></li>
                        <li>Scroll down to <strong>Approved Integrations</strong></li>
                        <li>Click <strong>+ New Access Token</strong></li>
                        <li>Enter a purpose (e.g., "StudyFlow Integration")</li>
                        <li>Set expiration date (optional)</li>
                        <li>Click <strong>Generate Token</strong></li>
                        <li>Copy the token and paste it here</li>
                    </ol>
                    
                    <div class="help-note">
                        <strong>Note:</strong> The API token is optional but provides enhanced features like:
                        <ul>
                            <li>Automatic assignment sync</li>
                            <li>Real-time updates</li>
                            <li>Grade information</li>
                            <li>Course details</li>
                        </ul>
                        Without the token, basic sync will still work using your Canvas URL.
                    </div>
                </div>
                
                <div class="help-actions">
                    <button class="btn btn-primary" onclick="this.closest('.help-modal').remove()">
                        Got it!
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(helpModal);
        
        // Add click outside to close
        setTimeout(() => {
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    helpModal.remove();
                }
            });
        }, 100);
    }

    exportData() {
        const data = {
            assignments: this.tracker.assignments,
            settings: {
                darkMode: this.tracker.isDarkMode,
                primaryColor: localStorage.getItem('primary-color'),
                secondaryColor: localStorage.getItem('secondary-color'),
                accentColor: localStorage.getItem('accent-color'),
                backgroundType: localStorage.getItem('background-type')
            },
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hw-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.tracker.showNotification('Data exported successfully!');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.assignments) {
                    this.tracker.assignments = data.assignments;
                    this.tracker.saveAssignments();
                }

                if (data.settings) {
                    Object.entries(data.settings).forEach(([key, value]) => {
                        if (value !== null && value !== undefined) {
                            localStorage.setItem(key, value.toString());
                        }
                    });
                }

                this.tracker.renderAssignments();
                this.tracker.showNotification('Data imported successfully!');
                
                // Refresh the page to apply all settings
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
            } catch (error) {
                this.tracker.showNotification('Failed to import data. Invalid file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        this.showClearDataConfirmation();
    }

    showClearDataConfirmation() {
        const modal = document.createElement('div');
        modal.className = 'clear-data-modal';
        modal.innerHTML = `
            <div class="clear-data-content glass-card">
                <div class="clear-data-header">
                    <h3>⚠️ Clear All Data</h3>
                </div>
                
                <div class="clear-data-body">
                    <div class="warning-icon">🗑️</div>
                    <p><strong>This will permanently delete:</strong></p>
                    <ul>
                        <li>All assignments and tasks</li>
                        <li>Settings and preferences</li>
                        <li>API connections</li>
                        <li>Completion streaks</li>
                        <li>All stored data</li>
                    </ul>
                    <p class="warning-text">This action cannot be undone!</p>
                    
                    <div class="clear-data-actions">
                        <button class="btn btn-secondary" onclick="this.closest('.clear-data-modal').remove()">
                            Cancel
                        </button>
                        <button class="btn danger-btn" onclick="settingsManager.confirmClearAllData()">
                            Clear All Data
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

    confirmClearAllData() {
        localStorage.clear();
        this.tracker.assignments = [];
        this.tracker.renderAssignments();
        this.tracker.showNotification('All data cleared successfully!');
        
        // Close modal
        const modal = document.querySelector('.clear-data-modal');
        if (modal) modal.remove();
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // Add method to handle individual feature purchases
    purchaseFeature(featureName) {
        const modal = document.createElement('div');
        modal.className = 'purchase-modal';
        modal.innerHTML = `
            <div class="purchase-content glass-card">
                <div class="purchase-header">
                    <h2>💳 Purchase Feature</h2>
                    <button class="close-btn" onclick="this.closest('.purchase-modal').remove()">×</button>
                </div>
                
                <div class="purchase-body">
                    <div class="feature-info">
                        <h3>${this.getFeatureName(featureName)}</h3>
                        <p>${this.getFeatureDescription(featureName)}</p>
                    </div>
                    
                    <div class="purchase-options">
                        <div class="option-card">
                            <h4>Individual Feature</h4>
                            <div class="price">$1.99</div>
                            <p>One-time purchase</p>
                            <button class="btn btn-primary" onclick="settingsManager.buyIndividualFeature('${featureName}')">
                                Buy Now
                            </button>
                        </div>
                        
                        <div class="option-card recommended">
                            <div class="recommended-badge">Best Value</div>
                            <h4>Premium Bundle</h4>
                            <div class="price">$4.99<span class="period">/month</span></div>
                            <p>All premium features</p>
                            <button class="btn btn-premium" onclick="settingsManager.startTrial()">
                                Start Trial
                            </button>
                        </div>
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

    getFeatureName(feature) {
        const names = {
            'custom-colors': 'Custom Color Schemes',
            'custom-images': 'Custom Background Images',
            'advanced-analytics': 'Advanced Analytics',
            'cloud-sync': 'Cloud Sync',
            'premium-themes': 'Premium Themes'
        };
        return names[feature] || feature;
    }

    getFeatureDescription(feature) {
        const descriptions = {
            'custom-colors': 'Create unlimited custom color palettes to personalize your workspace.',
            'custom-images': 'Upload your own background images for a unique experience.',
            'advanced-analytics': 'Detailed insights into your productivity and study patterns.',
            'cloud-sync': 'Sync your data across all devices automatically.',
            'premium-themes': 'Access exclusive themes and visual effects.'
        };
        return descriptions[feature] || 'Unlock this premium feature to enhance your experience.';
    }

    buyIndividualFeature(featureName) {
        // Check if dev mode is enabled for instant purchase
        const devActivated = localStorage.getItem('dev-premium') === 'true';
        
        if (devActivated) {
            // Dev mode - instant purchase
            this.completePurchase(featureName);
        } else {
            // Regular user - show card entry
            this.showCardEntryModal(featureName);
        }
    }

    completePurchase(featureName) {
        try {
            // Simulate individual feature purchase
            const purchasedFeatures = JSON.parse(localStorage.getItem('purchased-features') || '[]');
            if (!purchasedFeatures.includes(featureName)) {
                purchasedFeatures.push(featureName);
                localStorage.setItem('purchased-features', JSON.stringify(purchasedFeatures));
                
                // Save purchase timestamp for persistence
                const purchaseData = {
                    feature: featureName,
                    timestamp: Date.now(),
                    method: localStorage.getItem('dev-premium') === 'true' ? 'dev' : 'card'
                };
                
                const purchaseHistory = JSON.parse(localStorage.getItem('purchase-history') || '[]');
                purchaseHistory.push(purchaseData);
                localStorage.setItem('purchase-history', JSON.stringify(purchaseHistory));
            }
            
            // Close modal
            const modal = document.querySelector('.purchase-modal, .card-entry-modal');
            if (modal) modal.remove();
            
            // Show success message
            this.tracker.showNotification(`🎉 ${this.getFeatureName(featureName)} purchased successfully!`, 'success');
            
            // Refresh settings
            this.renderSettingsPage();
            
        } catch (error) {
            console.error('Purchase failed:', error);
            this.tracker.showNotification('Purchase failed. Please try again.', 'error');
        }
    }

    showCardEntryModal(featureName = null) {
        const modal = document.createElement('div');
        modal.className = 'card-entry-modal';
        modal.innerHTML = `
            <div class="card-entry-content glass-card">
                <div class="card-entry-header">
                    <h2>💳 Payment Information</h2>
                    <button class="close-btn" onclick="this.closest('.card-entry-modal').remove()">×</button>
                </div>
                
                <div class="card-entry-body">
                    <div class="payment-form">
                        <div class="form-group">
                            <label for="card-number">Card Number</label>
                            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="expiry">Expiry</label>
                                <input type="text" id="expiry" placeholder="MM/YY" maxlength="5">
                            </div>
                            <div class="form-group">
                                <label for="cvv">CVV</label>
                                <input type="text" id="cvv" placeholder="123" maxlength="4">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cardholder-name">Cardholder Name</label>
                            <input type="text" id="cardholder-name" placeholder="John Doe">
                        </div>
                        
                        <div class="security-note">
                            <div class="security-icon">🔒</div>
                            <p>Your payment information is secure and encrypted</p>
                        </div>
                        
                        <div class="payment-actions">
                            <button class="btn btn-secondary" onclick="this.closest('.card-entry-modal').remove()">
                                Cancel
                            </button>
                            <button class="btn btn-primary" onclick="settingsManager.processPayment('${featureName || 'trial'}')">
                                ${featureName ? 'Complete Purchase' : 'Start Free Trial'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add card formatting
        this.setupCardFormatting();
        
        setTimeout(() => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }, 100);
    }

    setupCardFormatting() {
        const cardNumber = document.getElementById('card-number');
        const expiry = document.getElementById('expiry');
        
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                e.target.value = formattedValue;
            });
        }
        
        if (expiry) {
            expiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
    }

    processPayment(featureName) {
        // Validate form
        const cardNumber = document.getElementById('card-number').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        const name = document.getElementById('cardholder-name').value;
        
        if (!cardNumber || !expiry || !cvv || !name) {
            this.tracker.showNotification('Please fill in all payment fields', 'error');
            return;
        }
        
        // Simulate payment processing
        this.tracker.showNotification('Processing payment...', 'info');
        
        setTimeout(() => {
            if (featureName === 'trial') {
                // Complete trial setup
                localStorage.setItem('premium-user', 'true');
                localStorage.setItem('trial-start', Date.now().toString());
                localStorage.setItem('payment-method-saved', 'true');
                
                this.tracker.showNotification('🎉 Free trial started! Payment method saved.', 'success');
                
                // Close modal and refresh UI state
                const modal = document.querySelector('.card-entry-modal');
                if (modal) modal.remove();
                this.updatePremiumUIState();
            } else {
                // Complete feature purchase
                this.completePurchase(featureName);
            }
        }, 2000);
    }

    hasFeatureAccess(featureName) {
        // Check if user has premium or purchased individual feature
        const isPremium = this.isPremiumUser();
        const purchasedFeatures = JSON.parse(localStorage.getItem('purchased-features') || '[]');
        return isPremium || purchasedFeatures.includes(featureName);
    }

    // Translation support methods
    applyTranslation(language) {
        if (language === 'en') return; // No translation needed for English
        
        // Show translation indicator
        this.showTranslationIndicator(language);
        
        // Translate assignment titles and descriptions
        this.tracker.assignments.forEach(assignment => {
            if (assignment.originalTitle && assignment.originalDescription) {
                // Already has original stored, translate from original
                this.translateText(assignment.originalTitle, language).then(translatedTitle => {
                    assignment.title = translatedTitle;
                    this.tracker.renderAssignments();
                });
                
                this.translateText(assignment.originalDescription, language).then(translatedDesc => {
                    assignment.description = translatedDesc;
                    this.tracker.renderAssignments();
                });
            } else {
                // Store original and translate
                assignment.originalTitle = assignment.title;
                assignment.originalDescription = assignment.description;
                
                this.translateText(assignment.title, language).then(translatedTitle => {
                    assignment.title = translatedTitle;
                    this.tracker.renderAssignments();
                });
                
                this.translateText(assignment.description, language).then(translatedDesc => {
                    assignment.description = translatedDesc;
                    this.tracker.renderAssignments();
                });
            }
        });
    }

    async translateText(text, targetLanguage) {
        if (!text || targetLanguage === 'en') return text;
        
        try {
            // Use browser's built-in translation or Google Translate API
            // For now, we'll use a simple mock translation
            return `[${targetLanguage.toUpperCase()}] ${text}`;
        } catch (error) {
            console.error('Translation failed:', error);
            return text;
        }
    }

    showTranslationIndicator(language) {
        let indicator = document.querySelector('.translation-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'translation-indicator';
            document.body.appendChild(indicator);
        }
        
        const languageNames = {
            'es': 'Español', 'fr': 'Français', 'de': 'Deutsch', 'it': 'Italiano',
            'pt': 'Português', 'ru': 'Русский', 'zh': '中文', 'ja': '日本語', 'ko': '한국어'
        };
        
        indicator.textContent = `Translating to ${languageNames[language] || language}...`;
        indicator.classList.add('visible');
        
        setTimeout(() => {
            indicator.classList.remove('visible');
        }, 3000);
    }

    // Initialize background state to show current selection
    initializeBackgroundState() {
        const currentBackgroundType = localStorage.getItem('background-type') || 'gradient';
        console.log('🎨 Initializing background state:', currentBackgroundType);
        
        // Set the background type selector
        const backgroundTypeSelect = document.getElementById('background-type');
        if (backgroundTypeSelect) {
            backgroundTypeSelect.value = currentBackgroundType;
            console.log('Background type selector set to:', currentBackgroundType);
        }
        
        // Show/hide appropriate sections based on current type
        this.handleBackgroundTypeChange(currentBackgroundType);
        
        // Set current video info if applicable
        const videoName = localStorage.getItem('live-wallpaper-name');
        const videoType = localStorage.getItem('live-wallpaper-type');
        if (videoName && videoType === 'video') {
            const currentVideoInfo = document.getElementById('current-video-info');
            const currentVideoName = document.getElementById('current-video-name');
            if (currentVideoInfo && currentVideoName) {
                currentVideoName.textContent = videoName;
                currentVideoInfo.style.display = 'block';
            }
        }
        
        // Initialize video upload event listeners
        this.initializeVideoUpload();
        
        // Initialize gradient color change listeners
        this.initializeGradientControls();
    }

    // Initialize video upload functionality
    initializeVideoUpload() {
        const videoUploadArea = document.getElementById('video-upload-area');
        const videoInput = document.getElementById('video-wallpaper-input');
        const removeVideoBtn = document.getElementById('remove-video-wallpaper');
        
        console.log('🎬 Initializing video upload...', {
            videoUploadArea: !!videoUploadArea,
            videoInput: !!videoInput,
            removeVideoBtn: !!removeVideoBtn,
            liveWallpaperManager: !!window.liveWallpaperManager
        });
        
        if (videoUploadArea && videoInput) {
            // Click handler for upload area
            videoUploadArea.addEventListener('click', () => {
                console.log('🎬 Video upload area clicked');
                if (window.liveWallpaperManager && window.liveWallpaperManager.isPremiumUser()) {
                    console.log('🎬 Premium user detected, opening file dialog');
                    videoInput.click();
                } else {
                    console.log('🎬 Not premium user, showing upgrade modal');
                    if (window.liveWallpaperManager) {
                        window.liveWallpaperManager.showUpgradeModal('Video wallpapers are a premium feature');
                    }
                }
            });
            
            // File change handler
            videoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && window.liveWallpaperManager) {
                    console.log('🎬 Video file selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
                    window.liveWallpaperManager.handleVideoUpload(file);
                    
                    // Update current video info
                    const currentVideoInfo = document.getElementById('current-video-info');
                    const currentVideoName = document.getElementById('current-video-name');
                    if (currentVideoInfo && currentVideoName) {
                        currentVideoName.textContent = file.name;
                        currentVideoInfo.style.display = 'block';
                    }
                }
            });
        }
        
        // Remove video button handler
        if (removeVideoBtn) {
            removeVideoBtn.addEventListener('click', () => {
                console.log('🎬 Removing video wallpaper');
                localStorage.removeItem('live-wallpaper-video');
                localStorage.removeItem('live-wallpaper-type');
                localStorage.removeItem('live-wallpaper-name');
                
                const currentVideoInfo = document.getElementById('current-video-info');
                if (currentVideoInfo) {
                    currentVideoInfo.style.display = 'none';
                }
                
                // Switch back to regular live wallpaper
                if (window.liveWallpaperManager) {
                    window.liveWallpaperManager.setWallpaper('particles');
                }
                
                this.tracker.showNotification('Video wallpaper removed', 'success');
            });
        }
    }

    // Initialize gradient color controls - Simplified to only handle top color options
    initializeGradientControls() {
        // No longer initializing gradient color pickers
        console.log('Gradient color pickers have been disabled');
    }

    // Apply settings page specific styling to ensure it inherits visual modes
    applySettingsPageStyling() {
        const settingsView = document.getElementById('settings-view');
        const settingsContent = document.getElementById('settings-content');
        
        if (!settingsView || !settingsContent) return;
        
        console.log('🎨 Applying settings page styling...');
        
        // Force settings to inherit body classes
        const bodyClasses = document.body.className;
        
        // Apply performance mode styling if active
        if (document.body.classList.contains('performance-mode')) {
            settingsView.classList.add('performance-mode');
            settingsContent.classList.add('performance-mode');
            console.log('⚡ Applied performance mode to settings');
        }
        
        // Apply animations disabled styling if active
        if (document.body.classList.contains('animations-disabled')) {
            settingsView.classList.add('animations-disabled');
            settingsContent.classList.add('animations-disabled');
            console.log('🚫 Applied animations-disabled to settings');
        }
        
        // Apply glassmorphism enhanced styling if active
        if (document.body.classList.contains('glassmorphism-enhanced')) {
            settingsView.classList.add('glassmorphism-enhanced');
            settingsContent.classList.add('glassmorphism-enhanced');
            console.log('✨ Applied glassmorphism-enhanced to settings');
        }
        
        // Force visibility regardless of mode
        this.forceSettingsVisibility();
        
        console.log('🎨 Settings page styling applied');
    }

    // Force settings visibility in all modes
    forceSettingsVisibility() {
        const settingsView = document.getElementById('settings-view');
        const settingsContent = document.getElementById('settings-content');
        
        if (settingsView) {
            settingsView.style.display = 'block !important';
            settingsView.style.visibility = 'visible !important';
            settingsView.style.opacity = '1 !important';
            settingsView.style.position = 'relative';
            settingsView.style.zIndex = '10';
            settingsView.style.width = '100%';
            settingsView.style.height = 'auto';
        }
        
        if (settingsContent) {
            settingsContent.style.display = 'block !important';
            settingsContent.style.visibility = 'visible !important';
            settingsContent.style.opacity = '1 !important';
            settingsContent.style.position = 'relative';
            settingsContent.style.width = '100%';
            settingsContent.style.height = 'auto';
        }
        
        // Force all settings sections to be visible
        const settingsSections = document.querySelectorAll('.settings-section');
        settingsSections.forEach(section => {
            section.style.display = 'block !important';
            section.style.visibility = 'visible !important';
            section.style.opacity = '1 !important';
        });
        
        // Force all toggle switches to be visible and functional
        const toggles = document.querySelectorAll('.toggle-switch');
        toggles.forEach(toggle => {
            toggle.style.display = 'flex !important';
            toggle.style.visibility = 'visible !important';
            toggle.style.opacity = '1 !important';
            toggle.style.pointerEvents = 'auto !important';
        });
        
        // Force all buttons to be visible and functional
        const buttons = settingsContent?.querySelectorAll('button, .btn');
        buttons?.forEach(button => {
            button.style.display = 'inline-block !important';
            button.style.visibility = 'visible !important';
            button.style.opacity = '1 !important';
            button.style.pointerEvents = 'auto !important';
        });
        
        console.log('🔧 Forced settings visibility');
    }

    // Enhanced protect settings visibility with more aggressive approach
    protectSettingsVisibility() {
        console.log('🛡️ Protecting settings visibility...');
        
        // Apply settings page styling first
        this.applySettingsPageStyling();
        
        // Force visibility
        this.forceSettingsVisibility();
        
        // Set up observer to maintain visibility
        this.setupSettingsVisibilityObserver();
        
        console.log('🛡️ Settings visibility protection complete');
    }

    // Set up mutation observer to maintain settings visibility
    setupSettingsVisibilityObserver() {
        const settingsView = document.getElementById('settings-view');
        if (!settingsView) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    
                    // Check if settings view is being hidden
                    const computedStyle = window.getComputedStyle(settingsView);
                    if (computedStyle.display === 'none' || 
                        computedStyle.visibility === 'hidden' || 
                        computedStyle.opacity === '0') {
                        
                        console.log('⚠️ Settings visibility compromised, restoring...');
                        this.forceSettingsVisibility();
                    }
                }
            });
        });
        
        observer.observe(settingsView, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        // Store observer for cleanup
        this.settingsObserver = observer;
    }

}
