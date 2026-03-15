"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { apiRequest } from "@/lib/api";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  registerWithPhone: (phone: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  idToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setIdToken(token);
          console.log("User signed token:", token);

          // Create or update user in backend
          await apiRequest("/api/auth/user", {
            method: "POST",
            body: JSON.stringify({ token }),
          });
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        setIdToken(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (authLoading) return;
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Ignore popup cancellation errors, log others
      if (
        error?.code === "auth/cancelled-popup-request" ||
        error?.code === "auth/popup-closed-by-user"
      ) {
        console.warn("Google sign-in popup was cancelled or closed by user.");
      } else {
        console.error("Sign in error:", error);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const phoneToEmail = (phone: string) => {
    const normalized = phone.replace(/[^0-9]/g, "");
    return `${normalized}@phone.login`;
  };

  const registerWithPhone = async (phone: string, password: string) => {
    if (authLoading) return;
    setAuthLoading(true);
    try {
      const email = phoneToEmail(phone);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Phone registration error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const signInWithPhone = async (phone: string, password: string) => {
    if (authLoading) return;
    setAuthLoading(true);
    try {
      const email = phoneToEmail(phone);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Phone sign-in error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIdToken(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading,
        signInWithGoogle,
        registerWithPhone,
        signInWithPhone,
        signOut,
        idToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
