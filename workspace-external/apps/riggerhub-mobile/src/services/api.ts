import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, Job, User, Application, Notification } from '../types';

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = 'https://rigger-platform-api-j6smnmk4oa-uc.a.run.app';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          // TODO: Navigate to login screen
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth Methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await this.client.post('/api/v1/auth/login', {
        email,
        password,
      });
      
      // Store token and user data
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'worker' | 'company';
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await this.client.post('/api/v1/auth/register', userData);
      
      // Store token and user data
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await this.client.post('/api/v1/auth/refresh');
      await AsyncStorage.setItem('authToken', response.data.data.token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Jobs Methods
  async getJobs(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    location?: string;
    experienceLevel?: string;
    salary?: string;
    sortBy?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  } = {}): Promise<ApiResponse<Job[]>> {
    try {
      // For demo purposes, return mock data
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Signaller - Infrastructure Project',
          company: 'Industrial Construction Ltd',
          location: 'West Melbourne, VIC',
          description: 'Crane signaller required for major infrastructure project. Entry level position with training provided.',
          salary: '$52.00/hr AUD',
          salaryMin: 52,
          salaryMax: 52,
          currency: 'AUD',
          jobType: 'contract',
          experienceLevel: 'entry_level',
          shift: 'day',
          startDate: '2025-07-24T11:58:00Z',
          requirements: ['White Card', 'Crane Signalling Certification'],
          benefits: ['Competitive rates', 'Training provided'],
          distance: 12646.8,
          coordinates: { latitude: -37.8136, longitude: 144.9631 },
          category: 'signaller',
          urgent: false,
          featured: true,
          applicantCount: 12,
          createdAt: '2025-07-20T10:00:00Z',
          updatedAt: '2025-07-20T10:00:00Z',
        },
        {
          id: '2',
          title: 'Rigger - Residential Complex',
          company: 'BuildTech Solutions',
          location: 'South Yarra, VIC',
          description: 'Riggers needed for large residential development. Great rates and steady work.',
          salary: '$42.00/hr AUD',
          salaryMin: 42,
          salaryMax: 42,
          currency: 'AUD',
          jobType: 'contract',
          experienceLevel: 'intermediate',
          shift: 'day',
          startDate: '2025-07-25T06:00:00Z',
          requirements: ['Rigging License', 'Experience with residential work'],
          benefits: ['Great rates', 'Steady work'],
          distance: 12646.3,
          coordinates: { latitude: -37.8396, longitude: 144.9897 },
          category: 'rigger',
          urgent: true,
          featured: false,
          applicantCount: 8,
          createdAt: '2025-07-20T09:00:00Z',
          updatedAt: '2025-07-20T09:00:00Z',
        },
      ];

      return {
        success: true,
        data: mockJobs,
        pagination: {
          page: params.page || 1,
          limit: params.limit || 20,
          total: mockJobs.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getJobById(jobId: string): Promise<ApiResponse<Job>> {
    try {
      const response = await this.client.get(`/api/v1/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getFeaturedJobs(): Promise<ApiResponse<Job[]>> {
    try {
      const response = await this.client.get('/api/v1/jobs/featured');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchJobs(query: string): Promise<ApiResponse<Job[]>> {
    try {
      const response = await this.client.get(`/api/v1/jobs/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Applications Methods
  async applyToJob(jobId: string, data: {
    message?: string;
    attachments?: string[];
  }): Promise<ApiResponse<Application>> {
    try {
      const response = await this.client.post(`/api/v1/jobs/${jobId}/apply`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMyApplications(params: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<Application[]>> {
    try {
      const response = await this.client.get('/api/v1/applications', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async withdrawApplication(applicationId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.client.delete(`/api/v1/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // User Profile Methods
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.get('/api/v1/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.put('/api/v1/profile', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadProfilePhoto(imageUri: string): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await this.client.post('/api/v1/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Notifications Methods
  async getNotifications(params: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  } = {}): Promise<ApiResponse<Notification[]>> {
    try {
      const response = await this.client.get('/api/v1/notifications', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.client.put(`/api/v1/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    try {
      const response = await this.client.put('/api/v1/notifications/read-all');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Location Methods
  async getNearbyJobs(lat: number, lng: number, radius: number = 50): Promise<ApiResponse<Job[]>> {
    try {
      const response = await this.client.get('/api/v1/jobs/nearby', {
        params: { lat, lng, radius },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Analytics Methods
  async trackJobView(jobId: string): Promise<void> {
    try {
      await this.client.post(`/api/v1/analytics/job-view`, { jobId });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  async trackApplicationStart(jobId: string): Promise<void> {
    try {
      await this.client.post(`/api/v1/analytics/application-start`, { jobId });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Utility Methods
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      return new Error(`API Error: ${message} (${error.response.status})`);
    } else if (error.request) {
      // Network error
      return new Error('Network Error: Please check your internet connection');
    } else {
      // Request setup error
      return new Error(`Request Error: ${error.message}`);
    }
  }

  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await this.client.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // File upload helper
  async uploadFile(file: {
    uri: string;
    type: string;
    name: string;
  }): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('file', file as any);

      const response = await this.client.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const apiService = new ApiService();
export default apiService;