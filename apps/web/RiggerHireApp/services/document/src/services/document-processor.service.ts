import { Document, DocumentType, VerificationResult, ProcessingStatus, WorkSafeVerification } from '../types';
import { WorkSafeService } from './worksafe.service';

export class DocumentProcessorService {
  private worksafeService: WorkSafeService;
  private processingQueue: Map<string, ProcessingStatus>;

  constructor() {
    this.worksafeService = new WorkSafeService();
    this.processingQueue = new Map();
  }

  /**
   * Process and verify a document
   */
  async processDocument(document: Document): Promise<VerificationResult> {
    try {
      this.updateProcessingStatus(document.id, 'PROCESSING', 0, 'Starting document verification');

      // Validate document type
      if (!this.isValidDocumentType(document)) {
        return {
          success: false,
          document,
          errors: ['Invalid document type']
        };
      }

      // Update processing status
      this.updateProcessingStatus(document.id, 'PROCESSING', 25, 'Document type validated');

      // Verify with WorkSafe WA if applicable
      let worksafeVerification: WorkSafeVerification | undefined;
      if (this.requiresWorksafeVerification(document.type)) {
        if (!document.licenseClass) {
          return {
            success: false,
            document,
            errors: ['License class required for WorkSafe verification']
          };
        }

        worksafeVerification = await this.worksafeService.verifyLicense(
          document.documentNumber,
          document.licenseClass
        );

        this.updateProcessingStatus(document.id, 'PROCESSING', 75, 'WorkSafe verification completed');
      }

      // Final verification checks
      const verificationResult = this.finalizeVerification(document, worksafeVerification);
      
      // Update processing status
      this.updateProcessingStatus(
        document.id,
        verificationResult.success ? 'COMPLETED' : 'FAILED',
        100,
        verificationResult.success ? 'Verification completed' : 'Verification failed'
      );

      return verificationResult;
    } catch (error) {
      this.updateProcessingStatus(document.id, 'FAILED', 100, `Error: ${error}`);
      throw error;
    }
  }

  /**
   * Get the current processing status of a document
   */
  getProcessingStatus(documentId: string): ProcessingStatus | undefined {
    return this.processingQueue.get(documentId);
  }

  /**
   * Update the processing status of a document
   */
  private updateProcessingStatus(
    documentId: string,
    status: ProcessingStatus['status'],
    progress: number,
    message?: string
  ): void {
    this.processingQueue.set(documentId, {
      documentId,
      status,
      progress,
      message
    });
  }

  /**
   * Check if a document type is valid
   */
  private isValidDocumentType(document: Document): boolean {
    return Object.values(DocumentType).includes(document.type);
  }

  /**
   * Check if a document type requires WorkSafe WA verification
   */
  private requiresWorksafeVerification(documentType: DocumentType): boolean {
    return [
      DocumentType.HIGH_RISK_WORK_LICENSE,
      DocumentType.DOGMAN_LICENSE,
      DocumentType.RIGGER_LICENSE,
      DocumentType.CRANE_OPERATOR_LICENSE
    ].includes(documentType);
  }

  /**
   * Finalize document verification
   */
  private finalizeVerification(
    document: Document,
    worksafeVerification?: WorkSafeVerification
  ): VerificationResult {
    if (worksafeVerification) {
      if (!worksafeVerification.isValid) {
        return {
          success: false,
          document,
          worksafeVerification,
          errors: ['Invalid license according to WorkSafe WA']
        };
      }

      // Check expiry date
      if (worksafeVerification.expiryDate < new Date()) {
        return {
          success: false,
          document,
          worksafeVerification,
          errors: ['License has expired']
        };
      }
    }

    // Additional checks for non-WorkSafe documents could be added here

    return {
      success: true,
      document,
      worksafeVerification
    };
  }
}
