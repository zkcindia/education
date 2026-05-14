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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Billing</Text>
          <Text style={styles.subtitle}>
            Manage your subscription and payment history
          </Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🎓</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Education App</Text>

            <View style={styles.infoRow}>
              <View>
                <Text style={styles.label}>Current Plan</Text>
                <Text style={styles.planBadge}>Free / Premium</Text>
              </View>

              <View>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.subscriptionCard}>
          <Text style={styles.cardTitle}>Subscription Settings</Text>

          <Text style={styles.currentPlan}>
            Current Plan: <Text style={styles.orangeText}>Free</Text>
          </Text>

          <Text style={styles.billingText}>
            Next billing date: No active subscription
          </Text>

          <TouchableOpacity
            style={styles.changePlanButton}
            onPress={() => router.push("/payment/billing-plan")}
          >
            <Text style={styles.changePlanText}>Change Plan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.invoiceCard}>
          <Text style={styles.cardTitle}>Invoice History</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#EA580C" style={{ marginTop: 30 }} />
          ) : paymentsData.length > 0 ? (
            paymentsData.map((payment, index) => (
              <View key={payment.order_id || index} style={styles.paymentItem}>
                <View>
                  <Text style={styles.paymentDate}>
                    {formatDate(payment.created_at)}
                  </Text>
                  <Text style={styles.paymentMethod}>
                    Method: {payment.method || "N/A"}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.paymentAmount}>
                    {payment.currency || "INR"} {Number(payment.amount || 0).toFixed(2)}
                  </Text>

                  <Text
                    style={[
                      styles.statusBadge,
                      payment.status === true ? styles.paidBadge : styles.pendingBadge,
                    ]}
                  >
                    {payment.status === true ? "Paid" : "Pending"}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No payment history found</Text>
          )}

          {paymentsData.length > 0 && (
            <Text style={styles.totalText}>
              Total Payments: {paymentsData.length}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 45,
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#EF4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  backText: {
    color: "#fff",
    fontWeight: "700",
  },

  header: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#EA580C",
  },

  subtitle: {
    color: "#6B7280",
    marginTop: 6,
    fontSize: 15,
  },

  profileCard: {
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FED7AA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  avatarText: {
    fontSize: 30,
  },

  profileName: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1F2937",
  },

  infoRow: {
    flexDirection: "row",
    gap: 28,
    marginTop: 10,
  },

  label: {
    color: "#6B7280",
    fontSize: 12,
  },

  planBadge: {
    color: "#EA580C",
    fontWeight: "700",
    marginTop: 2,
  },

  activeText: {
    color: "#22C55E",
    fontWeight: "700",
    marginTop: 2,
  },

  subscriptionCard: {
    marginHorizontal: 20,
    marginTop: 22,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 15,
  },

  currentPlan: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },

  orangeText: {
    color: "#EA580C",
  },

  billingText: {
    color: "#6B7280",
    marginTop: 8,
  },

  changePlanButton: {
    backgroundColor: "#EA580C",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },

  changePlanText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  invoiceCard: {
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 35,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    elevation: 3,
  },

  paymentItem: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  paymentDate: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },

  paymentMethod: {
    color: "#6B7280",
    marginTop: 5,
    textTransform: "capitalize",
  },

  paymentAmount: {
    fontWeight: "bold",
    color: "#111827",
  },

  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "700",
  },

  paidBadge: {
    backgroundColor: "#DCFCE7",
    color: "#15803D",
  },

  pendingBadge: {
    backgroundColor: "#FFEDD5",
    color: "#C2410C",
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    paddingVertical: 25,
  },

  totalText: {
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingTop: 12,
    marginTop: 10,
    color: "#6B7280",
  },
});