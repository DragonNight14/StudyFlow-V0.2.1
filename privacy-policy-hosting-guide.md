# Privacy Policy Hosting Guide for StudyFlow

## Option 1: GitHub Pages (FREE - RECOMMENDED)

### Steps:
1. Create a new GitHub repository called `studyflow-privacy`
2. Upload your `privacy-policy.html` file
3. Go to repository Settings > Pages
4. Select "Deploy from a branch" > "main"
5. Your privacy policy will be available at:
   `https://yourusername.github.io/studyflow-privacy/privacy-policy.html`

### Benefits:
- Completely free
- Reliable hosting
- Easy to update
- Professional URL

## Option 2: Netlify (FREE)

### Steps:
1. Go to netlify.com
2. Drag and drop your `privacy-policy.html` file
3. Get instant URL like: `https://random-name.netlify.app`
4. Can customize domain later

## Option 3: Google Sites (FREE)

### Steps:
1. Go to sites.google.com
2. Create new site
3. Copy/paste content from privacy-policy.html
4. Publish and get URL

## Option 4: Your Own Website

If you have a website, upload the file to:
`https://yourwebsite.com/privacy-policy.html`

## For Google Play Store:

### Required Fields:
- **Privacy Policy URL**: Use any of the above URLs
- **Example**: `https://yourusername.github.io/studyflow-privacy/privacy-policy.html`

### Google Play Console Steps:
1. Go to Google Play Console
2. Select your app
3. Go to "Store presence" > "Main store listing"
4. Scroll to "Privacy Policy"
5. Enter your privacy policy URL
6. Save changes

## Quick Setup with GitHub Pages:

```bash
# 1. Create new repository on GitHub
# 2. Clone it locally
git clone https://github.com/yourusername/studyflow-privacy.git

# 3. Copy privacy policy file
cp privacy-policy.html studyflow-privacy/

# 4. Push to GitHub
cd studyflow-privacy
git add .
git commit -m "Add StudyFlow privacy policy"
git push origin main

# 5. Enable GitHub Pages in repository settings
```

## URL Examples:
- GitHub Pages: `https://yourusername.github.io/studyflow-privacy/privacy-policy.html`
- Netlify: `https://studyflow-privacy.netlify.app`
- Custom domain: `https://studyflow.app/privacy-policy`

## Important Notes:
- Google Play requires a publicly accessible URL
- The privacy policy must be accessible without login
- URL should be permanent (don't change it after submission)
- Consider using a custom domain for professionalism

## Testing Your Link:
1. Open the URL in an incognito browser window
2. Ensure it loads without any login requirements
3. Check that it displays properly on mobile devices
4. Verify all sections are readable and formatted correctly

## Updating Your Privacy Policy:
1. Edit the HTML file
2. Re-upload to your hosting platform
3. The URL stays the same, content updates automatically
4. No need to update Google Play Console unless URL changes
