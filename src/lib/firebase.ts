import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate that all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    'Please check your .env file and ensure all Firebase configuration variables are set.'
  );
}

// Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate configuration values
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_api_key_here') {
  throw new Error('Firebase API key is not properly configured. Please check your .env file.');
}

if (!firebaseConfig.projectId || firebaseConfig.projectId === 'your_project_id') {
  throw new Error('Firebase Project ID is not properly configured. Please check your .env file.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the app instance
export default app;