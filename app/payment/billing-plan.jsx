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
import RazorpayCheckout from "react-native-razorpay";

import {
  getAllPlans,
  createPaymentOrder,
  verifyPayment,
} from "../../constants/api/apiPayment";

export default function BillingPlanScreen() {
  const [plans, setPlans] = useState({ monthly: [], yearly: [] });
  const [activeTab, setActiveTab] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getAllPlans();

      if (response?.monthly) {
        setPlans(response);
      } else if (response?.data?.monthly) {
        setPlans(response.data);
      } else {
        setPlans({ monthly: [], yearly: [] });
      }
    } catch (error) {
      console.log("Plans Error:", error?.response?.data || error.message);
      setPlans({ monthly: [], yearly: [] });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (plan) => {
    try {
      setPaymentLoading(true);

      console.log("1. Gateway API calling...");
      const orderData = await createPaymentOrder(plan.price_per_month);
      console.log("2. Gateway API response:", orderData);

      const options = {
        key: orderData.razorpay_key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        order_id: orderData.razorpay_order_id,
        name: "Education App",
        description: `${plan.duration} Plan`,
        prefill: {
          name: "Student",
          email: "student@gmail.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      console.log("3. Razorpay opening...");
      const paymentResponse = await RazorpayCheckout.open(options);
      console.log("4. Razorpay success response:", paymentResponse);

      console.log("5. Verify API calling...");
      const verification = await verifyPayment({
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        plan,
      });

      console.log("6. Verify API response:", verification);

      if (verification?.status === "success" || verification?.message) {
        console.log("✅ Payment Verified Successfully");
        router.push("/payment/success");
      } else {
        console.log("❌ Verification Failed");
        router.push("/payment/failed");
      }
    } catch (error) {
      console.log("Payment Error:", error?.message);
      console.log("BACKEND ERROR:", error?.response?.data);
      router.push("/payment/failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const activePlans = plans[activeTab] || [];

  // FAQ Data - Dynamic, can come from API
  const faqData = [
    {
      id: 1,
      question: "Can I change plans later?",
      answer: "Yes, your subscription gives access based on your selected plan.",
    },
    {
      id: 2,
      question: "Do I get all courses?",
      answer: "Yes, your subscription gives access based on your selected plan.",
    },
    {
      id: 3,
      question: "Are mock tests included?",
      answer: "Yes, your subscription gives access based on your selected plan.",
    },
    {
      id: 4,
      question: "Will I get certificate access?",
      answer: "Yes, your subscription gives access based on your selected plan.",
    },
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ===== HEADER ===== */}
        <View style={styles.header}>

          {/* <Text style={styles.headerTitle}>Choose Your Plan</Text> */}
          <Text style={styles.headerTitle}>Make your payment</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.headerSubtitle}>
          Select one subscription and unlock all courses, tests and notes
        </Text>

        {/* ===== TAB TOGGLE ===== */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "monthly" && styles.activeTabButton]}
            onPress={() => setActiveTab("monthly")}
          >
            <Text style={[styles.tabText, activeTab === "monthly" && styles.activeTabText]}>
              Monthly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "yearly" && styles.activeTabButton]}
            onPress={() => setActiveTab("yearly")}
          >
            <Text style={[styles.tabText, activeTab === "yearly" && styles.activeTabText]}>
              Yearly
            </Text>
          </TouchableOpacity>
        </View>

        {/* ===== PLANS ===== */}
        {loading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} />
        ) : activePlans.length > 0 ? (
          activePlans.map((plan, index) => (
            <View key={plan.id || index} style={[styles.planCard, index === 0 && styles.popularCard]}>
              {index === 0 && (
                <View style={styles.popularBadge}>
                  <Ionicons name="star" size={12} color="#fff" />
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}

              <Text style={styles.planName}>{plan.duration} Plan</Text>
              <Text style={styles.planDescription}>
                {plan.ideal_for || "Best plan for students"}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{plan.price_per_month}</Text>
                <Text style={styles.duration}>/ {plan.duration}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.featuresBox}>
                {plan?.key_features?.length > 0 ? (
                  plan.key_features.map((feature, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Ionicons name="checkmark-circle" size={18} color="#4F46E5" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))
                ) : (
                  <>
                    {["All Courses", "Mock Tests", "Notes Included", "Certificate Access"].map((feature, i) => (
                      <View key={i} style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={18} color="#4F46E5" />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </>
                )}
              </View>

              <TouchableOpacity
                style={[styles.subscribeButton, paymentLoading && styles.disabledButton]}
                onPress={() => handlePayment(plan)}
                disabled={paymentLoading}
              >
                <Text style={styles.subscribeText}>
                  {paymentLoading ? "Processing..." : "Get Started"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No {activeTab} plans available at the moment.</Text>
        )}

        {/* ===== FAQ SECTION ===== */}
        <View style={styles.faqCard}>
          <View style={styles.faqHeader}>
            <Ionicons name="help-circle" size={22} color="#4F46E5" />
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          </View>

          {faqData.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestionBtn}
                onPress={() => toggleFAQ(faq.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#94A3B8"
                />
              </TouchableOpacity>

              {expandedFAQ === faq.id && (
                <View style={styles.faqAnswerWrap}>
                  <View style={styles.faqLine} />
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
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

  // ===== TAB =====
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  activeTabButton: {
    backgroundColor: "#4F46E5",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  loader: {
    marginTop: 30,
  },

  // ===== PLAN CARD =====
  planCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },

  popularCard: {
    borderWidth: 2,
    borderColor: "#4F46E5",
  },

  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  popularText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  planName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },

  planDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 10,
  },

  price: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1E293B",
  },

  duration: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },

  featuresBox: {
    gap: 8,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  featureText: {
    fontSize: 14,
    color: "#334155",
  },

  subscribeButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },

  subscribeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },

  disabledButton: {
    opacity: 0.6,
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 30,
    fontSize: 15,
    marginHorizontal: 16,
  },

  // ===== FAQ =====
  faqCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },

  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  faqTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },

  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingVertical: 10,
  },

  faqQuestionBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  faqQuestion: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E293B",
    flex: 1,
    marginRight: 10,
  },

  faqAnswerWrap: {
    flexDirection: "row",
    marginTop: 6,
  },

  faqLine: {
    width: 3,
    backgroundColor: "#4F46E5",
    borderRadius: 2,
    marginRight: 10,
  },

  faqAnswer: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
    flex: 1,
  },
});