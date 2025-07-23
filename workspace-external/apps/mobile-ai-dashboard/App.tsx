import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from './src/types/Dashboard';
import { DashboardScreen } from './src/screens/DashboardScreen';

const Tab = createBottomTabNavigator();

// Placeholder screens for other tabs
const AgentsScreen = () => (
  <DashboardScreen />
);

const AnalyticsScreen = () => (
  <DashboardScreen />
);

const SettingsScreen = () => (
  <DashboardScreen />
);

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof MaterialIcons.glyphMap;

              if (route.name === 'Dashboard') {
                iconName = 'dashboard';
              } else if (route.name === 'Agents') {
                iconName = 'psychology';
              } else if (route.name === 'Analytics') {
                iconName = 'analytics';
              } else if (route.name === 'Settings') {
                iconName = 'settings';
              } else {
                iconName = 'dashboard';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textSecondary,
            tabBarStyle: {
              backgroundColor: Colors.cardBackground,
              borderTopColor: Colors.border,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Agents" component={AgentsScreen} />
          <Tab.Screen name="Analytics" component={AnalyticsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}