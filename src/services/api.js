// Backend API Service - Mock Integration (Not Active)
// This is placeholder code for future backend integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock API client configuration
const apiClient = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Mock authentication token management
let authToken = null;

const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    apiClient.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.headers['Authorization'];
  }
};

// Mock HTTP methods (not actually used)
const mockRequest = async (method, endpoint, data = null) => {
  // This is just placeholder code - doesn't make real requests
  console.log(`[MOCK API] ${method} ${endpoint}`, data);
  
  // Return mock response structure
  return {
    data: null,
    status: 200,
    message: 'Mock response - not connected to backend'
  };
};

// Mock API methods
const api = {
  // Auth endpoints (placeholder)
  auth: {
    login: async (credentials) => mockRequest('POST', '/auth/login', credentials),
    register: async (userData) => mockRequest('POST', '/auth/register', userData),
    logout: async () => mockRequest('POST', '/auth/logout'),
    refreshToken: async () => mockRequest('POST', '/auth/refresh'),
    forgotPassword: async (email) => mockRequest('POST', '/auth/forgot-password', { email }),
    resetPassword: async (token, password) => mockRequest('POST', '/auth/reset-password', { token, password })
  },

  // User endpoints (placeholder)
  users: {
    getProfile: async () => mockRequest('GET', '/users/profile'),
    updateProfile: async (data) => mockRequest('PUT', '/users/profile', data),
    deleteAccount: async () => mockRequest('DELETE', '/users/profile'),
    getSavedDestinations: async () => mockRequest('GET', '/users/saved-destinations'),
    saveDestination: async (cityId) => mockRequest('POST', '/users/saved-destinations', { cityId }),
    removeSavedDestination: async (cityId) => mockRequest('DELETE', `/users/saved-destinations/${cityId}`)
  },

  // Cities endpoints (placeholder)
  cities: {
    getAll: async (params = {}) => mockRequest('GET', '/cities', params),
    getById: async (id) => mockRequest('GET', `/cities/${id}`),
    search: async (query) => mockRequest('GET', `/cities/search?q=${query}`),
    getNearby: async (lat, lng, radius) => mockRequest('GET', `/cities/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
    getPopular: async (limit = 10) => mockRequest('GET', `/cities/popular?limit=${limit}`)
  },

  // Activities endpoints (placeholder)
  activities: {
    getAll: async (params = {}) => mockRequest('GET', '/activities', params),
    getById: async (id) => mockRequest('GET', `/activities/${id}`),
    getByCity: async (cityId, params = {}) => mockRequest('GET', `/activities/city/${cityId}`, params),
    search: async (query) => mockRequest('GET', `/activities/search?q=${query}`),
    getByCategory: async (category) => mockRequest('GET', `/activities/category/${category}`)
  },

  // Trips endpoints (placeholder)
  trips: {
    getAll: async () => mockRequest('GET', '/trips'),
    getById: async (id) => mockRequest('GET', `/trips/${id}`),
    create: async (tripData) => mockRequest('POST', '/trips', tripData),
    update: async (id, tripData) => mockRequest('PUT', `/trips/${id}`, tripData),
    delete: async (id) => mockRequest('DELETE', `/trips/${id}`),
    getPublic: async (shareToken) => mockRequest('GET', `/trips/public/${shareToken}`),
    addStop: async (tripId, stopData) => mockRequest('POST', `/trips/${tripId}/stops`, stopData),
    updateStop: async (tripId, stopId, stopData) => mockRequest('PUT', `/trips/${tripId}/stops/${stopId}`, stopData),
    deleteStop: async (tripId, stopId) => mockRequest('DELETE', `/trips/${tripId}/stops/${stopId}`),
    addActivity: async (tripId, stopId, activityData) => mockRequest('POST', `/trips/${tripId}/stops/${stopId}/activities`, activityData),
    removeActivity: async (tripId, stopId, activityId) => mockRequest('DELETE', `/trips/${tripId}/stops/${stopId}/activities/${activityId}`)
  }
};

// Mock error handling
const handleApiError = (error) => {
  console.log('[MOCK API ERROR]', error);
  return {
    message: 'Mock API error - not connected to backend',
    status: 500
  };
};

// Mock response interceptor
const processResponse = (response) => {
  console.log('[MOCK API RESPONSE]', response);
  return response;
};

export {
  api,
  setAuthToken,
  handleApiError,
  processResponse,
  API_BASE_URL
};

export default api;