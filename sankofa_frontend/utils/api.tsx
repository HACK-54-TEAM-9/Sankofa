import { publicAnonKey } from './supabase/info';

// Backend API URL - automatically switches between local dev and production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:5000/api' 
    : 'https://sankofa-b2jm.onrender.com/api');

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchAPI(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Use access token if provided, otherwise use public anon key
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signup: (data: { email: string; password: string; name: string; role: string; phone?: string }) =>
    fetchAPI('/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginWithPhone: (data: { phone: string; password: string }) =>
    fetchAPI('/login/phone', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUser: (token: string) =>
    fetchAPI('/user', {}, token),
};

// Collector API
export const collectorAPI = {
  getDashboard: (token: string) =>
    fetchAPI('/collector/dashboard', {}, token),

  submitCollection: (token: string, data: { weight: number; location: string; photoUrl?: string }) =>
    fetchAPI('/collector/collect', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),
};

// Hub Manager API
export const hubAPI = {
  getDashboard: (token: string) =>
    fetchAPI('/hub/dashboard', {}, token),

  getPendingCollections: (token: string) =>
    fetchAPI('/hub/pending-collections', {}, token),

  searchCollector: (token: string, phone: string) =>
    fetchAPI(`/hub/search-collector/${encodeURIComponent(phone)}`, {}, token),

  registerCollector: (token: string, data: { phone: string; name: string; neighborhood: string }) =>
    fetchAPI('/hub/register-collector', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  registerCollectorFull: (token: string, data: {
    collectorId: string;
    cardNumber: string;
    fullName: string;
    phoneNumber: string | null;
    hasPhone: 'yes' | 'no' | 'shared';
    emergencyContact: string | null;
    neighborhood: string;
    landmark: string | null;
    preferredLanguage: string;
    canRead: 'yes' | 'no';
    photo: string | null;
    physicalIdNumber: string | null;
    notes: string | null;
    registeredBy: string;
    registrationDate: string;
  }) =>
    fetchAPI('/hub/register-collector-full', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  processTransaction: (token: string, data: {
    collectorId: string;
    collectorPhone: string;
    plasticType: string;
    weight: number;
    location: { latitude: number; longitude: number } | null;
    totalValue: number;
    instantCash: number;
    savingsToken: number;
    timestamp: string;
  }) =>
    fetchAPI('/hub/process-transaction', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getCollectors: (token: string) =>
    fetchAPI('/hub/collectors', {}, token),
};

// Messaging API
export const messagesAPI = {
  getMessages: (token: string) =>
    fetchAPI('/messages', {}, token),

  sendMessage: (token: string, data: { recipientId: string; subject: string; content: string }) =>
    fetchAPI('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  markAsRead: (token: string, messageId: string) =>
    fetchAPI(`/messages/${messageId}/read`, {
      method: 'PUT',
    }, token),
};

// Donations API
export const donationsAPI = {
  submit: (data: { name: string; email: string; amount: number; frequency?: string; message?: string }) =>
    fetchAPI('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStats: () =>
    fetchAPI('/donations/stats'),
};

// Volunteers API
export const volunteersAPI = {
  submit: (data: { name: string; email: string; phone?: string; role: string; availability?: string; message?: string }) =>
    fetchAPI('/volunteers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Health Insights API
export const healthAPI = {
  getInsights: (location: string) =>
    fetchAPI(`/health-insights/${encodeURIComponent(location)}`),
};
