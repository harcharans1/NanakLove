const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

export const api = {
  getBooks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    return request(`/books${query.size ? `?${query}` : ''}`);
  },
  getBook: (id) => request(`/books/${encodeURIComponent(id)}`),
  getRadio: () => request('/radio'),
  getAllRadio: (adminKey) => request('/radio/admin/all', { headers: { 'x-admin-key': adminKey } }),
  sendContact: (message) => request('/contact', { method: 'POST', body: JSON.stringify(message) }),
  createBook: (book, adminKey) => request('/books', { method: 'POST', headers: { 'x-admin-key': adminKey }, body: JSON.stringify(book) }),
  updateBook: (id, book, adminKey) => request(`/books/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'x-admin-key': adminKey }, body: JSON.stringify(book) }),
  deleteBook: (id, adminKey) => request(`/books/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } }),
  createStation: (station, adminKey) => request('/radio', { method: 'POST', headers: { 'x-admin-key': adminKey }, body: JSON.stringify(station) }),
  updateStation: (id, station, adminKey) => request(`/radio/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'x-admin-key': adminKey }, body: JSON.stringify(station) }),
  deleteStation: (id, adminKey) => request(`/radio/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } }),
};
