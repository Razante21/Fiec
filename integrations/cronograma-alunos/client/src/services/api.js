const API_URL = '/api';

const api = {
  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
  },

  async post(endpoint, body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
  },

  async put(endpoint, body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
  },

  async delete(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro na requisição');
    return data;
  }
};

export default api;