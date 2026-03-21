"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "./config";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const msg = err.code === "auth/invalid-credential"
        ? "Invalid email or password"
        : err.code === "auth/user-not-found"
        ? "No account with this email"
        : err.code === "auth/too-many-requests"
        ? "Too many attempts. Try again later"
        : err.message || "Sign-in failed";
      setError(msg);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(result.user, { displayName: name });
      }
    } catch (err: any) {
      const msg = err.code === "auth/email-already-in-use"
        ? "Email already registered"
        : err.code === "auth/weak-password"
        ? "Password must be at least 6 characters"
        : err.code === "auth/invalid-email"
        ? "Invalid email address"
        : err.message || "Sign-up failed";
      setError(msg);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError(err.message || "Sign-out failed");
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, error, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
