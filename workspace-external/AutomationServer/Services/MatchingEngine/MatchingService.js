const WorkerDatabase = require('../Database/WorkerDatabase');
const JobDatabase = require('../Database/JobDatabase');
const Logger = require('../../../Shared/Utils/Logger');

class MatchingService {
    async matchWorkerToJob(jobId) {
        try {
            const job = await JobDatabase.getJob(jobId);
            if (!job) throw new Error(`Job ${jobId} not found.`);

            const eligibleWorkers = await WorkerDatabase.getEligibleWorkers(job);
            const rankedWorkers = this.rankWorkers(eligibleWorkers, job);

            return rankedWorkers.length > 0 ? rankedWorkers[0] : null;
        } catch (error) {
            Logger.error('Error in matching worker to job:', error);
            throw error;
        }
    }

    rankWorkers(workers, job) {
        return workers
            .map(worker => ({
                worker,
                score: this.calculateScore(worker, job),
            }))
            .sort((a, b) => b.score - a.score)
            .map(entry => entry.worker);
    }

    calculateScore(worker, job) {
        let score = 0;
        if (worker.experience >= job.requiredExperience) score += 50;
        if (worker.certifications.includes(job.requiredCertification)) score += 30;
        if (worker.location === job.location) score += 20;
        return score;
    }
}

module.exports = new MatchingService();
