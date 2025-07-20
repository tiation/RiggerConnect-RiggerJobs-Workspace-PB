import { useState, useEffect, useCallback } from 'react';
import { Job, ApiResponse } from '../types';
import { apiService } from '../services/api';

export interface UseJobsParams {
  search?: string;
  category?: string;
  location?: string;
  experienceLevel?: string;
  salary?: string;
  sortBy?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

export interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  refreshJobs: () => Promise<void>;
  loadMoreJobs: () => Promise<void>;
  searchJobs: (query: string) => Promise<void>;
  clearJobs: () => void;
}

export const useJobs = (params: UseJobsParams = {}): UseJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = useCallback(async (
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      if (page === 1) {
        setLoading(true);
      }
      setError(null);

      const response = await apiService.getJobs({
        ...params,
        page,
        limit: 20,
      });

      if (response.success) {
        if (append) {
          setJobs(prev => [...prev, ...response.data]);
        } else {
          setJobs(response.data);
        }

        if (response.pagination) {
          setCurrentPage(response.pagination.page);
          setTotalPages(response.pagination.totalPages);
          setHasMore(response.pagination.page < response.pagination.totalPages);
        } else {
          setHasMore(false);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch jobs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params]);

  const refreshJobs = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await fetchJobs(1, false);
  }, [fetchJobs]);

  const loadMoreJobs = useCallback(async () => {
    if (!hasMore || loading) return;

    const nextPage = currentPage + 1;
    await fetchJobs(nextPage, true);
  }, [hasMore, loading, currentPage, fetchJobs]);

  const searchJobs = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.searchJobs(query);

      if (response.success) {
        setJobs(response.data);
        setCurrentPage(1);
        setHasMore(false); // Search results are typically single page
      } else {
        throw new Error(response.message || 'Failed to search jobs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Error searching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearJobs = useCallback(() => {
    setJobs([]);
    setCurrentPage(1);
    setTotalPages(1);
    setHasMore(true);
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    hasMore,
    currentPage,
    totalPages,
    refreshJobs,
    loadMoreJobs,
    searchJobs,
    clearJobs,
  };
};

// Hook for featured jobs
export const useFeaturedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getFeaturedJobs();

      if (response.success) {
        setJobs(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch featured jobs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching featured jobs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedJobs();
  }, [fetchFeaturedJobs]);

  return {
    jobs,
    loading,
    error,
    refresh: fetchFeaturedJobs,
  };
};

// Hook for nearby jobs
export const useNearbyJobs = (lat?: number, lng?: number, radius?: number) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyJobs = useCallback(async () => {
    if (!lat || !lng) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getNearbyJobs(lat, lng, radius);

      if (response.success) {
        setJobs(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch nearby jobs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching nearby jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, radius]);

  useEffect(() => {
    fetchNearbyJobs();
  }, [fetchNearbyJobs]);

  return {
    jobs,
    loading,
    error,
    refresh: fetchNearbyJobs,
  };
};

// Hook for single job
export const useJob = (jobId: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getJobById(jobId);

      if (response.success) {
        setJob(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch job');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  return {
    job,
    loading,
    error,
    refresh: fetchJob,
  };
};

export default useJobs;