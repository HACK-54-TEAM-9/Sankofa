import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
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
  loginWithPhone: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setLoading(false);
          return;
        }

        if (session?.access_token) {
          // Fetch user profile from backend
          const userData = await authAPI.getUser(session.access_token);
          setUser(userData.user);
          setAccessToken(session.access_token);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      if (session?.access_token) {
        try {
          const userData = await authAPI.getUser(session.access_token);
          setUser(userData.user);
          setAccessToken(session.access_token);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
          setAccessToken(null);
        }
      } else {
        setUser(null);
        setAccessToken(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authAPI.signup({ email, password, name, role: role!, phone });
      
      if (response.success) {
        // After signup, sign in the user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.session?.access_token) {
          setUser(response.user);
          setAccessToken(data.session.access_token);
        }

        return { success: true };
      }

      return { success: false, error: response.error || 'Signup failed' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session?.access_token) {
        try {
          const userData = await authAPI.getUser(data.session.access_token);
          setUser(userData.user);
          setAccessToken(data.session.access_token);
          return { success: true };
        } catch (err: any) {
          return { success: false, error: err.message || 'Failed to fetch user profile' };
        }
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const loginWithPhone = async (phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Calling loginWithPhone API for:', phone);
      const response = await authAPI.loginWithPhone({ phone, password });

      console.log('Phone login API response:', response);

      if (response.success && response.accessToken) {
        setUser(response.user);
        setAccessToken(response.accessToken);
        return { success: true };
      }

      return { success: false, error: response.error || 'Phone login failed' };
    } catch (error: any) {
      console.error('Phone login error caught:', error);
      // ApiError will have the message from the server
      return { success: false, error: error.message || 'Phone login failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message || 'Failed to send reset email' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        loginWithPhone,
        signup,
        logout,
        resetPassword,
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
