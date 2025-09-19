// Simple Settings Manager for StudyFlow
class SimpleSettingsManager {
    constructor(tracker) {
        this.tracker = tracker;
        this.isInitialized = false;
    }

    renderSettingsPage() {
        console.log('SimpleSettingsManager.renderSettingsPage() called');
        
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
                                <span class="status">Not connected</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="integration-item">
                        <div class="integration-info">
                            <strong>Google Classroom</strong>
                            <div class="integration-details">
                                <span class="status">Not connected</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>🎨 Visual Settings</h3>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="dark-mode-toggle"> Dark Mode
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="animations-toggle" checked> Animations
                        </label>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>🔧 Debug Info</h3>
                    <div class="debug-info">
                        <strong>Status:</strong> Settings manager ready
                        <div class="debug-actions">
                            <button onclick="window.settingsManager.renderSettingsPage()" class="debug-btn">Reload Settings</button>
                            <button onclick="console.log(window.settingsManager)" class="debug-btn">Debug Info</button>
                        </div>
                    </div>
                </div>
            </section>
        `;

        console.log('Settings HTML rendered successfully');
        
        // Ensure settings container is visible
        settingsContainer.style.display = 'block';
        settingsContainer.style.opacity = '1';
        settingsContainer.style.visibility = 'visible';
        
        // Initialize event listeners
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.tracker.isDarkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.tracker.isDarkMode = e.target.checked;
                localStorage.setItem('darkMode', e.target.checked);
                document.body.classList.toggle('dark-mode', e.target.checked);
            });
        }

        // Animations toggle
        const animationsToggle = document.getElementById('animations-toggle');
        if (animationsToggle) {
            animationsToggle.addEventListener('change', (e) => {
                document.body.classList.toggle('no-animations', !e.target.checked);
                localStorage.setItem('animations', e.target.checked);
            });
        }
    }
}

// Make it available globally
window.SimpleSettingsManager = SimpleSettingsManager;
