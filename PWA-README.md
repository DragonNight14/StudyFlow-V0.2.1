# StudyFlow - Progressive Web App (PWA) with Payment Integration

This document provides an overview of the PWA features and payment integration in StudyFlow.

## PWA Features

### Service Worker
- **Offline Support**: Caches static assets for offline use
- **Background Sync**: Syncs data when the connection is restored
- **Push Notifications**: For assignment reminders and updates
- **Installation**: Can be installed on the home screen

### Web App Manifest
- **Theming**: Custom theme colors and display modes
- **Icons**: Multiple icon sizes for different devices
- **Shortcuts**: Quick access to common actions
- **Payment Support**: Integrated payment request API

## Payment Integration

### Payment Flow
1. User selects a premium plan or feature
2. Payment UI is shown using the Payment Request API
3. Payment is processed securely
4. On success, premium features are unlocked

### Supported Payment Methods
- Credit/Debit Cards
- Digital Wallets (if configured)
- Other payment methods via payment processors

### Testing Payments
For testing, use these test card numbers:
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

## Development

### Service Worker
- **File**: `sw-enhanced.js`
- **Cache Name**: `studyflow-v2`
- **Update Process**: Automatically updates when files change

### Payment Integration
- **File**: `js/payments.js`
- **API**: Uses Payment Request API
- **Test Mode**: Simulated payments in development

## Building for Production

1. Update the version number in `manifest.json` and `sw-enhanced.js`
2. Test all payment flows
3. Verify offline functionality
4. Deploy to your hosting provider

## Troubleshooting

### Service Worker Issues
- Clear site data in browser settings
- Check console for errors
- Verify the service worker is registered

### Payment Issues
- Ensure your payment processor is configured
- Check browser support for Payment Request API
- Verify SSL is properly configured (required for payments)

## Security

- All payments are processed securely
- No payment data is stored on our servers
- Uses HTTPS for all connections

## Support

For issues with payments or PWA functionality, please contact support@studyflow.app
