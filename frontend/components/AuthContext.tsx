import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'collector' | 'hub-manager' | null;

interface User {
  email: string;
  name: string;
  role: UserRole;
  id: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const MOCK_USERS = [
  {
    email: 'collector@demo.com',
    password: 'collector123',
    name: 'Ama Mensah',
    role: 'collector' as UserRole,
    id: 'collector-001',
  },
  {
    email: 'hubmanager@demo.com',
    password: 'manager123',
    name: 'Kwame Asante',
    role: 'hub-manager' as UserRole,
    id: 'manager-001',
  },
  // Additional demo accounts
  {
    email: 'demo.collector@sankofacoin.org',
    password: 'demo123',
    name: 'Demo Collector',
    role: 'collector' as UserRole,
    id: 'collector-002',
  },
  {
    email: 'demo.manager@sankofacoin.org',
    password: 'demo123',
    name: 'Demo Manager',
    role: 'hub-manager' as UserRole,
    id: 'manager-002',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('sankofacoin_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        id: foundUser.id,
      };
      setUser(userData);
      localStorage.setItem('sankofacoin_user', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sankofacoin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
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
