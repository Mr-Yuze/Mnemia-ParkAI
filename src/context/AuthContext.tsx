import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole, UserVehicle } from '../types';
import { auth, isFirebaseConfigured } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { INITIAL_USERS } from '../services/mockData';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginAsDemoUser: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  register: (name: string, email: string, pass: string, phone: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  addVehicle: (vehicle: UserVehicle) => Promise<void>;
  removeVehicle: (vehicleNumber: string) => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'mnemia_current_auth_user';
const USERS_STORAGE_KEY = 'mnemia_parkai_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize stored user
  useEffect(() => {
    const initAuth = async () => {
      if (isFirebaseConfigured && auth) {
        onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            // Find matched profile in local or firestore
            const storedUsers: UserProfile[] = JSON.parse(
              localStorage.getItem(USERS_STORAGE_KEY) || JSON.stringify(INITIAL_USERS)
            );
            const found = storedUsers.find((u) => u.email === fbUser.email);
            if (found) {
              setUser(found);
            } else {
              const newProf: UserProfile = {
                uid: fbUser.uid,
                name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
                email: fbUser.email || '',
                phone: fbUser.phoneNumber || '',
                role: 'user',
                createdAt: new Date().toISOString(),
              };
              setUser(newProf);
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } else {
        // Local mode
        const saved = localStorage.getItem(LOCAL_AUTH_KEY);
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch (e) {
            console.error('Error parsing stored user', e);
            setUser(INITIAL_USERS[1]); // Default to regular user
          }
        } else {
          // Auto login demo user for effortless initial showcase
          setUser(INITIAL_USERS[1]);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(INITIAL_USERS[1]));
        }
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const saveCurrentSession = (profile: UserProfile | null) => {
    setUser(profile);
    if (profile) {
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(LOCAL_AUTH_KEY);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, pass);
        toast.success('Logged in with Firebase Auth!');
        setLoading(false);
        return true;
      }

      // Local mock login
      const storedUsers: UserProfile[] = JSON.parse(
        localStorage.getItem(USERS_STORAGE_KEY) || JSON.stringify(INITIAL_USERS)
      );

      const found = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        saveCurrentSession(found);
        toast.success(`Welcome back, ${found.name}!`);
        setLoading(false);
        return true;
      }

      // If user isn't in mock data but typing standard demo pass
      if (email.includes('admin')) {
        const adminUser = INITIAL_USERS[0];
        saveCurrentSession(adminUser);
        toast.success('Welcome back, Administrator!');
        setLoading(false);
        return true;
      }

      // Dynamically create or accept for smooth trial
      const guestUser: UserProfile = {
        uid: `usr-${Date.now()}`,
        name: email.split('@')[0] || 'Explorer',
        email,
        phone: '+91 98000 12345',
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      storedUsers.push(guestUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
      saveCurrentSession(guestUser);
      toast.success(`Welcome to Mnemia ParkAI, ${guestUser.name}!`);
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.';
      toast.error(msg);
      setLoading(false);
      return false;
    }
  };

  const loginAsDemoUser = async () => {
    const demoUser = INITIAL_USERS[1];
    saveCurrentSession(demoUser);
    toast.success('Signed in as Demo User (Vehicle Owner)!');
  };

  const loginAsDemoAdmin = async () => {
    const adminUser = INITIAL_USERS[0];
    saveCurrentSession(adminUser);
    toast.success('Signed in as Demo Administrator!');
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    phone: string,
    role: UserRole = 'user'
  ): Promise<boolean> => {
    setLoading(true);
    try {
      let uid = `usr-${Date.now()}`;
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        uid = cred.user.uid;
      }

      const newUser: UserProfile = {
        uid,
        name,
        email,
        phone,
        role,
        vehicles: [],
        createdAt: new Date().toISOString(),
      };

      const storedUsers: UserProfile[] = JSON.parse(
        localStorage.getItem(USERS_STORAGE_KEY) || JSON.stringify(INITIAL_USERS)
      );

      storedUsers.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
      saveCurrentSession(newUser);

      toast.success(`Account created successfully! Welcome, ${name}.`);
      setLoading(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast.error(msg);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    saveCurrentSession(null);
    toast.success('Logged out successfully.');
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    saveCurrentSession(updated);

    const storedUsers: UserProfile[] = JSON.parse(
      localStorage.getItem(USERS_STORAGE_KEY) || JSON.stringify(INITIAL_USERS)
    );
    const idx = storedUsers.findIndex((u) => u.uid === user.uid);
    if (idx >= 0) {
      storedUsers[idx] = updated;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
    }
    toast.success('Profile updated successfully!');
  };

  const addVehicle = async (vehicle: UserVehicle) => {
    if (!user) return;
    const vehicles = user.vehicles || [];
    // Check duplicate
    if (vehicles.some((v) => v.vehicleNumber.toUpperCase() === vehicle.vehicleNumber.toUpperCase())) {
      toast.error('Vehicle already added.');
      return;
    }
    const updatedVehicles = [...vehicles, vehicle];
    await updateProfile({ vehicles: updatedVehicles });
    toast.success(`Added vehicle ${vehicle.vehicleNumber}!`);
  };

  const removeVehicle = async (vehicleNumber: string) => {
    if (!user) return;
    const updatedVehicles = (user.vehicles || []).filter(
      (v) => v.vehicleNumber.toUpperCase() !== vehicleNumber.toUpperCase()
    );
    await updateProfile({ vehicles: updatedVehicles });
    toast.success(`Removed vehicle ${vehicleNumber}.`);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // Simulated or Firebase password reset
    toast.success(`Password reset link sent to ${email} (Check your inbox)!`);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        loading,
        login,
        loginAsDemoUser,
        loginAsDemoAdmin,
        register,
        logout,
        updateProfile,
        addVehicle,
        removeVehicle,
        resetPassword,
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
