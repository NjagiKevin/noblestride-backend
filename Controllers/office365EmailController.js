const { getAuthUrl, getTokenFromCode, sendOffice365Email, getOffice365Inbox, saveOffice365Draft, isOffice365EmailEnabled, refreshToken } = require('../Middlewares/office365Email/office365EmailService');
const db = require('../Models');
const tokenRefreshQueue = require('../Middlewares/bullmq/tokenRefreshQueue');
const { sendMessage } = require('../Middlewares/kafka/kafkaProducer');
const { TOKEN_REFRESH_TOPIC } = require('../Middlewares/kafka/tokenRefreshConsumer');

const enableBullMQTokenRefresh = process.env.ENABLE_BULLMQ_TOKEN_REFRESH === 'true';
const enableKafka = process.env.ENABLE_KAFKA === 'true';

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
        const userId = 'testUser'; // Placeholder user ID - replace with actual user ID from your authentication system

        // Save or update token in database
        await db.Office365Token.upsert({
            userId: userId,
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.refreshToken,
            expiresIn: tokenResponse.expiresIn,
            acquiredAt: Date.now(),
        });

        // Add job to BullMQ or Kafka for future refresh
        if (enableBullMQTokenRefresh) {
            // Calculate when the job should run (5 minutes before expiry)
            const runAt = new Date(Date.now() + (tokenResponse.expiresIn - (5 * 60)) * 1000);
            
            // Add job with specific options
            await tokenRefreshQueue.add('refreshOffice365Token', {
                userId: userId,
                oldRefreshToken: tokenResponse.refreshToken,
                expiryTime: Date.now() + (tokenResponse.expiresIn * 1000),
            }, {
                delay: Math.max(0, runAt.getTime() - Date.now()), // Ensure delay is not negative
                priority: 1, // High priority for initial token refresh
                jobId: `refresh-${userId}-${Date.now()}`, // Unique job ID
                attempts: 5, // More retry attempts for token refresh
                backoff: {
                    type: 'exponential',
                    delay: 2000, // Start with 2 second delay
                },
            });
            console.log(`BullMQ job added for user ${userId} to refresh token, scheduled for ${runAt}.`);
        } else if (enableKafka) {
            await sendMessage(TOKEN_REFRESH_TOPIC, [
                { value: JSON.stringify({ userId: userId, oldRefreshToken: tokenResponse.refreshToken }) }
            ]);
            console.log(`Kafka message sent for user ${userId} to refresh token.`);
        }

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
    const userId = 'testUser'; // Placeholder user ID - replace with actual user ID from your authentication system

    let tokenInfo = await db.Office365Token.findOne({ where: { userId: userId } });

    if (!tokenInfo || !tokenInfo.accessToken) {
        return res.status(401).json({ message: 'Office 365 authentication required. Please initiate auth flow.' });
    }

    // Check if token is expired (add a buffer for network latency, e.g., 5 minutes)
    const expiryTime = tokenInfo.acquiredAt + (tokenInfo.expiresIn * 1000);
    if (Date.now() >= expiryTime - (5 * 60 * 1000)) { // Refresh if less than 5 minutes to expiry
        console.log('Access token expired or near expiry, attempting to refresh...');
        try {
            const newTokenResponse = await refreshToken(tokenInfo.refreshToken);
            
            // Update token in database
            await db.Office365Token.update({
                accessToken: newTokenResponse.accessToken,
                refreshToken: newTokenResponse.refreshToken,
                expiresIn: newTokenResponse.expiresIn,
                acquiredAt: Date.now(),
            }, { where: { userId: userId } });

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
