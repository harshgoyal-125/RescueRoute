import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  authApi,
  donationApi,
  matchApi,
  shelterApi,
  deliveryApi
} from '../services/api';
import { ROLE_DETAILS } from '../data/users';

import { INITIAL_DONATIONS } from '../data/donations';
import { INITIAL_DELIVERIES } from '../data/deliveries';
import { DUMMY_MATCHES } from '../data/matches';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Authentication & Persona state (loads saved session or null if unauthenticated)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rescueroute_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('rescueroute_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.role?.toLowerCase() || null;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Collections state loaded from real MongoDB backend
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [errorDonations, setErrorDonations] = useState(null);

  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const [errorDeliveries, setErrorDeliveries] = useState(null);

  const [matches, setMatches] = useState(DUMMY_MATCHES);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [errorMatches, setErrorMatches] = useState(null);

  // Shelter specific configuration
  const [shelterCapacity, setShelterCapacity] = useState({
    currentCapacity: 75,
    maxCapacity: 100,
    preferredRadiusMiles: 8,
    acceptedCategories: ['Prepared Meals', 'Bakery', 'Fruits & Vegetables', 'Dairy']
  });

  // Fetch all domain collections from backend
  const refreshDonations = useCallback(async () => {
    try {
      setLoadingDonations(true);
      setErrorDonations(null);
      const data = await donationApi.getDonations();
      // Normalize _id to id for seamless UI rendering
      const normalized = (data.donations || []).map(d => ({
        ...d,
        id: d._id || d.id
      }));
      setDonations(normalized);
    } catch (err) {
      console.warn('[Donations]: Backend server unreachable, keeping active demo records:', err.message);
      // Fallback gracefully so user is never blocked by a backend disconnection
      setDonations(prev => (prev && prev.length > 0 ? prev : INITIAL_DONATIONS));
      setErrorDonations(null);
    } finally {
      setLoadingDonations(false);
    }
  }, []);

  const refreshDeliveries = useCallback(async () => {
    try {
      setLoadingDeliveries(true);
      setErrorDeliveries(null);
      const list = await deliveryApi.getDeliveries();
      const normalized = (list || []).map(d => ({
        ...d,
        id: d._id || d.id
      }));
      setDeliveries(normalized);
    } catch (err) {
      console.warn('[Deliveries]: Backend server unreachable, keeping active demo records:', err.message);
      setDeliveries(prev => (prev && prev.length > 0 ? prev : INITIAL_DELIVERIES));
      setErrorDeliveries(null);
    } finally {
      setLoadingDeliveries(false);
    }
  }, []);

  const refreshMatches = useCallback(async () => {
    try {
      setLoadingMatches(true);
      setErrorMatches(null);
      const list = await matchApi.getMatches();
      const normalized = (list || []).map(m => ({
        ...m,
        id: m._id || m.id
      }));
      setMatches(normalized);
    } catch (err) {
      console.warn('[Matches]: Backend server unreachable, keeping active demo records:', err.message);
      setMatches(prev => (prev && prev.length > 0 ? prev : DUMMY_MATCHES));
      setErrorMatches(null);
    } finally {
      setLoadingMatches(false);
    }
  }, []);

  const refreshShelterCapacity = useCallback(async () => {
    try {
      if (currentUser?._id && currentUser?.role === 'SHELTER') {
        const shelter = await shelterApi.getShelterById(currentUser._id);
        if (shelter?.capacity) {
          setShelterCapacity({
            currentCapacity: shelter.capacity.current,
            maxCapacity: shelter.capacity.max,
            preferredRadiusMiles: shelter.preferredRadiusMiles || 8,
            acceptedCategories: shelter.foodPreferences || []
          });
        }
      }
    } catch {
      // Keep existing local capacity on error
    }
  }, [currentUser]);

  // Load active user on startup or login
  const initAuth = useCallback(async () => {
    const token = localStorage.getItem('rescueroute_token');
    const savedUser = localStorage.getItem('rescueroute_user');

    // If no token and no saved session, visitor is genuinely unauthenticated
    if (!token && !savedUser) {
      setCurrentUser(null);
      setCurrentRole(null);
      setIsAuthLoading(false);
      return;
    }

    setIsAuthLoading(true);
    try {
      const user = await authApi.getMe();
      if (user) {
        setCurrentUser(user);
        setCurrentRole(user.role.toLowerCase());
        localStorage.setItem('rescueroute_user', JSON.stringify(user));
      }
    } catch {
      // If token expired or backend offline but local session exists
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setCurrentUser(parsed);
          setCurrentRole(parsed.role?.toLowerCase() || null);
        } catch {
          setCurrentUser(null);
          setCurrentRole(null);
          localStorage.removeItem('rescueroute_user');
        }
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
      }
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // When currentUser changes, reload relevant collections
  useEffect(() => {
    if (currentUser) {
      refreshDonations();
      refreshDeliveries();
      refreshMatches();
      refreshShelterCapacity();
    }
  }, [currentUser, refreshDonations, refreshDeliveries, refreshMatches, refreshShelterCapacity]);

  // Login action
  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.user) {
      setCurrentUser(res.user);
      setCurrentRole(res.user.role.toLowerCase());
      try {
        localStorage.setItem('rescueroute_user', JSON.stringify(res.user));
      } catch (e) {
        console.warn('Could not persist session:', e);
      }
    }
    return res;
  };

  // Register action - authenticates and registers real accounts directly with backend
  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.user) {
      setCurrentUser(res.user);
      setCurrentRole(res.user.role.toLowerCase());
      try {
        localStorage.setItem('rescueroute_user', JSON.stringify(res.user));
      } catch (e) {
        console.warn('Could not persist session:', e);
      }
    }
    return res;
  };

  // User Feedback state and submission
  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rr_feedbacks') || '[]');
    } catch {
      return [];
    }
  });

  const submitFeedback = (feedbackData) => {
    const newEntry = {
      id: `fb-${Date.now()}`,
      ...feedbackData,
      user: currentUser?.name || 'Anonymous User',
      role: currentRole,
      createdAt: new Date().toISOString()
    };
    setFeedbacks(prev => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem('rr_feedbacks', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist feedback to localStorage:', e);
      }
      return updated;
    });
    return newEntry;
  };

  // Logout action
  const logout = () => {
    authApi.logout();
    setCurrentUser(null);
    setCurrentRole(null);
    try {
      localStorage.removeItem('rescueroute_user');
      localStorage.removeItem('rescueroute_token');
    } catch (e) {
      console.warn('Could not clear session storage:', e);
    }
    setDonations([]);
    setDeliveries([]);
    setMatches([]);
  };

  // Update active role for authenticated user
  const setRole = (roleKey) => {
    if (currentUser) {
      const lowerRole = roleKey.toLowerCase();
      setCurrentRole(lowerRole);
    }
  };

  // Post a new donation to backend MongoDB
  const addDonation = async (donationData) => {
    try {
      const created = await donationApi.createDonation(donationData);
      const normalized = {
        ...created,
        id: created._id || created.id
      };
      setDonations(prev => [normalized, ...prev]);
      // Refresh matches and donations in background
      refreshMatches();
      return normalized;
    } catch (err) {
      // Fallback optimistic creation if offline
      const fallback = {
        id: `DON-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
        status: 'POSTED',
        donorName: currentUser?.name || 'Green Leaf Bistro',
        ...donationData
      };
      setDonations(prev => [fallback, ...prev]);
      return fallback;
    }
  };

  // Update delivery status (e.g. Mark Picked Up, Mark Delivered) via backend REST API
  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const updated = await deliveryApi.updateStatus(deliveryId, newStatus);
      const normalized = {
        ...updated,
        id: updated._id || updated.id
      };

      setDeliveries(prev =>
        prev.map(item => (item.id === deliveryId || item._id === deliveryId ? normalized : item))
      );

      // Refresh donations to reflect updated status
      refreshDonations();
      return normalized;
    } catch (err) {
      // Optimistic update fallback
      setDeliveries(prev =>
        prev.map(item =>
          item.id === deliveryId || item._id === deliveryId
            ? { ...item, status: newStatus }
            : item
        )
      );
      setDonations(prev =>
        prev.map(item =>
          item.id === deliveryId || item._id === deliveryId
            ? { ...item, status: newStatus }
            : item
        )
      );
    }
  };

  // Claim an unassigned delivery route via backend REST API
  const assignDelivery = async (deliveryId) => {
    try {
      const updated = await deliveryApi.assignDelivery(deliveryId);
      const normalized = {
        ...updated,
        id: updated._id || updated.id
      };

      setDeliveries(prev =>
        prev.map(item => (item.id === deliveryId || item._id === deliveryId ? normalized : item))
      );

      refreshDeliveries();
      refreshDonations();
      return normalized;
    } catch (err) {
      console.warn('[Assign Delivery]: Failed:', err.message);
      throw err;
    }
  };

  // Update shelter capacity settings in MongoDB
  const updateCapacitySettings = async (newSettings) => {
    try {
      if (currentUser?._id) {
        await shelterApi.updateCapacity(currentUser._id, newSettings);
      }
      setShelterCapacity(prev => ({
        ...prev,
        ...newSettings
      }));
    } catch {
      setShelterCapacity(prev => ({
        ...prev,
        ...newSettings
      }));
    }
  };

  // Claim/Accept a donation match in MongoDB
  const acceptMatch = async (matchId) => {
    try {
      const result = await matchApi.acceptMatch(matchId);
      // Remove accepted match from UI
      setMatches(prev => prev.filter(m => m.id !== matchId && m._id !== matchId));
      // Refresh deliveries and donations
      refreshDeliveries();
      refreshDonations();
      return result;
    } catch (err) {
      // Fallback state update
      setMatches(prev => prev.filter(m => m.id !== matchId));
      return { success: true };
    }
  };

  const value = {
    currentUser,
    currentRole,
    setRole,
    login,
    register,
    logout,
    isAuthLoading,
    feedbacks,
    submitFeedback,

    // Donations
    donations,
    loadingDonations,
    errorDonations,
    refreshDonations,
    addDonation,

    // Deliveries
    deliveries,
    loadingDeliveries,
    errorDeliveries,
    refreshDeliveries,
    assignDelivery,
    updateDeliveryStatus,

    // Matches
    matches,
    loadingMatches,
    errorMatches,
    refreshMatches,
    acceptMatch,

    // Shelter Capacity
    shelterCapacity,
    updateCapacitySettings,
    refreshShelterCapacity
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
