import { View, Text, StyleSheet, Image, TextInput, SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather, FontAwesome, AntDesign } from '@expo/vector-icons';
import { COLOR } from './../../../../constants/Colors';
import Banner from '../../../../components/home/Banner';
import PopularCourse from '../../../../components/home/PopularCourse';
import TopMentor from '../../../../components/home/TopMentor';
import FeaturedCourse from '../../../../components/home/featuredCourse';
import Sloka from '../../../../components/home/Sloka';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { getPointsHistory } from '../../../../constants/api/apiHome';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const [userName, setUserName] = useState('');
  const [earningPoints, setEarningPoints] = useState(0);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');

      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserName(parsedData);
      }

      const pointsData = await getPointsHistory();

      const totalPoints = pointsData.reduce((total, item) => {
        return total + Number(item.points || 0);
      }, 0);

      setEarningPoints(totalPoints);

    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  fetchUserData();
}, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: 40, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Top Header */}
        <View style={styles.topContainer}>
          <Image
            source={{
              uri: 'https://www.icon0.com/free/static2/preview2/stock-photo-little-boy-faces-children-avatar-people-icon-character-cartoon-32990.jpg',
            }}
            style={styles.profileImage}
          />

          <View style={styles.middleContainer}>
            <Text 
              style={styles.userNameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {userName?.name || 'Guest'}
            </Text>

            <TouchableOpacity
              style={styles.premiumButton}
              onPress={() => router.push('/payment/billing')}
            >
              <Text style={styles.premiumButtonText}>
                👑 Upgrade Premium
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightHeaderContainer}>
            {/* <FontAwesome
              name="bell"
              size={20}
              color="black"
            /> */}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>

          <View style={styles.earningContainer}>
            <Image
              source={{
                uri: 'https://img.freepik.com/premium-vector/bitcoin-investing-flat-vector-illustration-banner_128772-693.jpg',
              }}
              style={styles.statImage}
            />

            <View>
              <Text style={styles.statText}>
{earningPoints}
              </Text>

              <Text style={styles.statLabel}>
                Earning Points
              </Text>
            </View>
          </View>

          <View style={styles.earningContainer}>
            <Image
              source={{
                uri: 'https://img.freepik.com/premium-vector/achievement-trophy-flat-vector-illustration-banner_128772-725.jpg',
              }}
              style={styles.statImage}
            />

            <View>
              <Text style={styles.statText}>420</Text>

              <Text style={styles.statLabel}>
                Ranks
              </Text>
            </View>
          </View>

        </View>

        {/* Existing Components */}
        <Banner />
        {/* <Sloka /> */}
        <PopularCourse />
        {/* <Banner /> */}
        <FeaturedCourse />

      </ScrollView>

      {/* Floating Action Button - Start Your Test */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/classes')}
        activeOpacity={0.85}
      >
        <View style={styles.fabLabel}>
          <Text style={styles.fabText}>Start Your Test</Text>
        </View>

        <View style={styles.fabCircle}>
          <AntDesign name="plus" size={28} color="#FFF" />
        </View>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginBottom: 3,
    marginTop: 10,
  },

  profileImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 50,
    backgroundColor: COLOR.background,
  },

  middleContainer: {
    flex: 1,
    marginLeft: width * 0.03,
    justifyContent: 'center',
  },

  userNameText: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.045,
    color: '#000',
  },

  premiumButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 8,
    shadowColor: '#7C3AED',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  premiumButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'roboto-bold',
    letterSpacing: 0.3,
  },

  rightHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 8,
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

  // Floating Action Button Styles - Start Your Test
  fab: {
    position: 'absolute',
    bottom: 5,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  fabLabel: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  fabCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },

  fabText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: 'roboto-bold',
  },

  /* Payment Card Styles */

  paymentContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },

  paymentTitle: {
    fontSize: 22,
    fontFamily: 'roboto-bold',
    marginBottom: 15,
  },

  paymentCard: {
    backgroundColor: '#7C3AED',
    padding: 20,
    borderRadius: 25,
  },

  courseTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'roboto-bold',
  },

  courseSubtitle: {
    color: '#E9D5FF',
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'roboto',
  },

  paymentImage: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    marginTop: 20,
  },

  priceText: {
    color: 'white',
    fontSize: 35,
    fontFamily: 'roboto-bold',
    marginTop: 20,
  },

  buyButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 20,
  },

  buyButtonText: {
    textAlign: 'center',
    color: '#7C3AED',
    fontSize: 18,
    fontFamily: 'roboto-bold',
  },

});