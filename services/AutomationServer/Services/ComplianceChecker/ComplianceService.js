const { supabase } = require('../../../../config/supabaseClient');
const worksafeService = require('../../../../services/worksafeService');

class ComplianceService {
  constructor() {
    this.checkInterval = process.env.COMPLIANCE_CHECK_INTERVAL || 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Start automated compliance checking
   */
  startAutomatedChecks() {
    setInterval(() => this.runComplianceChecks(), this.checkInterval);
  }

  /**
   * Run compliance checks for all registered businesses
   */
  async runComplianceChecks() {
    try {
      // Get all active businesses
      const { data: businesses, error } = await supabase
        .from('business_registrations')
        .select('*')
        .in('status', ['active', 'pending']);

      if (error) throw error;

      for (const business of businesses) {
        await this.checkBusinessCompliance(business);
      }
    } catch (error) {
      console.error('Compliance check error:', error);
    }
  }

  /**
   * Check compliance for a specific business
   */
  async checkBusinessCompliance(business) {
    try {
      // Check WorkSafe compliance
      const worksafeCompliance = await worksafeService.getComplianceDetails(business.worksafe_number);

      // Create compliance check record
      const { data: check, error } = await supabase
        .from('compliance_checks')
        .insert({
          business_id: business.id,
          worksafe_number: business.worksafe_number,
          scheduled_date: new Date().toISOString(),
          completion_date: new Date().toISOString(),
          status: worksafeCompliance.isCompliant ? 'compliant' : 'non_compliant',
          results: worksafeCompliance,
          next_check_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .select()
        .single();

      if (error) throw error;

      // Create alert if non-compliant
      if (!worksafeCompliance.isCompliant) {
        await this.createComplianceAlert(business, worksafeCompliance);
      }

      return check;
    } catch (error) {
      console.error(`Compliance check failed for business ${business.id}:`, error);
      throw error;
    }
  }

  /**
   * Create a compliance alert
   */
  async createComplianceAlert(business, complianceDetails) {
    try {
      const { error } = await supabase
        .from('compliance_alerts')
        .insert({
          business_id: business.id,
          worksafe_number: business.worksafe_number,
          alert_type: 'compliance_violation',
          details: {
            complianceDetails,
            message: 'Business is no longer compliant with WorkSafe regulations',
            recommendedActions: [
              'Review current WorkSafe certification',
              'Update expired documentation',
              'Contact WorkSafe WA for guidance'
            ]
          }
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Failed to create compliance alert for business ${business.id}:`, error);
      throw error;
    }
  }

  /**
   * Get compliance status for a business
   */
  async getBusinessComplianceStatus(businessId) {
    try {
      const { data, error } = await supabase
        .from('compliance_checks')
        .select('*')
        .eq('business_id', businessId)
        .order('completion_date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to get compliance status for business ${businessId}:`, error);
      throw error;
    }
  }

  /**
   * Get active compliance alerts for a business
   */
  async getBusinessComplianceAlerts(businessId) {
    try {
      const { data, error } = await supabase
        .from('compliance_alerts')
        .select('*')
        .eq('business_id', businessId)
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to get compliance alerts for business ${businessId}:`, error);
      throw error;
    }
  }
}

module.exports = new ComplianceService();
