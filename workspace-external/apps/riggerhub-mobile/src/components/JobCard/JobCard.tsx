import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Job, ExperienceLevel, ShiftType } from '../../types';
import Colors from '../../theme/colors';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onApply?: () => void;
  style?: any;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onPress,
  onApply,
  style
}) => {
  const getExperienceIcon = (level: ExperienceLevel) => {
    switch (level) {
      case ExperienceLevel.ENTRY_LEVEL:
        return 'star-outline';
      case ExperienceLevel.INTERMEDIATE:
        return 'star-half-full';
      case ExperienceLevel.EXPERIENCED:
        return 'star';
      case ExperienceLevel.SENIOR:
        return 'star-circle';
      default:
        return 'star-outline';
    }
  };

  const getShiftIcon = (shift: ShiftType) => {
    switch (shift) {
      case ShiftType.DAY:
        return 'white-balance-sunny';
      case ShiftType.NIGHT:
        return 'moon-waning-crescent';
      case ShiftType.ROTATING:
        return 'rotate-orbit';
      case ShiftType.WEEKEND:
        return 'calendar-weekend';
      default:
        return 'clock-outline';
    }
  };

  const getShiftColor = (shift: ShiftType) => {
    return Colors.shift[shift] || Colors.primary[500];
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'crane_operator':
        return 'crane';
      case 'rigger':
        return 'link-variant';
      case 'signaller':
        return 'hand-back-left';
      case 'scaffolder':
        return 'ladder';
      case 'safety_officer':
        return 'shield-check';
      default:
        return 'hard-hat';
    }
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    return `${distance.toFixed(1)} km`;
  };

  const formatSalary = (salary: string) => {
    return salary.replace('/hr', '/hr');
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {/* Header with Category Icon and Distance */}
        <View style={styles.header}>
          <View style={styles.categoryContainer}>
            <MaterialCommunityIcons
              name={getCategoryIcon(job.category)}
              size={24}
              color={Colors.primary[500]}
            />
            <Text style={styles.categoryTitle}>
              {job.title.split(' - ')[0]}
            </Text>
          </View>
          {job.distance && (
            <View style={styles.distanceContainer}>
              <MaterialIcons
                name="location-on"
                size={16}
                color={Colors.text.tertiary}
              />
              <Text style={styles.distance}>
                {formatDistance(job.distance)}
              </Text>
            </View>
          )}
        </View>

        {/* Job Title */}
        <Text style={styles.jobTitle} numberOfLines={2}>
          {job.title}
        </Text>

        {/* Job Description */}
        <Text style={styles.description} numberOfLines={3}>
          {job.description}
        </Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={16}
            color={Colors.primary[500]}
          />
          <Text style={styles.location}>{job.location}</Text>
        </View>

        {/* Job Details Row */}
        <View style={styles.detailsRow}>
          {/* Experience Level */}
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name={getExperienceIcon(job.experienceLevel)}
              size={16}
              color={Colors.experience[job.experienceLevel]}
            />
            <Text style={[styles.detailText, { 
              color: Colors.experience[job.experienceLevel] 
            }]}>
              {job.experienceLevel.replace('_', ' ')}
            </Text>
          </View>

          {/* Shift Type */}
          <View style={styles.detailItem}>
            <MaterialCommunityIcons
              name={getShiftIcon(job.shift)}
              size={16}
              color={getShiftColor(job.shift)}
            />
            <Text style={[styles.detailText, {
              color: getShiftColor(job.shift)
            }]}>
              {job.shift.replace('_', ' ')} Shift
            </Text>
          </View>
        </View>

        {/* Footer with Salary and Apply Button */}
        <View style={styles.footer}>
          <View style={styles.salaryContainer}>
            <Text style={styles.salaryAmount}>
              {formatSalary(job.salary)}
            </Text>
            <Text style={styles.startDate}>
              Start: {new Date(job.startDate).toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={onApply}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.applyGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.applyText}>Apply</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Urgent Badge */}
        {job.urgent && (
          <View style={styles.urgentBadge}>
            <MaterialIcons name="priority-high" size={12} color="white" />
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}

        {/* Featured Badge */}
        {job.featured && (
          <View style={styles.featuredBadge}>
            <MaterialIcons name="star" size={12} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: Colors.gray[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[500],
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginLeft: 4,
    fontWeight: '500',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  salaryContainer: {
    flex: 1,
  },
  salaryAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.success[500],
    marginBottom: 4,
  },
  startDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  applyButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  applyGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  urgentBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: Colors.error[500],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  featuredBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: Colors.warning[500],
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default JobCard;