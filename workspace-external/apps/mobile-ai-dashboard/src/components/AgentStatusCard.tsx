import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, AgentStatus } from '../types/Dashboard';
import { ProgressBar } from './ProgressBar';

interface AgentStatusCardProps {
  agent: AgentStatus;
}

export const AgentStatusCard: React.FC<AgentStatusCardProps> = ({ agent }) => {
  const getStatusColor = (status: AgentStatus['status']) => {
    switch (status) {
      case 'running': return Colors.success;
      case 'warning': return Colors.warning;
      case 'error': return Colors.error;
      case 'stopped': return Colors.textSecondary;
      default: return Colors.textSecondary;
    }
  };

  const getStatusText = (status: AgentStatus['status']) => {
    switch (status) {
      case 'running': return 'Running';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      case 'stopped': return 'Stopped';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.agentInfo}>
            <Text style={styles.agentName}>{agent.name}</Text>
            <Text style={styles.agentType}>{agent.type}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agent.status) }]}>
            <Text style={styles.statusText}>{getStatusText(agent.status)}</Text>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>CPU</Text>
            <ProgressBar 
              progress={agent.cpu} 
              color={agent.cpu > 80 ? Colors.error : Colors.gradient.blue[1]}
              height={4}
            />
            <Text style={styles.metricValue}>{agent.cpu}%</Text>
          </View>

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Memory</Text>
            <ProgressBar 
              progress={agent.memory} 
              color={agent.memory > 90 ? Colors.error : Colors.gradient.red[1]}
              height={4}
            />
            <Text style={styles.metricValue}>{agent.memory}%</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  agentType: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.background,
  },
  metricsContainer: {
    gap: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    width: 60,
  },
  metricValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
});