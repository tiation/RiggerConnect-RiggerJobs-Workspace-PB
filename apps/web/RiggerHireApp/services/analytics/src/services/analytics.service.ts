import { AnalyticsEvent, SafetyIncident, ComplianceReport, AnalyticsQueryParams, TimeSeriesData, AggregateMetrics, SafetyMetrics } from '../types';
import { ClickHouseClient } from 'clickhouse-node';
import Elasticsearch from 'elasticsearch';
import { format, zonedTimeToUtc } from 'date-fns-tz';

export class AnalyticsService {
  private clickhouseClient: ClickHouseClient;
  private esClient: Elasticsearch.Client;

  constructor() {
    this.clickhouseClient = new ClickHouseClient({
      url: process.env.CLICKHOUSE_URL || 'http://localhost:8123'
    });
    this.esClient = new Elasticsearch.Client({
      host: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
    });
  }

  /**
   * Save an Analytics Event
   */
  async saveEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const timeZone = 'Australia/Perth';
      const formattedDate = format(zonedTimeToUtc(event.timestamp, timeZone), "yyyy-MM-dd'T'HH:mm:ssXXX");

      await this.clickhouseClient.insertInto('analytics_events', [
        event.id,
        event.type,
        formattedDate,
        event.userId,
        event.companyId,
        JSON.stringify(event.metadata),
        JSON.stringify(event.location)
      ]);
    } catch (error) {
      throw new Error(`Failed to save event: ${error.message}`);
    }
  }

  /**
   * Generate a compliance report
   */
  async generateComplianceReport(companyId: string, start: Date, end: Date): Promise<ComplianceReport> {
    try {
      const { body } = await this.esClient.search({
        index: 'compliance',
        body: {
          query: {
            bool: {
              must: [
                { match: { companyId } },
                { range: { date: { gte: start, lte: end } } }
              ]
            }
          },
          aggs: {
            validLicenses: { sum: { field: 'validLicenses' } },
            expiringLicenses: { sum: { field: 'expiringLicenses' } },
            safetyIncidents: { sum: { field: 'safetyIncidents' } },
            nearMisses: { sum: { field: 'nearMisses' } }
          }
        }
      });

      const metrics = body.aggregations;

      return {
        id: 'report-' + Date.now(),
        companyId,
        reportingPeriod: { start, end },
        metrics: {
          totalEmployees: body.hits.total.value,
          validLicenses: metrics.validLicenses.value,
          expiringLicenses: metrics.expiringLicenses.value,
          safetyIncidents: metrics.safetyIncidents.value,
          nearMisses: metrics.nearMisses.value,
          complianceScore: this.calculateComplianceScore(metrics)
        },
        recommendations: this.getRecommendations(metrics),
        generatedAt: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to generate compliance report: ${error.message}`);
    }
  }

  /**
   * Query for safety metrics
   */
  async getSafetyMetrics(params: AnalyticsQueryParams): Promise<SafetyMetrics> {
    const incidents = await this.querySafetyIncidents(params);
    const total = incidents.length;

    const severityDistribution = incidents.reduce<Record<SafetySeverity, number>>((acc, incident) => {
      acc[incident.severity] = (acc[incident.severity] || 0) + 1;
      return acc;
    }, {
      [SafetySeverity.LOW]: 0,
      [SafetySeverity.MEDIUM]: 0,
      [SafetySeverity.HIGH]: 0,
      [SafetySeverity.CRITICAL]: 0
    });

    const mostCommonTypes = this.calculateMostCommonIncidentTypes(incidents);
    const trendline = this.calculateTrendline(incidents, params);

    return {
      incidentRate: total / params.endDate.getMilliseconds(),
      severityDistribution,
      mostCommonTypes,
      trendline
    };
  }

  /**
   * Query for safety incidents
   */
  private async querySafetyIncidents(params: AnalyticsQueryParams): Promise<SafetyIncident[]> {
    const { body } = await this.esClient.search({
      index: 'safety_incidents',
      body: {
        query: {
          bool: {
            must: [
              { range: { date: { gte: params.startDate, lte: params.endDate } } },
              { term: { region: params.region } }
            ]
          }
        }
      }
    });

    return body.hits.hits.map((hit: any) => hit._source);
  }

  /**
   * Calculate the compliance score
   */
  private calculateComplianceScore(metrics: any): number {
    // Simple compliance calculation (for demonstration purposes)
    return (
      (metrics.validLicenses.value / (metrics.validLicenses.value + metrics.expiringLicenses.value)) * 0.4 +
      (metrics.safetyIncidents.value / (metrics.safetyIncidents.value + metrics.nearMisses.value)) * 0.6
    ) * 100;
  }

  /**
   * Get recommendations based on compliance metrics
   */
  private getRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];

    if (metrics.expiringLicenses.value > 0) {
      recommendations.push('Renew expiring licenses to maintain compliance.');
    }
    if (metrics.safetyIncidents.value > 5) {  // arbitrary threshold for demonstration
      recommendations.push('Investigate frequent safety incidents and implement preventive measures.');
    }

    // Additional recommendations would be added here

    return recommendations;
  }

  /**
   * Calculate most common incident types
   */
  private calculateMostCommonIncidentTypes(incidents: SafetyIncident[]): Array<{ type: string; count: number }> {
    const typeMap: Record<string, number> = {};

    incidents.forEach((incident) => {
      typeMap[incident.incidentType] = (typeMap[incident.incidentType] || 0) + 1;
    });

    return Object.entries(typeMap)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Calculate trendline data
   */
  private calculateTrendline(incidents: SafetyIncident[], params: AnalyticsQueryParams): TimeSeriesData[] {
    // Implement trendline calculation (e.g., based on aggregation)
    return [];
  }
}

