import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginAsDemoUser: (role?: UserRole) => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<{ error?: string }>;
  logout: () => void;
  isSupabaseActive: boolean;
}

const defaultAdminUser: User = {
  id: 'usr-admin-01',
  name: 'Alex Morgan',
  email: 'alex.morgan@nexusflow.io',
  role: 'admin',
  organizationId: 'org-demo-001',
  organizationName: 'NexusFlow Technologies Inc.',
  avatar: ''
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return getStoredData<User | null>(STORAGE_KEYS.USER, defaultAdminUser);
  });

  useEffect(() => {
    if (user) {
      setStoredData(STORAGE_KEYS.USER, user);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  // Demo user preset switch
  const loginAsDemoUser = (role: UserRole = 'admin') => {
    let name = 'Alex Morgan';
    let email = 'alex.morgan@nexusflow.io';
    
    if (role === 'sales') {
      name = 'Marcus Vance';
      email = 'marcus.v@nexusflow.io';
    } else if (role === 'hr') {
      name = 'Alexander Wright';
      email = 'alex.w@nexusflow.io';
    } else if (role === 'finance') {
      name = 'Sophia Chen';
      email = 'sophia.c@nexusflow.io';
    }

    const demoUser: User = {
      id: `usr-${role}-demo`,
      name,
      email,
      role,
      organizationId: 'org-demo-001',
      organizationName: 'NexusFlow Technologies Inc.',
      avatar: ''
    };
    setUser(demoUser);
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          email: data.user.email || email,
          role: 'admin',
          organizationId: data.user.user_metadata?.organization_id || 'org-live-01',
          organizationName: data.user.user_metadata?.organization_name || 'Enterprise Workspace'
        });
        return {};
      }
    }

    // Offline / Demo authentication
    setUser({
      id: 'usr-offline-01',
      name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
      email,
      role: 'admin',
      organizationId: 'org-demo-001',
      organizationName: 'NexusFlow Technologies Inc.'
    });
    return {};
  };

  const signUpWithEmail = async (name: string, email: string, pass: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
            organization_name: `${name}'s Organization`
          }
        }
      });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          name,
          email,
          role: 'admin',
          organizationId: 'org-live-01',
          organizationName: `${name}'s Organization`
        });
        return {};
      }
    }

    // Offline / Demo Signup
    setUser({
      id: `usr-${Date.now()}`,
      name,
      email,
      role: 'admin',
      organizationId: `org-${Date.now()}`,
      organizationName: `${name}'s Organization`
    });
    return {};
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAsDemoUser,
        loginWithEmail,
        signUpWithEmail,
        logout,
        isSupabaseActive: isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
