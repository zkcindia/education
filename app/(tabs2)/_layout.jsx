// import { View, Text } from 'react-native';
// import React from 'react';
// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons'; // or import any other icon library
// import { COLOR } from '../../constants/Colors';

// export default function Layout() {
//   return (
//     <Tabs
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           switch (route.name) {
//             case 'home2':
//               iconName = focused ? 'home' : 'home-outline';
//               break;
//             case 'question':
//               iconName = focused ? 'list' : 'list-outline';
//               break;
//             // case 'inbox2':
//             //   iconName = focused ? 'mail' : 'mail-outline';
//             //   break;
//             case 'profile2':
//               iconName = focused ? 'person' : 'person-outline';
//               break;
//             default:
//               iconName = 'help-circle'; // Fallback if route name is unknown
//           }

//           // Increase size if tab is active
//           const iconSize = focused ? 29 : 24;

//           return <Ionicons name={iconName} size={iconSize} color={color} />;
//         },
//         tabBarActiveTintColor: COLOR.background,
//         tabBarInactiveTintColor: 'gray',
//         headerShown: false,
//       })}
//     >
//       <Tabs.Screen name='home2' options={{ title: 'HOME' }} />
//       <Tabs.Screen name='question' options={{ title: 'QUESTION', headerShown: false }} />
// <Tabs.Screen name="inbox2" options={{ href: null }} />

//       {/* Hide inbox */}
//       <Tabs.Screen
//         name="inbox"
//         options={{
//           href: null,
//         }}
//       />

//       <Tabs.Screen name='profile2' options={{ title: 'PROFILE' }} />
//     </Tabs>
//   );
// }


import { View, Text, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
              iconName = 'help-circle';
          }

          // ✨ Active icon ke peeche light purple circle
          return (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <Ionicons
                name={iconName}
                size={focused ? 24 : 22}
                color={focused ? '#4F46E5' : color}
              />
            </View>
          );
        },

        // 🎨 Tab Bar Styles
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        headerShown: false,
      })}
    >
      <Tabs.Screen name='home2' options={{ title: 'HOME' }} />
      <Tabs.Screen
        name='question'
        options={{ title: 'QUESTION', headerShown: false }}
      />

      {/* Hide inbox2 */}
      <Tabs.Screen name='inbox2' options={{ href: null }} />

      {/* Hide inbox */}
      <Tabs.Screen
        name='inbox'
        options={{
          href: null,
        }}
      />

      <Tabs.Screen name='profile2' options={{ title: 'PROFILE' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // 📦 Tab Bar Container (Fixed — no absolute)
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 25 : 8,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    // ❌ position: 'absolute' — hata diya
    // ❌ bottom, left, right — hata diye
    // ✅ Ab normal position mein hai
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },

  // 🎯 Each Tab Item
  tabBarItem: {
    paddingTop: 4,
    paddingBottom: 4,
  },

  // 🏷️ Label
  tabBarLabel: {
    fontSize: 10,
    fontFamily: 'roboto-bold',
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // 🔵 Icon Wrapper (Circle)
  iconWrapper: {
    width: 44,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ✨ Active Icon Wrapper
  iconWrapperActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
});