import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import {
  getWalletBalance,
  getWithdrawalHistory,
} from '../../constants/api/apiPayment';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#4F46E5',
  white: '#FFFFFF',
  gray: '#888888',
  lightGray: '#F8FAFC',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#1E3A8A',
};

export default function Wallet() {
  const navigation = useNavigation();

  const [balance, setBalance] = useState(0);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchBalance(),
        fetchWithdrawalHistory(),
      ]);
    } catch (error) {
      console.log('Wallet load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await getWalletBalance();
      setCurrentBalance(response.current_balance);
      console.log('WALLET BALANCE RESPONSE:', response);

      const amount =
        response?.balance ||
        response?.cashback ||
        response?.data?.balance ||
        response?.data?.cashback ||
        response?.data?.total_cashback ||
        0;

      setBalance(Number(amount));
    } catch (error) {
      console.log(
        'Balance error:',
        error?.response?.data || error.message
      );
      setBalance(0);
    }
  };

  const fetchWithdrawalHistory = async () => {
    try {
      const response = await getWithdrawalHistory();

      console.log('WITHDRAWAL HISTORY RESPONSE:', response);

      if (response?.status === true) {
        setWithdrawalHistory(response?.data || []);
      } else if (Array.isArray(response)) {
        setWithdrawalHistory(response);
      } else {
        setWithdrawalHistory(response?.data || []);
      }
    } catch (error) {
      console.log(
        'Withdrawal history error:',
        error?.response?.data || error.message
      );
      setWithdrawalHistory([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
      case 'success':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'failed':
      case 'rejected':
        return COLORS.danger;
      default:
        return COLORS.gray;
    }
  };

  const getStatusIcon = status => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
      case 'success':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'failed':
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderHistoryItem = ({ item }) => {
    const color = getStatusColor(item?.status);

    return (
      <View style={styles.historyItem}>
        <View style={styles.historyLeft}>
          <View style={[styles.historyIcon, { backgroundColor: color + '20' }]}>
            <Ionicons
              name={getStatusIcon(item?.status)}
              size={22}
              color={color}
            />
          </View>

          <View>
            <Text style={styles.historyAmount}>
              ₹{item?.amount || 0}
            </Text>

            <Text style={styles.historyBank}>
              {item?.bank_name || 'Withdrawal Request'}
            </Text>
          </View>
        </View>

        <View style={styles.historyRight}>
          <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.statusText, { color }]}>
              {item?.status || 'Pending'}
            </Text>
          </View>

          <Text style={styles.historyDate}>
            {item?.requested_at
              ? new Date(item.requested_at).toLocaleDateString()
              : item?.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : ''}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 🔵 GRADIENT HEADER */}
        <LinearGradient
          colors={['#4F46E5', '#6D28D9', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Decorative Circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>My Wallet</Text>

            <View style={styles.headerRight} />
          </View>

          {/* 💰 BALANCE CARD (Gradient ke andar) */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceIconBox}>
              <Ionicons name="wallet" size={22} color="#4F46E5" />
            </View>

            <Text style={styles.balanceLabel}>Available Balance</Text>

            <Text style={styles.balanceAmount}>
              ₹{currentBalance ?? 0}
            </Text>

            <View style={styles.balanceFooter}>
              <Ionicons name="shield-checkmark" size={12} color="rgba(255,255,255,0.85)" />
              <Text style={styles.balanceFooterText}>Safe & Secure</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 📋 HISTORY CARD */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <View style={styles.historyHeaderLeft}>
              <View style={styles.historyTitleIcon}>
                <Ionicons name="time" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.historyTitle}>Withdrawal History</Text>
            </View>

            <View style={styles.historyCountBadge}>
              <Text style={styles.historyCount}>
                {withdrawalHistory.length}
              </Text>
            </View>
          </View>

          <View style={styles.historyList}>
            {withdrawalHistory.length > 0 ? (
              <FlatList
                data={withdrawalHistory}
                renderItem={renderHistoryItem}
                keyExtractor={(item, index) =>
                  item?.id?.toString() || index.toString()
                }
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyHistory}>
                <View style={styles.emptyIconBox}>
                  <Ionicons name="receipt-outline" size={45} color="#4F46E5" />
                </View>
                <Text style={styles.emptyHistoryText}>
                  No withdrawal history found
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  centerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'roboto',
  },

  // 🔵 HEADER GRADIENT
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },

  decorCircle1: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 17,
    fontFamily: 'roboto-bold',
    color: '#fff',
  },

  headerRight: {
    width: 38,
  },

  // 💰 BALANCE CARD
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginTop: 22,
    padding: 22,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    zIndex: 2,
  },

  balanceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  balanceLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontFamily: 'roboto',
  },

  balanceAmount: {
    color: '#fff',
    fontSize: 38,
    fontFamily: 'roboto-bold',
    marginTop: 4,
  },

  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },

  balanceFooterText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontFamily: 'roboto',
  },

  // 📋 HISTORY CARD
  historyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -40,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 3,
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  historyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  historyTitleIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  historyTitle: {
    fontSize: 15,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
  },

  historyCountBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 32,
    alignItems: 'center',
  },

  historyCount: {
    fontSize: 13,
    fontFamily: 'roboto-bold',
    color: '#4F46E5',
  },

  historyList: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },

  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  historyAmount: {
    fontSize: 15,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
  },

  historyBank: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'roboto',
  },

  historyRight: {
    alignItems: 'flex-end',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  statusText: {
    fontSize: 10,
    fontFamily: 'roboto-bold',
  },

  historyDate: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    fontFamily: 'roboto',
  },

  // 🚫 Empty State
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  emptyHistoryText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'roboto',
  },
});