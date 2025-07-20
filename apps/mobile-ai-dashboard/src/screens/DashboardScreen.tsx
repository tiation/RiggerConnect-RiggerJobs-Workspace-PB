import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, DashboardMetrics, AgentStatus } from '../types/Dashboard';
import { MetricCard } from '../components/MetricCard';
import { AgentStatusCard } from '../components/AgentStatusCard';
import { DashboardService } from '../services/DashboardService';

export const DashboardScreen: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeAgents: 12,
    tasksCompleted: 2847,
    systemLoad: 67,
    errors: 2,
  });

  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: '1',
      name: 'DataProcessor',
      type: 'Analytics Agent',
      status: 'running',
      cpu: 45,
      memory: 68,
      lastUpdate: new Date(),
    },
    {
      id: '2',
      name: 'EmailBot',
      type: 'Communication Agent',
      status: 'warning',
      cpu: 23,
      memory: 89,
      lastUpdate: new Date(),
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, fetch fresh data from DashboardService
      const newMetrics = await DashboardService.getMetrics();
      const newAgents = await DashboardService.getAgents();
      setMetrics(newMetrics);
      setAgents(newAgents);
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Set up real-time updates
    const interval = setInterval(() => {
      // In real app, update from WebSocket or polling
      handleRefresh();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="dashboard" size={32} color={Colors.primary} />
            <Text style={styles.title}>AI Dashboard</Text>
          </View>
          
          <MaterialIcons name="refresh" size={24} color={Colors.textSecondary} />
        </View>

        <Text style={styles.subtitle}>Monitor your AI agents in real-time</Text>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricsRow}>
            <MetricCard
              title="Active Agents"
              value={metrics.activeAgents}
              color="blue"
              icon={<MaterialIcons name="psychology" size={20} color={Colors.gradient.blue[1]} />}
            />
            <MetricCard
              title="Tasks Completed"
              value={metrics.tasksCompleted.toLocaleString()}
              color="teal"
              icon={<MaterialIcons name="check-circle" size={20} color={Colors.success} />}
            />
          </View>

          <View style={styles.metricsRow}>
            <MetricCard
              title="System Load"
              value={`${metrics.systemLoad}%`}
              color="yellow"
              icon={<MaterialIcons name="memory" size={20} color={Colors.gradient.yellow[1]} />}
            />
            <MetricCard
              title="Errors"
              value={metrics.errors}
              color="red"
              icon={<MaterialIcons name="error" size={20} color={Colors.error} />}
            />
          </View>
        </View>

        {/* Agent Status Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Agent Status</Text>
        </View>

        <View style={styles.agentsContainer}>
          {agents.map((agent) => (
            <AgentStatusCard key={agent.id} agent={agent} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  metricsGrid: {
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  agentsContainer: {
    paddingBottom: 24,
  },
});