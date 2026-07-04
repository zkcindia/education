import { View, Text, StyleSheet, Image, TextInput, SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather, FontAwesome , AntDesign } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLOR } from '../../../constants/Colors'
import Banner from '../../../components/home/Banner'
import PopularCourse from '../../../components/home/PopularCourse'
import TopMentor from '../../../components/home/TopMentor'
import FeaturedCourse from '../../../components/home/featuredCourse'
import Sloka from '../../../components/home/Sloka'
import ClassBannerPage from '../../../components/home/ClassBannerPage'
import { router } from 'expo-router'

const { width, height } = Dimensions.get('window')

export default function Index() {
  const [userName, setUserName] = useState({ name: '', points: 0 })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          console.log(parsedData, 'data');
          setUserName(parsedData); // Assuming userData has 'name' and 'points' fields
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: 40 }}
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

          <View style={styles.userNameContainer}>
            <Text style={styles.userNameText}>
              {userName?.name || 'Guest'}
            </Text>

<Text style={styles.userSubtitle}>
  Manage your classes and inspire every learner 📚
</Text>
          </View>

          {/* <View style={styles.rightHeaderContainer}>
            <TouchableOpacity
              style={styles.premiumButton}
              onPress={() => router.push('/payment/billing')}
            >
              <Text style={styles.premiumButtonText}>
                👑 upgrade Premium
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Stats */}
        {/* <View style={styles.statsContainer}>
          <View style={styles.earningContainer}>
            <Image
              source={{
                uri: 'https://img.freepik.com/premium-vector/bitcoin-investing-flat-vector-illustration-banner_128772-693.jpg',
              }}
              style={styles.statImage}
            />

            <View>
              <Text style={styles.statText}>
                {userName?.points || '0'}
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
        </View> */}

        {/* Existing Components */}
        <Banner />
        {/* <Sloka /> */}
        <PopularCourse />
        {/* <Banner /> */}
        <ClassBannerPage />
        {/* <FeaturedCourse /> */}
        <TopMentor />
        {/* <Banner /> */}
      </ScrollView>

<TouchableOpacity
  style={styles.fab}
  onPress={() => router.push('/screen/QuestionUpload')}
  activeOpacity={0.85}
>
  <View style={styles.fabLabel}>
    <Text style={styles.fabText}>Add Questions</Text>
  </View>

  <View style={styles.fabCircle}>
    <AntDesign name="plus" size={28} color="#FFF" />
  </View>
</TouchableOpacity>

    </SafeAreaView>
  )
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
    marginBottom: 20,
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

  rightHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  premiumButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
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
  },

fab: {
  position: 'absolute',
  bottom: 2,
  right: 2,
  flexDirection: 'row',
  alignItems: 'center',
},

fabLabel: {
  backgroundColor: COLOR.background,
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 18,
  marginRight: 10,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,
},

fabCircle: {
  width: 58,
  height: 58,
  borderRadius: 29,
  backgroundColor: COLOR.background,
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
  color: "#fff",
  fontFamily: 'roboto-bold',
},
})