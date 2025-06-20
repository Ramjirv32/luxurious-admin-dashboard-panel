
const API_BASE_URL = 'http://localhost:6000/api';

class AdminAPI {
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this.fetchWithAuth('/admin/dashboard/stats');
  }

  // Users
  async getUsers(params: { page?: number; search?: string; limit?: number } = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    return this.fetchWithAuth(`/admin/users?${queryParams.toString()}`);
  }

  async getUserById(id: string) {
    return this.fetchWithAuth(`/admin/users/${id}`);
  }

  async updateUser(id: string, data: any) {
    return this.fetchWithAuth(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.fetchWithAuth(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings
  async getBookings(params: { page?: number; search?: string; limit?: number } = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    return this.fetchWithAuth(`/admin/bookings?${queryParams.toString()}`);
  }

  async getBookingById(id: string) {
    return this.fetchWithAuth(`/admin/bookings/${id}`);
  }

  async updateBookingStatus(id: string, status: string) {
    return this.fetchWithAuth(`/admin/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Hotels
  async getHotels(params: { page?: number; search?: string; limit?: number } = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    return this.fetchWithAuth(`/admin/hotels?${queryParams.toString()}`);
  }

  async getHotelById(id: string) {
    return this.fetchWithAuth(`/admin/hotels/${id}`);
  }

  async createHotel(data: any) {
    return this.fetchWithAuth('/admin/hotels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHotel(id: string, data: any) {
    return this.fetchWithAuth(`/admin/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHotel(id: string) {
    return this.fetchWithAuth(`/admin/hotels/${id}`, {
      method: 'DELETE',
    });
  }

  // Newsletter
  async getNewsletterSubscribers(params: { page?: number; search?: string; limit?: number } = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    return this.fetchWithAuth(`/admin/newsletter?${queryParams.toString()}`);
  }

  async removeSubscriber(id: string) {
    return this.fetchWithAuth(`/admin/newsletter/${id}`, {
      method: 'DELETE',
    });
  }

  // Rooms
  async getRooms(hotelId?: string) {
    const endpoint = hotelId ? `/admin/rooms?hotelId=${hotelId}` : '/admin/rooms';
    return this.fetchWithAuth(endpoint);
  }

  async createRoom(data: any) {
    return this.fetchWithAuth('/admin/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRoom(id: string, data: any) {
    return this.fetchWithAuth(`/admin/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRoom(id: string) {
    return this.fetchWithAuth(`/admin/rooms/${id}`, {
      method: 'DELETE',
    });
  }
}

export const adminAPI = new AdminAPI();
