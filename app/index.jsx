// import { useCallback, useEffect, useState } from "react";
// import { ActivityIndicator, Text, View } from "react-native";
// import * as SplashScreen from 'expo-splash-screen';
// import * as Font from 'expo-font';
// import { Redirect } from "expo-router";
// import AsyncStorage from '@react-native-async-storage/async-storage';


// export default function Index() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [redirectPath, setRedirectPath] = useState(null);

//    useEffect(() => {
//     const checkUserData = async () => {
//       try {
//         // Prevent splash screen from auto hiding while we're loading
//         await SplashScreen.preventAutoHideAsync();

//         const userDataString  = await AsyncStorage.getItem('userData');
//         const userData = JSON.parse(userDataString);
//         console.log(userData);
        
//         if (userData?.role==='Student') {
//           // If user data is present, redirect to Home screen
//           setRedirectPath('home');
//         }else if(userData?.role==='teacher'){
//           setRedirectPath('home2');
//         } else {
//           // If no user data, redirect to Login screen
//           setRedirectPath('screen1');
//         }

//         setIsLoading(false); // Loading finished
//         await SplashScreen.hideAsync(); // Hide splash screen once ready
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     checkUserData();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   // Redirect to the appropriate screen based on user data
//   if (redirectPath) {
//     return <Redirect href={redirectPath} />;
//   }

//   return null; // Return nothing while deciding redirect path
// }

// app/index.jsx
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { Redirect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const checkUserData = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        const userDataString = await AsyncStorage.getItem('userData');
        
        let userData = null;
        if (userDataString) {
          try {
            userData = JSON.parse(userDataString);
          } catch (e) {
            console.log('JSON parse error:', e);
            userData = null;
          }
        }

        console.log('🔍 INDEX - userData:', userData);
        const role = (userData?.role || "").toLowerCase();
        console.log('🔍 INDEX - role:', role);

        // ✅ ROLE-BASED ROUTING (Education App Theme)
        if (role === 'student' || role === 'user') {
          setRedirectPath('/(drawer)/(tabs)/home');
        } 
        else if (role === 'teacher') {
          setRedirectPath('/(tabs2)/home2');
        } 
     if (role === 'dealer' || role === 'district') {
          setRedirectPath('/(associate)/(tabs)/home');
        } 
        // ✅ 2. EXECUTIVE -> Tabs2 (Referrer)
        else if (role === 'referrer' || role === 'executive') {
          setRedirectPath('/(associate)/(tabs2)/home');
        } 

        else {
          // ❌ No role — go to onboarding
          setRedirectPath('screen1');
        }

        setIsLoading(false);
        await SplashScreen.hideAsync();
      } catch (e) {
        console.error('INDEX ERROR:', e);
        setIsLoading(false);
        setRedirectPath('screen1');
      }
    };

    checkUserData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#003096" />
      </View>
    );
  }

  if (redirectPath) {
    return <Redirect href={redirectPath} />;
  }

  return null;
}