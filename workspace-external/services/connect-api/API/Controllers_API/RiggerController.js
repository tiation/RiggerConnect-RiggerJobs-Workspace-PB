const RiggerService = require('../Services/RiggerService');

module.exports = {
    async getRiggerProfile(req, res) {
        try {
            const { riggerId } = req.params;
            const profile = await RiggerService.fetchProfile(riggerId);
            return res.status(200).json(profile);
        } catch (error) {
            console.error('Error fetching rigger profile:', error);
            return res.status(500).json({ error: 'Failed to fetch profile.' });
        }
    },
};
