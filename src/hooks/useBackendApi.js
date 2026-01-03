// Mock Backend API Hook - Placeholder Integration
// This hook provides mock backend API functionality without affecting current Supabase operations

import { useState, useEffect } from 'react';
import api from '../services/api';

// Mock authentication hook
export const useBackendAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mockLogin = async (credentials) => {
    setLoading(true);
    try {
      // Mock login - doesn't actually authenticate
      console.log('[MOCK] Backend login attempt:', credentials);
      setError(null);
      // Simulate success without actual backend call
      return { success: true, message: 'Mock login - not connected' };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const mockRegister = async (userData) => {
    setLoading(true);
    try {
      console.log('[MOCK] Backend register attempt:', userData);
      setError(null);
      return { success: true, message: 'Mock register - not connected' };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const mockLogout = async () => {
    console.log('[MOCK] Backend logout');
    setUser(null);
    return { success: true };
  };

  return {
    user,
    loading,
    error,
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout
  };
};

// Mock cities hook
export const useBackendCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCities = async (filters = {}) => {
    setLoading(true);
    try {
      console.log('[MOCK] Fetching cities from backend:', filters);
      // Mock API call - doesn't actually fetch
      await api.cities.getAll(filters);
      setError(null);
      // Don't actually set cities - keep using Supabase data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchCities = async (query) => {
    setLoading(true);
    try {
      console.log('[MOCK] Searching cities in backend:', query);
      await api.cities.search(query);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    cities,
    loading,
    error,
    fetchCities,
    searchCities
  };
};

// Mock activities hook
export const useBackendActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivities = async (cityId, filters = {}) => {
    setLoading(true);
    try {
      console.log('[MOCK] Fetching activities from backend:', cityId, filters);
      await api.activities.getByCity(cityId, filters);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchActivities = async (query) => {
    setLoading(true);
    try {
      console.log('[MOCK] Searching activities in backend:', query);
      await api.activities.search(query);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    loading,
    error,
    fetchActivities,
    searchActivities
  };
};

// Mock trips hook
export const useBackendTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      console.log('[MOCK] Fetching trips from backend');
      await api.trips.getAll();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData) => {
    setLoading(true);
    try {
      console.log('[MOCK] Creating trip in backend:', tripData);
      await api.trips.create(tripData);
      setError(null);
      return { success: true, message: 'Mock trip creation - not connected' };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (tripId, tripData) => {
    setLoading(true);
    try {
      console.log('[MOCK] Updating trip in backend:', tripId, tripData);
      await api.trips.update(tripId, tripData);
      setError(null);
      return { success: true, message: 'Mock trip update - not connected' };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    setLoading(true);
    try {
      console.log('[MOCK] Deleting trip in backend:', tripId);
      await api.trips.delete(tripId);
      setError(null);
      return { success: true, message: 'Mock trip deletion - not connected' };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip
  };
};

// Generic API hook for any endpoint
export const useBackendApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = async (method = 'GET', payload = null) => {
    setLoading(true);
    try {
      console.log(`[MOCK] ${method} request to backend:`, endpoint, payload);
      // Mock API call - doesn't actually make request
      setError(null);
      return { success: true, message: 'Mock API request - not connected' };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    makeRequest
  };
};