import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  loading: boolean;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase is not configured. Authentication is not available in preview mode.');
    }

    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        console.warn('Email not verified. Some features may be limited.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('user-not-found')) {
          throw new Error('No account found with this email address');
        } else if (error.message.includes('wrong-password')) {
          throw new Error('Incorrect password');
        } else if (error.message.includes('invalid-email')) {
          throw new Error('Invalid email address');
        } else if (error.message.includes('too-many-requests')) {
          throw new Error('Too many failed attempts. Please try again later');
        }
      }
      
      throw error;
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase is not configured');
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to log out. Please try again.');
    }
  };

  const sendVerificationEmail = async () => {
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }

    try {
      await sendEmailVerification(currentUser);
    } catch (error) {
      console.error('Email verification error:', error);
      throw new Error('Failed to send verification email. Please try again.');
    }
  };

  useEffect(() => {
    // If Firebase is not configured, just set loading to false and continue
    if (!isFirebaseConfigured || !auth) {
      console.log('Firebase not configured, running in preview mode');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        console.log('User authenticated:', user.email, 'Verified:', user.emailVerified);
      } else {
        console.log('User logged out');
      }
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    sendVerificationEmail,
    loading,
    isConfigured: isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
