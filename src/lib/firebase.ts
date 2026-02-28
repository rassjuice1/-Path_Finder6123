// Firebase configuration
// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

// Initialize Firebase (client-side only)
let app: any = null;
let auth: any = null;
let googleProvider: any = null;

if (typeof window !== 'undefined') {
  try {
    // Dynamically import firebase to avoid SSR issues
    import('firebase/auth').then((firebaseAuth) => {
      import('firebase/app').then((firebaseApp) => {
        if (!firebaseApp.getApps().length) {
          app = firebaseApp.initializeApp(firebaseConfig);
        } else {
          app = firebaseApp.getApps()[0];
        }
        auth = firebaseAuth.getAuth(app);
        googleProvider = new firebaseAuth.GoogleAuthProvider();
        
        // Add Google profile scope
        googleProvider.addScope('profile');
        googleProvider.addScope('email');
      });
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { app, auth, googleProvider };

// Mock user for demo mode (when Firebase is not configured)
export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  provider?: string;
}

export const mockUser: MockUser = {
  uid: 'demo-user-123',
  email: 'demo@example.com',
  displayName: 'Demo User',
  photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=4F46E5&color=fff'
};
