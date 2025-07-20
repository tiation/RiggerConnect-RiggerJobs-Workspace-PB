import React, { useState, useEffect } from 'react';
import { StatusBar, Alert, LogBox, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import JobsScreen from './src/screens/JobsScreen/JobsScreen';
import Colors from './src/theme/colors';
import { apiService } from './src/services/api';

// Ignore specific warnings for demo
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
]);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Mock screens for demo
const MyJobsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <MaterialCommunityIcons name="briefcase" size={64} color={Colors.primary[500]} />
      <Text style={{ marginTop: 16, color: Colors.text.primary, fontSize: 24, fontWeight: 'bold' }}>My Jobs</Text>
      <Text style={{ color: Colors.text.secondary, textAlign: 'center', marginTop: 8 }}>
        Track your applications and active jobs
      </Text>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <MaterialCommunityIcons name="account" size={64} color={Colors.primary[500]} />
      <Text style={{ marginTop: 16, color: Colors.text.primary, fontSize: 24, fontWeight: 'bold' }}>Profile</Text>
      <Text style={{ color: Colors.text.secondary, textAlign: 'center', marginTop: 8 }}>
        Manage your profile and preferences
      </Text>
    </View>
  );
};

const PaymentsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <MaterialCommunityIcons name="credit-card" size={64} color={Colors.primary[500]} />
      <Text style={{ marginTop: 16, color: Colors.text.primary, fontSize: 24, fontWeight: 'bold' }}>Payments</Text>
      <Text style={{ color: Colors.text.secondary, textAlign: 'center', marginTop: 8 }}>
        View payment history and earnings
      </Text>
    </View>
  );
};

// Auth Stack (for future implementation)
const AuthStack = () => {
  return (
    <Stack.Navigator>
      {/* Auth screens would go here */}
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Available Jobs':
              iconName = focused ? 'briefcase-search' : 'briefcase-search-outline';
              break;
            case 'My Jobs':
              iconName = focused ? 'briefcase-check' : 'briefcase-check-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            case 'Payments':
              iconName = focused ? 'credit-card' : 'credit-card-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary[600],
        tabBarInactiveTintColor: Colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: Colors.border.light,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen 
        name="Available Jobs" 
        component={JobsScreen}
        options={{
          tabBarBadge: undefined, // Could show number of new jobs
        }}
      />
      <Tab.Screen 
        name="My Jobs" 
        component={MyJobsScreen}
        options={{
          tabBarBadge: undefined, // Could show number of active applications
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsScreen} 
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    checkApiHealth();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');
      
      if (token && user) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkApiHealth = async () => {
    try {
      const isHealthy = await apiService.checkApiHealth();
      if (!isHealthy) {
        console.warn('API health check failed - using mock data');
      }
    } catch (error) {
      console.error('API health check error:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: Colors.primary[600]
      }}>
        <MaterialCommunityIcons name="loading" size={48} color="white" />
        <Text style={{ marginTop: 16, color: 'white', fontSize: 24, fontWeight: 'bold' }}>RiggerHub</Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primary[600]}
        translucent={false}
      />
      <NavigationContainer>
        {/* For demo purposes, always show main app */}
        {/* In production, you'd check isAuthenticated here */}
        <MainTabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;