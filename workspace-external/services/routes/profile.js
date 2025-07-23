const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');
const { authenticateJWT } = require('../middleware/auth');

// Get company profile
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('business_registrations')
      .select('*')
      .eq('email', req.user.email)
      .single();
    
    if (error) throw error;

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update company profile
router.patch('/profile', authenticateJWT, async (req, res) => {
  try {
    const updates = req.body;

    const { data: updatedProfile, error } = await supabase
      .from('business_registrations')
      .update(updates)
      .eq('email', req.user.email)
      .select('*')
      .single();

    if (error) throw error;

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
