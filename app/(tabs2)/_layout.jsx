import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // or import any other icon library
import { COLOR } from '../../constants/Colors';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'home2':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'question':
              iconName = focused ? 'list' : 'list-outline';
              break;
            // case 'inbox2':
            //   iconName = focused ? 'mail' : 'mail-outline';
            //   break;
            case 'profile2':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle'; // Fallback if route name is unknown
          }

          // Increase size if tab is active
          const iconSize = focused ? 29 : 24;

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: COLOR.background,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tabs.Screen name='home2' options={{ title: 'HOME' }} />
      <Tabs.Screen name='question' options={{ title: 'QUESTION', headerShown: false }} />
<Tabs.Screen name="inbox2" options={{ href: null }} />

      {/* Hide inbox */}
      <Tabs.Screen
        name="inbox"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen name='profile2' options={{ title: 'PROFILE' }} />
    </Tabs>
  );
}
