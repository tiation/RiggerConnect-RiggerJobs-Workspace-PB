const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');
const { verifyWorksafeNumber } = require('../services/worksafeService');
const { sendVerificationEmail } = require('../services/emailService');
const { validateABN } = require('../services/abnService');
const { authenticateJWT } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Business registration endpoint
router.post('/register', upload.array('documents', 5), async (req, res) => {
  try {
    const {
      companyName,
      abn,
      worksafeNumber,
      contactName,
      email,
      phone,
      address,
      businessType
    } = req.body;

    // Validate ABN
    const abnValid = await validateABN(abn);
    if (!abnValid) {
      return res.status(400).json({ error: 'Invalid ABN' });
    }

    // Check WorkSafe number
    const worksafeValid = await verifyWorksafeNumber(worksafeNumber);
    if (!worksafeValid) {
      return res.status(400).json({ error: 'Invalid WorkSafe number' });
    }

    // Upload documents to Supabase storage
    const documentUrls = [];
    for (const file of req.files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const { data, error } = await supabase.storage
        .from('business-documents')
        .upload(fileName, file.buffer);

      if (error) throw error;
      documentUrls.push(data.path);
    }

    // Create business registration record
    const { data: registration, error } = await supabase
      .from('business_registrations')
      .insert({
        company_name: companyName,
        abn,
        worksafe_number: worksafeNumber,
        contact_name: contactName,
        email,
        phone,
        address,
        business_type: businessType,
        documents: documentUrls,
        status: 'pending',
        submission_date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Send verification email
    await sendVerificationEmail(email, {
      companyName,
      registrationId: registration.id,
      contactName
    });

    res.status(201).json({
      message: 'Registration submitted successfully',
      registrationId: registration.id
    });
  } catch (error) {
    console.error('Business registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get registration status
router.get('/registration/:id', authenticateJWT, async (req, res) => {
  try {
    const { data: registration, error } = await supabase
      .from('business_registrations')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json(registration);
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({ error: 'Failed to fetch registration' });
  }
});

// Update registration
router.patch('/registration/:id', authenticateJWT, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { data: registration, error } = await supabase
      .from('business_registrations')
      .update({ status, notes, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Send status update email
    await sendVerificationEmail(registration.email, {
      companyName: registration.company_name,
      status,
      notes,
      contactName: registration.contact_name
    });

    res.json(registration);
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({ error: 'Failed to update registration' });
  }
});

// Verify business documents
router.post('/verify/:id/documents', authenticateJWT, async (req, res) => {
  try {
    const { data: registration, error: fetchError } = await supabase
      .from('business_registrations')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    // Verify WorkSafe compliance
    const worksafeValid = await verifyWorksafeNumber(registration.worksafe_number);
    
    // Update verification status
    const { data: updated, error: updateError } = await supabase
      .from('business_registrations')
      .update({
        document_verified: true,
        worksafe_verified: worksafeValid,
        verification_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json(updated);
  } catch (error) {
    console.error('Document verification error:', error);
    res.status(500).json({ error: 'Failed to verify documents' });
  }
});

module.exports = router;
