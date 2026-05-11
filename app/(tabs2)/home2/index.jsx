import { View, Text, StyleSheet, Image, TextInput, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather, FontAwesome } from '@expo/vector-icons'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLOR } from '../../../constants/Colors'
import Banner from '../../../components/home/Banner'
import PopularCourse from '../../../components/home/PopularCourse'
import { useRoute } from '@react-navigation/native'

export default function Index() {
  const [userName, setUserName] = useState('');
  const router = useRoute()
  console.log(router);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          console.log(parsedData,'data');
          
          setUserName(parsedData); // Assuming userData has a 'name' field
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <View style={{flex:1,paddingTop:40}}>
      <SafeAreaView>
        <ScrollView>
      <View style={styles.topContainer}>
        <Image source={{uri:'https://www.icon0.com/free/static2/preview2/stock-photo-little-boy-faces-children-avatar-people-icon-character-cartoon-32990.jpg'}} width={40} height={40} style={{borderRadius:99,backgroundColor:COLOR.background}}/>
        <View>
          <Text style={{fontFamily:'roboto-bold',fontSize:17}}>{userName?.name || 'Guest'}</Text>
          <Text style={{fontFamily:'roboto'}}>Find your class and enjoy new arrive ✨</Text>
        </View>
        <FontAwesome name="bell" size={20} color="black" />
      </View>
      {/* <View style={styles.searchContainer}>
        <View style={styles.earningContainer}>
          <Image source={{uri:'https://img.freepik.com/premium-vector/bitcoin-investing-flat-vector-illustration-banner_128772-693.jpg'}} style={styles.image}/>
          <View>
          <Text style={{fontFamily:'roboto-bold',fontSize:16}}>{userName.points || '0'}</Text>
          <Text style={{fontFamily:'roboto'}}>earning points</Text>
          </View>
        </View>
        <View style={styles.earningContainer}>
          <Image source={{uri:'https://img.freepik.com/premium-vector/achievement-trophy-flat-vector-illustration-banner_128772-725.jpg'}} style={styles.image}/>
          <View>
          <Text style={{fontFamily:'roboto-bold',fontSize:16}}>420</Text>
          <Text style={{fontFamily:'roboto'}}>Ranks</Text>
          </View>
        </View>
      </View> */}
      {/* banner */}
      <Banner />
      {/* Sloka */}
      {/* <Sloka /> */}
      {/* Top student*/}
      <PopularCourse />
      {/* banner */}
      <Banner />
      {/* class list */}
      {/* <FeaturedCourse /> */}
      {/* My course */}
      {/* <MyCourse /> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
const styles = StyleSheet.create({
  topContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    gap:20,
    paddingHorizontal:20,
    marginHorizontal:'auto'
  },
  searchContainer:{
    display:'flex',
    flexDirection:'row',
    marginHorizontal:20,
    padding:10,
    backgroundColor:'#fff',
    borderRadius:10,
    marginTop:20,
    shadowColor:'#000',
    shadowOffset:{
      width:0,
      height:2
    },
    shadowRadius:10,
    shadowOpacity:0.2,
    justifyContent:'space-between'
  },
  image:{
    width:50,
    height:60
  },
  earningContainer:{
    flexDirection:'row',
    alignItems:'center',
    gap:10
  },
})
