/**
 * Centralized TicketGo API Client
 * Connects the Next.js frontend to the real NestJS backend.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'ticketgo_access_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: response.ok,
      statusCode: response.status,
      data: null as any,
    }));

    if (!response.ok) {
      if (response.status === 401) {
        removeStoredToken();
      }

      const errorMessage =
        (data && (data.message || data.error)) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(
        Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
        response.status,
        data,
      );
    }

    return (data && data.data !== undefined ? data.data : data) as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network connection failed', 0);
  }
}

function buildQuery(params?: Record<string, any>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export const api = {
  // Authentication
  auth: {
    login: async (email: string, password: string) =>
      request<{ accessToken: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: async () => request<any>('/auth/me'),
    logout: async () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
  },

  // Tickets
  tickets: {
    list: async (params?: any) =>
      request<any>(`/tickets${buildQuery(params)}`),
    get: async (idOrCode: string) =>
      request<any>(`/tickets/${encodeURIComponent(idOrCode)}`),
    create: async (ticketData: any) =>
      request<any>('/tickets', {
        method: 'POST',
        body: JSON.stringify(ticketData),
      }),
    update: async (id: string, updateData: any) =>
      request<any>(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }),
    assign: async (id: string, assigneeId?: string | null) =>
      request<any>(`/tickets/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ assigneeId: assigneeId || null }),
      }),
    updateStatus: async (id: string, status: string) =>
      request<any>(`/tickets/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    addComment: async (id: string, content: string) =>
      request<any>(`/tickets/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    getActivity: async (id: string) =>
      request<any[]>(`/tickets/${id}/activity`),
  },

  // Users
  users: {
    list: async (params?: any) =>
      request<any>(`/users${buildQuery(params)}`),
    get: async (id: string) => request<any>(`/users/${id}`),
    create: async (userData: any) =>
      request<any>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    update: async (id: string, updateData: any) =>
      request<any>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }),
    updateStatus: async (id: string, status: string) =>
      request<any>(`/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Teams
  teams: {
    list: async (params?: any) =>
      request<any[]>(`/teams${buildQuery(params)}`),
    get: async (id: string) => request<any>(`/teams/${id}`),
    create: async (teamData: any) =>
      request<any>('/teams', {
        method: 'POST',
        body: JSON.stringify(teamData),
      }),
    update: async (id: string, updateData: any) =>
      request<any>(`/teams/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }),
    addMember: async (teamId: string, memberData: { userId: string; role?: string }) =>
      request<any>(`/teams/${teamId}/members`, {
        method: 'POST',
        body: JSON.stringify(memberData),
      }),
    removeMember: async (teamId: string, userId: string) =>
      request<any>(`/teams/${teamId}/members/${userId}`, {
        method: 'DELETE',
      }),
  },

  // Categories
  categories: {
    list: async (params?: any) =>
      request<any[]>(`/categories${buildQuery(params)}`),
    get: async (id: string) => request<any>(`/categories/${id}`),
    create: async (catData: any) =>
      request<any>('/categories', {
        method: 'POST',
        body: JSON.stringify(catData),
      }),
    update: async (id: string, updateData: any) =>
      request<any>(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }),
    updateStatus: async (id: string, status: string) =>
      request<any>(`/categories/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Notifications
  notifications: {
    list: async (params?: any) =>
      request<any>(`/notifications${buildQuery(params)}`),
    unreadCount: async () =>
      request<{ unreadCount: number }>('/notifications/unread-count'),
    markRead: async (id: string) =>
      request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: async () =>
      request<{ count: number }>('/notifications/read-all', { method: 'PATCH' }),
  },

  // Knowledge Base
  knowledgeBase: {
    list: async (params?: any) =>
      request<any>(`/knowledge-base${buildQuery(params)}`),
    categories: async () =>
      request<{ category: string; articleCount: number }[]>('/knowledge-base/categories'),
    get: async (id: string) => request<any>(`/knowledge-base/${id}`),
    create: async (articleData: any) =>
      request<any>('/knowledge-base', {
        method: 'POST',
        body: JSON.stringify(articleData),
      }),
    update: async (id: string, updateData: any) =>
      request<any>(`/knowledge-base/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }),
    togglePublish: async (id: string, isPublished: boolean) =>
      request<any>(`/knowledge-base/${id}/publish`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished }),
      }),
    delete: async (id: string) =>
      request<{ success: boolean }>(`/knowledge-base/${id}`, {
        method: 'DELETE',
      }),
  },

  // Reports
  reports: {
    get: async (params?: any) =>
      request<any>(`/reports${buildQuery(params)}`),
    dashboard: async () => request<any>('/reports/dashboard'),
  },

  // Global Search
  search: {
    global: async (q: string, type?: string, limit?: number) =>
      request<any>(`/search${buildQuery({ q, type, limit })}`),
  },
};
