import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';

// Validation schema for business registration
const businessSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  abn: z.string().regex(/^\d{11}$/, 'ABN must be 11 digits'),
  worksafeNumber: z.string().regex(/^[A-Z0-9]{8}$/, 'WorkSafe number must be 8 characters'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?61\d{9}$/, 'Phone must be in Australian format'),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    suburb: z.string().min(2, 'Suburb is required'),
    state: z.string().length(2, 'State must be 2 letters (WA)'),
    postcode: z.string().regex(/^\d{4}$/, 'Postcode must be 4 digits')
  }),
  businessType: z.enum(['mining', 'construction', 'both']),
  licenseDocuments: z.array(z.any()).min(1, 'At least one license document is required')
});

type BusinessFormData = z.infer<typeof businessSchema>;

export default function BusinessRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      address: { state: 'WA' } // Default to Western Australia
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = async (data: BusinessFormData) => {
    setIsSubmitting(true);
    try {
      // Upload documents to Supabase storage
      const documentUrls = await Promise.all(
        uploadedFiles.map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;
          const { data: uploadData, error } = await supabase.storage
            .from('business-documents')
            .upload(fileName, file);
          
          if (error) throw error;
          return uploadData.path;
        })
      );

      // Create business registration record
      const { data: registration, error } = await supabase
        .from('business_registrations')
        .insert({
          ...data,
          documents: documentUrls,
          status: 'pending',
          submission_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger verification workflow
      await fetch('/api/business/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: registration.id })
      });

      // Redirect to verification status page
      window.location.href = `/registration/status/${registration.id}`;
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-gray-900 p-8 rounded-lg border border-cyan-500 shadow-lg shadow-cyan-500/20">
        <h2 className="text-2xl font-bold mb-6 text-white bg-gradient-to-r from-cyan-500 to-magenta-500 bg-clip-text text-transparent">
          Business Registration
        </h2>

        {/* Company Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-cyan-400 mb-1">Company Name</label>
            <input
              {...register('companyName')}
              className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-cyan-400 mb-1">ABN</label>
              <input
                {...register('abn')}
                className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              {errors.abn && (
                <p className="text-red-500 text-sm mt-1">{errors.abn.message}</p>
              )}
            </div>

            <div>
              <label className="block text-cyan-400 mb-1">WorkSafe Number</label>
              <input
                {...register('worksafeNumber')}
                className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              {errors.worksafeNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.worksafeNumber.message}</p>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-cyan-400 mb-1">Contact Name</label>
              <input
                {...register('contactName')}
                className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              {errors.contactName && (
                <p className="text-red-500 text-sm mt-1">{errors.contactName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-cyan-400 mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-cyan-400 mb-1">Street Address</label>
              <input
                {...register('address.street')}
                className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              {errors.address?.street && (
                <p className="text-red-500 text-sm mt-1">{errors.address.street.message}</p>
              )}
            </div>

            <div>
              <label className="block text-cyan-400 mb-1">Suburb</label>
              <input
                {...register('address.suburb')}
                className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              {errors.address?.suburb && (
                <p className="text-red-500 text-sm mt-1">{errors.address.suburb.message}</p>
              )}
            </div>

            <div>
              <label className="block text-cyan-400 mb-1">Postcode</label>
              <input
                {...register('address.postcode')}
                className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              {errors.address?.postcode && (
                <p className="text-red-500 text-sm mt-1">{errors.address.postcode.message}</p>
              )}
            </div>
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-cyan-400 mb-1">Business Type</label>
            <select
              {...register('businessType')}
              className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            >
              <option value="mining">Mining</option>
              <option value="construction">Construction</option>
              <option value="both">Both Mining & Construction</option>
            </select>
            {errors.businessType && (
              <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>
            )}
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-cyan-400 mb-1">License Documents</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-cyan-700 border-dashed rounded-md hover:border-cyan-500 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-cyan-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-400">
                  <label className="relative cursor-pointer rounded-md font-medium text-cyan-500 hover:text-cyan-400 focus-within:outline-none">
                    <span>Upload files</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">
                  PDF, PNG, JPG up to 10MB each
                </p>
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <ul className="mt-2 text-sm text-cyan-400">
                {uploadedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-magenta-500 text-white py-2 px-4 rounded-md hover:from-cyan-600 hover:to-magenta-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </button>
        </div>
      </div>
    </form>
  );
}
