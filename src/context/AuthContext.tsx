'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Define the shape of the user data we might store
interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  // Add other relevant fields
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void; // Function to update state on login
  logout: () => void; // Function to clear state on logout
  checkAuthStatus: () => Promise<void>; // Function to check auth status on load
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading initially
  const pathname = usePathname();

  // Extract locale from the path
  const getLocalePrefix = () => {
    if (pathname) {
      const parts = pathname.split('/');
      if (parts.length > 1 && parts[1].length === 2) {
        return `/${parts[1]}`;
      }
    }
    return '';
  };
  
  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
    // Call the logout API endpoint to clear the server-side cookie
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Redirect to login page with locale if available
      const localePrefix = getLocalePrefix();
      window.location.href = `${localePrefix}/login`;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Function to check auth status, e.g., by calling a /api/auth/me endpoint
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Assume an endpoint /api/auth/me verifies the cookie and returns user data
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (response.ok && data.isAuthenticated && data.user) {
        setUser(data.user);
      } else {
        // User is not logged in - this is not an error, just a normal state
        setUser(null);
      }
    } catch (error) {
      // Only log serious errors, not 401s which are expected
      console.error("Failed to check auth status:", error);
      setUser(null); // Ensure user is null on error
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status when the provider mounts, with a small delay to avoid race conditions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkAuthStatus();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Always wrap children with AuthContext.Provider so useAuth is always within context
  return (
    <AuthContext.Provider value={{ 
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 