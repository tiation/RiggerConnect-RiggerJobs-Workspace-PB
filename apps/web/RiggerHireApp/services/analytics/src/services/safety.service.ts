import { SafetyIncident, SafetySeverity, TimeSeriesData } from '../types';
import { format, parseISO, eachDayOfInterval } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export class SafetyMetricsService {
  /**
   * Calculate Key Performance Indicators (KPIs) for safety metrics
   */
  calculateSafetyKPIs(incidents: SafetyIncident[], timeRange: { start: Date; end: Date }) {
    const totalIncidents = incidents.length;
    const totalDays = Math.ceil((timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      incidentFrequencyRate: (totalIncidents * 1000000) / (totalDays * 8 * 100), // per million hours worked
      severityRate: this.calculateSeverityRate(incidents),
      criticalIncidentRate: this.calculateCriticalIncidentRate(incidents),
      nearMissRate: this.calculateNearMissRate(incidents),
      resolutionRate: this.calculateResolutionRate(incidents)
    };
  }

  /**
   * Calculate severity rate weighted by incident severity
   */
  private calculateSeverityRate(incidents: SafetyIncident[]): number {
    const weights = {
      [SafetySeverity.LOW]: 1,
      [SafetySeverity.MEDIUM]: 3,
      [SafetySeverity.HIGH]: 7,
      [SafetySeverity.CRITICAL]: 15
    };

    const weightedSum = incidents.reduce((sum, incident) => {
      return sum + weights[incident.severity];
    }, 0);

    return weightedSum / incidents.length || 0;
  }

  /**
   * Calculate rate of critical incidents
   */
  private calculateCriticalIncidentRate(incidents: SafetyIncident[]): number {
    const criticalIncidents = incidents.filter(
      incident => incident.severity === SafetySeverity.CRITICAL
    );
    return (criticalIncidents.length / incidents.length) * 100 || 0;
  }

  /**
   * Calculate near-miss reporting rate
   */
  private calculateNearMissRate(incidents: SafetyIncident[]): number {
    const nearMisses = incidents.filter(
      incident => incident.severity === SafetySeverity.LOW
    );
    return (nearMisses.length / incidents.length) * 100 || 0;
  }

  /**
   * Calculate incident resolution rate
   */
  private calculateResolutionRate(incidents: SafetyIncident[]): number {
    const resolvedIncidents = incidents.filter(
      incident => incident.status === 'RESOLVED' || incident.status === 'CLOSED'
    );
    return (resolvedIncidents.length / incidents.length) * 100 || 0;
  }

  /**
   * Generate trendline data for safety metrics
   */
  generateTrendlineData(
    incidents: SafetyIncident[],
    timeRange: { start: Date; end: Date }
  ): TimeSeriesData[] {
    const days = eachDayOfInterval(timeRange);
    const timeZone = 'Australia/Perth';

    return days.map(day => {
      const dayStart = zonedTimeToUtc(day, timeZone);
      const dayEnd = zonedTimeToUtc(new Date(day.setHours(23, 59, 59)), timeZone);

      const dayIncidents = incidents.filter(
        incident => incident.date >= dayStart && incident.date <= dayEnd
      );

      return {
        timestamp: day,
        value: dayIncidents.length,
        metric: 'incidents'
      };
    });
  }

  /**
   * Generate safety recommendations based on incident patterns
   */
  generateSafetyRecommendations(incidents: SafetyIncident[]): string[] {
    const recommendations: string[] = [];
    const recentIncidents = incidents.filter(
      incident => incident.date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    // Check for frequent incident types
    const incidentTypes = this.getFrequentIncidentTypes(recentIncidents);
    if (incidentTypes.length > 0) {
      recommendations.push(
        `Focus on preventing ${incidentTypes.join(', ')} incidents which are most frequent.`
      );
    }

    // Check for critical incidents
    const criticalIncidents = recentIncidents.filter(
      incident => incident.severity === SafetySeverity.CRITICAL
    );
    if (criticalIncidents.length > 0) {
      recommendations.push(
        'Review and strengthen safety protocols due to recent critical incidents.'
      );
    }

    // Check resolution time
    const unresolved = recentIncidents.filter(
      incident => incident.status === 'REPORTED' || incident.status === 'INVESTIGATING'
    );
    if (unresolved.length > recentIncidents.length * 0.3) {
      recommendations.push(
        'Improve incident resolution process to address backlog of open cases.'
      );
    }

    return recommendations;
  }

  /**
   * Get most frequent incident types
   */
  private getFrequentIncidentTypes(incidents: SafetyIncident[]): string[] {
    const typeCount: Record<string, number> = {};
    incidents.forEach(incident => {
      typeCount[incident.incidentType] = (typeCount[incident.incidentType] || 0) + 1;
    });

    return Object.entries(typeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
  }
}
