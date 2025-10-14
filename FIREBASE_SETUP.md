# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "moniepoint-clone")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Add Web App to Firebase Project

1. In your Firebase project dashboard, click the web icon (`</>`)
2. Register your app with a nickname (e.g., "moniepoint-web")
3. Copy the Firebase configuration object

## 3. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Replace the placeholder values with your actual Firebase configuration values.

## 4. Enable Firebase Services

### Authentication
1. Go to Authentication > Sign-in method
2. Enable the authentication methods you want to use (Email/Password, Google, etc.)

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database

### Storage
1. Go to Storage
2. Click "Get started"
3. Review the security rules and click "Next"
4. Choose a location for your storage bucket

## 5. Security Rules (Important for Production)

Make sure to update your Firestore and Storage security rules before going to production:

### Firestore Rules Example:
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

### Storage Rules Example:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 6. Usage in Your App

The Firebase configuration is already set up in `src/lib/firebase.ts`. You can import and use Firebase services like this:

```typescript
import { auth, db, storage } from './lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
```
