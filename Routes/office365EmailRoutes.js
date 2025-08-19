const express = require('express');
const { initiateAuth, handleAuthCallback, ensureOffice365Auth, sendEmail, getInbox, saveDraft } = require('../Controllers/office365EmailController');

const router = express.Router();

// Route to initiate Office 365 authentication
router.get('/auth/initiate', initiateAuth);

// Callback URL for Office 365 authentication
router.get('/auth/callback', handleAuthCallback);

// Routes requiring Office 365 authentication
router.post('/send', ensureOffice365Auth, sendEmail);
router.get('/inbox', ensureOffice365Auth, getInbox);
router.post('/drafts', ensureOffice365Auth, saveDraft);

module.exports = router;
