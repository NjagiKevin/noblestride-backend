const express = require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');

router.get('/test-token', (req, res) => {
    try {
        const token = req.query.token;
        console.log('Original token:', token);

        // First step: URL decode
        const decodedToken = decodeURIComponent(token);
        console.log('URL decoded token:', decodedToken);

        // Check if it's a valid CryptoJS encrypted string
        if (!decodedToken.startsWith('U2FsdGVkX1')) {
            return res.status(400).json({
                status: false,
                message: 'Token does not appear to be a valid encrypted string',
                tokenStart: decodedToken.substring(0, 20)
            });
        }

        // Attempt decryption
        const secretKey = process.env.secretKey;
        console.log('Secret key exists:', !!secretKey);
        
        const decrypted = CryptoJS.AES.decrypt(decodedToken, secretKey);
        console.log('Decryption performed');

        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        console.log('Decrypted string length:', decryptedString.length);

        // Try to parse as JWT
        const parts = decryptedString.split('.');
        if (parts.length !== 3) {
            return res.status(400).json({
                status: false,
                message: 'Decrypted string is not a valid JWT',
                decryptedString: decryptedString
            });
        }

        return res.json({
            status: true,
            message: 'Token processed successfully',
            stages: {
                urlDecoded: decodedToken,
                decryptedString: decryptedString,
                isValidJWT: parts.length === 3
            }
        });

    } catch (error) {
        console.error('Error processing token:', error);
        return res.status(500).json({
            status: false,
            message: 'Error processing token',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;
