const axios = require('axios');

class ABNService {
  constructor() {
    this.apiEndpoint = process.env.ABN_LOOKUP_API_ENDPOINT;
    this.apiGuid = process.env.ABN_LOOKUP_GUID;
  }

  /**
   * Validate an ABN using the ABN Lookup web service
   * @param {string} abn - The ABN to validate
   * @returns {Promise<boolean>} - Whether the ABN is valid
   */
  async validateABN(abn) {
    try {
      const formattedABN = abn.replace(/\s/g, '');
      
      // Basic format check
      if (!/^\d{11}$/.test(formattedABN)) {
        return false;
      }

      // Call ABN Lookup API
      const response = await axios.get(`${this.apiEndpoint}/abn.json/${this.apiGuid}/${formattedABN}`);
      
      // Check if ABN is active and valid
      return response.data.Abn && 
             response.data.AbnStatus === 'Active' && 
             response.data.BusinessName;
    } catch (error) {
      console.error('ABN validation error:', error);
      throw new Error('Failed to validate ABN');
    }
  }

  /**
   * Get detailed ABN information
   * @param {string} abn - The ABN to look up
   * @returns {Promise<Object>} - Detailed ABN information
   */
  async getABNDetails(abn) {
    try {
      const formattedABN = abn.replace(/\s/g, '');
      
      const response = await axios.get(`${this.apiEndpoint}/abn.json/${this.apiGuid}/${formattedABN}`);
      
      if (!response.data.Abn) {
        throw new Error('ABN not found');
      }

      return {
        abn: response.data.Abn,
        entityName: response.data.EntityName,
        entityType: response.data.EntityType?.EntityTypeDescription,
        status: response.data.AbnStatus,
        stateCode: response.data.AddressState?.StateCode,
        postcode: response.data.AddressPostcode,
        effectiveFrom: response.data.AbnStatusEffectiveFrom,
        gstRegistered: response.data.Gst === 'Y',
        businessNames: response.data.BusinessName || []
      };
    } catch (error) {
      console.error('ABN lookup error:', error);
      throw new Error('Failed to fetch ABN details');
    }
  }

  /**
   * Validate ABN matches company name
   * @param {string} abn - The ABN to validate
   * @param {string} companyName - The company name to match
   * @returns {Promise<boolean>} - Whether the ABN matches the company
   */
  async validateABNMatchesCompany(abn, companyName) {
    try {
      const details = await this.getABNDetails(abn);
      
      // Normalize names for comparison
      const normalizedCompanyName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedEntityName = details.entityName.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Check main entity name
      if (normalizedEntityName.includes(normalizedCompanyName) || 
          normalizedCompanyName.includes(normalizedEntityName)) {
        return true;
      }

      // Check trading names
      const matchingBusinessName = details.businessNames.some(name => {
        const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalizedName.includes(normalizedCompanyName) || 
               normalizedCompanyName.includes(normalizedName);
      });

      return matchingBusinessName;
    } catch (error) {
      console.error('ABN company validation error:', error);
      throw new Error('Failed to validate ABN against company name');
    }
  }
}

module.exports = new ABNService();
