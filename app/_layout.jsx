// // app/_layout.jsx
// import { COLOR } from "@/constants/Colors";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import { ActivityIndicator, TouchableOpacity, View } from "react-native";
// import { ToastProvider } from 'react-native-toast-notifications';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import { Provider } from 'react-redux';
// import store from './../redux/store';
// import { useNavigation } from "@react-navigation/native";

// export default function RootLayout() {
//   const navigation = useNavigation();
//   const [fontsLoaded] = useFonts({
//     'roboto': require('./../assets/fonts/Roboto-Regular.ttf'),
//     'roboto-bold': require('./../assets/fonts/Roboto-Bold.ttf'),
//     'roboto-medium': require('./../assets/fonts/Roboto-Medium.ttf'),
//   });

//   if (!fontsLoaded) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <Provider store={store}>
//       <ToastProvider>
//         <Stack>
//           {/* Auth Screens */}
//           <Stack.Screen name="index" options={{ headerShown: false }} />
//           <Stack.Screen name="screen1" options={{ headerShown: false }} />
//           <Stack.Screen name="screen2" options={{ headerShown: false }} />
//           <Stack.Screen name="screen3" options={{ headerShown: false }} />
//           <Stack.Screen name="screen4" options={{ headerShown: false }} />
//           <Stack.Screen name="screen5" options={{ headerShown: false }} />
          
//           <Stack.Screen name="signIn" options={{ headerShown: false }} />
          
//           {/* ADD THESE THREE ROUTES */}
//           <Stack.Screen name="RoleSelection" options={{ headerShown: false }} />
//           <Stack.Screen name="StudentSignUp" options={{ headerShown: false }} />
//           <Stack.Screen name="TeacherSignUp" options={{ headerShown: false }} />
          
//           {/* Remove old signUp */}
//           {/* <Stack.Screen name="signUp" options={{ headerShown: false }} /> */}
          
//           <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
//           <Stack.Screen name="(tabs2)" options={{ headerShown: false }} />
//           <Stack.Screen name="screen/courseDetails" options={{ headerShown: false }} />
//           <Stack.Screen name="screen/allClass" options={{ headerShown: false }} />
//           <Stack.Screen name="screen/allMentors" options={{ headerShown: false }} />
//           <Stack.Screen name="screen/subjectScreen" options={{ headerShown: false }} />
//           <Stack.Screen name="screen/instructionsScreen" options={{ headerShown: false }} />
//           <Stack.Screen name="screen/quizScreen" options={{ headerShown: false }} />
//           <Stack.Screen name="screen/resultScreen" options={{ headerShown: false }} />
          
//           <Stack.Screen 
//             name="screen/myProfileScreen" 
//             options={{
//               headerShown: false,
//               title: "My Profile",
//               headerStyle: {
//                 backgroundColor: COLOR.background,
//               },
//               headerTintColor: COLOR.white,
//               headerRight: () => (
//                 <TouchableOpacity onPress={() => navigation.navigate('screen/myProfileScreen', { isEditing: true })}>
//                   <MaterialCommunityIcons name="square-edit-outline" size={24} color={COLOR.white} style={{ marginRight: 15 }} />
//                 </TouchableOpacity>
//               ),
//             }} 
//           />
          
//           {/* Teacher Screens */}
//           <Stack.Screen name="screen/questionsDetails" options={{ headerShown: false }} />
//           <Stack.Screen name="screen/questionEditScreen" options={{ headerShown: false }} />
//           <Stack.Screen name="screen/QuestionUpload" options={{ headerShown: false }} />
//         </Stack>
//       </ToastProvider>
//     </Provider>
//   );
// }

// app/_layout.jsx
import { COLOR } from "@/constants/Colors";
import { useFonts } from "expo-font";
import { Stack, router, useSegments } from "expo-router";
import { ActivityIndicator, TouchableOpacity, View, AppState } from "react-native";
import { ToastProvider } from 'react-native-toast-notifications';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Provider } from 'react-redux';
import store from './../redux/store';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useRef } from 'react';

export default function RootLayout() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const appState = useRef(AppState.currentState);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [fontsLoaded] = useFonts({
    'roboto': require('./../assets/fonts/Roboto-Regular.ttf'),
    'roboto-bold': require('./../assets/fonts/Roboto-Bold.ttf'),
    'roboto-medium': require('./../assets/fonts/Roboto-Medium.ttf'),
  });

  // ✅ Initial load
  useEffect(() => {
    if (fontsLoaded) {
      checkUserStatus();
    }
  }, [fontsLoaded]);

  // ✅ App state change listener
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active' &&
        !isRedirecting
      ) {
        console.log('📱 App came from background');
        checkAndRedirectToWordOfDay();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isRedirecting]);

  // ✅ Check if Word of Day already seen today
  const checkAndRedirectToWordOfDay = async () => {
    try {
      if (isRedirecting) return;
      setIsRedirecting(true);

      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const currentPath = segments.join('/');
        const isOnWordOfDay = currentPath.includes('WordOfDay');
        const isOnSpecialDay = currentPath.includes('SpecialDay');

        // ✅ Check if already seen today
        const today = new Date().toDateString();
        const lastVisit = await AsyncStorage.getItem('lastWordOfDayVisit');
        const alreadySeenToday = lastVisit === today;

        console.log('📅 Today:', today);
        console.log('📅 Last Visit:', lastVisit);
        console.log('✅ Already seen today?', alreadySeenToday);

        // ✅ Only redirect if NOT on WordOfDay AND NOT seen today
        if (!isOnWordOfDay && !isOnSpecialDay && !alreadySeenToday) {
          console.log('🔄 New day! Redirecting to Word of Day');
          router.replace('/(drawer)/(studentIntro)/WordOfDay');
        } else if (alreadySeenToday) {
          console.log('✅ Already seen today, skipping redirect');
        } else {
          console.log('✅ Already on WordOfDay/SpecialDay');
        }
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setTimeout(() => setIsRedirecting(false), 1000);
    }
  };

  const checkUserStatus = async () => {
    try {
      console.log('🔥 Checking user status...');
      const userData = await AsyncStorage.getItem('userData');

      if (userData) {
        // ✅ Check if already seen today
        const today = new Date().toDateString();
        const lastVisit = await AsyncStorage.getItem('lastWordOfDayVisit');
        const alreadySeenToday = lastVisit === today;

        if (!alreadySeenToday) {
          console.log('📅 New day! Going to Word of Day');
          router.replace('/(drawer)/(studentIntro)/WordOfDay');
        } else {
          console.log('✅ Already seen today, going to Dashboard');
          router.replace('/(drawer)');
        }
      } else {
        console.log('❌ User not logged in, going to SignIn');
        router.replace('/signIn');
      }
    } catch (error) {
      console.log('❌ Error:', error);
      router.replace('/signIn');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLOR.background || "#003096"} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <ToastProvider>
        <Stack>
          {/* Auth Screens */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="screen1" options={{ headerShown: false }} />
          <Stack.Screen name="screen2" options={{ headerShown: false }} />
          <Stack.Screen name="screen3" options={{ headerShown: false }} />
          <Stack.Screen name="screen4" options={{ headerShown: false }} />
          <Stack.Screen name="screen5" options={{ headerShown: false }} />
          
          <Stack.Screen name="signIn" options={{ headerShown: false }} />
          
          <Stack.Screen name="RoleSelection" options={{ headerShown: false }} />
          <Stack.Screen name="StudentSignUp" options={{ headerShown: false }} />
          <Stack.Screen name="TeacherSignUp" options={{ headerShown: false }} />
          
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs2)" options={{ headerShown: false }} />
          <Stack.Screen name="screen/courseDetails" options={{ headerShown: false }} />
          <Stack.Screen name="screen/allClass" options={{ headerShown: false }} />
          <Stack.Screen name="screen/allMentors" options={{ headerShown: false }} />
          <Stack.Screen name="screen/subjectScreen" options={{ headerShown: false }} />
          <Stack.Screen name="screen/instructionsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="screen/quizScreen" options={{ headerShown: false }} />
          <Stack.Screen name="screen/resultScreen" options={{ headerShown: false }} />
          
          <Stack.Screen 
            name="screen/myProfileScreen" 
            options={{
              headerShown: false,
              title: "My Profile",
              headerStyle: {
                backgroundColor: COLOR.background,
              },
              headerTintColor: COLOR.white,
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('screen/myProfileScreen', { isEditing: true })}>
                  <MaterialCommunityIcons name="square-edit-outline" size={24} color={COLOR.white} style={{ marginRight: 15 }} />
                </TouchableOpacity>
              ),
            }} 
          />
          
          <Stack.Screen name="screen/questionsDetails" options={{ headerShown: false }} />
          <Stack.Screen name="screen/questionEditScreen" options={{ headerShown: false }} />
          <Stack.Screen name="screen/QuestionUpload" options={{ headerShown: false }} />
        </Stack>
      </ToastProvider>
    </Provider>
  );
}