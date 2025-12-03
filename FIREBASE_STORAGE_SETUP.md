# Firebase Storage Rules Setup

## Problem
File uploads from your computer fail because Firebase Storage security rules are blocking them.

## Solution

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on **Storage** in the left sidebar
4. Click on the **Rules** tab at the top

### Step 2: Update Your Storage Rules

Replace your current rules with these:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload to projects folder
    match /projects/{userId}/{fileName} {
      // Allow authenticated users to upload their own images
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');  // Only images

      // Allow anyone to read (so images can be displayed on your public portfolio)
      allow read: if true;
    }
  }
}
```

### Step 3: Publish the Rules
Click the **Publish** button to save your changes.

### What These Rules Do:
- ✅ Allow authenticated users to upload images to their own folder (`projects/{userId}/`)
- ✅ Limit file size to 5MB maximum
- ✅ Only allow image files (jpg, png, gif, etc.)
- ✅ Allow anyone to view the uploaded images (needed for your public portfolio)
- ❌ Prevent unauthorized uploads
- ❌ Prevent non-image files

### Step 4: Test the Upload
1. Log in to your portfolio admin panel
2. Try uploading an image from your computer
3. It should now work! ✨

## Troubleshooting

### Still not working?
1. **Check Authentication**: Make sure you're logged in
2. **Check Browser Console**: Look for specific error messages
3. **File Size**: Ensure your image is under 5MB
4. **File Type**: Make sure it's an image file (jpg, png, gif, webp, etc.)
5. **Wait a moment**: Rule changes can take 1-2 minutes to propagate

### Error: "Permission denied"
Your Firebase Storage rules haven't been updated or haven't propagated yet. Wait 1-2 minutes and try again.

### Error: "Network error"
Check your internet connection and Firebase project status.
