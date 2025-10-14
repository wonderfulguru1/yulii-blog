# Firestore Troubleshooting Guide

## Database Seeding Issues

If you're getting "Failed to seed database" errors, here are the most common causes and solutions:

### 1. **Firestore Security Rules**

The most common issue is that Firestore security rules are blocking writes. 

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Replace the rules with this (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Click **Publish**

### 2. **Authentication Required**

Make sure you're logged in before trying to seed the database.

**Solution:**
1. Go to `/login` and sign in
2. Then go to `/admin` and try seeding again

### 3. **Manual Seeding (Alternative)**

If the UI seeding still fails, you can seed manually:

1. Open browser console (F12)
2. Make sure you're logged in
3. Run: `seedBlogDatabase()`
4. Check status with: `checkBlogDatabase()`

### 4. **Check Firebase Configuration**

Verify your Firebase configuration is correct:

1. Check browser console for Firebase errors
2. Verify `.env.local` has correct values
3. Make sure Firebase project is active

### 5. **Network Issues**

Sometimes network issues can cause failures:

1. Check your internet connection
2. Try refreshing the page
3. Check if Firebase services are accessible

## Common Error Messages

### "User must be authenticated to seed database"
- **Cause:** Not logged in
- **Solution:** Sign in first, then try seeding

### "Permission denied"
- **Cause:** Firestore security rules blocking writes
- **Solution:** Update security rules (see #1 above)

### "Firebase: Error (auth/operation-not-allowed)"
- **Cause:** Authentication method not enabled
- **Solution:** Enable Email/Password and Google sign-in in Firebase Console

### "Failed to fetch"
- **Cause:** Network or CORS issues
- **Solution:** Check internet connection and Firebase project status

## Testing Your Setup

1. **Test Authentication:**
   - Go to `/login`
   - Try signing in with email/password or Google
   - Should redirect to `/admin`

2. **Test Database Access:**
   - Open browser console
   - Run: `checkBlogDatabase()`
   - Should return true/false

3. **Test Manual Seeding:**
   - Open browser console
   - Run: `seedBlogDatabase()`
   - Should show success message

## Getting Help

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify all Firebase services are enabled
3. Make sure you're using the correct Firebase project
4. Check that your `.env.local` file has the right configuration

## Quick Fix Checklist

- [ ] User is logged in
- [ ] Firestore security rules allow authenticated writes
- [ ] Firebase project is active
- [ ] `.env.local` has correct configuration
- [ ] Internet connection is working
- [ ] No browser console errors
