
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  allUsers: User[]; // For admin view
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  deleteUser: (userId: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'nao_accounts_v1';
const SESSION_KEY = 'nao_session_v1';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load users list
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    }

    // Load active session
    const activeSessionId = localStorage.getItem(SESSION_KEY);
    if (activeSessionId && savedUsers) {
      const users = JSON.parse(savedUsers) as User[];
      const found = users.find(u => u.id === activeSessionId);
      if (found) setUser(found);
    }
    setIsLoading(false);
  }, []);

  const signup = async (username: string, password: string): Promise<boolean> => {
    const existing = allUsers.find(u => u.username === username);
    if (existing) return false;

    // Simulate password hashing by not storing it at all in this demo, 
    // or just checking simple equality if we had to.
    const newUser: User = {
      id: `u_${Date.now()}`,
      username,
      // First user ever becomes the super admin
      role: allUsers.length === 0 ? 'admin' : 'user',
      createdAt: Date.now()
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    
    // Auto login
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, newUser.id);
    return true;
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real mock, we'd check passwords. Here we just match username for simplicity.
    const found = allUsers.find(u => u.username === username);
    if (found) {
      setUser(found);
      localStorage.setItem(SESSION_KEY, found.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const deleteUser = (userId: string) => {
    const updated = allUsers.filter(u => u.id !== userId);
    setAllUsers(updated);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    // Also clean up their project data
    localStorage.removeItem(`nao_projects_user_${userId}`);
    if (user?.id === userId) logout();
  };

  return (
    <AuthContext.Provider value={{ user, allUsers, login, signup, logout, deleteUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
