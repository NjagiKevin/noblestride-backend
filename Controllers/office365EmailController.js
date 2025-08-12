const { getAuthUrl, getTokenFromCode, sendOffice365Email, getOffice365Inbox, saveOffice365Draft, isOffice365EmailEnabled, refreshToken } = require('../Middlewares/office365Email/office365EmailService');

// In a real application, you would store tokens securely (e.g., in a database)
// For this example, we'll use a simple in-memory store for demonstration purposes.
const userTokens = {}; // userId -> { accessToken, refreshToken, expiresIn,  etc. }

/**
 * Initiates the Office 365 authentication flow.
 */
const initiateAuth = (req, res) => {
    if (!isOffice365EmailEnabled) {
        return res.status(503).json({ message: 'Office 365 email functionality is currently disabled due to missing configuration.' });
    }
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
};

/**
 * Handles the OAuth 2.0 callback from Microsoft.
 */
const handleAuthCallback = async (req, res) => {
    if (!isOffice365EmailEnabled) {
        return res.status(503).json({ message: 'Office 365 email functionality is currently disabled due to missing configuration.' });
    }
    const { code, state } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code not found.');
    }

    try {
        const tokenResponse = await getTokenFromCode(code);
        // In a real app, you'd associate this token with a user in your database
        const userId = 'testUser'; // Placeholder user ID
        userTokens[userId] = tokenResponse;

        res.status(200).json({
            message: 'Authentication successful!',
            accessToken: tokenResponse.accessToken,
            // In a real app, you wouldn't send refresh token to client
            refreshToken: tokenResponse.refreshToken,
            expiresIn: tokenResponse.expiresIn,
        });
    } catch (error) {
        console.error('Error handling auth callback:', error.message);
        res.status(500).send('Authentication failed.');
    }
};

/**
 * Middleware to ensure user is authenticated with Office 365 and has an access token.
 * In a real app, this would involve looking up the token in a database.
 */
const ensureOffice365Auth = async (req, res, next) => {
    if (!isOffice365EmailEnabled) {
        return res.status(503).json({ message: 'Office 365 email functionality is currently disabled due to missing configuration.' });
    }
    const userId = 'testUser'; // Placeholder user ID
    const tokenInfo = userTokens[userId];

    if (!tokenInfo || !tokenInfo.accessToken) {
        return res.status(401).json({ message: 'Office 365 authentication required. Please initiate auth flow.' });
    }

    // Basic token expiry check (real app would use refresh token logic)
    if (Date.now() >= (tokenInfo.ext_expires_in * 1000 + tokenInfo.acquiredAt)) {
        console.log('Access token expired, attempting to refresh...');
        try {
            const newTokenResponse = await refreshToken(tokenInfo.refreshToken);
            userTokens[userId] = { ...tokenInfo, ...newTokenResponse };
            req.office365AccessToken = newTokenResponse.accessToken;
        } catch (error) {
            console.error('Error refreshing token:', error.message);
            return res.status(401).json({ message: 'Failed to refresh token. Please re-authenticate.' });
        }
    } else {
        req.office365AccessToken = tokenInfo.accessToken;
    }
    next();
};

/**
 * Sends an email via Office 365.
 */
const sendEmail = async (req, res) => {
    if (!isOffice365EmailEnabled) {
        return res.status(503).json({ message: 'Office 365 email functionality is currently disabled due to missing configuration.' });
    }
    const { to, subject, text, html, cc, bcc } = req.body;
    const accessToken = req.office365AccessToken; // From ensureOffice365Auth middleware

    if (!to || !subject || !text) {
        return res.status(400).json({ message: 'Missing required fields: to, subject, text.' });
    }

    try {
        const result = await sendOffice365Email(accessToken, { to, subject, text, html, cc, bcc });
        if (result.status) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(500).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in sendEmail controller:', error.message);
        res.status(500).json({ message: 'Failed to send email.' });
    }
};

/**
 * Fetches inbox emails from Office 365.
 */
const getInbox = async (req, res) => {
    if (!isOffice365EmailEnabled) {
        return res.status(503).json({ message: 'Office 365 email functionality is currently disabled due to missing configuration.' });
    }
    const accessToken = req.office365AccessToken;
    const { top, filter } = req.query; // Allow query parameters for top and filter

    try {
        const result = await getOffice365Inbox(accessToken, { top, filter });
        if (result.status) {
            res.status(200).json({ emails: result.emails });
        } else {
            res.status(500).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in getInbox controller:', error.message);
        res.status(500).json({ message: 'Failed to fetch inbox.' });
    }
};

/**
 * Saves an email as a draft in Office 365.
 */
const saveDraft = async (req, res) => {
    if (!isOffice365EmailEnabled) {
        return res.status(503).json({ message: 'Office 365 email functionality is currently disabled due to missing configuration.' });
    }
    const { to, subject, text, html, cc, bcc } = req.body;
    const accessToken = req.office365AccessToken;

    if (!to || !subject || !text) {
        return res.status(400).json({ message: 'Missing required fields: to, subject, text.' });
    }

    try {
        const result = await saveOffice365Draft(accessToken, { to, subject, text, html, cc, bcc });
        if (result.status) {
            res.status(200).json({ message: result.message, draftId: result.draftId });
        } else {
            res.status(500).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in saveDraft controller:', error.message);
        res.status(500).json({ message: 'Failed to save draft.' });
    }
};

module.exports = {
    initiateAuth,
    handleAuthCallback,
    ensureOffice365Auth,
    sendEmail,
    getInbox,
    saveDraft,
};
