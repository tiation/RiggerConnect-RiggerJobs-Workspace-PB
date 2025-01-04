const express = require('express');
const router = express.Router();
const WorkerService = require('../../Services/WorkerService');
const AvailabilityService = require('../../Services/WorkerWellness/AvailabilityService');
const { validateWorkerProfile, validateAvailability } = require('../Middleware/Validation');
const { asyncHandler } = require('../Utils/ErrorHandler');

// Get worker profile
router.get('/:workerId', asyncHandler(async (req, res) => {
    const { workerId } = req.params;
    const worker = await WorkerService.getWorkerProfile(workerId);
    res.json(worker);
}));

// Create/Update worker profile
router.post('/profile', validateWorkerProfile, asyncHandler(async (req, res) => {
    const workerProfile = await WorkerService.updateProfile(req.body);
    res.status(201).json(workerProfile);
}));

// Update availability
router.put('/:workerId/availability', validateAvailability, asyncHandler(async (req, res) => {
    const { workerId } = req.params;
    const availability = await AvailabilityService.updateAvailability(workerId, req.body);
    res.json(availability);
}));

// Accept job
router.post('/:workerId/jobs/:jobId/accept', asyncHandler(async (req, res) => {
    const { workerId, jobId } = req.params;
    const result = await WorkerService.acceptJob(workerId, jobId);
    res.json(result);
}));

// Get worker's scheduled jobs
router.get('/:workerId/jobs', asyncHandler(async (req, res) => {
    const { workerId } = req.params;
    const jobs = await WorkerService.getWorkerJobs(workerId);
    res.json(jobs);
}));

module.exports = router;

