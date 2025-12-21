const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

let firebaseApp = null;

const initializeFirebase = () => {
    if (!firebaseApp) {
        try {
            let serviceAccount;

            // Check if running on Render platform
            if (process.env.RENDER && process.env.RENDER === 'true') {
                // Production: Load from Render secrets
                logger.info('Loading Firebase credentials from Render secrets');
                serviceAccount = require('/etc/secrets/serviceAccountKey.json');
            } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
                // Environment variable: Parse JSON string
                logger.info('Loading Firebase credentials from environment variable');
                serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            } else {
                // Local development: Load from file
                logger.info('Loading Firebase credentials from local file');
                serviceAccount = require('../serviceAccountKey.json');
            }

            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.FIREBASE_DATABASE_URL,
            });

            logger.info('Firebase initialized successfully');
        } catch (error) {
            logger.error('Error initializing Firebase:', error);
            throw error;
        }
    }

    return firebaseApp;
};

module.exports = initializeFirebase;