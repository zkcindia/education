import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Feather, FontAwesome, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOR } from '../../../constants/Colors';
import Banner from '../../../components/home/Banner';
import PopularCourse from '../../../components/home/PopularCourse';
import TopMentor from '../../../components/home/TopMentor';
import FeaturedCourse from '../../../components/home/featuredCourse';
import Sloka from '../../../components/home/Sloka';
import ClassBannerPage from '../../../components/home/ClassBannerPage';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const [userName, setUserName] = useState({ name: '', points: 0, image: '' });

  // 🎈 Floating animation (if needed later)
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔵 GRADIENT HEADER */}
        <LinearGradient
          colors={['#4F46E5', '#6D28D9', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* 🎨 Decorative Circles (Bade) */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <View style={styles.topContainer}>
            {/* Profile Image with Ring */}
            <View style={styles.profileRing}>
              <Image
                source={{
                  uri:
                    userName?.image ||
                    'https://www.icon0.com/free/static2/preview2/stock-photo-little-boy-faces-children-avatar-people-icon-character-cartoon-32990.jpg',
                }}
                style={styles.profileImage}
              />
            </View>

            {/* Name + Subtitle */}
            <View style={styles.userNameContainer}>
              <Text style={styles.userNameText} numberOfLines={1}>
                {userName?.name || 'Guest'}
              </Text>

              <Text style={styles.userSubtitle} numberOfLines={2}>
                Manage your classes and inspire every learner 📚
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ===== STATS (Commented - as it was) ===== */}
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

        {/* ===== EXISTING COMPONENTS ===== */}
        <View style={styles.componentsWrap}>
          <Banner />
          {/* <Sloka /> */}
          <PopularCourse />
          {/* <Banner /> */}
          <ClassBannerPage />
          {/* <FeaturedCourse /> */}
          <TopMentor />
          {/* <Banner /> */}
        </View>
      </ScrollView>

      {/* 🔘 FLOATING ACTION BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/screen/QuestionUpload')}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#7C3AED', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Text style={styles.fabText}>Add Questions</Text>
          <View style={styles.fabCircle}>
            <AntDesign name="plus" size={22} color="#7C3AED" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // 🔵 GRADIENT HEADER
  headerGradient: {
    paddingTop: height * 0.08,
    paddingBottom: 25,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },

  // 🎨 Decorative Circles (Bade kiye)
  decorCircle1: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -110,
    left: -90,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  // Top Row
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },

  // Profile Image with Ring
  profileRing: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.065,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  profileImage: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.055,
    backgroundColor: '#fff',
  },

  // Text Container
  userNameContainer: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  userNameText: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.05,
    color: '#fff',
  },
  userSubtitle: {
    fontFamily: 'roboto',
    fontSize: width * 0.03,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    lineHeight: 16,
  },

  // ===== STATS (Styles kept - as it was) =====
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

  // ===== COMPONENTS WRAPPER =====
  componentsWrap: {
    paddingTop: 10,
  },

  // 🔘 FLOATING ACTION BUTTON
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
  },
  fabText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'roboto-bold',
    marginRight: 10,
  },
  fabCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});