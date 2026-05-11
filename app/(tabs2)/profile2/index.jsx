import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOR } from '../../../constants/Colors';

export default function Index() {
  const navigation = useNavigation()
  const handleLogout= async()=>{
    await AsyncStorage.removeItem('userData');
    navigation.navigate('screen1')
  }
  return (
    <SafeAreaView style={{flex:1}}>
        <View style={{backgroundColor:COLOR.background,flex:0.4,padding:20,paddingTop:35,flexDirection:'column'}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity>
            <Feather name="arrow-left" size={24} color={COLOR.white} />
            </TouchableOpacity>
            <TouchableOpacity>
            <MaterialCommunityIcons name="square-edit-outline" size={24} color={COLOR.white} />
            </TouchableOpacity>
            
            </View>
            <View style={{marginHorizontal:"auto",justifyContent:'center',alignItems:'center'}}>
              <Image source={{uri:"https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"}} width={100} height={100} style={{borderRadius:50}}/>
              <View style={{marginTop:10}}>
                <Text style={{color:COLOR.white,fontWeight:'bold',fontSize:18,textAlign:'center'}}>Alexo Deo</Text>
                <Text style={{color:COLOR.white,textAlign:'center'}}>0907654367</Text>
                <Text style={{color:COLOR.white,fontWeight:'400',fontSize:15,textAlign:'center',marginTop:10}}>Lake City, Conord Shipping Complex, Khikhol,Dhaka-752054</Text>
              </View>
            </View>
        </View>
          <ScrollView style={{flex:0.6}}>
        <View style={{padding:20,flexDirection:'column',gap:10}}>
          <TouchableOpacity style={styles.profileCard} onPress={()=>navigation.navigate('screen/myProfileScreen')}>
            <View style={{flexDirection:'row',gap:20,alignItems:'center'}}>
              <FontAwesome5 name="user-alt" size={22} color={COLOR.background} />
              <Text style={{fontSize:16, color:'#999898'}}>My Profile</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileCard}>
            <View style={{flexDirection:'row',gap:20,alignItems:'center'}}>
              <Entypo name="wallet" size={22} color={COLOR.background} />
              <Text style={{fontSize:16, color:'#999898'}}>My Wallet</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.profileCard}>
            <View style={{flexDirection:'row',gap:20,alignItems:'center'}}>
              <Entypo name="heart" size={22} color={COLOR.background} />
              <Text style={{fontSize:16, color:'#999898'}}>My Wishlist</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.profileCard}>
            <View style={{flexDirection:'row',gap:20,alignItems:'center'}}>
              <Entypo name="lock" size={22} color={COLOR.background} />
              <Text style={{fontSize:16, color:'#999898'}}>Change Password</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.profileCard}>
            <View style={{flexDirection:'row',gap:20,alignItems:'center'}}>
              <MaterialIcons name="assignment" size={22} color={COLOR.background} />
              <Text style={{fontSize:16, color:'#999898'}}>My Complet Subject</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.profileCard}>
            <View style={{flexDirection:'row',gap:20,alignItems:'center'}}>
              <FontAwesome name="share-alt" size={22} color={COLOR.background} />
              <Text style={{fontSize:16, color:'#999898'}}>Share App</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileCard} onPress={handleLogout}>
            <View style={{flexDirection:'row',gap:20,alignItems:'center'}}>
              <MaterialIcons name="logout" size={22} color={COLOR.background} />
              <Text style={{fontSize:16, color:'#999898'}}>Logout</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>
        </View>
          </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  profileCard:{
    flexDirection:'row',
    backgroundColor:COLOR.white,
    padding:20,
    justifyContent:'space-between',
    alignItems:'center',
    borderRadius:5
  }
})
