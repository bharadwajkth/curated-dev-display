# Security Guidelines for Portfolio Application

## Environment Variables Security

### ✅ What's Safe to Expose (Frontend)
- `VITE_FIREBASE_API_KEY` - Firebase client API key (designed for public use)
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

**Note**: These are client-side Firebase configuration values that are meant to be public. Security is enforced through Firebase Security Rules, not by hiding these keys.

### ❌ What Should NEVER Be Exposed
- Firebase Admin SDK private keys
- Database connection strings with credentials
- Third-party API secret keys
- JWT signing secrets
- Payment processor secret keys

## Firebase Security Best Practices

### 1. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for portfolio projects
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email_verified;
    }
    
    // Restrict all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 2. Firebase Authentication Rules
- Enable only Email/Password authentication
- Require email verification for admin actions
- Implement proper user validation

### 3. Environment Variable Management

#### Development
1. Copy `.env.example` to `.env`
2. Fill in your actual Firebase configuration values
3. Never commit `.env` to version control

#### Production (Vercel/Netlify)
1. Add environment variables in your hosting platform's dashboard
2. Use the same variable names with `VITE_` prefix
3. Ensure all variables are properly set before deployment

#### Production (Traditional Hosting)
1. Use your hosting provider's environment variable system
2. If not available, create `.env` file on server (ensure it's not publicly accessible)
3. Set proper file permissions (600) for `.env` file

## Deployment Security Checklist

### Before Deployment
- [ ] All sensitive data is in environment variables
- [ ] `.env` file is in `.gitignore`
- [ ] Firebase Security Rules are properly configured
- [ ] No hardcoded credentials in source code
- [ ] Environment variables are validated on startup

### After Deployment
- [ ] Environment variables are set in production
- [ ] Firebase Security Rules are published
- [ ] Test authentication and authorization
- [ ] Monitor Firebase usage and security

## Additional Security Measures

### 1. Content Security Policy (CSP)
Consider adding CSP headers to prevent XSS attacks:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;">
```

### 2. Firebase App Check (Optional)
For additional security, consider implementing Firebase App Check to protect against abuse.

### 3. Rate Limiting
Implement rate limiting for form submissions and API calls to prevent abuse.

## Emergency Response

### If Credentials Are Compromised
1. Immediately regenerate all affected API keys
2. Update environment variables in all environments
3. Review Firebase Security Rules
4. Check Firebase usage logs for suspicious activity
5. Consider temporarily disabling affected services

### Monitoring
- Regularly review Firebase usage and authentication logs
- Set up alerts for unusual activity
- Monitor for failed authentication attempts