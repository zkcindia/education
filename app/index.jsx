import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Redirect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

   useEffect(() => {
    const checkUserData = async () => {
      try {
        // Prevent splash screen from auto hiding while we're loading
        await SplashScreen.preventAutoHideAsync();

        const userDataString  = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        console.log(userData);
        
        if (userData?.role==='Student') {
          // If user data is present, redirect to Home screen
          setRedirectPath('home');
        }else if(userData?.role==='teacher'){
          setRedirectPath('home2');
        } else {
          // If no user data, redirect to Login screen
          setRedirectPath('screen1');
        }

        setIsLoading(false); // Loading finished
        await SplashScreen.hideAsync(); // Hide splash screen once ready
      } catch (e) {
        console.error(e);
      }
    };

    checkUserData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Redirect to the appropriate screen based on user data
  if (redirectPath) {
    return <Redirect href={redirectPath} />;
  }

  return null; // Return nothing while deciding redirect path
}