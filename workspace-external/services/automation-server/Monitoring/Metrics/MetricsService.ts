export class MetricsService {
  private metrics: any = {};
  private isCollecting = false;

  public recordRequestMetrics(method: string, path: string, statusCode: number, duration: number): void {
    if (!this.metrics[method]) {
      this.metrics[method] = {};
    }
    
    if (!this.metrics[method][path]) {
      this.metrics[method][path] = {
        count: 0,
        totalDuration: 0,
        statusCodes: {}
      };
    }

    this.metrics[method][path].count++;
    this.metrics[method][path].totalDuration += duration;
    
    if (!this.metrics[method][path].statusCodes[statusCode]) {
      this.metrics[method][path].statusCodes[statusCode] = 0;
    }
    this.metrics[method][path].statusCodes[statusCode]++;
  }

  public getMetrics() {
    return {
      requests: this.metrics,
      timestamp: new Date().toISOString()
    };
  }

  public startCollection(): void {
    this.isCollecting = true;
    console.log('Metrics collection started');
  }

  public stopCollection(): void {
    this.isCollecting = false;
    console.log('Metrics collection stopped');
  }
}
