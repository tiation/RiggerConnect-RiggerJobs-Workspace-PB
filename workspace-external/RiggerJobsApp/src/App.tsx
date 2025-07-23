/**
 * RiggerJobs Worker App
 * Enterprise-grade React Native application for riggers and crane operators
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#0A0A0A' : '#ffffff',
  };

  const cardStyle = {
    backgroundColor: isDarkMode ? '#1A1A1A' : '#f8f9fa',
    borderColor: isDarkMode ? '#00FFFF' : '#e9ecef',
  };

  const textStyle = {
    color: isDarkMode ? '#ffffff' : '#000000',
  };

  const accentStyle = {
    color: isDarkMode ? '#00FFFF' : '#007AFF',
  };

  const handleJobSearch = () => {
    Alert.alert(
      'RiggerJobs - Job Search',
      'Find rigger and crane operator positions in WA mining and construction industry',
      [
        {
          text: 'Browse Jobs',
          onPress: () => console.log('Opening job search...'),
        },
      ]
    );
  };

  const handleProfileSetup = () => {
    Alert.alert(
      'Worker Profile',
      'Set up your rigger profile with certifications, experience, and availability',
      [
        {
          text: 'Setup Profile',
          onPress: () => console.log('Opening profile setup...'),
        },
      ]
    );
  };

  const handleEarningsTracker = () => {
    Alert.alert(
      'Earnings Tracker',
      'Track your income, job history, and performance metrics',
      [
        {
          text: 'View Earnings',
          onPress: () => console.log('Opening earnings tracker...'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, accentStyle]}>RiggerJobs</Text>
          <Text style={[styles.subtitle, textStyle]}>Worker Portal</Text>
          <Text style={[styles.tagline, textStyle]}>Find Your Next Rigging Assignment</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, cardStyle]}>
            <Text style={[styles.statNumber, accentStyle]}>247</Text>
            <Text style={[styles.statLabel, textStyle]}>Available Jobs</Text>
          </View>
          <View style={[styles.statCard, cardStyle]}>
            <Text style={[styles.statNumber, accentStyle]}>$85k</Text>
            <Text style={[styles.statLabel, textStyle]}>Avg. Salary</Text>
          </View>
          <View style={[styles.statCard, cardStyle]}>
            <Text style={[styles.statNumber, accentStyle]}>98%</Text>
            <Text style={[styles.statLabel, textStyle]}>Safety Rate</Text>
          </View>
        </View>

        {/* Main Features */}
        <View style={styles.content}>
          <TouchableOpacity 
            style={[styles.featureCard, cardStyle]}
            onPress={handleJobSearch}>
            <Text style={[styles.featureIcon, accentStyle]}>🔍</Text>
            <Text style={[styles.featureTitle, textStyle]}>Job Search</Text>
            <Text style={[styles.featureDescription, textStyle]}>
              Browse mining and construction rigging opportunities across WA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, cardStyle]}
            onPress={handleProfileSetup}>
            <Text style={[styles.featureIcon, accentStyle]}>👨‍🔧</Text>
            <Text style={[styles.featureTitle, textStyle]}>Worker Profile</Text>
            <Text style={[styles.featureDescription, textStyle]}>
              Manage certifications, skills, and availability
            </Text>
          </TouchableOpacity>

          <View style={[styles.featureCard, cardStyle]}>
            <Text style={[styles.featureIcon, accentStyle]}>📱</Text>
            <Text style={[styles.featureTitle, textStyle]}>Real-time Updates</Text>
            <Text style={[styles.featureDescription, textStyle]}>
              Get instant notifications for job matches and updates
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.featureCard, cardStyle]}
            onPress={handleEarningsTracker}>
            <Text style={[styles.featureIcon, accentStyle]}>💰</Text>
            <Text style={[styles.featureTitle, textStyle]}>Earnings Tracker</Text>
            <Text style={[styles.featureDescription, textStyle]}>
              Monitor income, job history, and performance metrics
            </Text>
          </TouchableOpacity>

          <View style={[styles.featureCard, cardStyle]}>
            <Text style={[styles.featureIcon, accentStyle]}>🛡️</Text>
            <Text style={[styles.featureTitle, textStyle]}>Safety Compliance</Text>
            <Text style={[styles.featureDescription, textStyle]}>
              Track safety certifications and compliance requirements
            </Text>
          </View>

          <View style={[styles.featureCard, cardStyle]}>
            <Text style={[styles.featureIcon, accentStyle]}>📍</Text>
            <Text style={[styles.featureTitle, textStyle]}>Location Services</Text>
            <Text style={[styles.featureDescription, textStyle]}>
              Find jobs near you with integrated mapping
            </Text>
          </View>

          <TouchableOpacity style={[styles.primaryButton, {backgroundColor: isDarkMode ? '#00FFFF' : '#007AFF'}]}>
            <Text style={[styles.buttonText, {color: isDarkMode ? '#000000' : '#ffffff'}]}>
              Start Job Search
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, textStyle]}>
            Connecting riggers with WA mining & construction industry
          </Text>
          <Text style={[styles.footerSubtext, textStyle]}>
            Powered by Tiation • Enterprise-grade platform
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.8,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    opacity: 0.6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingBottom: 40,
  },
  featureCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  primaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    opacity: 0.4,
    textAlign: 'center',
  },
});

export default App;
