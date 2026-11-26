const TOKEN_KEY = 'drapple_token';
const ADMIN_KEY = 'drapple_admin';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdmin() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSession(token, admin) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  async login(username, password) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setSession(data.token, data.admin);
    return data.admin;
  },

  logout() {
    clearSession();
  },

  // Products — public
  listProducts() {
    return request('/api/products');
  },

  getProduct(slug) {
    return request(`/api/products/${slug}`);
  },

  // Products — staff
  listAllProducts() {
    return request('/api/products/admin/all');
  },

  createProduct(formData) {
    return request('/api/products', { method: 'POST', body: formData });
  },

  updateProduct(id, formData) {
    return request(`/api/products/${id}`, { method: 'PUT', body: formData });
  },

  softDeleteProduct(id) {
    return request(`/api/products/${id}`, { method: 'DELETE' });
  },

  restoreProduct(id) {
    return request(`/api/products/${id}/restore`, { method: 'PUT' });
  },

  // Admins — owner
  listAdmins() {
    return request('/api/admins');
  },

  createAdmin(username, password, role) {
    return request('/api/admins', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
  },

  deleteAdmin(id) {
    return request(`/api/admins/${id}`, { method: 'DELETE' });
  },

  // Activity — owner
  listActivity() {
    return request('/api/activity');
  },
};
