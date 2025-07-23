module.exports = {
    // WorkSafe WA API Configuration
    worksafe: {
        // Base URL for WorkSafe WA API
        apiUrl: 'https://api.commerce.wa.gov.au/worksafe/v1',
        
        // API Authentication
        apiKey: 'your_worksafe_api_key',
        apiSecret: 'your_worksafe_api_secret',
        
        // Callback URL for certification updates
        callbackUrl: 'https://your-domain.com/api/worksafe/webhook',
        
        // License Types
        licenseTypes: {
            BASIC_RIGGING: 'RB',
            INTERMEDIATE_RIGGING: 'RI',
            ADVANCED_RIGGING: 'RA',
            BASIC_SCAFFOLDING: 'SB',
            INTERMEDIATE_SCAFFOLDING: 'SI',
            ADVANCED_SCAFFOLDING: 'SA',
            DOGGING: 'DG',
            CRANE_OPERATION: 'CN'
        },
        
        // API Rate Limits
        rateLimits: {
            maxRequests: 100,
            timeWindow: 60000 // 1 minute
        },
        
        // Verification Settings
        verification: {
            cacheExpiry: 3600000, // 1 hour
            retryAttempts: 3,
            retryDelay: 1000 // 1 second
        }
    }
};
