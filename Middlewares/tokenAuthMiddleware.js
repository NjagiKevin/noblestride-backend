// Middlewares/tokenAuthMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../Models");

const tokenAuthMiddleware = async (req, res, next) => {
  try {
    console.log('Query params:', req.query);
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);

    // Check for token in Authorization header or query parameter
    let token = req.header("Authorization")?.replace("Bearer ", "") || 
                req.cookies.jwt ||
                req.query.token;  // Support token in query parameter
    
    // Log token for debugging
    console.log('Initial token:', token);
    
    if (token) {
      // First, try to decode any URL encoding
      try {
        // First, try single decode
        let decodedOnce = decodeURIComponent(token);
        console.log('Token after single decode:', decodedOnce);
        
        // Try second decode only if the result still has encoded characters
        if (decodedOnce.includes('%')) {
          token = decodeURIComponent(decodedOnce);
          console.log('Token after double decode:', token);
        } else {
          token = decodedOnce;
        }
      } catch (e) {
        console.error('Error decoding token:', e);
        // If decoding fails, keep the original token
        console.log('Keeping original token due to decode error');
      }

      // If token looks like it's encrypted with CryptoJS
      if (token.includes('U2FsdGVkX1')) {
        try {
          console.log('Detected encrypted token, attempting decryption');
          const CryptoJS = require('crypto-js');
          
          // Remove line breaks but preserve spaces as they might be part of the encrypted data
          token = token.replace(/\r?\n|\r/g, '');
          console.log('Token after removing line breaks:', token);
          
          // Decrypt the token
          console.log('Using secret key:', process.env.secretKey ? 'Present' : 'Missing');
          const decrypted = CryptoJS.AES.decrypt(token, process.env.secretKey);
          console.log('Decryption object created');
          
          token = decrypted.toString(CryptoJS.enc.Utf8);
          console.log('Decrypted token:', token);
          
          if (!token) {
            throw new Error('Decryption resulted in empty string');
          }
        } catch (e) {
          console.error('Error during decryption process:', e);
          return res.status(400).json({ 
            status: "false", 
            message: "Invalid encrypted token format." 
          });
        }
      }
      
      // Clean up any remaining whitespace after decryption
      token = token.trim();
    }
    
    if (!token) {
      return res
        .status(401)
        .json({ status: "false", message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await db.users.findOne({
      where: { id: decoded.id },
      include: [
        {
          model: db.roles,
          as: "userRole"
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ status: "false", message: "User not found." });
    }

    // Check if user has Administrator role
    if (user.userRole?.name !== "Administrator") {
      return res.status(403).json({
        status: "false",
        message: "Access denied. Administrator role required."
      });
    }

    req.user = user;
    next();
  } catch (ex) {
    res.status(400).json({ status: "false", message: "Invalid token." });
  }
};

module.exports = tokenAuthMiddleware;
