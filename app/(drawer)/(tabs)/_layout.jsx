import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons' // or import any other icon library
import { COLOR } from '../../../constants/Colors'

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'classes':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'inbox':
              iconName = focused ? 'mail' : 'mail-outline';
              break;
            case 'profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle';
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
      <Tabs.Screen name='home'  options={{title:'HOME'}}/>
      <Tabs.Screen name='classes' options={{title:'CLASSES'}}/>
      {/* <Tabs.Screen name='inbox' options={{title:'INBOX'}} /> */}

        {/* Hide inbox */}
  <Tabs.Screen
    name="inbox"
    options={{
      href: null,
    }}
  />


      <Tabs.Screen name='profile' options={{title:'PROFILE'}}/>
    </Tabs>
  )
}
