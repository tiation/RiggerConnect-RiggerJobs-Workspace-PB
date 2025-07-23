import { DocumentType, LicenseClass, WorkSafeVerification } from '../types';

export class WorkSafeService {
  private readonly API_KEY: string;
  private readonly API_ENDPOINT: string;

  constructor() {
    this.API_KEY = process.env.WORKSAFE_API_KEY || '';
    this.API_ENDPOINT = process.env.WORKSAFE_API_ENDPOINT || 'https://api.commerce.wa.gov.au/worksafe/v1';
  }

  /**
   * Verify a high-risk work license with WorkSafe WA
   */
  async verifyLicense(licenseNumber: string, licenseClass: LicenseClass): Promise<WorkSafeVerification> {
    try {
      // Implementation would use actual WorkSafe WA API
      // This is a mock implementation
      const response = await this.mockWorkSafeApiCall(licenseNumber, licenseClass);
      
      return {
        isValid: response.valid,
        licenseNumber: response.license_number,
        holderName: response.holder_name,
        licenseClass: response.license_class,
        expiryDate: new Date(response.expiry_date),
        restrictions: response.restrictions,
        verificationId: response.verification_id
      };
    } catch (error) {
      throw new Error(`WorkSafe verification failed: ${error}`);
    }
  }

  /**
   * Verify multiple licenses in bulk
   */
  async verifyLicenses(verifications: Array<{ licenseNumber: string; licenseClass: LicenseClass }>): Promise<WorkSafeVerification[]> {
    try {
      const results = await Promise.all(
        verifications.map(v => this.verifyLicense(v.licenseNumber, v.licenseClass))
      );
      return results;
    } catch (error) {
      throw new Error(`Bulk verification failed: ${error}`);
    }
  }

  /**
   * Check if a license class is valid for a document type
   */
  isValidLicenseClassForDocument(documentType: DocumentType, licenseClass: LicenseClass): boolean {
    const validClasses = this.getValidLicenseClassesForDocument(documentType);
    return validClasses.includes(licenseClass);
  }

  /**
   * Get valid license classes for a document type
   */
  private getValidLicenseClassesForDocument(documentType: DocumentType): LicenseClass[] {
    switch (documentType) {
      case DocumentType.DOGMAN_LICENSE:
        return [LicenseClass.DG];
      case DocumentType.RIGGER_LICENSE:
        return [LicenseClass.RB, LicenseClass.RI, LicenseClass.RA];
      case DocumentType.CRANE_OPERATOR_LICENSE:
        return [
          LicenseClass.CN,
          LicenseClass.C2,
          LicenseClass.C6,
          LicenseClass.C1,
          LicenseClass.CB,
          LicenseClass.CT
        ];
      default:
        return [];
    }
  }

  /**
   * Mock WorkSafe WA API call (for development)
   */
  private async mockWorkSafeApiCall(licenseNumber: string, licenseClass: LicenseClass): Promise<any> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response
    return {
      valid: true,
      license_number: licenseNumber,
      holder_name: 'John Smith',
      license_class: licenseClass,
      expiry_date: '2024-12-31',
      restrictions: [],
      verification_id: `WS-${Date.now()}`
    };
  }
}
