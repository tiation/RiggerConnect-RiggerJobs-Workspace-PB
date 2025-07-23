'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';

// Profile update schema
const profileSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  contact_name: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?61\d{9}$/, 'Phone must be in Australian format'),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    suburb: z.string().min(2, 'Suburb is required'),
    state: z.string().length(2, 'State must be 2 letters (WA)'),
    postcode: z.string().regex(/^\d{4}$/, 'Postcode must be 4 digits')
  }),
  business_type: z.enum(['mining', 'construction', 'both'])
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('business_registrations')
        .select('*')
        .single();

      if (error) throw error;
      reset(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load profile'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('business_registrations')
        .update(data)
        .single();

      if (error) throw error;

      showToast({
        type: 'success',
        title: 'Success',
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update profile'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-500 to-magenta-500 bg-clip-text text-transparent">
              Company Profile
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Manage your company information and preferences
            </p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Company Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-cyan-400">Company Details</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Company Name
                  </label>
                  <input
                    type="text"
                    {...register('company_name')}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  {errors.company_name && (
                    <p className="mt-1 text-sm text-red-500">{errors.company_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Business Type
                  </label>
                  <select
                    {...register('business_type')}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="mining">Mining</option>
                    <option value="construction">Construction</option>
                    <option value="both">Both Mining & Construction</option>
                  </select>
                  {errors.business_type && (
                    <p className="mt-1 text-sm text-red-500">{errors.business_type.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-cyan-400">Contact Details</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    {...register('contact_name')}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  {errors.contact_name && (
                    <p className="mt-1 text-sm text-red-500">{errors.contact_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="+61"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-cyan-400">Address</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Street Address
                  </label>
                  <input
                    type="text"
                    {...register('address.street')}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  {errors.address?.street && (
                    <p className="mt-1 text-sm text-red-500">{errors.address.street.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Suburb
                    </label>
                    <input
                      type="text"
                      {...register('address.suburb')}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    {errors.address?.suburb && (
                      <p className="mt-1 text-sm text-red-500">{errors.address.suburb.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      State
                    </label>
                    <input
                      type="text"
                      {...register('address.state')}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="WA"
                      maxLength={2}
                    />
                    {errors.address?.state && (
                      <p className="mt-1 text-sm text-red-500">{errors.address.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Postcode
                    </label>
                    <input
                      type="text"
                      {...register('address.postcode')}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      maxLength={4}
                    />
                    {errors.address?.postcode && (
                      <p className="mt-1 text-sm text-red-500">{errors.address.postcode.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-700">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isDirty || isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white rounded-md shadow-sm hover:from-cyan-600 hover:to-magenta-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Compliance Status Card */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-cyan-400">Compliance Status</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-white">WorkSafe License</h4>
                    <p className="text-sm text-gray-400">Valid until Dec 2025</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-white">Insurance</h4>
                    <p className="text-sm text-gray-400">Up to date</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-white">Safety Rating</h4>
                    <p className="text-sm text-gray-400">5/5 Stars</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
