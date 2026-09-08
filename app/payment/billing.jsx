import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { myPayments } from "../../constants/api/apiPayment";

export default function BillingScreen() {
  const [loading, setLoading] = useState(false);
  const [paymentsData, setPaymentsData] = useState([]);

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      const response = await myPayments();

      if (response?.payments) {
        setPaymentsData(response.payments);
      } else if (Array.isArray(response)) {
        setPaymentsData(response);
      } else {
        setPaymentsData([]);
      }
    } catch (error) {
      console.log("Payment History Error:", error);
      setPaymentsData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Dummy data for subscription (will be dynamic from API)
  const subscriptionData = {
    plan_name: "Premium",
    amount: "499",
    status: "active",
    renewal_date: "2026-10-15",
  };

  const isActive = subscriptionData.status === "active";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ===== HEADER ===== */}
        <View style={styles.header}>

          <Text style={styles.headerTitle}>Billing</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.headerSubtitle}>Manage your subscription and payment history</Text>

        {/* ===== SUBSCRIPTION CARD ===== */}
        <View style={styles.subscriptionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="school-outline" size={22} color="#4F46E5" />
            </View>
            <Text style={styles.cardTitle}>Subscription Settings</Text>
          </View>

          <View style={styles.planRow}>
            <Text style={styles.planLabel}>Current Plan:</Text>
            <Text style={styles.planName}>{subscriptionData.plan_name}</Text>
            <View style={[styles.statusBadge, isActive ? styles.activeBadge : styles.inactiveBadge]}>
              <Text style={[styles.statusText, isActive ? styles.activeText : styles.inactiveText]}>
                {isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          <Text style={styles.billingText}>
            Next billing date: {subscriptionData.renewal_date ? formatDate(subscriptionData.renewal_date) : "No active subscription"}
          </Text>

          <TouchableOpacity
            style={styles.changePlanButton}
            onPress={() => router.push("/payment/billing-plan")}
          >
            <Text style={styles.changePlanText}>Change Plan</Text>
          </TouchableOpacity>
        </View>

        {/* ===== PAYMENT HISTORY ===== */}
        <View style={styles.historyCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="receipt-outline" size={22} color="#4F46E5" />
            </View>
            <Text style={styles.cardTitle}>Invoice History</Text>
            {paymentsData.length > 0 && (
              <Text style={styles.historyCount}>{paymentsData.length} transactions</Text>
            )}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} />
          ) : paymentsData.length > 0 ? (
            <>
              {paymentsData.map((payment, index) => (
                <View key={payment.order_id || index} style={styles.paymentItem}>
                  <View style={styles.paymentLeft}>
                    <View style={[
                      styles.paymentIcon,
                      payment.status === true ? styles.paidIcon : styles.pendingIcon
                    ]}>
                      <Ionicons
                        name={payment.status === true ? "checkmark" : "time"}
                        size={14}
                        color="#fff"
                      />
                    </View>
                    <View>
                      <Text style={styles.paymentDate}>
                        {formatDate(payment.created_at)}
                      </Text>
                      <Text style={styles.paymentMethod}>
                        {payment.method || "N/A"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.paymentRight}>
                    <Text style={styles.paymentAmount}>
                      {payment.currency || "₹"} {Number(payment.amount || 0).toFixed(2)}
                    </Text>
                    <View style={[
                      styles.statusTag,
                      payment.status === true ? styles.paidTag : styles.pendingTag,
                    ]}>
                      <Text style={[
                        styles.statusTagText,
                        payment.status === true ? styles.paidTagText : styles.pendingTagText,
                      ]}>
                        {payment.status === true ? "Paid" : "Pending"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total Payments: {paymentsData.length}</Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyHistory}>
              <Ionicons name="receipt-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No payment history found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },

  scrollContent: {
    paddingBottom: 30,
  },

  // ===== HEADER =====
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 8,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  // ===== SUBSCRIPTION CARD =====
  subscriptionCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },

  planRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },

  planLabel: {
    fontSize: 15,
    color: "#6B7280",
  },

  planName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },

  activeBadge: {
    backgroundColor: "#DCFCE7",
  },

  inactiveBadge: {
    backgroundColor: "#FEE2E2",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  activeText: {
    color: "#15803D",
  },

  inactiveText: {
    color: "#DC2626",
  },

  billingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  changePlanButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },

  changePlanText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },

  // ===== HISTORY CARD =====
  historyCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },

  historyCount: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: "auto",
    fontWeight: "500",
  },

  loader: {
    marginVertical: 20,
  },

  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  paymentIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  paidIcon: {
    backgroundColor: "#22C55E",
  },

  pendingIcon: {
    backgroundColor: "#F59E0B",
  },

  paymentDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },

  paymentMethod: {
    fontSize: 12,
    color: "#6B7280",
    textTransform: "capitalize",
  },

  paymentRight: {
    alignItems: "flex-end",
  },

  paymentAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 2,
  },

  paidTag: {
    backgroundColor: "#DCFCE7",
  },

  pendingTag: {
    backgroundColor: "#FEF3C7",
  },

  statusTagText: {
    fontSize: 10,
    fontWeight: "600",
  },

  paidTagText: {
    color: "#15803D",
  },

  pendingTagText: {
    color: "#D97706",
  },

  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  totalText: {
    fontSize: 13,
    color: "#6B7280",
  },

  emptyHistory: {
    alignItems: "center",
    paddingVertical: 24,
  },

  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 6,
  },
});