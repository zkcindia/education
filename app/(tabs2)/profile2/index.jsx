import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Share,
  Dimensions,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { COLOR } from '../../../constants/Colors';
import { getWalletBalance } from '../../../constants/api/apiPayment';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Index() {
  const navigation = useNavigation();

  const [teacher, setTeacher] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacherProfile();
    loadWalletBalance();
  }, []);

  const loadTeacherProfile = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');

      if (userData) {
        const parsedUser = JSON.parse(userData);

        const response = await axios.get(
          `${API_URL}/user-data/${parsedUser.id}/`
        );

        setTeacher(response.data);
      }
    } catch (error) {
      console.log(
        'Teacher profile error:',
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const data = await getWalletBalance();
      setWalletBalance(Number(data?.current_balance || 0));
    } catch (error) {
      console.log('Wallet error:', error?.response?.data || error.message);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Download Candlelights App: https://backend.candlelights.in/',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
    navigation.navigate('screen1');
  };

  const profileImage = teacher?.image
    ? teacher.image.startsWith('http')
      ? teacher.image
      : `${API_URL}${teacher.image}`
    : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* 🔵 GRADIENT HEADER */}
        <LinearGradient
          colors={['#4F46E5', '#6D28D9', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          {/* Decorative Circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* Top Row */}
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('screen/myProfileScreen')}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="square-edit-outline"
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Profile Box */}
          <View style={styles.profileBox}>
            {/* Profile Image with Ring */}
            <View style={styles.profileRing}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            </View>

            <Text style={styles.name}>
              {teacher?.name || teacher?.full_name || 'Teacher Name'}
            </Text>

            <View style={styles.infoRow}>
              <Feather name="phone" size={12} color="rgba(255,255,255,0.85)" />
              <Text style={styles.phone}>
                {teacher?.mobile || 'No Phone'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Feather
                name="map-pin"
                size={12}
                color="rgba(255,255,255,0.85)"
              />
              <Text style={styles.address} numberOfLines={1}>
                {teacher?.address || 'No Address'}
              </Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                👨‍🏫 {teacher?.role || 'Teacher'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* 📋 CARDS */}
        <View style={styles.cardContainer}>
          {/* My Profile */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('screen/myProfileScreen')}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name="user-alt" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.cardText}>My Profile</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#4F46E5" />
          </TouchableOpacity>

          {/* Refer & Earn */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('refer-earn')}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons
                  name="gift-outline"
                  size={18}
                  color="#F59E0B"
                />
              </View>
              <View>
                <Text style={styles.cardText}>Refer & Earn</Text>
                <Text style={styles.subText}>Earn ₹500 per referral</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={22} color="#4F46E5" />
          </TouchableOpacity>

          {/* My Wallet */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('screen/Wallet')}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Entypo name="wallet" size={18} color="#10B981" />
              </View>
              <View>
                <Text style={styles.cardText}>My Wallet</Text>
                <Text style={styles.walletText}>
                  Balance: ₹{walletBalance}
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={22} color="#4F46E5" />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.profileCard}>
            <View style={styles.row}>
              <Entypo name="lock" size={22} color={COLOR.background} />
              <Text style={styles.cardText}>Change Password</Text>
            </View>

            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity> */}

          {/* Share App */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
                <FontAwesome name="share-alt" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.cardText}>Share App</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#4F46E5" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.profileCard, styles.logoutCard]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <MaterialIcons name="logout" size={18} color="#DC2626" />
              </View>
              <Text style={[styles.cardText, { color: '#DC2626' }]}>
                Logout
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  // 🔵 HEADER
  header: {
    paddingTop: 45,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },

  // Decorative Circles
  decorCircle1: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileBox: {
    alignItems: 'center',
    marginTop: 18,
    zIndex: 2,
  },

  // Profile Image Ring
  profileRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  profileImage: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: '#fff',
  },

  name: {
    color: '#fff',
    fontFamily: 'roboto-bold',
    fontSize: 19,
    textAlign: 'center',
    marginTop: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },

  phone: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontFamily: 'roboto',
    fontSize: 12,
  },

  address: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontFamily: 'roboto',
    fontSize: 12,
    maxWidth: width * 0.7,
  },

  badge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'roboto-bold',
  },

  // 📋 Cards
  cardContainer: {
    padding: 16,
    gap: 10,
    marginTop: 8,
  },

  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  logoutCard: {
    backgroundColor: '#FEF2F2',
  },

  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    flex: 1,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardText: {
    fontSize: 14,
    color: '#1E3A8A',
    fontFamily: 'roboto-bold',
  },

  subText: {
    fontSize: 11,
    color: '#F59E0B',
    marginTop: 2,
    fontFamily: 'roboto',
  },

  walletText: {
    fontSize: 11,
    color: '#10B981',
    marginTop: 2,
    fontFamily: 'roboto-bold',
  },
});