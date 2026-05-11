import { COLOR } from "@/constants/Colors";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { ToastProvider } from 'react-native-toast-notifications';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Provider } from 'react-redux';
import store from './../redux/store';
import { useNavigation } from "@react-navigation/native";


export default function RootLayout() {
  const navigation =useNavigation()
  const [fontsLoaded] = useFonts({
    'roboto': require('./../assets/fonts/Roboto-Regular.ttf'),
    'roboto-bold': require('./../assets/fonts/Roboto-Bold.ttf'),
    'roboto-medium': require('./../assets/fonts/Roboto-Medium.ttf'),
  });

  if (!fontsLoaded) {
    // Show a loading indicator while fonts are being loaded
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
    <ToastProvider>
    <Stack>
      <Stack.Screen name="index" options={{headerShown:false}}/>
      <Stack.Screen name="screen1" options={{headerShown:false}}/>
      <Stack.Screen name="screen2" options={{headerShown:false}}/>
      <Stack.Screen name="screen3" options={{headerShown:false}}/>
      <Stack.Screen name="screen4" options={{headerShown:false}}/>
      <Stack.Screen name="screen5" options={{headerShown:false}}/>
      <Stack.Screen name="signUp" options={{headerShown:false}}/>
      <Stack.Screen name="signIn" options={{headerShown:false}}/>
      <Stack.Screen name="(drawer)" options={{headerShown:false}}/>
      <Stack.Screen name="(tabs2)" options={{headerShown:false}}/>
      <Stack.Screen name="screen/courseDetails" options={{headerShown:false}}/>
      <Stack.Screen name="screen/allClass" options={{headerShown:false}}/>
      <Stack.Screen name="screen/allMentors" options={{headerShown:false}}/>
      <Stack.Screen name="screen/subjectScreen" options={{headerShown:false}}/>
      <Stack.Screen name="screen/instructionsScreen" options={{headerShown:false}}/>
      <Stack.Screen name="screen/quizScreen" options={{headerShown:false}}/>
      <Stack.Screen name="screen/resultScreen" options={{headerShown:false}}/>
      <Stack.Screen name="screen/myProfileScreen" options={{headerShown:false,title:"My Profile",
        headerStyle:{
          backgroundColor:COLOR.background,
        },
        headerTintColor:COLOR.white,
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('screen/myProfileScreen', { isEditing: true })}>
            <MaterialCommunityIcons name="square-edit-outline" size={24} color={COLOR.white} style={{ marginRight: 15 }}/>
          </TouchableOpacity>
        ),
      }}/>
      {/* teacher */}
      <Stack.Screen name="screen/questionsDetails" options={{headerShown:false}}/>
      <Stack.Screen name="screen/questionEditScreen" options={{headerShown:false}}/>
      <Stack.Screen name="screen/QuestionUpload" options={{headerShown:false}}/>
    </Stack>
    </ToastProvider>
    </Provider>
  );
}
