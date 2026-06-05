import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOR } from '../../../constants/Colors';
import { getWalletBalance } from '../../../constants/api/apiPayment';

export default function Index() {
  const router = useRouter();
  const [teacher, setTeacher] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacherData();
    loadWalletBalance();
  }, []);

  const loadTeacherData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        setTeacher(parsed);
      }
    } catch (error) {
      console.log("Error loading teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const data = await getWalletBalance();
      setWalletBalance(Number(data.current_balance || 0));
    } catch (error) {
      console.log("Wallet error:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('access');
            await AsyncStorage.removeItem('refresh');
            router.replace('/screen1');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLOR.background} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={{ backgroundColor: COLOR.background, padding: 20, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={COLOR.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile2/my-profile')}>
            <MaterialCommunityIcons name="square-edit-outline" size={24} color={COLOR.white} />
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: "auto", justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Image
            source={{ uri: teacher?.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
            style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' }}
          />
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <Text style={{ color: COLOR.white, fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
              {teacher?.full_name || "Teacher Name"}
            </Text>
            <Text style={{ color: COLOR.white, textAlign: 'center', marginTop: 4 }}>
              {teacher?.mobile || "No Phone"}
            </Text>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 }}>
              <Text style={{ color: COLOR.white, fontSize: 12, fontWeight: '500' }}>👨‍🏫 Teacher</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, gap: 12 }}>

          {/* My Profile */}
          <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/profile2/my-profile')}>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
              <FontAwesome5 name="user-alt" size={22} color={COLOR.background} />
              <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>My Profile</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>

          {/* Refer & Earn */}
          <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/profile2/refer-earn')}>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
              <MaterialCommunityIcons name="gift-outline" size={22} color={COLOR.background} />
              <View>
                <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>Refer & Earn</Text>
                <Text style={{ fontSize: 12, color: '#EA580C', marginTop: 2 }}>Earn ₹500 per referral</Text>
              </View>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>

          {/* My Wallet */}
          <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/profile2/my-wallet')}>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
              <Entypo name="wallet" size={22} color={COLOR.background} />
              <View>
                <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>My Wallet</Text>
                <Text style={{ fontSize: 12, color: '#10B981', marginTop: 2 }}>Balance: ₹{walletBalance}</Text>
              </View>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/profile2/change-password')}>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
              <Entypo name="lock" size={22} color={COLOR.background} />
              <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>Change Password</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>

          {/* Share App */}
          <TouchableOpacity style={styles.profileCard}>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
              <FontAwesome name="share-alt" size={22} color={COLOR.background} />
              <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>Share App</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.profileCard} onPress={handleLogout}>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
              <MaterialIcons name="logout" size={22} color={COLOR.background} />
              <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>Logout</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    backgroundColor: COLOR.white,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  }
});