// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6000/api';

console.log('API_BASE_URL configured as:', API_BASE_URL);

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

  // Only add Authorization header if token is provided (not for login/signup)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`[API] ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`[API] Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, error.error || error.message || 'Request failed');
    }

    return response.json();
  } catch (error: any) {
    console.error('[API] Error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  signup: (data: { email: string; password: string; name: string; role: string; phone?: string }) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: (token: string) =>
    fetchAPI('/auth/logout', {
      method: 'POST',
    }, token),

  getUser: (token: string) =>
    fetchAPI('/auth/me', {}, token),

  updateProfile: (token: string, data: any) =>
    fetchAPI('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token),

  updatePassword: (token: string, data: { currentPassword: string; newPassword: string }) =>
    fetchAPI('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token),
};

// Collector API
export const collectorAPI = {
  getDashboard: (token: string) =>
    fetchAPI('/users/collector/dashboard', {}, token),

  submitCollection: (token: string, data: {
    hub: string;
    plasticType: string;
    weight: number;
    quantity: number;
    collectionLocation?: { coordinates: [number, number] };
    photoUrl?: string;
    notes?: string;
  }) =>
    fetchAPI('/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getCollections: (token: string) =>
    fetchAPI('/collections', {}, token),

  getCollectionById: (token: string, id: string) =>
    fetchAPI(`/collections/${id}`, {}, token),
};

// Hub Manager API
export const hubAPI = {
  getDashboard: (hubId: string, token: string) =>
    fetchAPI(`/hubs/${hubId}/dashboard`, {}, token),

  getPendingCollections: (hubId: string, token: string) =>
    fetchAPI(`/hubs/${hubId}/pending-collections`, {}, token),

  searchCollector: (hubId: string, phone: string, token: string) =>
    fetchAPI(`/hubs/${hubId}/search-collector?phone=${encodeURIComponent(phone)}`, {}, token),

  registerCollector: (hubId: string, data: { phone: string; name: string; neighborhood: string }, token: string) =>
    fetchAPI(`/hubs/${hubId}/register-collector`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  registerCollectorFull: (hubId: string, data: {
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
  }, token: string) =>
    fetchAPI(`/hubs/${hubId}/register-collector-full`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  processTransaction: (hubId: string, data: {
    collectorId: string;
    collectorPhone: string;
    plasticType: string;
    weight: number;
    location: { latitude: number; longitude: number } | null;
    totalValue: number;
    instantCash: number;
    savingsToken: number;
    timestamp: string;
  }, token: string) =>
    fetchAPI(`/hubs/${hubId}/transactions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getCollectors: (hubId: string, token: string) =>
    fetchAPI(`/hubs/${hubId}/collectors`, {}, token),

  getHubs: () =>
    fetchAPI('/hubs'),

  getHubById: (hubId: string, token?: string) =>
    fetchAPI(`/hubs/${hubId}`, {}, token),

  getNearbyHubs: (latitude: number, longitude: number, maxDistance?: number) =>
    fetchAPI(`/hubs/nearby?latitude=${latitude}&longitude=${longitude}${maxDistance ? `&maxDistance=${maxDistance}` : ''}`),

  getHubAnalytics: (hubId: string, token: string) =>
    fetchAPI(`/hubs/${hubId}/analytics`, {}, token),

  getHubCollections: (hubId: string, token: string) =>
    fetchAPI(`/hubs/${hubId}/collections`, {}, token),
};

// Messaging API
export const messagesAPI = {
  getMessages: (token: string) =>
    fetchAPI('/messages', {}, token),

  sendMessage: (data: { recipientId: string; subject: string; content: string }, token: string) =>
    fetchAPI('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  markAsRead: (messageId: string, token: string) =>
    fetchAPI(`/messages/${messageId}/read`, {
      method: 'PUT',
    }, token),

  deleteMessage: (messageId: string, token: string) =>
    fetchAPI(`/messages/${messageId}`, {
      method: 'DELETE',
    }, token),

  getUnreadCount: (token: string) =>
    fetchAPI('/messages/unread-count', {}, token),
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
  getInsights: (location?: string) =>
    fetchAPI(`/health/insights${location ? `?location=${encodeURIComponent(location)}` : ''}`),

  getHealthByRegion: (region: string) =>
    fetchAPI(`/health/region/${encodeURIComponent(region)}`),

  getHealthTrends: (params?: { startDate?: string; endDate?: string; region?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.region) queryParams.append('region', params.region);
    return fetchAPI(`/health/trends?${queryParams.toString()}`);
  },

  getHighRiskAreas: () =>
    fetchAPI('/health/high-risk-areas'),

  getDiseasePatterns: (params?: { disease?: string; region?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.disease) queryParams.append('disease', params.disease);
    if (params?.region) queryParams.append('region', params.region);
    return fetchAPI(`/health/disease-patterns?${queryParams.toString()}`);
  },

  getEnvironmentalHealth: (region?: string) =>
    fetchAPI(`/health/environmental${region ? `?region=${encodeURIComponent(region)}` : ''}`),
};

// AI Assistant API
export const aiAPI = {
  chat: (message: string, token?: string) =>
    fetchAPI('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }, token),

  getVoiceResponse: (message: string, token?: string) =>
    fetchAPI('/ai/voice', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }, token),

  getHealthRecommendations: (token?: string) =>
    fetchAPI('/ai/health-recommendations', {}, token),

  getCollectionAdvice: (token?: string) =>
    fetchAPI('/ai/collection-advice', {}, token),

  getLocationInsights: (location: string, token?: string) =>
    fetchAPI(`/ai/location-insights?location=${encodeURIComponent(location)}`, {}, token),

  getHistory: (token: string) =>
    fetchAPI('/ai/history', {}, token),

  provideFeedback: (interactionId: string, feedback: { rating: number; comment?: string }, token: string) =>
    fetchAPI(`/ai/feedback/${interactionId}`, {
      method: 'POST',
      body: JSON.stringify(feedback),
    }, token),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: (token: string) =>
    fetchAPI('/analytics/dashboard', {}, token),

  getCollectionAnalytics: (params?: { startDate?: string; endDate?: string }, token?: string) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    return fetchAPI(`/analytics/collections?${queryParams.toString()}`, {}, token);
  },

  getHealthAnalytics: (params?: { startDate?: string; endDate?: string }, token?: string) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    return fetchAPI(`/analytics/health?${queryParams.toString()}`, {}, token);
  },

  getEnvironmentalImpact: (params?: { startDate?: string; endDate?: string }, token?: string) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    return fetchAPI(`/analytics/environmental-impact?${queryParams.toString()}`, {}, token);
  },

  getPredictiveInsights: (token?: string) =>
    fetchAPI('/analytics/predictive-insights', {}, token),

  getGeographicAnalytics: (params?: { startDate?: string; endDate?: string }, token?: string) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    return fetchAPI(`/analytics/geographic?${queryParams.toString()}`, {}, token);
  },
};
