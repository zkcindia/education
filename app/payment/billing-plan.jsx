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
          color: "#EA580C",
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Select one subscription and unlock all courses, tests and notes
          </Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "monthly" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("monthly")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "monthly" && styles.activeTabText,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "yearly" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("yearly")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "yearly" && styles.activeTabText,
              ]}
            >
              Yearly
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#EA580C"
            style={{ marginTop: 40 }}
          />
        ) : activePlans.length > 0 ? (
          activePlans.map((plan, index) => (
            <View key={plan.id || index} style={styles.planCard}>
              <Text style={styles.planName}>{plan.duration} Plan</Text>

              <Text style={styles.planDescription}>
                {plan.ideal_for || "Best plan for students"}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{plan.price_per_month}</Text>
                <Text style={styles.duration}>/ {plan.duration}</Text>
              </View>

              <View style={styles.featuresBox}>
                {plan?.key_features?.length > 0 ? (
                  plan.key_features.map((feature, i) => (
                    <Text key={i} style={styles.featureText}>
                      ✅ {feature}
                    </Text>
                  ))
                ) : (
                  <>
                    <Text style={styles.featureText}>✅ All Courses</Text>
                    <Text style={styles.featureText}>✅ Mock Tests</Text>
                    <Text style={styles.featureText}>✅ Notes Included</Text>
                    <Text style={styles.featureText}>✅ Certificate Access</Text>
                  </>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.getStartedButton,
                  paymentLoading && styles.disabledButton,
                ]}
                onPress={() => handlePayment(plan)}
                disabled={paymentLoading}
              >
                <Text style={styles.getStartedText}>
                  {paymentLoading ? "Processing..." : "Get Started"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            No {activeTab} plans available at the moment.
          </Text>
        )}

        <View style={styles.faqBox}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

          {[
            "Can I change plans later?",
            "Do I get all courses?",
            "Are mock tests included?",
            "Will I get certificate access?",
          ].map((question, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.question}>{question}</Text>
              <Text style={styles.answer}>
                Yes, your subscription gives access based on your selected plan.
              </Text>
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
    backgroundColor: "#F9FAFB",
  },

  topBar: {
    paddingHorizontal: 20,
    paddingTop: 45,
  },

  backText: {
    color: "#EA580C",
    fontSize: 16,
    fontWeight: "700",
  },

  header: {
    paddingHorizontal: 20,
    marginTop: 28,
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    gap: 12,
  },

  tabButton: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 10,
  },

  activeTabButton: {
    backgroundColor: "#EA580C",
  },

  tabText: {
    color: "#374151",
    fontWeight: "700",
  },

  activeTabText: {
    color: "#fff",
  },

  planCard: {
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    elevation: 4,
  },

  planName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },

  planDescription: {
    color: "#6B7280",
    marginTop: 8,
    fontSize: 15,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 20,
  },

  price: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#111827",
  },

  duration: {
    color: "#6B7280",
    marginLeft: 5,
    marginBottom: 7,
  },

  featuresBox: {
    marginTop: 22,
  },

  featureText: {
    color: "#374151",
    fontSize: 15,
    marginBottom: 12,
  },

  getStartedButton: {
    backgroundColor: "#EA580C",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
  },

  disabledButton: {
    opacity: 0.6,
  },

  getStartedText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 40,
    fontSize: 16,
  },

  faqBox: {
    marginHorizontal: 20,
    marginTop: 35,
    marginBottom: 40,
  },

  faqTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 15,
  },

  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 14,
  },

  question: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  answer: {
    color: "#6B7280",
    marginTop: 6,
  },
});