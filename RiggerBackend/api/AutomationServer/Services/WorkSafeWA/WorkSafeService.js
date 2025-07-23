const axios = require('axios');
const crypto = require('crypto');
const logger = require('../../../middleware/logger');

class WorkSafeService {
    constructor() {
        this.baseUrl = process.env.WORKSAFE_WA_API_URL;
        this.apiKey = process.env.WORKSAFE_WA_API_KEY;
        this.apiSecret = process.env.WORKSAFE_WA_API_SECRET;
    }

    /**
     * Generate authentication headers for WorkSafe WA API
     * @returns {Object} Headers for API request
     */
    #generateAuthHeaders() {
        const timestamp = Date.now().toString();
        const signature = crypto
            .createHmac('sha256', this.apiSecret)
            .update(`${this.apiKey}${timestamp}`)
            .digest('hex');

        return {
            'X-API-Key': this.apiKey,
            'X-Timestamp': timestamp,
            'X-Signature': signature,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Validate a high-risk work license
     * @param {string} licenseNumber - WorkSafe WA license number
     * @param {string} licenseType - Type of license (e.g., 'RB' for basic rigging)
     * @returns {Promise<Object>} License validation result
     */
    async validateHighRiskLicense(licenseNumber, licenseType) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/licenses/validate`,
                {
                    headers: this.#generateAuthHeaders(),
                    params: {
                        license_number: licenseNumber,
                        license_type: licenseType
                    }
                }
            );

            logger.info(`Successfully validated license: ${licenseNumber}`);
            return {
                isValid: response.data.valid,
                expiryDate: response.data.expiry_date,
                restrictions: response.data.restrictions || [],
                classes: response.data.license_classes || [],
                verificationId: response.data.verification_id
            };
        } catch (error) {
            logger.error(`Error validating license ${licenseNumber}: ${error.message}`);
            throw new Error('License validation failed');
        }
    }

    /**
     * Get detailed certification information
     * @param {string} certificationId - WorkSafe WA certification ID
     * @returns {Promise<Object>} Detailed certification information
     */
    async getCertificationDetails(certificationId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/certifications/${certificationId}`,
                {
                    headers: this.#generateAuthHeaders()
                }
            );

            logger.info(`Retrieved certification details for: ${certificationId}`);
            return {
                holderName: response.data.holder_name,
                certificationTypes: response.data.certification_types,
                issueDate: response.data.issue_date,
                expiryDate: response.data.expiry_date,
                status: response.data.status,
                endorsements: response.data.endorsements || [],
                verificationHistory: response.data.verification_history || []
            };
        } catch (error) {
            logger.error(`Error fetching certification ${certificationId}: ${error.message}`);
            throw new Error('Certification lookup failed');
        }
    }

    /**
     * Verify safety awareness training completion
     * @param {string} workerId - Worker's unique identifier
     * @returns {Promise<Object>} Safety training verification result
     */
    async verifySafetyTraining(workerId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/safety-training/verify`,
                {
                    headers: this.#generateAuthHeaders(),
                    params: { worker_id: workerId }
                }
            );

            logger.info(`Verified safety training for worker: ${workerId}`);
            return {
                hasValidTraining: response.data.valid_training,
                completionDate: response.data.completion_date,
                trainingModules: response.data.completed_modules || [],
                nextRefreshDate: response.data.refresh_due_date
            };
        } catch (error) {
            logger.error(`Error verifying safety training for ${workerId}: ${error.message}`);
            throw new Error('Safety training verification failed');
        }
    }

    /**
     * Check for any safety incidents or violations
     * @param {string} workerId - Worker's unique identifier
     * @returns {Promise<Object>} Safety record check result
     */
    async checkSafetyRecord(workerId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/safety-record/check`,
                {
                    headers: this.#generateAuthHeaders(),
                    params: { worker_id: workerId }
                }
            );

            logger.info(`Checked safety record for worker: ${workerId}`);
            return {
                hasSafetyIncidents: response.data.has_incidents,
                incidentCount: response.data.incident_count || 0,
                lastIncidentDate: response.data.last_incident_date,
                resolutionStatus: response.data.resolution_status,
                safetyRating: response.data.safety_rating
            };
        } catch (error) {
            logger.error(`Error checking safety record for ${workerId}: ${error.message}`);
            throw new Error('Safety record check failed');
        }
    }

    /**
     * Subscribe to real-time certification updates
     * @param {string} certificationId - WorkSafe WA certification ID
     * @param {Function} callback - Callback function for updates
     * @returns {Promise<Object>} Subscription confirmation
     */
    async subscribeToCertificationUpdates(certificationId, callback) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/certifications/subscribe`,
                {
                    certification_id: certificationId,
                    callback_url: process.env.WORKSAFE_CALLBACK_URL
                },
                {
                    headers: this.#generateAuthHeaders()
                }
            );

            logger.info(`Subscribed to updates for certification: ${certificationId}`);
            return {
                subscriptionId: response.data.subscription_id,
                status: response.data.status,
                notificationType: response.data.notification_type
            };
        } catch (error) {
            logger.error(`Error subscribing to certification updates ${certificationId}: ${error.message}`);
            throw new Error('Certification subscription failed');
        }
    }
}

module.exports = new WorkSafeService();
