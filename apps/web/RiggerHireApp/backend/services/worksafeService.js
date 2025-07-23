const axios = require('axios');
const { supabase } = require('../config/supabaseClient');

/**
 * Service for verifying and managing WorkSafe compliance
 */
class WorksafeService {
  constructor() {
    this.apiEndpoint = process.env.WORKSAFE_API_ENDPOINT;
    this.apiKey = process.env.WORKSAFE_API_KEY;
  }

  /**
   * Verify a WorkSafe number against the WA WorkSafe database
   * @param {string} worksafeNumber - The WorkSafe registration number to verify
   * @returns {Promise<boolean>} - Whether the number is valid
   */
  async verifyWorksafeNumber(worksafeNumber) {
    try {
      // First check our cache
      const { data: cached } = await supabase
        .from('worksafe_verifications')
        .select('valid, expires_at')
        .eq('worksafe_number', worksafeNumber)
        .single();

      // Return cached result if still valid
      if (cached && new Date(cached.expires_at) > new Date()) {
        return cached.valid;
      }

      // Call WorkSafe API
      const response = await axios.get(`${this.apiEndpoint}/verify/${worksafeNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const isValid = response.data.valid === true;
      
      // Cache the result
      await supabase.from('worksafe_verifications').upsert({
        worksafe_number: worksafeNumber,
        valid: isValid,
        verification_date: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Cache for 7 days
        response_data: response.data
      });

      return isValid;
    } catch (error) {
      console.error('WorkSafe verification error:', error);
      throw new Error('Failed to verify WorkSafe number');
    }
  }

  /**
   * Get detailed WorkSafe compliance information
   * @param {string} worksafeNumber - The WorkSafe registration number
   * @returns {Promise<Object>} - Detailed compliance information
   */
  async getComplianceDetails(worksafeNumber) {
    try {
      const response = await axios.get(`${this.apiEndpoint}/compliance/${worksafeNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        isCompliant: response.data.compliant,
        expiryDate: response.data.expiryDate,
        restrictions: response.data.restrictions || [],
        lastInspection: response.data.lastInspection,
        riskRating: response.data.riskRating
      };
    } catch (error) {
      console.error('WorkSafe compliance check error:', error);
      throw new Error('Failed to fetch compliance details');
    }
  }

  /**
   * Schedule a compliance check for a business
   * @param {string} businessId - The business ID in our system
   * @param {string} worksafeNumber - The WorkSafe registration number
   * @returns {Promise<void>}
   */
  async scheduleComplianceCheck(businessId, worksafeNumber) {
    try {
      // Create a compliance check schedule
      await supabase.from('compliance_checks').insert({
        business_id: businessId,
        worksafe_number: worksafeNumber,
        scheduled_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Schedule for 30 days
        status: 'scheduled'
      });
    } catch (error) {
      console.error('Failed to schedule compliance check:', error);
      throw new Error('Failed to schedule compliance check');
    }
  }

  /**
   * Process scheduled compliance checks
   * @returns {Promise<void>}
   */
  async processScheduledChecks() {
    try {
      // Get all scheduled checks that are due
      const { data: scheduledChecks, error } = await supabase
        .from('compliance_checks')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_date', new Date().toISOString());

      if (error) throw error;

      // Process each scheduled check
      for (const check of scheduledChecks) {
        try {
          const complianceDetails = await this.getComplianceDetails(check.worksafe_number);
          
          // Update check status and results
          await supabase
            .from('compliance_checks')
            .update({
              status: 'completed',
              completion_date: new Date().toISOString(),
              results: complianceDetails,
              next_check_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('id', check.id);

          // If non-compliant, create an alert
          if (!complianceDetails.isCompliant) {
            await supabase.from('compliance_alerts').insert({
              business_id: check.business_id,
              worksafe_number: check.worksafe_number,
              alert_type: 'non_compliant',
              details: complianceDetails,
              created_at: new Date().toISOString()
            });
          }
        } catch (checkError) {
          console.error(`Failed to process check ${check.id}:`, checkError);
          
          // Mark check as failed
          await supabase
            .from('compliance_checks')
            .update({
              status: 'failed',
              error_message: checkError.message,
              completion_date: new Date().toISOString()
            })
            .eq('id', check.id);
        }
      }
    } catch (error) {
      console.error('Failed to process scheduled checks:', error);
      throw new Error('Failed to process scheduled compliance checks');
    }
  }
}

module.exports = new WorksafeService();
