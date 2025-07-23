import request from 'supertest';
import { app } from '../../../src/app';
import { JobsRepository } from '../../../src/repositories/JobsRepository';
import { createTestToken } from '../../helpers/auth';

describe('Jobs API', () => {
  let testToken: string;

  beforeAll(async () => {
    testToken = await createTestToken({
      userId: '123',
      role: 'employer'
    });
  });

  beforeEach(async () => {
    await JobsRepository.clear(); // Clear test database
  });

  describe('POST /api/jobs', () => {
    it('should create a new job posting', async () => {
      const jobData = {
        title: 'Senior Rigger',
        description: 'Experienced rigger needed for major construction project',
        requirements: ['rigging-license', '5-years-experience'],
        location: 'Perth, WA',
        startDate: '2025-08-01',
        salary: {
          min: 85000,
          max: 95000,
          currency: 'AUD'
        }
      };

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${testToken}`)
        .send(jobData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        ...jobData,
        id: expect.any(String),
        createdAt: expect.any(String),
        status: 'active'
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          description: 'Missing required fields'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContain('title is required');
    });
  });

  describe('GET /api/jobs', () => {
    it('should return paginated job listings', async () => {
      // Create test jobs
      await JobsRepository.createMany([
        {
          title: 'Rigger 1',
          location: 'Perth, WA'
        },
        {
          title: 'Rigger 2',
          location: 'Perth, WA'
        }
      ]);

      const response = await request(app)
        .get('/api/jobs')
        .set('Authorization', `Bearer ${testToken}`)
        .query({
          page: 1,
          limit: 10
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        jobs: expect.arrayContaining([
          expect.objectContaining({
            title: 'Rigger 1'
          }),
          expect.objectContaining({
            title: 'Rigger 2'
          })
        ]),
        pagination: {
          page: 1,
          limit: 10,
          total: 2
        }
      });
    });
  });
});
