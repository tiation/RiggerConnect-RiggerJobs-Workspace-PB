'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/types';
import {
  validateABN,
  validateACN,
  INDUSTRY_REQUIREMENTS,
  LICENSE_FILE_REQUIREMENTS,
  INSURANCE_FILE_REQUIREMENTS,
  validateFile,
  IndustryType
} from '@/lib/types/business';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    industry: 'mining_operations' as IndustryType,
    address: '',
    abn: '',
    acn: '',
    message: '',
    licenseFile: null as File | null,
    insuranceFile: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.files[0]
      });
    }
  };

  // Get current industry requirements
  const currentIndustryReqs = INDUSTRY_REQUIREMENTS.includes(formData.industry as IndustryType)
    ? formData.industry
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 0. Validate ABN/ACN
      if (!validateABN(formData.abn)) {
        throw new Error('Invalid ABN format or checksum.');
      }

      if (formData.acn && !validateACN(formData.acn)) {
        throw new Error('Invalid ACN format or checksum.');
      }

      // 1. Validate files
      const licenseFileError = formData.licenseFile ? validateFile(formData.licenseFile, LICENSE_FILE_REQUIREMENTS) : null;
      if (licenseFileError) throw new Error(licenseFileError);

      const insuranceFileError = formData.insuranceFile ? validateFile(formData.insuranceFile, INSURANCE_FILE_REQUIREMENTS) : null;
      if (insuranceFileError) throw new Error(insuranceFileError);
      // 1. Upload license and insurance documents to Supabase Storage
      const licenseUrl = formData.licenseFile ? 
        await uploadFile('business-documents', `licenses/${formData.abn}-${formData.licenseFile.name}`, formData.licenseFile) : null;
      
      const insuranceUrl = formData.insuranceFile ? 
        await uploadFile('business-documents', `insurance/${formData.abn}-${formData.insuranceFile.name}`, formData.insuranceFile) : null;

      // 2. Create business record
      const { data, error: insertError } = await supabase
        .from('businesses')
        .insert([
          {
            name: formData.businessName,
            email: formData.email,
            phone: formData.phone,
            industry: formData.industry,
            address: formData.address,
            verified: false,
            subscription_tier: 'free',
            abn: formData.abn,
            acn: formData.acn || null,
            license_url: licenseUrl,
            insurance_url: insuranceUrl,
            additional_info: formData.message,
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 3. Trigger verification workflow
      await fetch('/api/business/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: data.id,
          abn: formData.abn,
          licenseUrl,
          insuranceUrl
        })
      });

      // 4. Redirect to verification pending page
      router.push('/register/pending');

    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register business. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (bucket: string, path: string, file: File): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    return data.path;
  };

  return (
    <main className="min-h-screen pt-24 bg-background-dark">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary text-transparent bg-clip-text">
          Register Your Business
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-background-darker p-6 rounded-lg border border-primary-cyan">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              id="businessName"
              required
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
              placeholder="Enter your registered business name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="abn" className="block text-sm font-medium text-gray-300 mb-2">
                ABN (Australian Business Number) *
              </label>
              <input
                type="text"
                id="abn"
                required
                pattern="\d{11}"
                value={formData.abn}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
                placeholder="11 digit ABN"
              />
            </div>

            <div>
              <label htmlFor="acn" className="block text-sm font-medium text-gray-300 mb-2">
                ACN (if applicable)
              </label>
              <input
                type="text"
                id="acn"
                pattern="\d{9}"
                value={formData.acn}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
                placeholder="9 digit ACN"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Business Email *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
                placeholder="Enter your business email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Business Phone *
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
                placeholder="Enter your business phone"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
              Business Address *
            </label>
            <input
              type="text"
              id="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
              placeholder="Enter your business address"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                Industry *
              </label>
              <select
                id="industry"
                required
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
              >
                {Object.entries(INDUSTRY_REQUIREMENTS).map(([value, { name }]) => (
                  <option 
                    key={value} 
                    value={value}
                    className="bg-background-dark text-white"
                  >
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Display industry-specific requirements */}
            <div className="p-4 bg-background-darker rounded-lg border border-primary-cyan/30">
              <h3 className="text-sm font-medium text-primary-cyan mb-3">
                Required for {currentIndustryReqs.name}:
              </h3>
              
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium mb-1">Licenses/Permits Required:</h4>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    {currentIndustryReqs.licenses.map((license, index) => (
                      <li key={index} className="text-gray-400">{license}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Insurance Requirements:</h4>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    {currentIndustryReqs.insuranceTypes.map((insurance, index) => (
                      <li key={index} className="text-gray-400">{insurance}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Required Certifications:</h4>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    {currentIndustryReqs.certifications.map((cert, index) => (
                      <li key={index} className="text-gray-400">{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="licenseFile" className="block text-sm font-medium text-gray-300 mb-2">
                Business License/Permit *
              </label>
              <input
                type="file"
                id="licenseFile"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary-cyan/20 file:text-white hover:file:bg-primary-cyan/30"
              />
              <p className="mt-1 text-xs text-gray-400">Upload relevant business licenses or permits (PDF, JPG, PNG)</p>
            </div>

            <div>
              <label htmlFor="insuranceFile" className="block text-sm font-medium text-gray-300 mb-2">
                Insurance Certificate *
              </label>
              <input
                type="file"
                id="insuranceFile"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary-cyan/20 file:text-white hover:file:bg-primary-cyan/30"
              />
              <p className="mt-1 text-xs text-gray-400">Upload current public liability insurance (PDF, JPG, PNG)</p>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Additional Information
            </label>
            <textarea
              id="message"
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full bg-background-dark border border-primary-cyan text-white px-4 py-2 rounded-md focus:outline-none focus:shadow-neon-cyan"
              placeholder="Any additional information about your business"
            ></textarea>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold shadow-neon-cyan hover:shadow-neon-magenta transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Registering...' : 'Register Business'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
