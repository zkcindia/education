import { View, Text, StyleSheet, Image, TextInput, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { COLOR } from './../../../../constants/Colors';
import Banner from '../../../../components/home/Banner';
import PopularCourse from '../../../../components/home/PopularCourse';
import TopMentor from '../../../../components/home/TopMentor';
import FeaturedCourse from '../../../../components/home/featuredCourse';
import Sloka from '../../../../components/home/Sloka';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

export default function Index() {
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserName(parsedData);
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{paddingTop: 40}} showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
          <Image 
            source={{ uri: 'https://www.icon0.com/free/static2/preview2/stock-photo-little-boy-faces-children-avatar-people-icon-character-cartoon-32990.jpg' }} 
            style={styles.profileImage} 
          />
          <View style={styles.userNameContainer}>
            <Text style={styles.userNameText}>{userName?.name || 'Guest'}</Text>
            <Text style={styles.userSubtitle}>Find your class and enjoy new arrivals ✨</Text>
          </View>
          <FontAwesome name="bell" size={20} color="black" />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.earningContainer}>
            <Image 
              source={{ uri: 'https://img.freepik.com/premium-vector/bitcoin-investing-flat-vector-illustration-banner_128772-693.jpg' }} 
              style={styles.statImage} 
            />
            <View>
              <Text style={styles.statText}>{userName.points || '0'}</Text>
              <Text style={styles.statLabel}>Earning Points</Text>
            </View>
          </View>
          <View style={styles.earningContainer}>
            <Image 
              source={{ uri: 'https://img.freepik.com/premium-vector/achievement-trophy-flat-vector-illustration-banner_128772-725.jpg' }} 
              style={styles.statImage} 
            />
            <View>
              <Text style={styles.statText}>420</Text>
              <Text style={styles.statLabel}>Ranks</Text>
            </View>
          </View>
        </View>

        {/* Components */}
        <Banner />
        <Sloka />
        <PopularCourse />
        <Banner />
        <FeaturedCourse />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    marginBottom: 20,
  },
  profileImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 50,
    backgroundColor: COLOR.background,
  },
  userNameContainer: {
    flex: 1,
    marginLeft: width * 0.03,
  },
  userNameText: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.045,
  },
  userSubtitle: {
    fontFamily: 'roboto',
    fontSize: width * 0.035,
    color: 'grey',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
  },
  earningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.4,
  },
  statImage: {
    width: width * 0.15,
    height: height * 0.1,
    resizeMode: 'contain',
  },
  statText: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.04,
  },
  statLabel: {
    fontFamily: 'roboto',
    fontSize: width * 0.035,
    color: 'grey',
  },
});
