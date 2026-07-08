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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import {
  getWalletBalance,
  getWithdrawalHistory,
} from '../../constants/api/apiPayment';

const COLORS = {
  primary: '#6C63FF',
  white: '#FFFFFF',
  gray: '#888888',
  lightGray: '#F5F7FA',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  text: '#333333',
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
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Wallet</Text>

          <View style={styles.headerRight} />
        </View>

<View style={styles.balanceCard}>
  <Text style={styles.balanceLabel}>Available Balance</Text>

  <Text style={styles.balanceAmount}>
    ₹{currentBalance ?? 0}
  </Text>
</View>

        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <View style={styles.historyHeaderLeft}>
              <Ionicons name="time" size={22} color={COLORS.primary} />
              <Text style={styles.historyTitle}>Withdrawal History</Text>
            </View>

            <Text style={styles.historyCount}>
              {withdrawalHistory.length}
            </Text>
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
                <Ionicons name="receipt-outline" size={55} color="#ccc" />
                <Text style={styles.emptyHistoryText}>
                  No withdrawal history found
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: COLORS.gray,
    fontSize: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  headerRight: {
    width: 40,
  },

  balanceCard: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 26,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  balanceLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '500',
  },

  balanceAmount: {
    color: COLORS.white,
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: 8,
  },

  historyCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  historyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  historyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 10,
  },

  historyCount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },

  historyList: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
  },

  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  historyAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  historyBank: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 3,
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
    fontSize: 11,
    fontWeight: '700',
  },

  historyDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },

  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 35,
  },

  emptyHistoryText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },

  footer: {
    height: 40,
  },
});