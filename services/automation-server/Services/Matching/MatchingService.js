import Database from '../../Database/DatabaseManager';
import ComplianceChecker from '../ComplianceChecker/ComplianceService';
import { calculateDistance } from '../../Utilities/GeoUtils';

class MatchingService {
    constructor() {
        this.db = new Database();
        this.complianceChecker = new ComplianceChecker();
    }

    /**
    * Finds suitable workers for a given job
    * @param {Object} job - The job details
    * @returns {Promise<Array>} - Array of matched worker profiles
    */
    async findMatches(job) {
        try {
            const workers = await this.db.getAvailableWorkers();
            const eligibleWorkers = workers.filter(worker =>
                this.complianceChecker.isWorkerEligible(worker, job)
            );

            const rankedWorkers = eligibleWorkers
                .map(worker => ({
                    worker,
                    score: this.calculateMatchingScore(worker, job),
                }))
                .sort((a, b) => b.score - a.score);

            return rankedWorkers.map(({ worker }) => worker);
        } catch (error) {
            console.error('Error in MatchingService:', error);
            throw new Error('Failed to find matching workers');
        }
    }

    /**
    * Calculates a matching score for a worker based on job requirements
    * @param {Object} worker - The worker profile
    * @param {Object} job - The job details
    * @returns {Number} - Matching score
    */
    calculateMatchingScore(worker, job) {
        const distanceScore = this.getDistanceScore(worker.location, job.location);
        const experienceScore = worker.experience >= job.requiredExperience ? 1 : 0;
        const certificationScore = this.getCertificationScore(worker.certifications, job.requiredCertifications);

        return distanceScore * 0.4 + experienceScore * 0.3 + certificationScore * 0.3;
    }

    /**
    * Computes a distance-based score
    * @param {Object} workerLocation - Location of the worker
    * @param {Object} jobLocation - Location of the job
    * @returns {Number} - Distance score
    */
    getDistanceScore(workerLocation, jobLocation) {
        const distance = calculateDistance(workerLocation, jobLocation);
        return distance <= 10 ? 1 : distance <= 50 ? 0.5 : 0.2;
    }

    /**
    * Computes a certification-based score
    * @param {Array} workerCertifications - Worker certifications
    * @param {Array} jobCertifications - Job-required certifications
    * @returns {Number} - Certification score
    */
    getCertificationScore(workerCertifications, jobCertifications) {
        const matches = jobCertifications.filter(cert =>
            workerCertifications.includes(cert)
        ).length;
        return matches / jobCertifications.length;
    }
}

export default MatchingService;

