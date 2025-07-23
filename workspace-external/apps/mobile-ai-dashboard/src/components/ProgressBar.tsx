import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../types/Dashboard';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.primary,
  backgroundColor = Colors.border,
  height = 6,
  animated = true
}) => {
  const progressPercent = Math.max(0, Math.min(100, progress));
  
  return (
    <View style={[styles.container, { backgroundColor, height }]}>
      <View 
        style={[
          styles.progressFill,
          {
            width: `${progressPercent}%`,
            backgroundColor: color,
            height,
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    overflow: 'hidden',
    flex: 1,
  },
  progressFill: {
    borderRadius: 3,
    minWidth: 2, // Ensure some visible progress even at 0%
  },
});