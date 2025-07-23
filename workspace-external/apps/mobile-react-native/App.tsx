/**
 * RiggerConnect Mobile App
 * Enterprise-grade React Native application
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
} from 'react-native';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
  };

  const textStyle = {
    color: isDarkMode ? '#ffffff' : '#000000',
  };

  const handleGetStarted = () => {
    Alert.alert(
      'Welcome to RiggerConnect',
      'Your enterprise-grade rigging and crane operation management app is ready!',
      [
        {
          text: 'Continue',
          onPress: () => console.log('Getting started with RiggerConnect'),
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
          <Text style={[styles.title, textStyle]}>RiggerConnect</Text>
          <Text style={[styles.subtitle, textStyle]}>Enterprise Mobile App</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.featureCard}>
            <Text style={[styles.featureTitle, textStyle]}>🏗️ Job Management</Text>
            <Text style={[styles.featureDescription, textStyle]}>
              Manage rigging jobs, crane operations, and worker assignments
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={[styles.featureTitle, textStyle]}>👨‍💼 Worker Portal</Text>
            <Text style={[styles.featureDescription, textStyle]}>
              Access job opportunities, track certifications, and manage compliance
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={[styles.featureTitle, textStyle]}>📊 Analytics Dashboard</Text>
            <Text style={[styles.featureDescription, textStyle]}>
              Real-time monitoring, performance metrics, and reporting
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={[styles.featureTitle, textStyle]}>🔒 Enterprise Security</Text>
            <Text style={[styles.featureDescription, textStyle]}>
              Biometric authentication, encrypted data, and secure communications
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, textStyle]}>
            Enterprise-grade solution for construction industry
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
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingBottom: 40,
  },
  featureCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default App;
