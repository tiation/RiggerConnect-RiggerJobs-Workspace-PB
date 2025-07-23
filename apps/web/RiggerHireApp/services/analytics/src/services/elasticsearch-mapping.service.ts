import { Client } from 'elasticsearch';

export class ElasticsearchMappingService {
  private client: Client;

  constructor() {
    this.client = new Client({
      host: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      log: 'error'
    });
  }

  /**
   * Initialize all required indices with proper mappings
   */
  async initializeIndices(): Promise<void> {
    await Promise.all([
      this.createSafetyIncidentsIndex(),
      this.createComplianceRecordsIndex(),
      this.createWorkerLicensesIndex(),
      this.createJobRecordsIndex(),
      this.createAnalyticsEventsIndex()
    ]);
  }

  /**
   * Create safety incidents index with mapping
   */
  private async createSafetyIncidentsIndex(): Promise<void> {
    const indexName = 'safety_incidents';
    const exists = await this.client.indices.exists({ index: indexName });

    if (!exists) {
      await this.client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              severity: { type: 'keyword' },
              incidentType: { type: 'keyword' },
              description: { type: 'text' },
              location: {
                properties: {
                  region: { type: 'keyword' },
                  site: { type: 'keyword' },
                  coordinates: { type: 'geo_point' }
                }
              },
              date: { type: 'date' },
              reportedBy: { type: 'keyword' },
              witnesses: { type: 'keyword' },
              immediateActions: { type: 'text' },
              preventiveMeasures: { type: 'text' },
              status: { type: 'keyword' },
              attachments: { type: 'keyword' },
              companyId: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' }
            }
          }
        }
      });
    }
  }

  /**
   * Create compliance records index with mapping
   */
  private async createComplianceRecordsIndex(): Promise<void> {
    const indexName = 'compliance_records';
    const exists = await this.client.indices.exists({ index: indexName });

    if (!exists) {
      await this.client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              companyId: { type: 'keyword' },
              timestamp: { type: 'date' },
              complianceScore: { type: 'float' },
              validLicenses: { type: 'integer' },
              expiringLicenses: { type: 'integer' },
              safetyIncidents: { type: 'integer' },
              nearMisses: { type: 'integer' },
              riskFactors: { type: 'keyword' },
              recommendations: { type: 'text' }
            }
          }
        }
      });
    }
  }

  /**
   * Create worker licenses index with mapping
   */
  private async createWorkerLicensesIndex(): Promise<void> {
    const indexName = 'worker_licenses';
    const exists = await this.client.indices.exists({ index: indexName });

    if (!exists) {
      await this.client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              workerId: { type: 'keyword' },
              companyId: { type: 'keyword' },
              licenseType: { type: 'keyword' },
              licenseNumber: { type: 'keyword' },
              issuedDate: { type: 'date' },
              expiryDate: { type: 'date' },
              status: { type: 'keyword' },
              verificationStatus: { type: 'keyword' },
              restrictions: { type: 'keyword' },
              documentUrl: { type: 'keyword' }
            }
          }
        }
      });
    }
  }

  /**
   * Create job records index with mapping
   */
  private async createJobRecordsIndex(): Promise<void> {
    const indexName = 'job_records';
    const exists = await this.client.indices.exists({ index: indexName });

    if (!exists) {
      await this.client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              companyId: { type: 'keyword' },
              jobType: { type: 'keyword' },
              status: { type: 'keyword' },
              location: {
                properties: {
                  region: { type: 'keyword' },
                  site: { type: 'keyword' },
                  coordinates: { type: 'geo_point' }
                }
              },
              requirements: { type: 'keyword' },
              postDate: { type: 'date' },
              filledDate: { type: 'date' },
              completedDate: { type: 'date' },
              workerId: { type: 'keyword' },
              rating: { type: 'float' },
              feedback: { type: 'text' }
            }
          }
        }
      });
    }
  }

  /**
   * Create analytics events index with mapping
   */
  private async createAnalyticsEventsIndex(): Promise<void> {
    const indexName = 'analytics_events';
    const exists = await this.client.indices.exists({ index: indexName });

    if (!exists) {
      await this.client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              type: { type: 'keyword' },
              timestamp: { type: 'date' },
              userId: { type: 'keyword' },
              companyId: { type: 'keyword' },
              metadata: {
                type: 'object',
                dynamic: true
              },
              location: {
                properties: {
                  region: { type: 'keyword' },
                  coordinates: { type: 'geo_point' }
                }
              }
            }
          },
          settings: {
            'index.mapping.total_fields.limit': 2000,
            'index.number_of_shards': 3,
            'index.number_of_replicas': 1
          }
        }
      });
    }
  }

  /**
   * Update index settings for better search performance
   */
  async optimizeIndexSettings(indexName: string): Promise<void> {
    await this.client.indices.putSettings({
      index: indexName,
      body: {
        'index.refresh_interval': '5s',
        'index.number_of_replicas': 1,
        'index.search.slowlog.threshold.query.warn': '10s',
        'index.search.slowlog.threshold.fetch.warn': '1s'
      }
    });
  }

  /**
   * Create index lifecycle policy for log rotation
   */
  async createIndexLifecyclePolicy(): Promise<void> {
    await this.client.ilm.putLifecycle({
      policy: 'analytics_lifecycle_policy',
      body: {
        policy: {
          phases: {
            hot: {
              actions: {
                rollover: {
                  max_age: '30d',
                  max_size: '50gb'
                }
              }
            },
            warm: {
              min_age: '30d',
              actions: {
                forcemerge: {
                  max_num_segments: 1
                },
                allocate: {
                  number_of_replicas: 1
                }
              }
            },
            cold: {
              min_age: '90d',
              actions: {
                allocate: {
                  number_of_replicas: 0
                }
              }
            },
            delete: {
              min_age: '365d',
              actions: {
                delete: {}
              }
            }
          }
        }
      }
    });
  }
}
