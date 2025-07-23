import { Worker, Job, Company } from '../../types';

/**
 * Test data generators
 */
export const createTestWorker = (override: Partial<Worker> = {}): Worker => ({
  id: 'test-worker-id',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+61412345678',
  certifications: ['rigging-license', 'crane-license'],
  experience: 5,
  location: 'Perth, WA',
  availability: true,
  rating: 4.5,
  ...override
});

export const createTestJob = (override: Partial<Job> = {}): Job => ({
  id: 'test-job-id',
  title: 'Senior Rigger',
  description: 'Experienced rigger needed for construction project',
  requirements: ['rigging-license', '5-years-experience'],
  location: 'Perth, WA',
  startDate: new Date('2025-08-01'),
  salary: {
    min: 85000,
    max: 95000,
    currency: 'AUD'
  },
  status: 'active',
  ...override
});

export const createTestCompany = (override: Partial<Company> = {}): Company => ({
  id: 'test-company-id',
  name: 'Construction Corp',
  abn: '12345678901',
  address: '123 Business St, Perth, WA',
  contactPerson: {
    name: 'Jane Smith',
    email: 'jane.smith@constructioncorp.com',
    phone: '+61412345679'
  },
  verificationStatus: 'verified',
  ...override
});

/**
 * Database helpers
 */
export const clearTestDatabase = async () => {
  // Clear all test collections
  const collections = ['workers', 'jobs', 'companies', 'applications'];
  await Promise.all(collections.map(c => db.collection(c).deleteMany({})));
};

/**
 * Authentication helpers
 */
export const createTestToken = async (userData: {
  userId: string;
  role: 'worker' | 'employer' | 'admin';
}) => {
  // Create JWT token for testing
  const token = jwt.sign(userData, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });
  return token;
};

/**
 * API request helpers
 */
export const apiRequest = async (options: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  token?: string;
  body?: any;
}) => {
  const { method, endpoint, token, body } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${process.env.API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  
  return {
    status: response.status,
    body: await response.json()
  };
};

/**
 * Mocking helpers
 */
export const mockService = <T extends object>(
  service: T,
  methodName: keyof T,
  implementation: (...args: any[]) => any
) => {
  const original = service[methodName];
  service[methodName] = implementation as any;
  return () => {
    service[methodName] = original;
  };
};
