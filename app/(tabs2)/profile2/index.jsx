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
} from 'react-native';

import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { COLOR } from '../../../constants/Colors';
import { getWalletBalance } from '../../../constants/api/apiPayment';

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
        <ActivityIndicator size="large" color={COLOR.background} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={COLOR.white} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('screen/myProfileScreen')}
          >
            <MaterialCommunityIcons
              name="square-edit-outline"
              size={24}
              color={COLOR.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileBox}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />

          <Text style={styles.name}>
            {teacher?.name || teacher?.full_name || 'Teacher Name'}
          </Text>

          <Text style={styles.phone}>
            {teacher?.mobile || 'No Phone'}
          </Text>

          <Text style={styles.address}>
            {teacher?.address || 'No Address'}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              👨‍🏫 {teacher?.role || 'Teacher'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('screen/myProfileScreen')}
          >
            <View style={styles.row}>
              <FontAwesome5
                name="user-alt"
                size={22}
                color={COLOR.background}
              />
              <Text style={styles.cardText}>My Profile</Text>
            </View>

            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('refer-earn')}
          >
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="gift-outline"
                size={22}
                color={COLOR.background}
              />

              <View>
                <Text style={styles.cardText}>Refer & Earn</Text>
                <Text style={styles.subText}>Earn ₹500 per referral</Text>
              </View>
            </View>

            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>

<TouchableOpacity 
  style={styles.profileCard}
  onPress={() => navigation.navigate('screen/Wallet')}  // ← YEH ADD KARO
>
  <View style={styles.row}>
    <Entypo name="wallet" size={22} color={COLOR.background} />
    <View>
      <Text style={styles.cardText}>My Wallet</Text>
      <Text style={styles.walletText}>Balance: ₹{walletBalance}</Text>
    </View>
  </View>
  <FontAwesome name="angle-right" size={24} color={COLOR.background} />
</TouchableOpacity>

          <TouchableOpacity style={styles.profileCard}>
            <View style={styles.row}>
              <Entypo name="lock" size={22} color={COLOR.background} />
              <Text style={styles.cardText}>Change Password</Text>
            </View>

            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileCard} onPress={handleShare}>
            <View style={styles.row}>
              <FontAwesome name="share-alt" size={22} color={COLOR.background} />
              <Text style={styles.cardText}>Share App</Text>
            </View>

            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileCard} onPress={handleLogout}>
            <View style={styles.row}>
              <MaterialIcons name="logout" size={22} color={COLOR.background} />
              <Text style={styles.cardText}>Logout</Text>
            </View>

            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
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
  },

  header: {
    backgroundColor: COLOR.background,
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  profileBox: {
    alignItems: 'center',
    marginTop: 20,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },

  name: {
    color: COLOR.white,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },

  phone: {
    color: COLOR.white,
    textAlign: 'center',
    marginTop: 4,
  },

  address: {
    color: COLOR.white,
    textAlign: 'center',
    marginTop: 4,
    fontSize: 13,
  },

  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },

  badgeText: {
    color: COLOR.white,
    fontSize: 12,
    fontWeight: '500',
  },

  scrollView: {
    flex: 1,
  },

  cardContainer: {
    padding: 20,
    gap: 12,
  },

  profileCard: {
    flexDirection: 'row',
    backgroundColor: COLOR.white,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },

  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  subText: {
    fontSize: 12,
    color: '#EA580C',
    marginTop: 2,
  },

  walletText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
  },
});