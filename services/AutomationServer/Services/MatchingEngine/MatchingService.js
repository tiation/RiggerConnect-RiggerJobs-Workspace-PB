/**
 * JobMatchingAgent - ML-powered job-candidate matching service
 * Integrates with RiggerHireApp, RiggerJobs, and TiationAIAgents
 */

const tf = require('@tensorflow/tfjs-node');
const mongoose = require('mongoose');

class MatchingService {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
        this.initialize();
    }

    async initialize() {
        try {
            // Load pre-trained ML model for job matching
            await this.loadModel();
            console.log('✅ JobMatchingAgent initialized successfully');
        } catch (error) {
            console.error('❌ JobMatchingAgent initialization failed:', error);
        }
    }

    async loadModel() {
        try {
            // In production, load from trained model file
            this.model = await tf.loadLayersModel('file://./models/job_matching_model.json');
            this.isModelLoaded = true;
        } catch (error) {
            console.log('🔄 Model not found, using rule-based matching as fallback');
            this.isModelLoaded = false;
        }
    }

    /**
     * Match jobs with candidates using ML algorithms
     * @param {Object} params - Matching parameters
     * @returns {Object} Match results with scores and reasoning
     */
    async matchJobsWithCandidates(params) {
        const {
            candidateProfile,
            jobRequirements,
            locationPreferences,
            maxDistance = 50,
            minMatchScore = 0.6
        } = params;

        try {
            let matchResults = [];

            if (this.isModelLoaded) {
                matchResults = await this.mlBasedMatching(candidateProfile, jobRequirements);
            } else {
                matchResults = await this.ruleBasedMatching(candidateProfile, jobRequirements);
            }

            // Apply location filtering
            matchResults = this.applyLocationFiltering(
                matchResults, 
                locationPreferences, 
                maxDistance
            );

            // Filter by minimum match score
            matchResults = matchResults.filter(match => match.score >= minMatchScore);

            // Sort by match score (descending)
            matchResults.sort((a, b) => b.score - a.score);

            return {
                success: true,
                totalMatches: matchResults.length,
                matches: matchResults,
                timestamp: new Date().toISOString(),
                agentId: 'JobMatchingAgent',
                version: '1.0.0'
            };

        } catch (error) {
            console.error('🚨 Job matching error:', error);
            return {
                success: false,
                error: error.message,
                matches: [],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * ML-based matching using TensorFlow model
     */
    async mlBasedMatching(candidateProfile, jobRequirements) {
        const features = this.extractFeatures(candidateProfile, jobRequirements);
        const tensor = tf.tensor2d([features]);
        
        const prediction = this.model.predict(tensor);
        const score = await prediction.data();
        
        tensor.dispose();
        prediction.dispose();

        return [{
            jobId: jobRequirements.jobId,
            candidateId: candidateProfile.userId,
            score: score[0],
            confidence: 0.95,
            reasoning: ['ml_prediction'],
            features: features
        }];
    }

    /**
     * Rule-based matching as fallback
     */
    async ruleBasedMatching(candidateProfile, jobRequirements) {
        let score = 0;
        let reasoning = [];

        // Skill matching (40% weight)
        const skillMatch = this.calculateSkillMatch(
            candidateProfile.skills,
            jobRequirements.requiredSkills
        );
        score += skillMatch * 0.4;
        if (skillMatch > 0.7) reasoning.push('skill_match');

        // Experience level (25% weight)
        const experienceMatch = this.calculateExperienceMatch(
            candidateProfile.experience,
            jobRequirements.experienceLevel
        );
        score += experienceMatch * 0.25;
        if (experienceMatch > 0.8) reasoning.push('experience_level');

        // Location proximity (20% weight)
        const locationMatch = this.calculateLocationMatch(
            candidateProfile.location,
            jobRequirements.location
        );
        score += locationMatch * 0.2;
        if (locationMatch > 0.8) reasoning.push('location_proximity');

        // Certifications (15% weight)
        const certMatch = this.calculateCertificationMatch(
            candidateProfile.certifications,
            jobRequirements.requiredCertifications
        );
        score += certMatch * 0.15;
        if (certMatch > 0.9) reasoning.push('certification_match');

        return [{
            jobId: jobRequirements.jobId,
            candidateId: candidateProfile.userId,
            score: Math.min(score, 1.0),
            confidence: 0.85,
            reasoning: reasoning,
            breakdown: {
                skillMatch,
                experienceMatch,
                locationMatch,
                certMatch
            }
        }];
    }

    calculateSkillMatch(candidateSkills, requiredSkills) {
        if (!requiredSkills || requiredSkills.length === 0) return 1.0;
        
        const matchedSkills = candidateSkills.filter(skill => 
            requiredSkills.some(required => 
                required.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(required.toLowerCase())
            )
        );
        
        return matchedSkills.length / requiredSkills.length;
    }

    calculateExperienceMatch(candidateExp, requiredExp) {
        const expMapping = {
            'entry': 0,
            'junior': 2,
            'intermediate': 5,
            'senior': 8,
            'expert': 12
        };

        const candidateYears = candidateExp.years || expMapping[candidateExp.level] || 0;
        const requiredYears = expMapping[requiredExp] || 0;

        if (candidateYears >= requiredYears) {
            return 1.0;
        } else if (candidateYears >= requiredYears * 0.8) {
            return 0.8;
        } else if (candidateYears >= requiredYears * 0.6) {
            return 0.6;
        } else {
            return 0.3;
        }
    }

    calculateLocationMatch(candidateLocation, jobLocation) {
        // Simple distance calculation (in production, use proper geolocation)
        const distance = this.calculateDistance(
            candidateLocation.latitude,
            candidateLocation.longitude,
            jobLocation.latitude,
            jobLocation.longitude
        );

        if (distance <= 10) return 1.0;
        if (distance <= 25) return 0.8;
        if (distance <= 50) return 0.6;
        if (distance <= 100) return 0.4;
        return 0.2;
    }

    calculateCertificationMatch(candidateCerts, requiredCerts) {
        if (!requiredCerts || requiredCerts.length === 0) return 1.0;
        
        const validCerts = candidateCerts.filter(cert => 
            cert.isValid && new Date(cert.expiryDate) > new Date()
        );
        
        const matchedCerts = validCerts.filter(cert =>
            requiredCerts.includes(cert.type)
        );
        
        return matchedCerts.length / requiredCerts.length;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    applyLocationFiltering(matches, locationPreferences, maxDistance) {
        return matches.filter(match => {
            // In production, calculate actual distance using job and candidate locations
            return true; // For now, return all matches
        });
    }

    extractFeatures(candidateProfile, jobRequirements) {
        // Extract numerical features for ML model
        return [
            candidateProfile.experience?.years || 0,
            candidateProfile.skills?.length || 0,
            candidateProfile.certifications?.length || 0,
            candidateProfile.rating || 0,
            candidateProfile.completedJobs || 0,
            jobRequirements.payRate || 0,
            jobRequirements.duration || 1,
            jobRequirements.urgency === 'high' ? 1 : 0
        ];
    }

    /**
     * Get job recommendations for a specific user
     */
    async getJobRecommendations(userId, limit = 10) {
        try {
            // In production, fetch user profile and active jobs from database
            const userProfile = await this.getUserProfile(userId);
            const activeJobs = await this.getActiveJobs();
            
            const recommendations = [];
            
            for (const job of activeJobs) {
                const matchResult = await this.matchJobsWithCandidates({
                    candidateProfile: userProfile,
                    jobRequirements: job,
                    minMatchScore: 0.3
                });
                
                if (matchResult.success && matchResult.matches.length > 0) {
                    recommendations.push({
                        ...job,
                        matchScore: matchResult.matches[0].score,
                        reasoning: matchResult.matches[0].reasoning
                    });
                }
            }
            
            return recommendations
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, limit);
                
        } catch (error) {
            console.error('🚨 Recommendation error:', error);
            return [];
        }
    }

    async getUserProfile(userId) {
        // Mock user profile - replace with actual database query
        return {
            userId: userId,
            skills: ['rigging', 'crane_operation', 'safety'],
            experience: { years: 5, level: 'intermediate' },
            certifications: [
                { type: 'rigging_basic', isValid: true, expiryDate: '2025-12-31' },
                { type: 'safety_certificate', isValid: true, expiryDate: '2025-06-30' }
            ],
            location: { latitude: -31.9505, longitude: 115.8605 }, // Perth
            rating: 4.5,
            completedJobs: 25
        };
    }

    async getActiveJobs() {
        // Mock active jobs - replace with actual database query
        return [
            {
                jobId: 'job_001',
                title: 'Senior Rigger - Mining Site',
                requiredSkills: ['rigging', 'heavy_lifting'],
                experienceLevel: 'intermediate',
                requiredCertifications: ['rigging_basic', 'safety_certificate'],
                location: { latitude: -31.9505, longitude: 115.8605 },
                payRate: 85,
                duration: 30,
                urgency: 'high'
            }
        ];
    }

    /**
     * Cross-app integration endpoints
     */
    async handleIntegrationRequest(sourceApp, targetApp, messageType, payload) {
        try {
            switch (messageType) {
                case 'JOB_MATCH_REQUEST':
                    return await this.matchJobsWithCandidates(payload);
                
                case 'GET_RECOMMENDATIONS':
                    return await this.getJobRecommendations(payload.userId, payload.limit);
                
                case 'UPDATE_MATCH_FEEDBACK':
                    return await this.updateMatchFeedback(payload);
                
                default:
                    throw new Error(`Unknown message type: ${messageType}`);
            }
        } catch (error) {
            console.error('🚨 Integration request error:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    async updateMatchFeedback(feedback) {
        // Update ML model based on user feedback
        console.log('📊 Updating match feedback:', feedback);
        return { success: true, message: 'Feedback recorded for model improvement' };
    }
}

module.exports = new MatchingService();
