// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence, // Persists session in local storage (long-term)
  // browserSessionPersistence, // Persists session only for the current session/tab
} from "firebase/auth";
import { app } from "../config/firebase"; // Your Firebase app instance

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth state check

  const auth = getAuth(app);

  useEffect(() => {
    // Set persistence to local storage. This means the user stays logged in
    // even after closing the browser, until they explicitly sign out or
    // browser data is cleared. Firebase handles the token refresh automatically.
    // For "remember me for 1 month", browserLocalPersistence is appropriate.
    // Firebase's ID tokens typically expire after 1 hour, but the SDK refreshes them
    // as long as the refresh token (stored by local persistence) is valid.
    // Refresh tokens are long-lived.
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Now listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          setLoading(false);
        });
        return unsubscribe; // Cleanup subscription on unmount
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
        setLoading(false);
      });
  }, [auth]);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    login,
    logout,
    loadingAuth: loading, // Renamed to avoid conflict if component has own 'loading'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}{" "}
      {/* Don't render children until auth state is determined */}
    </AuthContext.Provider>
  );
}
