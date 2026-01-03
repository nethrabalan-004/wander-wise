// Mock Backend Synchronization Utilities
// Placeholder code for syncing data between Supabase and backend (not active)

import api from '../services/api';

// Mock data synchronization functions
export const syncUtils = {
  // Mock user sync
  syncUserToBackend: async (supabaseUser) => {
    try {
      console.log('[MOCK SYNC] Syncing user to backend:', supabaseUser?.id);
      // Mock API call - doesn't actually sync
      await api.users.updateProfile({
        id: supabaseUser?.id,
        email: supabaseUser?.email,
        name: supabaseUser?.user_metadata?.full_name
      });
      return { success: true, message: 'Mock user sync - not connected' };
    } catch (error) {
      console.log('[MOCK SYNC ERROR] User sync failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Mock trip sync
  syncTripToBackend: async (supabaseTrip) => {
    try {
      console.log('[MOCK SYNC] Syncing trip to backend:', supabaseTrip?.id);
      await api.trips.create({
        id: supabaseTrip?.id,
        name: supabaseTrip?.name,
        description: supabaseTrip?.description,
        start_date: supabaseTrip?.start_date,
        end_date: supabaseTrip?.end_date,
        user_id: supabaseTrip?.user_id
      });
      return { success: true, message: 'Mock trip sync - not connected' };
    } catch (error) {
      console.log('[MOCK SYNC ERROR] Trip sync failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Mock activity sync
  syncActivityToBackend: async (supabaseActivity) => {
    try {
      console.log('[MOCK SYNC] Syncing activity to backend:', supabaseActivity?.id);
      await api.activities.getById(supabaseActivity?.id);
      return { success: true, message: 'Mock activity sync - not connected' };
    } catch (error) {
      console.log('[MOCK SYNC ERROR] Activity sync failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Mock batch sync
  batchSyncToBackend: async (data) => {
    try {
      console.log('[MOCK SYNC] Batch syncing to backend:', Object.keys(data));
      
      const results = {
        users: 0,
        trips: 0,
        activities: 0,
        errors: []
      };

      // Mock sync operations
      if (data.users) {
        for (const user of data.users) {
          const result = await syncUtils.syncUserToBackend(user);
          if (result.success) results.users++;
          else results.errors.push(`User ${user.id}: ${result.error}`);
        }
      }

      if (data.trips) {
        for (const trip of data.trips) {
          const result = await syncUtils.syncTripToBackend(trip);
          if (result.success) results.trips++;
          else results.errors.push(`Trip ${trip.id}: ${result.error}`);
        }
      }

      if (data.activities) {
        for (const activity of data.activities) {
          const result = await syncUtils.syncActivityToBackend(activity);
          if (result.success) results.activities++;
          else results.errors.push(`Activity ${activity.id}: ${result.error}`);
        }
      }

      return { success: true, results, message: 'Mock batch sync completed' };
    } catch (error) {
      console.log('[MOCK SYNC ERROR] Batch sync failed:', error);
      return { success: false, error: error.message };
    }
  }
};

// Mock background sync scheduler
export class BackendSyncScheduler {
  constructor() {
    this.isRunning = false;
    this.interval = null;
    this.syncInterval = 5 * 60 * 1000; // 5 minutes
  }

  start() {
    if (this.isRunning) return;
    
    console.log('[MOCK SYNC] Starting background sync scheduler');
    this.isRunning = true;
    
    this.interval = setInterval(() => {
      this.performSync();
    }, this.syncInterval);
  }

  stop() {
    if (!this.isRunning) return;
    
    console.log('[MOCK SYNC] Stopping background sync scheduler');
    this.isRunning = false;
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  async performSync() {
    try {
      console.log('[MOCK SYNC] Performing scheduled sync...');
      // Mock sync operation - doesn't actually sync anything
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('[MOCK SYNC] Scheduled sync completed');
    } catch (error) {
      console.log('[MOCK SYNC ERROR] Scheduled sync failed:', error);
    }
  }

  setSyncInterval(minutes) {
    this.syncInterval = minutes * 60 * 1000;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

// Mock conflict resolution
export const conflictResolver = {
  resolveUserConflict: (supabaseData, backendData) => {
    console.log('[MOCK CONFLICT] Resolving user conflict');
    // Mock resolution - always prefer Supabase data
    return supabaseData;
  },

  resolveTripConflict: (supabaseData, backendData) => {
    console.log('[MOCK CONFLICT] Resolving trip conflict');
    // Mock resolution - always prefer Supabase data
    return supabaseData;
  },

  resolveActivityConflict: (supabaseData, backendData) => {
    console.log('[MOCK CONFLICT] Resolving activity conflict');
    // Mock resolution - always prefer Supabase data
    return supabaseData;
  }
};

// Mock data validation
export const dataValidator = {
  validateUser: (userData) => {
    console.log('[MOCK VALIDATION] Validating user data');
    return { isValid: true, errors: [] };
  },

  validateTrip: (tripData) => {
    console.log('[MOCK VALIDATION] Validating trip data');
    return { isValid: true, errors: [] };
  },

  validateActivity: (activityData) => {
    console.log('[MOCK VALIDATION] Validating activity data');
    return { isValid: true, errors: [] };
  }
};

// Initialize mock sync scheduler (but don't start it)
export const syncScheduler = new BackendSyncScheduler();

// Mock sync status
export const getSyncStatus = () => {
  return {
    isConnected: false,
    lastSync: null,
    pendingOperations: 0,
    errors: [],
    message: 'Backend sync not active - using Supabase only'
  };
};