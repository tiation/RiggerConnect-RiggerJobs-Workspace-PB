import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Job, JobCategory, ExperienceLevel, ShiftType } from '../../types';
import { JobCard } from '../../components/JobCard/JobCard';
import Colors from '../../theme/colors';
import { useJobs } from '../../hooks/useJobs';

const { width, height } = Dimensions.get('window');

interface FilterOption {
  id: string;
  label: string;
  value: any;
  icon: string;
  count?: number;
}

export const JobsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [scrollY] = useState(new Animated.Value(0));
  
  const { 
    jobs, 
    loading, 
    error, 
    refreshJobs, 
    loadMoreJobs,
    hasMore 
  } = useJobs();

  // Mock data for development
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Signaller - Infrastructure Project',
      company: 'Industrial Construction Ltd',
      location: 'West Melbourne, VIC',
      description: 'Crane signaller required for major infrastructure project. Entry level position with training provided. Great opportunity for career growth.',
      salary: '$52.00/hr AUD',
      salaryMin: 52,
      salaryMax: 52,
      currency: 'AUD',
      jobType: 'contract',
      experienceLevel: ExperienceLevel.ENTRY_LEVEL,
      shift: ShiftType.DAY,
      startDate: '2025-07-24T11:58:00Z',
      requirements: ['White Card', 'Crane Signalling Certification', 'Safety Training'],
      benefits: ['Competitive rates', 'Training provided', 'Career progression'],
      distance: 12646.8,
      coordinates: { latitude: -37.8136, longitude: 144.9631 },
      category: JobCategory.SIGNALLER,
      urgent: false,
      featured: true,
      applicantCount: 12,
      createdAt: '2025-07-20T10:00:00Z',
      updatedAt: '2025-07-20T10:00:00Z',
    },
    {
      id: '2',
      title: 'Rigger - Residential Complex',
      company: 'BuildTech Solutions',
      location: 'South Yarra, VIC',
      description: 'Riggers needed for large residential development. Great rates and steady work for experienced professionals.',
      salary: '$42.00/hr AUD',
      salaryMin: 42,
      salaryMax: 42,
      currency: 'AUD',
      jobType: 'contract',
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      shift: ShiftType.DAY,
      startDate: '2025-07-25T06:00:00Z',
      requirements: ['Rigging License', 'Experience with residential work', 'Team player'],
      benefits: ['Great rates', 'Steady work', 'Experienced team'],
      distance: 12646.3,
      coordinates: { latitude: -37.8396, longitude: 144.9897 },
      category: JobCategory.RIGGER,
      urgent: true,
      featured: false,
      applicantCount: 8,
      createdAt: '2025-07-20T09:00:00Z',
      updatedAt: '2025-07-20T09:00:00Z',
    },
    {
      id: '3',
      title: 'Tower Crane Operator',
      company: 'Metro Construction',
      location: 'Melbourne CBD, VIC',
      description: 'Experienced tower crane operator needed for CBD high-rise project. Must have current license and safety certifications.',
      salary: '$65.00/hr AUD',
      salaryMin: 65,
      salaryMax: 65,
      currency: 'AUD',
      jobType: 'contract',
      experienceLevel: ExperienceLevel.EXPERIENCED,
      shift: ShiftType.DAY,
      startDate: '2025-07-26T07:00:00Z',
      requirements: ['Tower Crane License', '5+ years experience', 'Height work certification'],
      benefits: ['Premium rates', 'CBD location', 'Long-term project'],
      distance: 12650.2,
      coordinates: { latitude: -37.8136, longitude: 144.9631 },
      category: JobCategory.CRANE_OPERATOR,
      urgent: false,
      featured: true,
      applicantCount: 15,
      createdAt: '2025-07-20T08:00:00Z',
      updatedAt: '2025-07-20T08:00:00Z',
    },
  ];

  const filterOptions: FilterOption[] = [
    {
      id: 'crane_operator',
      label: 'Crane Operator',
      value: JobCategory.CRANE_OPERATOR,
      icon: 'crane',
      count: 5,
    },
    {
      id: 'rigger',
      label: 'Rigger',
      value: JobCategory.RIGGER,
      icon: 'link-variant',
      count: 8,
    },
    {
      id: 'signaller',
      label: 'Signaller',
      value: JobCategory.SIGNALLER,
      icon: 'hand-back-left',
      count: 3,
    },
    {
      id: 'entry_level',
      label: 'Entry Level',
      value: ExperienceLevel.ENTRY_LEVEL,
      icon: 'star-outline',
      count: 4,
    },
    {
      id: 'experienced',
      label: 'Experienced',
      value: ExperienceLevel.EXPERIENCED,
      icon: 'star',
      count: 12,
    },
    {
      id: 'day_shift',
      label: 'Day Shift',
      value: ShiftType.DAY,
      icon: 'white-balance-sunny',
      count: 14,
    },
    {
      id: 'urgent',
      label: 'Urgent',
      value: 'urgent',
      icon: 'alert-circle',
      count: 2,
    },
  ];

  const filteredJobs = useMemo(() => {
    let filtered = mockJobs;
    
    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(job => {
        return selectedFilters.some(filterId => {
          const filter = filterOptions.find(f => f.id === filterId);
          if (!filter) return false;
          
          switch (filterId) {
            case 'urgent':
              return job.urgent;
            case 'crane_operator':
            case 'rigger':
            case 'signaller':
              return job.category === filter.value;
            case 'entry_level':
            case 'intermediate':
            case 'experienced':
            case 'senior':
              return job.experienceLevel === filter.value;
            case 'day_shift':
            case 'night_shift':
            case 'rotating':
            case 'weekend':
              return job.shift === filter.value;
            default:
              return false;
          }
        });
      });
    }
    
    return filtered;
  }, [searchQuery, selectedFilters]);

  const handleJobPress = (job: Job) => {
    console.log('Job pressed:', job.title);
    // Navigate to job details
  };

  const handleApply = (job: Job) => {
    Alert.alert(
      'Apply for Job',
      `Apply for ${job.title} at ${job.company}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Apply', 
          onPress: () => {
            console.log('Applied to:', job.title);
            // Handle application logic
          }
        },
      ]
    );
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setSearchQuery('');
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: 'clamp',
  });

  const searchOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderJobItem = ({ item }: { item: Job }) => (
    <JobCard
      job={item}
      onPress={() => handleJobPress(item)}
      onApply={() => handleApply(item)}
    />
  );

  const renderFilterChip = ({ item }: { item: FilterOption }) => {
    const isSelected = selectedFilters.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          isSelected && styles.filterChipSelected
        ]}
        onPress={() => toggleFilter(item.id)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={16}
          color={isSelected ? 'white' : Colors.primary[500]}
        />
        <Text style={[
          styles.filterChipText,
          isSelected && styles.filterChipTextSelected
        ]}>
          {item.label}
        </Text>
        {item.count && (
          <View style={[
            styles.filterCount,
            isSelected && styles.filterCountSelected
          ]}>
            <Text style={[
              styles.filterCountText,
              isSelected && styles.filterCountTextSelected
            ]}>
              {item.count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[600]} />
      
      {/* Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={Colors.gradients.primary}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Available Jobs</Text>
            <Text style={styles.headerSubtitle}>
              {filteredJobs.length} jobs available
            </Text>
            
            <Animated.View style={[styles.searchContainer, { opacity: searchOpacity }]}>
              <MaterialIcons name="search" size={20} color={Colors.text.tertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search jobs..."
                placeholderTextColor={Colors.text.tertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Animated.View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.viewToggle}
                onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              >
                <MaterialIcons
                  name={viewMode === 'list' ? 'map' : 'list'}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterButton, showFilters && styles.filterButtonActive]}
                onPress={() => setShowFilters(!showFilters)}
              >
                <MaterialCommunityIcons name="tune" size={20} color="white" />
                {selectedFilters.length > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>
                      {selectedFilters.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            {selectedFilters.length > 0 && (
              <TouchableOpacity onPress={clearAllFilters}>
                <Text style={styles.clearFilters}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filterOptions}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          />
        </View>
      )}

      {/* Job List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={styles.jobsList}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshJobs}
            colors={[Colors.primary[500]]}
            tintColor={Colors.primary[500]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="briefcase-search"
              size={64}
              color={Colors.text.tertiary}
            />
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error[500],
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  clearFilters: {
    fontSize: 14,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.primary[500],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[500],
    marginLeft: 6,
  },
  filterChipTextSelected: {
    color: 'white',
  },
  filterCount: {
    backgroundColor: Colors.primary[100],
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  filterCountSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  filterCountTextSelected: {
    color: 'white',
  },
  jobsList: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

export default JobsScreen;