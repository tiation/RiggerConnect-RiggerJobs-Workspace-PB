const MatchingService = require('./MatchingEngine/MatchingService');
const { ValidationError, NotFoundError } = require('../Utils/Errors');

class JobService {
constructor() {
    this.matchingService = new MatchingService();
}

async createJob(jobData) {
    try {
    this.validateJobData(jobData);
    
    // Create job in database
    const job = await this.saveJob(jobData);
    
    // Find matching workers
    const matches = await this.matchingService.findMatchingWorkers(job);
    
    // Notify matching workers
    await this.notifyWorkers(matches);
    
    return job;
    } catch (error) {
    throw error;
    }
}

validateJobData(jobData) {
    const requiredFields = ['title', 'description', 'location', 'requiredSkills', 'clientId'];
    for (const field of requiredFields) {
    if (!jobData[field]) {
        throw new ValidationError(`Missing required field: ${field}`);
    }
    }
}

async updateJobStatus(jobId, status) {
    const validStatuses = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    
    if (!validStatuses.includes(status)) {
    throw new ValidationError('Invalid job status');
    }
    
    const job = await this.getJob(jobId);
    if (!job) {
    throw new NotFoundError('Job not found');
    }
    
    // Update job status in database
    job.status = status;
    return await this.saveJob(job);
}

async getJob(jobId) {
    // Get job from database
    const job = null;  // Replace with actual database query
    
    if (!job) {
    throw new NotFoundError('Job not found');
    }
    
    return job;
}

async listJobs(filters = {}) {
    // Query jobs from database with filters
    return [];  // Simplified for MVP
}

async assignWorker(jobId, workerId) {
    const job = await this.getJob(jobId);
    
    if (job.status !== 'OPEN') {
    throw new ValidationError('Job is not available for assignment');
    }
    
    // Verify worker eligibility
    const matches = await this.matchingService.findMatchingWorkers(job);
    const isEligible = matches.some(match => match.worker.id === workerId);
    
    if (!isEligible) {
    throw new ValidationError('Worker is not eligible for this job');
    }
    
    // Assign worker to job
    job.workerId = workerId;
    job.status = 'ASSIGNED';
    
    return await this.saveJob(job);
}

async saveJob(job) {
    // Save job to database
    return job;  // Simplified for MVP
}

async notifyWorkers(matches) {
    // Implement notification logic
    // This could use a separate NotificationService
}
}

module.exports = JobService;

