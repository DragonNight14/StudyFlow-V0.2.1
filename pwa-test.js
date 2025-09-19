// PWA Testing and Validation Script
class PWATestSuite {
    constructor() {
        this.testResults = [];
        this.installPrompt = null;
        
        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            console.log('✅ PWA install prompt available');
        });
        
        // Listen for app installed
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed successfully');
        });
    }

    // Run comprehensive PWA tests
    async runAllTests() {
        console.log('🧪 Starting PWA Test Suite...');
        
        const tests = [
            this.testManifest,
            this.testServiceWorker,
            this.testOfflineSupport,
            this.testInstallability,
            this.testIcons,
            this.testCaching,
            this.testNotifications,
            this.testBackgroundSync
        ];

        for (const test of tests) {
            try {
                await test.call(this);
            } catch (error) {
                console.error(`Test failed: ${test.name}`, error);
            }
        }

        this.displayResults();
        return this.testResults;
    }

    // Test manifest.json
    async testManifest() {
        console.log('🔍 Testing manifest.json...');
        
        try {
            const response = await fetch('./manifest.json');
            const manifest = await response.json();
            
            const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
            const missingFields = requiredFields.filter(field => !manifest[field]);
            
            if (missingFields.length === 0) {
                this.addResult('Manifest', true, 'All required fields present');
                
                // Check icons
                if (manifest.icons && manifest.icons.length >= 2) {
                    this.addResult('Manifest Icons', true, `${manifest.icons.length} icons configured`);
                } else {
                    this.addResult('Manifest Icons', false, 'Insufficient icons (need at least 2)');
                }
                
                // Check display mode
                if (['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display)) {
                    this.addResult('Display Mode', true, `Display: ${manifest.display}`);
                } else {
                    this.addResult('Display Mode', false, `Invalid display mode: ${manifest.display}`);
                }
                
            } else {
                this.addResult('Manifest', false, `Missing fields: ${missingFields.join(', ')}`);
            }
        } catch (error) {
            this.addResult('Manifest', false, `Failed to load manifest: ${error.message}`);
        }
    }

    // Test service worker
    async testServiceWorker() {
        console.log('🔍 Testing Service Worker...');
        
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                
                if (registration) {
                    this.addResult('Service Worker', true, 'Service Worker registered');
                    
                    // Check if active
                    if (registration.active) {
                        this.addResult('SW Active', true, 'Service Worker is active');
                    } else {
                        this.addResult('SW Active', false, 'Service Worker not active');
                    }
                    
                    // Check update
                    await registration.update();
                    this.addResult('SW Update', true, 'Service Worker update check completed');
                    
                } else {
                    this.addResult('Service Worker', false, 'No Service Worker registration found');
                }
            } catch (error) {
                this.addResult('Service Worker', false, `SW error: ${error.message}`);
            }
        } else {
            this.addResult('Service Worker', false, 'Service Worker not supported');
        }
    }

    // Test offline support
    async testOfflineSupport() {
        console.log('🔍 Testing Offline Support...');
        
        try {
            // Test if main page is cached
            const cache = await caches.open('hw-tracker-static-v2.0');
            const cachedResponse = await cache.match('./index.html');
            
            if (cachedResponse) {
                this.addResult('Offline Support', true, 'Main page cached for offline use');
            } else {
                this.addResult('Offline Support', false, 'Main page not cached');
            }
            
            // Test cache storage
            const cacheNames = await caches.keys();
            if (cacheNames.length > 0) {
                this.addResult('Cache Storage', true, `${cacheNames.length} caches available`);
            } else {
                this.addResult('Cache Storage', false, 'No caches found');
            }
            
        } catch (error) {
            this.addResult('Offline Support', false, `Cache test failed: ${error.message}`);
        }
    }

    // Test installability
    testInstallability() {
        console.log('🔍 Testing Installability...');
        
        if (this.installPrompt) {
            this.addResult('Installability', true, 'Install prompt available');
        } else {
            // Check if already installed
            if (window.matchMedia('(display-mode: standalone)').matches) {
                this.addResult('Installability', true, 'App is already installed');
            } else {
                this.addResult('Installability', false, 'Install prompt not available');
            }
        }
        
        // Check if running as PWA
        if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
            this.addResult('PWA Mode', true, 'Running as installed PWA');
        } else {
            this.addResult('PWA Mode', false, 'Running in browser');
        }
    }

    // Test icons
    async testIcons() {
        console.log('🔍 Testing Icons...');
        
        const iconSizes = ['192x192', '512x512'];
        let validIcons = 0;
        
        for (const size of iconSizes) {
            try {
                const response = await fetch(`./icon-${size}.png`);
                if (response.ok) {
                    validIcons++;
                } else {
                    console.warn(`Icon ${size} not found`);
                }
            } catch (error) {
                console.warn(`Failed to load icon ${size}:`, error);
            }
        }
        
        if (validIcons === iconSizes.length) {
            this.addResult('Icons', true, `All ${validIcons} icons available`);
        } else {
            this.addResult('Icons', false, `Only ${validIcons}/${iconSizes.length} icons available`);
        }
    }

    // Test caching strategy
    async testCaching() {
        console.log('🔍 Testing Caching Strategy...');
        
        try {
            const cacheNames = await caches.keys();
            const staticCache = cacheNames.find(name => name.includes('static'));
            const dynamicCache = cacheNames.find(name => name.includes('dynamic'));
            
            if (staticCache) {
                const cache = await caches.open(staticCache);
                const cachedRequests = await cache.keys();
                this.addResult('Static Cache', true, `${cachedRequests.length} files cached`);
            } else {
                this.addResult('Static Cache', false, 'No static cache found');
            }
            
            if (dynamicCache) {
                this.addResult('Dynamic Cache', true, 'Dynamic cache available');
            } else {
                this.addResult('Dynamic Cache', false, 'No dynamic cache found');
            }
            
        } catch (error) {
            this.addResult('Caching', false, `Cache test failed: ${error.message}`);
        }
    }

    // Test notifications
    testNotifications() {
        console.log('🔍 Testing Notifications...');
        
        if ('Notification' in window) {
            const permission = Notification.permission;
            
            if (permission === 'granted') {
                this.addResult('Notifications', true, 'Notification permission granted');
            } else if (permission === 'default') {
                this.addResult('Notifications', false, 'Notification permission not requested');
            } else {
                this.addResult('Notifications', false, 'Notification permission denied');
            }
        } else {
            this.addResult('Notifications', false, 'Notifications not supported');
        }
        
        // Test push notifications
        if ('PushManager' in window) {
            this.addResult('Push Notifications', true, 'Push notifications supported');
        } else {
            this.addResult('Push Notifications', false, 'Push notifications not supported');
        }
    }

    // Test background sync
    testBackgroundSync() {
        console.log('🔍 Testing Background Sync...');
        
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            this.addResult('Background Sync', true, 'Background sync supported');
        } else {
            this.addResult('Background Sync', false, 'Background sync not supported');
        }
        
        // Test IndexedDB for offline queue
        if ('indexedDB' in window) {
            this.addResult('IndexedDB', true, 'IndexedDB available for offline storage');
        } else {
            this.addResult('IndexedDB', false, 'IndexedDB not available');
        }
    }

    // Add test result
    addResult(test, passed, message) {
        this.testResults.push({
            test,
            passed,
            message,
            timestamp: new Date().toISOString()
        });
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${test}: ${message}`);
    }

    // Display test results
    displayResults() {
        console.log('\n🧪 PWA Test Results Summary:');
        console.log('================================');
        
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        const percentage = Math.round((passed / total) * 100);
        
        console.log(`Overall Score: ${passed}/${total} (${percentage}%)`);
        
        if (percentage >= 80) {
            console.log('🎉 PWA is ready for testing!');
        } else if (percentage >= 60) {
            console.log('⚠️ PWA needs some improvements');
        } else {
            console.log('❌ PWA has significant issues');
        }
        
        // Show failed tests
        const failed = this.testResults.filter(r => !r.passed);
        if (failed.length > 0) {
            console.log('\n❌ Failed Tests:');
            failed.forEach(test => {
                console.log(`  - ${test.test}: ${test.message}`);
            });
        }
        
        // Create visual report
        this.createVisualReport();
    }

    // Create visual report in the UI
    createVisualReport() {
        const existingReport = document.getElementById('pwa-test-report');
        if (existingReport) {
            existingReport.remove();
        }
        
        const report = document.createElement('div');
        report.id = 'pwa-test-report';
        report.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 12px;
            max-width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;
        
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        const percentage = Math.round((passed / total) * 100);
        
        report.innerHTML = `
            <h3>🧪 PWA Test Report</h3>
            <p><strong>Score: ${passed}/${total} (${percentage}%)</strong></p>
            <div style="margin: 10px 0;">
                ${this.testResults.map(result => `
                    <div style="margin: 5px 0; display: flex; align-items: center;">
                        <span style="margin-right: 10px;">${result.passed ? '✅' : '❌'}</span>
                        <span><strong>${result.test}:</strong> ${result.message}</span>
                    </div>
                `).join('')}
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: #4f46e5;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            ">Close</button>
        `;
        
        document.body.appendChild(report);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (report.parentElement) {
                report.remove();
            }
        }, 30000);
    }

    // Trigger install prompt
    async triggerInstall() {
        if (this.installPrompt) {
            try {
                const result = await this.installPrompt.prompt();
                console.log('Install prompt result:', result);
                this.installPrompt = null;
                return result;
            } catch (error) {
                console.error('Install prompt failed:', error);
                return null;
            }
        } else {
            console.log('No install prompt available');
            return null;
        }
    }

    // Test notification
    async testNotificationSend() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                new Notification('PWA Test', {
                    body: 'Test notification from StudyFlow PWA',
                    icon: './icon-192x192.png',
                    badge: './icon-192x192.png'
                });
                return true;
            }
        }
        return false;
    }

    // Test offline functionality
    async testOfflineMode() {
        console.log('🔍 Testing offline mode...');
        
        // Simulate offline
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration && registration.active) {
                // Send message to SW to test offline queue
                registration.active.postMessage({
                    type: 'TEST_OFFLINE',
                    data: { test: true }
                });
                
                console.log('✅ Offline test message sent to service worker');
                return true;
            }
        }
        
        console.log('❌ Cannot test offline mode - no active service worker');
        return false;
    }
}

// Initialize PWA testing
const pwaTest = new PWATestSuite();

// Make available globally
window.pwaTest = pwaTest;
window.testPWA = () => pwaTest.runAllTests();
window.installPWA = () => pwaTest.triggerInstall();
window.testNotification = () => pwaTest.testNotificationSend();
window.testOffline = () => pwaTest.testOfflineMode();

console.log('🧪 PWA Testing Suite loaded. Available commands:');
console.log('  - testPWA() - Run all PWA tests');
console.log('  - installPWA() - Trigger install prompt');
console.log('  - testNotification() - Test notifications');
console.log('  - testOffline() - Test offline functionality');
