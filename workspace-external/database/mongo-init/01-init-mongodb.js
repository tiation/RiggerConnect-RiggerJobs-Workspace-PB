// MongoDB Initialization Script for Tiation Rigger Platform
// This script sets up the initial MongoDB collections and indexes

// Switch to the tiation_rigger database
db = db.getSiblingDB('tiation_rigger');

// Create collections with validation schemas
// Job matching logs collection
db.createCollection('job_matching_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['jobId', 'workerId', 'matchScore', 'matchedAt'],
      properties: {
        jobId: {
          bsonType: 'string',
          description: 'Job ID from PostgreSQL'
        },
        workerId: {
          bsonType: 'string',
          description: 'Worker ID from PostgreSQL'
        },
        matchScore: {
          bsonType: 'number',
          minimum: 0,
          maximum: 1,
          description: 'AI matching score between 0 and 1'
        },
        matchedAt: {
          bsonType: 'date',
          description: 'When the match was calculated'
        },
        matchFactors: {
          bsonType: 'object',
          properties: {
            skillMatch: { bsonType: 'number' },
            locationMatch: { bsonType: 'number' },
            experienceMatch: { bsonType: 'number' },
            availabilityMatch: { bsonType: 'number' },
            ratingMatch: { bsonType: 'number' }
          }
        },
        algorithm: {
          bsonType: 'string',
          description: 'Algorithm version used for matching'
        }
      }
    }
  }
});

// Analytics events collection
db.createCollection('analytics_events', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['eventType', 'userId', 'timestamp'],
      properties: {
        eventType: {
          bsonType: 'string',
          enum: ['login', 'logout', 'job_view', 'job_apply', 'profile_update', 'search', 'message_sent'],
          description: 'Type of event'
        },
        userId: {
          bsonType: 'string',
          description: 'User ID from PostgreSQL'
        },
        timestamp: {
          bsonType: 'date',
          description: 'When the event occurred'
        },
        properties: {
          bsonType: 'object',
          description: 'Event-specific properties'
        },
        sessionId: {
          bsonType: 'string',
          description: 'User session identifier'
        },
        userAgent: {
          bsonType: 'string',
          description: 'User agent string'
        },
        ipAddress: {
          bsonType: 'string',
          description: 'User IP address'
        },
        platform: {
          bsonType: 'string',
          enum: ['web', 'mobile', 'api'],
          description: 'Platform used'
        }
      }
    }
  }
});

// Real-time notifications collection
db.createCollection('notifications_queue', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'type', 'title', 'message', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'string',
          description: 'User ID from PostgreSQL'
        },
        type: {
          bsonType: 'string',
          enum: ['job_match', 'application_update', 'message', 'payment', 'system'],
          description: 'Notification type'
        },
        title: {
          bsonType: 'string',
          description: 'Notification title'
        },
        message: {
          bsonType: 'string',
          description: 'Notification message'
        },
        data: {
          bsonType: 'object',
          description: 'Additional notification data'
        },
        createdAt: {
          bsonType: 'date',
          description: 'When the notification was created'
        },
        deliveredAt: {
          bsonType: 'date',
          description: 'When the notification was delivered'
        },
        readAt: {
          bsonType: 'date',
          description: 'When the notification was read'
        },
        channels: {
          bsonType: 'array',
          items: {
            bsonType: 'string',
            enum: ['push', 'email', 'sms', 'in_app']
          },
          description: 'Delivery channels'
        },
        priority: {
          bsonType: 'string',
          enum: ['low', 'normal', 'high', 'urgent'],
          description: 'Notification priority'
        }
      }
    }
  }
});

// Chat messages collection
db.createCollection('chat_messages', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['conversationId', 'senderId', 'message', 'timestamp'],
      properties: {
        conversationId: {
          bsonType: 'string',
          description: 'Conversation identifier'
        },
        senderId: {
          bsonType: 'string',
          description: 'Sender user ID'
        },
        message: {
          bsonType: 'string',
          description: 'Message content'
        },
        timestamp: {
          bsonType: 'date',
          description: 'When the message was sent'
        },
        messageType: {
          bsonType: 'string',
          enum: ['text', 'image', 'file', 'location', 'system'],
          description: 'Type of message'
        },
        metadata: {
          bsonType: 'object',
          description: 'Message metadata (file info, etc.)'
        },
        readBy: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              userId: { bsonType: 'string' },
              readAt: { bsonType: 'date' }
            }
          },
          description: 'Users who have read this message'
        },
        edited: {
          bsonType: 'boolean',
          description: 'Whether the message was edited'
        },
        editedAt: {
          bsonType: 'date',
          description: 'When the message was last edited'
        }
      }
    }
  }
});

// Search logs collection
db.createCollection('search_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'searchQuery', 'timestamp'],
      properties: {
        userId: {
          bsonType: 'string',
          description: 'User ID who performed the search'
        },
        searchQuery: {
          bsonType: 'string',
          description: 'Search query string'
        },
        filters: {
          bsonType: 'object',
          description: 'Applied search filters'
        },
        resultsCount: {
          bsonType: 'number',
          description: 'Number of results returned'
        },
        clickedResults: {
          bsonType: 'array',
          items: { bsonType: 'string' },
          description: 'Job IDs that were clicked'
        },
        timestamp: {
          bsonType: 'date',
          description: 'When the search was performed'
        },
        searchType: {
          bsonType: 'string',
          enum: ['jobs', 'workers', 'companies'],
          description: 'Type of search'
        },
        responseTime: {
          bsonType: 'number',
          description: 'Search response time in milliseconds'
        }
      }
    }
  }
});

// Performance metrics collection
db.createCollection('performance_metrics', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['service', 'metric', 'value', 'timestamp'],
      properties: {
        service: {
          bsonType: 'string',
          description: 'Service name'
        },
        metric: {
          bsonType: 'string',
          description: 'Metric name'
        },
        value: {
          bsonType: 'number',
          description: 'Metric value'
        },
        timestamp: {
          bsonType: 'date',
          description: 'When the metric was recorded'
        },
        tags: {
          bsonType: 'object',
          description: 'Metric tags for filtering'
        },
        unit: {
          bsonType: 'string',
          description: 'Metric unit (ms, count, bytes, etc.)'
        }
      }
    }
  }
});

// Create indexes for better performance
// Job matching logs indexes
db.job_matching_logs.createIndex({ jobId: 1, workerId: 1 }, { unique: true });
db.job_matching_logs.createIndex({ jobId: 1, matchScore: -1 });
db.job_matching_logs.createIndex({ workerId: 1, matchScore: -1 });
db.job_matching_logs.createIndex({ matchedAt: -1 });

// Analytics events indexes
db.analytics_events.createIndex({ userId: 1, timestamp: -1 });
db.analytics_events.createIndex({ eventType: 1, timestamp: -1 });
db.analytics_events.createIndex({ sessionId: 1 });
db.analytics_events.createIndex({ timestamp: -1 });

// Notifications queue indexes
db.notifications_queue.createIndex({ userId: 1, createdAt: -1 });
db.notifications_queue.createIndex({ type: 1, createdAt: -1 });
db.notifications_queue.createIndex({ deliveredAt: 1 });
db.notifications_queue.createIndex({ readAt: 1 });

// Chat messages indexes
db.chat_messages.createIndex({ conversationId: 1, timestamp: -1 });
db.chat_messages.createIndex({ senderId: 1, timestamp: -1 });
db.chat_messages.createIndex({ timestamp: -1 });

// Search logs indexes
db.search_logs.createIndex({ userId: 1, timestamp: -1 });
db.search_logs.createIndex({ searchQuery: 'text' });
db.search_logs.createIndex({ timestamp: -1 });

// Performance metrics indexes
db.performance_metrics.createIndex({ service: 1, metric: 1, timestamp: -1 });
db.performance_metrics.createIndex({ timestamp: -1 });

// Set up TTL (Time To Live) indexes for automatic cleanup
// Keep analytics events for 90 days
db.analytics_events.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

// Keep notifications queue for 30 days
db.notifications_queue.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Keep search logs for 180 days
db.search_logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 15552000 });

// Keep performance metrics for 365 days
db.performance_metrics.createIndex({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

// Create initial admin user for development
db.users.insertOne({
  _id: 'admin',
  username: 'admin',
  email: 'admin@tiation.com',
  role: 'admin',
  createdAt: new Date(),
  permissions: ['read', 'write', 'admin']
});

print('MongoDB initialization completed successfully!');
print('Created collections:');
print('- job_matching_logs');
print('- analytics_events');
print('- notifications_queue');
print('- chat_messages');
print('- search_logs');
print('- performance_metrics');
print('');
print('Created indexes and TTL policies for automatic cleanup');
print('Initial admin user created with username: admin');
