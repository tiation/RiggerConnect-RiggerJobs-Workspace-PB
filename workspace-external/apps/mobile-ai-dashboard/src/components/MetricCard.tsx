import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../types/Dashboard';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: keyof typeof Colors.gradient;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle
}) => {
  const gradientColors = Colors.gradient[color];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { borderColor: gradientColors[1] }]}>
            {icon}
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 120,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    opacity: 0.7,
  },
});