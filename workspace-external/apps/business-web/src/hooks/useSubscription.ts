import { useState, useEffect, useCallback } from 'react';
import { SubscriptionManager } from '@/lib/subscription/manager';
import { SubscriptionTier } from '@/config/subscriptionPlans';
import { useToast } from '@/components/ui/toast';

interface UseSubscriptionProps {
  businessId: string;
}

interface SubscriptionLimits {
  maxJobPostings: number;
  maxUsers: number;
  maxStorageGB: number;
  apiRequestsPerMonth: number;
}

export function useSubscription({ businessId }: UseSubscriptionProps) {
  const [tier, setTier] = useState<SubscriptionTier>('FREE');
  const [status, setStatus] = useState<string>('');
  const [features, setFeatures] = useState<string[]>([]);
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const toast = useToast();
  const subscriptionManager = new SubscriptionManager();

  const fetchSubscriptionDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { tier, status, features } = await subscriptionManager.getBusinessSubscription(businessId);
      const limits = await subscriptionManager.getActiveSubscriptionLimits(businessId);
      
      setTier(tier);
      setStatus(status);
      setFeatures(features);
      setLimits(limits);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to fetch subscription details');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, [fetchSubscriptionDetails]);

  const checkFeatureAccess = useCallback(async (featureKey: string) => {
    try {
      return await subscriptionManager.checkFeatureAccess(businessId, featureKey);
    } catch (err) {
      toast.error('Failed to check feature access');
      return false;
    }
  }, [businessId]);

  const checkUsageLimits = useCallback(async (metric: keyof SubscriptionLimits) => {
    try {
      return await subscriptionManager.checkUsageLimits(businessId, metric);
    } catch (err) {
      toast.error('Failed to check usage limits');
      return {
        current: 0,
        limit: 0,
        isWithinLimit: false,
      };
    }
  }, [businessId]);

  const refreshSubscription = useCallback(() => {
    fetchSubscriptionDetails();
  }, [fetchSubscriptionDetails]);

  return {
    tier,
    status,
    features,
    limits,
    loading,
    error,
    checkFeatureAccess,
    checkUsageLimits,
    refreshSubscription,
  };
}
