const Logger = require('../../../Shared/Utils/Logger');

class ServiceHealthCheck {
    constructor() {
        this.services = new Map();
    }

    registerService(name, checkFn) {
        this.services.set(name, checkFn);
        Logger.info(`Registered health check for service: ${name}`);
    }

    async checkHealth() {
        const results = {};

        for (const [service, checkFn] of this.services) {
            try {
                const status = await checkFn();
                results[service] = {
                    status: status ? 'healthy' : 'unhealthy',
                    timestamp: new Date().toISOString()
                };
            } catch (error) {
                Logger.error(`Health check failed for ${service}`, { error: error.message });
                results[service] = {
                    status: 'error',
                    error: error.message,
                    timestamp: new Date().toISOString()
                };
            }
        }

        return {
            status: Object.values(results).every(r => r.status === 'healthy') ? 'healthy' : 'unhealthy',
            services: results,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = new ServiceHealthCheck();

