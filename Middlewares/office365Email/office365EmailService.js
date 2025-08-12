const { Client } = require('@microsoft/microsoft-graph-client');
const { ConfidentialClientApplication } = require('@azure/msal-node');
const axios = require('axios');

let isOffice365EmailEnabled = true;
let cca;

// Azure AD App Registration details (replace with your actual values from .env)
const CLIENT_ID = process.env.O365_CLIENT_ID;
const CLIENT_SECRET = process.env.O365_CLIENT_SECRET;
const TENANT_ID = process.env.O365_TENANT_ID;
const REDIRECT_URI = process.env.O365_REDIRECT_URI || 'http://localhost:3030/api/office365/auth/callback';

if (!CLIENT_ID || !CLIENT_SECRET || !TENANT_ID) {
    console.warn('WARNING: Office 365 email functionality is disabled. Missing one or more required environment variables: O365_CLIENT_ID, O365_CLIENT_SECRET, O365_TENANT_ID.');
    isOffice365EmailEnabled = false;
} else {
    const msalConfig = {
        auth: {
            clientId: CLIENT_ID,
            authority: `https://login.microsoftonline.com/${TENANT_ID}`,
            clientSecret: CLIENT_SECRET,
        }
    };
    try {
        cca = new ConfidentialClientApplication(msalConfig);
    } catch (error) {
        console.error('ERROR: Failed to initialize MSAL ConfidentialClientApplication. Office 365 email functionality will be disabled.', error.message);
        isOffice365EmailEnabled = false;
    }
}

const disabledFunction = (featureName) => async () => {
    console.error(`Office 365 email feature '${featureName}' is disabled due to missing configuration.`);
    return { status: false, message: `Office 365 email feature '${featureName}' is disabled due to missing configuration.` };
};

// --- Authentication Functions ---

// --- Authentication Functions ---

const getAuthUrl = isOffice365EmailEnabled ? () => {
    const authCodeUrlParameters = {
        scopes: ['Mail.ReadWrite', 'Mail.Send', 'offline_access', 'User.Read'],
        redirectUri: REDIRECT_URI,
    };
    return cca.getAuthCodeUrl(authCodeUrlParameters);
} : disabledFunction('getAuthUrl');

/**
 * Acquires tokens using the authorization code.
 * @param {string} code - The authorization code received from the callback.
 * @returns {Promise<object>} A promise that resolves to the token response.
 */
const getTokenFromCode = isOffice365EmailEnabled ? async (code) => {
    const tokenRequest = {
        code: code,
        scopes: ['Mail.ReadWrite', 'Mail.Send', 'offline_access', 'User.Read'],
        redirectUri: REDIRECT_URI,
    };
    return await cca.acquireTokenByCode(tokenRequest);
} : disabledFunction('getTokenFromCode');

/**
 * Refreshes the access token using a refresh token.
 * @param {string} refreshToken - The refresh token.
 * @returns {Promise<object>} A promise that resolves to the new token response.
 */
const refreshToken = isOffice365EmailEnabled ? async (refreshToken) => {
    const refreshTokenRequest = {
        refreshToken: refreshToken,
        scopes: ['Mail.ReadWrite', 'Mail.Send', 'offline_access', 'User.Read'],
    };
    return await cca.acquireTokenByRefreshToken(refreshTokenRequest);
} : disabledFunction('refreshToken');

// --- Microsoft Graph Client Initialization ---

/**
 * Creates a Microsoft Graph client instance.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Client} The Microsoft Graph client.
 */
const getGraphClient = (accessToken) => {
    return Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });
};

// --- Email Operations ---

const sendOffice365Email = isOffice365EmailEnabled ? async (accessToken, { to, subject, text, html, cc, bcc }) => {
    const client = getGraphClient(accessToken);
    const message = {
        subject: subject,
        body: {
            contentType: html ? 'Html' : 'Text',
            content: html || text,
        },
        toRecipients: to.split(',').map(email => ({ emailAddress: { address: email.trim() } })),
    };

    if (cc) {
        message.ccRecipients = cc.split(',').map(email => ({ emailAddress: { address: email.trim() } }));
    }
    if (bcc) {
        message.bccRecipients = bcc.split(',').map(email => ({ emailAddress: { address: email.trim() } }));
    }

    try {
        await client.api('/me/sendMail').post({ message, saveToSentItems: true });
        return { status: true, message: 'Email sent successfully via Office 365!' };
    } catch (error) {
        console.error('Error sending Office 365 email:', error.message);
        return { status: false, message: error.message };
    }
} : disabledFunction('sendOffice365Email');

/**
 * Fetches emails from the user's inbox.
 * @param {string} accessToken - The access token of the authenticated user.
 * @param {object} [options] - Options for fetching emails.
 * @param {number} [options.top=10] - Number of emails to fetch.
 * @param {string} [options.filter] - OData filter string.
 * @returns {Promise<object>} A promise that resolves to the list of emails.
 */
const getOffice365Inbox = isOffice365EmailEnabled ? async (accessToken, options = {}) => {
    const client = getGraphClient(accessToken);
    const { top = 10, filter } = options;
    let request = client.api('/me/messages')
        .top(top)
        .select('subject,from,receivedDateTime,bodyPreview,isRead,webLink'); // Select relevant fields

    if (filter) {
        request = request.filter(filter);
    }

    try {
        const response = await request.get();
        return { status: true, emails: response.value };
    } catch (error) {
        console.error('Error fetching Office 365 inbox:', error.message);
        return { status: false, message: error.message };
    }
} : disabledFunction('getOffice365Inbox');

/**
 * Saves an email as a draft.
 * @param {string} accessToken - The access token of the authenticated user.
 * @param {object} emailOptions - Options for the draft email.
 * @param {string} emailOptions.to - Comma-separated recipient email addresses.
 * @param {string} emailOptions.subject - Email subject.
 * @param {string} emailOptions.text - Plain text body.
 * @param {string} [emailOptions.html] - HTML body.
 * @param {string} [emailOptions.cc] - Comma-separated CC recipient email addresses.
 * @param {string} [emailOptions.bcc] - Comma-separated BCC recipient email addresses.
 * @returns {Promise<object>} A promise that resolves to the created draft.
 */
const saveOffice365Draft = isOffice365EmailEnabled ? async (accessToken, { to, subject, text, html, cc, bcc }) => {
    const client = getGraphClient(accessToken);
    const message = {
        subject: subject,
        body: {
            contentType: html ? 'Html' : 'Text',
            content: html || text,
        },
        toRecipients: to.split(',').map(email => ({ emailAddress: { address: email.trim() } })),
    };

    if (cc) {
        message.ccRecipients = cc.split(',').map(email => ({ emailAddress: { address: email.trim() } }));
    }
    if (bcc) {
        message.bccRecipients = bcc.split(',').map(email => ({ emailAddress: { address: email.trim() } }));
    }

    try {
        const draft = await client.api('/me/messages').post(message);
        return { status: true, message: 'Draft saved successfully!', draftId: draft.id };
    } catch (error) {
        console.error('Error saving Office 365 draft:', error.message);
        return { status: false, message: error.message };
    }
} : disabledFunction('saveOffice365Draft');

module.exports = {
    getAuthUrl: isOffice365EmailEnabled ? getAuthUrl : disabledFunction('getAuthUrl'),
    getTokenFromCode: isOffice365EmailEnabled ? getTokenFromCode : disabledFunction('getTokenFromCode'),
    refreshToken: isOffice365EmailEnabled ? refreshToken : disabledFunction('refreshToken'),
    sendOffice365Email: isOffice365EmailEnabled ? sendOffice365Email : disabledFunction('sendOffice365Email'),
    getOffice365Inbox: isOffice365EmailEnabled ? getOffice365Inbox : disabledFunction('getOffice365Inbox'),
    saveOffice365Draft: isOffice365EmailEnabled ? saveOffice365Draft : disabledFunction('saveOffice365Draft'),
};
