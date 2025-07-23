import { MatchingService } from '../../../services/matching/MatchingService';
import { Worker, Job } from '../../../types';

describe('MatchingService', () => {
  let matchingService: MatchingService;

  beforeEach(() => {
    matchingService = new MatchingService();
  });

  describe('findMatchingWorkers', () => {
    it('should match workers based on job requirements', async () => {
      const job: Job = {
        id: '123',
        title: 'Crane Operator',
        requirements: ['crane-license', '5-years-experience'],
        location: 'Perth, WA',
        startDate: new Date('2025-08-01'),
      };

      const workers: Worker[] = [
        {
          id: '1',
          certifications: ['crane-license'],
          experience: 6,
          location: 'Perth, WA',
          availability: true,
        },
        {
          id: '2',
          certifications: ['rigging-license'],
          experience: 3,
          location: 'Perth, WA',
          availability: true,
        },
      ];

      const matches = await matchingService.findMatchingWorkers(job, workers);
      
      expect(matches).toHaveLength(1);
      expect(matches[0].id).toBe('1');
    });

    it('should return empty array when no matches found', async () => {
      const job: Job = {
        id: '123',
        title: 'Crane Operator',
        requirements: ['crane-license', '10-years-experience'],
        location: 'Sydney, NSW',
        startDate: new Date('2025-08-01'),
      };

      const workers: Worker[] = [
        {
          id: '1',
          certifications: ['crane-license'],
          experience: 6,
          location: 'Perth, WA',
          availability: true,
        },
      ];

      const matches = await matchingService.findMatchingWorkers(job, workers);
      
      expect(matches).toHaveLength(0);
    });
  });
});
