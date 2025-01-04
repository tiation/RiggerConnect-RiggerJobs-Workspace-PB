const express = require('express');
const router = express.Router();
const JobService = require('../../Services/JobService');
const { ValidationError, NotFoundError } = require('../../Utils/Errors');

class JobController {
constructor() {
    this.jobService = new JobService();
}

async createJob(req, res, next) {
    try {
    const jobData = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        requiredSkills: req.body.requiredSkills,
        status: 'OPEN',
        clientId: req.user.id,
        budget: req.body.budget
    };
    
    const job = await this.jobService.createJob(jobData);
    res.status(201).json(job);
    } catch (error) {
    next(error);
    }
}

async updateJobStatus(req, res, next) {
    try {
    const { jobId } = req.params;
    const { status } = req.body;
    
    const job = await this.jobService.updateJobStatus(jobId, status);
    res.json(job);
    } catch (error) {
    next(error);
    }
}

async getJob(req, res, next) {
    try {
    const { jobId } = req.params;
    const job = await this.jobService.getJob(jobId);
    res.json(job);
    } catch (error) {
    next(error);
    }
}

async listJobs(req, res, next) {
    try {
    const { status, location, skills } = req.query;
    const jobs = await this.jobService.listJobs({ status, location, skills });
    res.json(jobs);
    } catch (error) {
    next(error);
    }
}

async assignWorker(req, res, next) {
    try {
    const { jobId } = req.params;
    const { workerId } = req.body;
    
    const job = await this.jobService.assignWorker(jobId, workerId);
    res.json(job);
    } catch (error) {
    next(error);
    }
}
}

const jobController = new JobController();

// Routes
router.post('/jobs', jobController.createJob.bind(jobController));
router.get('/jobs', jobController.listJobs.bind(jobController));
router.get('/jobs/:jobId', jobController.getJob.bind(jobController));
router.patch('/jobs/:jobId/status', jobController.updateJobStatus.bind(jobController));
router.post('/jobs/:jobId/assign', jobController.assignWorker.bind(jobController));

module.exports = router;

