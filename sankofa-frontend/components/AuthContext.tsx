import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

export type UserRole = 'collector' | 'hub-manager' | null;

interface User {
  email: string;
  name: string;
  role: UserRole;
  id: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check localStorage for saved token and user
        const savedToken = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
          try {
            // Verify token is still valid by fetching user profile
            await authAPI.getUser(savedToken);
            setUser(JSON.parse(savedUser));
            setAccessToken(savedToken);
          } catch (error) {
            // Token is invalid, clear storage
            console.error('Token validation failed:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Add phone number (required by backend)
      const phone = `+233${Math.floor(200000000 + Math.random() * 100000000)}`;

      const response = await authAPI.signup({
        email,
        password,
        name,
        role: role!,
        phone
      });

      if (response.success && response.data) {
        // After successful signup, automatically log in
        return await login(email, password);
      }

      return { success: false, error: response.message || 'Signup failed' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Use backend API for login instead of Supabase Auth
      const response = await authAPI.login({ email, password });

      if (response.success && response.data) {
        const { user, accessToken } = response.data;
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole
        });
        setAccessToken(accessToken);

        // Store token in localStorage for persistence
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }));

        return { success: true };
      }

      return { success: false, error: response.message || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  const logout = async () => {
    try {
      // Clear local state
      setUser(null);
      setAccessToken(null);

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Optionally call backend logout endpoint
      if (accessToken) {
        try {
          await authAPI.logout(accessToken);
        } catch (error) {
          console.error('Backend logout error:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
