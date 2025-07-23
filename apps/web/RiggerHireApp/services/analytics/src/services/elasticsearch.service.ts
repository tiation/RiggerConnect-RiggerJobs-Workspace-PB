import { Client } from 'elasticsearch';
import { 
  SafetyIncident, 
  SafetySeverity, 
  AnalyticsQueryParams,
  TimeSeriesData
} from '../types';

export class ElasticsearchService {
  private client: Client;
  private readonly indices = {
    safety: 'safety_incidents',
    compliance: 'compliance_records',
    licenses: 'worker_licenses',
    jobs: 'job_records',
    analytics: 'analytics_events'
  };

  constructor() {
    this.client = new Client({
      host: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      log: 'error'
    });
  }

  /**
   * Query safety incidents with advanced filtering
   */
  async querySafetyIncidents(params: AnalyticsQueryParams): Promise<SafetyIncident[]> {
    const { body } = await this.client.search({
      index: this.indices.safety,
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  date: {
                    gte: params.startDate,
                    lte: params.endDate
                  }
                }
              },
              ...(params.region ? [{
                term: { 'location.region.keyword': params.region }
              }] : []),
              ...(params.companyId ? [{
                term: { companyId: params.companyId }
              }] : [])
            ]
          }
        },
        aggs: {
          severity_distribution: {
            terms: {
              field: 'severity.keyword'
            }
          },
          daily_incidents: {
            date_histogram: {
              field: 'date',
              calendar_interval: 'day',
              time_zone: 'Australia/Perth'
            }
          },
          incident_types: {
            terms: {
              field: 'incidentType.keyword',
              size: 10
            }
          }
        },
        sort: [
          { date: { order: 'desc' } }
        ],
        size: 1000
      }
    });

    return body.hits.hits.map((hit: any) => hit._source);
  }

  /**
   * Query compliance metrics
   */
  async queryComplianceMetrics(companyId: string, timeRange: { start: Date; end: Date }) {
    const { body } = await this.client.search({
      index: this.indices.compliance,
      body: {
        query: {
          bool: {
            must: [
              { term: { companyId } },
              {
                range: {
                  timestamp: {
                    gte: timeRange.start,
                    lte: timeRange.end
                  }
                }
              }
            ]
          }
        },
        aggs: {
          compliance_over_time: {
            date_histogram: {
              field: 'timestamp',
              calendar_interval: 'week',
              time_zone: 'Australia/Perth'
            },
            aggs: {
              compliance_score: {
                avg: { field: 'complianceScore' }
              },
              valid_licenses: {
                sum: { field: 'validLicenses' }
              },
              expiring_licenses: {
                sum: { field: 'expiringLicenses' }
              }
            }
          },
          average_compliance: {
            avg: { field: 'complianceScore' }
          },
          risk_factors: {
            terms: {
              field: 'riskFactors.keyword',
              size: 5
            }
          }
        }
      }
    });

    return body;
  }

  /**
   * Query license metrics
   */
  async queryLicenseMetrics(params: AnalyticsQueryParams) {
    const { body } = await this.client.search({
      index: this.indices.licenses,
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  expiryDate: {
                    gte: 'now'
                  }
                }
              },
              ...(params.companyId ? [{
                term: { companyId: params.companyId }
              }] : [])
            ]
          }
        },
        aggs: {
          license_types: {
            terms: {
              field: 'licenseType.keyword'
            },
            aggs: {
              expiring_soon: {
                range: {
                  field: 'expiryDate',
                  ranges: [
                    { to: 'now+30d' },
                    { from: 'now+30d', to: 'now+90d' },
                    { from: 'now+90d' }
                  ]
                }
              }
            }
          },
          expiry_timeline: {
            date_histogram: {
              field: 'expiryDate',
              calendar_interval: 'month',
              time_zone: 'Australia/Perth'
            }
          }
        }
      }
    });

    return body;
  }

  /**
   * Query job analytics
   */
  async queryJobAnalytics(params: AnalyticsQueryParams) {
    const { body } = await this.client.search({
      index: this.indices.jobs,
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  postDate: {
                    gte: params.startDate,
                    lte: params.endDate
                  }
                }
              }
            ]
          }
        },
        aggs: {
          jobs_by_type: {
            terms: {
              field: 'jobType.keyword'
            }
          },
          jobs_by_region: {
            terms: {
              field: 'location.region.keyword'
            }
          },
          average_fill_time: {
            avg: {
              script: {
                source: "if (doc['filledDate'].size() > 0) { return (doc['filledDate'].value.toInstant().toEpochMilli() - doc['postDate'].value.toInstant().toEpochMilli()) / 86400000 }"
              }
            }
          },
          job_status_distribution: {
            terms: {
              field: 'status.keyword'
            }
          }
        }
      }
    });

    return body;
  }

  /**
   * Query safety trends
   */
  async querySafetyTrends(timeRange: { start: Date; end: Date }): Promise<TimeSeriesData[]> {
    const { body } = await this.client.search({
      index: this.indices.safety,
      body: {
        query: {
          range: {
            date: {
              gte: timeRange.start,
              lte: timeRange.end
            }
          }
        },
        aggs: {
          incidents_over_time: {
            date_histogram: {
              field: 'date',
              calendar_interval: 'day',
              time_zone: 'Australia/Perth'
            },
            aggs: {
              by_severity: {
                terms: {
                  field: 'severity.keyword'
                }
              }
            }
          }
        }
      }
    });

    // Transform aggregations into time series data
    return body.aggregations.incidents_over_time.buckets.map((bucket: any) => ({
      timestamp: new Date(bucket.key),
      value: bucket.doc_count,
      metric: 'incidents',
      breakdown: bucket.by_severity.buckets.reduce((acc: any, severityBucket: any) => ({
        ...acc,
        [severityBucket.key]: severityBucket.doc_count
      }), {})
    }));
  }

  /**
   * Query worker performance metrics
   */
  async queryWorkerPerformance(workerId: string, timeRange: { start: Date; end: Date }) {
    const { body } = await this.client.search({
      index: [this.indices.jobs, this.indices.safety],
      body: {
        query: {
          bool: {
            must: [
              { term: { workerId } },
              {
                range: {
                  date: {
                    gte: timeRange.start,
                    lte: timeRange.end
                  }
                }
              }
            ]
          }
        },
        aggs: {
          completed_jobs: {
            filter: {
              term: { 'status.keyword': 'COMPLETED' }
            }
          },
          safety_record: {
            filter: {
              term: { 'type.keyword': 'SAFETY_INCIDENT' }
            }
          },
          skill_ratings: {
            avg: { field: 'rating' }
          }
        }
      }
    });

    return body;
  }
}
