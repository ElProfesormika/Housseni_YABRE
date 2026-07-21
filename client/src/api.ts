const API = '/api';

function headers(auth = false): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('admin_token');
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erreur réseau');
  return data as T;
}

export const api = {
  getPortfolio: () => request<import('./types').PortfolioData>(`${API}/portfolio`),

  login: (email: string, password: string) =>
    request<{ token: string; email: string }>(`${API}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<{ email: string }>(`${API}/auth/me`, { headers: headers(true) }),

  getProfile: () => request<import('./types').Profile>(`${API}/admin/profile`, { headers: headers(true) }),
  updateProfile: (body: Partial<import('./types').Profile>) =>
    request<import('./types').Profile>(`${API}/admin/profile`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(body),
    }),

  crud: <T>(resource: string) => ({
    list: () => request<T[]>(`${API}/admin/${resource}`, { headers: headers(true) }),
    create: (body: Partial<T>) =>
      request<T>(`${API}/admin/${resource}`, {
        method: 'POST',
        headers: headers(true),
        body: JSON.stringify(body),
      }),
    update: (id: number, body: Partial<T>) =>
      request<T>(`${API}/admin/${resource}/${id}`, {
        method: 'PUT',
        headers: headers(true),
        body: JSON.stringify(body),
      }),
    remove: (id: number) =>
      request<{ ok: boolean }>(`${API}/admin/${resource}/${id}`, {
        method: 'DELETE',
        headers: headers(true),
      }),
  }),

  getSettings: () => request<Record<string, string>>(`${API}/admin/settings`, { headers: headers(true) }),
  updateSettings: (body: Record<string, string>) =>
    request<Record<string, string>>(`${API}/admin/settings`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(body),
    }),

  uploadImage: async (file: File) => {
    const form = new FormData();
    form.append('image', file);
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API}/admin/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload échoué');
    return data as { url: string };
  },

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ ok: boolean }>(`${API}/admin/password`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  sendContact: (body: { name: string; email: string; subject?: string; message: string }) =>
    request<{ ok: boolean; id: number }>(`${API}/contact`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    }),

  getMessages: () =>
    request<
      {
        id: number;
        name: string;
        email: string;
        subject: string;
        message: string;
        read_status: number;
        created_at: string;
      }[]
    >(`${API}/admin/messages`, { headers: headers(true) }),

  markMessageRead: (id: number) =>
    request<{ id: number }>(`${API}/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: headers(true),
    }),

  deleteMessage: (id: number) =>
    request<{ ok: boolean }>(`${API}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: headers(true),
    }),
};

export function mediaUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}
