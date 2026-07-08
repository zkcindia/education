import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { signInUser } from '../constants/api/apiSignUp';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

export default function signUp() {
  const navigation = useNavigation();
  const toast = useToast();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleLogin = async() =>{
    if(!email &&  !password){
      toast.show('Please fill all field', {
        type: 'danger',
        duration: 2000,
        animationType: 'zoom-in',
        placement:'top',
      })
      return;
        }
    try {
      const response = await signInUser({email,password});
if(response.status === 200){

  console.log("LOGIN RESPONSE:", response.data);

if(response.data.access_token){
  await AsyncStorage.setItem(
    'access',
    response.data.access_token
  );
}

if(response.data.refresh_token){
  await AsyncStorage.setItem(
    'refresh',
    response.data.refresh_token
  );
}

  // SAVE USER DATA
  if(response.data.teacher_data){

    const teacher_data = JSON.stringify(
      response.data.teacher_data
    );

    await AsyncStorage.setItem(
      'userData',
      teacher_data
    );

    navigation.navigate('(tabs2)');

} else if(response.data.user_data){

  const userData = JSON.stringify(
    response.data.user_data
  );

  await AsyncStorage.setItem(
    'userData',
    userData
  );

  await AsyncStorage.removeItem("hasVisitedStudentIntro");

  router.replace("/(drawer)/(studentIntro)/WordOfDay");
}

  toast.show(response.data.message, {
    type: 'success',
    duration: 2000,
    animationType: 'zoom-in',
    placement:'top',
  });
}
    } catch (error) {
      toast.show('Some error occure',{
        type: 'danger',
        duration: 2000,
        animationType: 'zoom-in',
        placement:'top',
      })
    }

  }
  return (
    <View style={{flex:1,backgroundColor:'#fff',padding:15}}>
        <View style={{display:'flex',flexDirection:'row',marginTop:23,width:'100%'}}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
            <Text style={{fontFamily:'roboto-bold',textAlign:'center',fontSize:30}}>Sign In</Text>
      <Text style={{fontSize:16,marginHorizontal:'auto',marginTop:5,fontFamily:'roboto'}}>Please Sign In with your account</Text>
      <View style={{display:'flex',flexDirection:'column',gap:15,marginTop:30}}>
        <View style={{display:'flex',flexDirection:'column',gap:5}}>
          <Text style={{fontSize:16,fontFamily:'roboto-medium'}}>Email Here</Text>
          <TextInput style={{width:'100%',height:40,borderRadius:5,borderWidth:1,padding:10,fontFamily:'roboto',fontSize:15,borderColor:'#ccc'}} placeholder='example@gmail.com' onChangeText={setEmail}/>
        </View>
        
        <View style={{ display: 'flex', flexDirection: 'column', marginBottom: 15 }}>
      <Text style={{ fontSize: 16, fontFamily: 'roboto-medium', marginBottom: 5 }}>Password</Text>
      <View style={{ 
        width: '100%', 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 5, 
        flexDirection: 'row', 
        alignItems: 'center' 
      }}>
        <TextInput
          style={{ 
            flex: 1, 
            height: 40, 
            padding: 10, 
            fontFamily: 'roboto', 
            fontSize: 15 
          }}
          placeholder="*****************"
          secureTextEntry={true} // To mask the input
          onChangeText={setPassword}
        />
        <Feather 
          name="eye" 
          size={24} 
          color="black" 
          style={{ paddingRight: 10 }} 
        />
      </View>
    </View>
        <TouchableOpacity style={{backgroundColor:'#003096',padding:15,borderRadius:10}} onPress={handleLogin}>
          <Text style={{fontSize:20,fontFamily:'roboto-bold',color:'#fff',textAlign:'center'}}>SIGN IN</Text>
        </TouchableOpacity>
      </View>
          <View style={styles.container}>
          <View style={styles.line} />
          <Text style={styles.text}>Or Sign in with</Text>
          <View style={styles.line} />
        </View>
        <TouchableOpacity style={{display:'flex',flexDirection:'row',justifyContent:'center',gap:15,backgroundColor:'#087BEA',padding:10,borderRadius:10,marginTop:30}}>
         <Image source={require('./../assets/images/facebook.png')} style={{width:25,height:25}}/>
        <Text style={{fontSize:18,fontFamily:'roboto',color:'#fff'}}>Sign In with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display:'flex',flexDirection:'row',justifyContent:'center',gap:15,backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc',padding:10,borderRadius:10,marginTop:15}}>
         <Image source={require('./../assets/images/search.png')} style={{width:25,height:25}}/>
        <Text style={{fontSize:18,fontFamily:'roboto',color:'#000'}}>Sign In with Google</Text>
        </TouchableOpacity>
        <View style={{display:'flex',flexDirection:'row',gap:10,justifyContent:'center',marginTop:30}}>
          <Text style={{fontFamily:'roboto',textAlign:'center'}}>Didn't have an account? </Text>
          <TouchableOpacity onPress={()=>navigation.navigate('signUp')}>
            <Text style={{color:'#003096',fontFamily:'roboto-bold'}}>Sign up Here</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    width: '30%',
    marginVertical: 10,
  },
  text: {
    textAlign: 'center',
  },
})
