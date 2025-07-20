const { ValidationError, NotFoundError } = require('../Utils/Errors');
const db = require('../Database');

class WorkerService {
    static async getWorkerProfile(workerId) {
        const worker = await db.workers.findById(workerId);
        if (!worker) throw new NotFoundError('Worker not found');
        return worker;
    }

    static async updateProfile(profileData) {
        const { workerId, name, skills, certifications, location } = profileData;

        if (!workerId) throw new ValidationError('Worker ID is required');

        const worker = await db.workers.findById(workerId);
        if (!worker) {
            return await db.workers.create(profileData);
        }

        return await db.workers.update(workerId, {
            name,
            skills,
            certifications,
            location,
            updatedAt: new Date()
        });
    }

    static async verifyWorker(workerId) {
        const worker = await this.getWorkerProfile(workerId);
        const verificationResult = await this.performVerificationChecks(worker);
        
        await db.workers.update(workerId, {
            isVerified: verificationResult.passed,
            verificationDetails: verificationResult,
            verifiedAt: new Date()
        });

        return verificationResult;
    }

    static async acceptJob(workerId, jobId) {
        const worker = await this.getWorkerProfile(workerId);
        if (!worker.isVerified) {
            throw new ValidationError('Worker must be verified to accept jobs');
        }

        // Check if worker is available
        const isAvailable = await AvailabilityService.checkAvailability(workerId, jobId);
        if (!isAvailable) {
            throw new ValidationError('Worker is not available for this job time slot');
        }

        return await db.jobs.assignWorker(jobId, workerId);
    }

    static async getWorkerJobs(workerId) {
        const worker = await this.getWorkerProfile(workerId);
        return await db.jobs.findByWorkerId(workerId);
    }

    static async performVerificationChecks(worker) {
        // Implement verification logic here
        // Check certifications, background checks, etc.
        return {
            passed: true,
            checks: {
                backgroundCheck: true,
                certificationsValid: true,
                identityVerified: true
            }
        };
    }
}

module.exports = WorkerService;

