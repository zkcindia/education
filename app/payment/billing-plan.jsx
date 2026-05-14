import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      console.log("Plans Error:", error);
      setPlans({ monthly: [], yearly: [] });
    } finally {
      setLoading(false);
    }
  };

const handlePayment = async (plan) => {
  try {
    console.log("✅ Gateway API calling...");

    const orderData = await createPaymentOrder(plan.price);

    console.log("✅ Gateway API response:", orderData);

    const options = {
      key: orderData.razorpay_key,
      amount: orderData.amount,
      currency: "INR",
      order_id: orderData.razorpay_order_id,
      name: "Education App",
      description: `${plan.name} Plan`,
      prefill: {
        name: "Student",
        email: "student@gmail.com",
        contact: "9999999999",
      },
      theme: {
        color: "#EA580C",
      },
    };

    const paymentResponse = await RazorpayCheckout.open(options);

    console.log("✅ Razorpay Success:", paymentResponse);

    console.log("✅ Verify Payment API calling...");

    const verification = await verifyPayment({
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_signature: paymentResponse.razorpay_signature,
      plan,
    });

    console.log("✅ Verify Payment API response:", verification);

    if (verification?.status === "success") {
      setShowSuccessModal(true);
    } else {
      router.push("/payment/failed");
    }
  } catch (error) {
    console.log("❌ Payment Error:", error);
    router.push("/payment/failed");
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
            Select the perfect plan for your learning needs
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
          <ActivityIndicator size="large" color="#EA580C" style={{ marginTop: 40 }} />
        ) : activePlans.length > 0 ? (
          activePlans.map((plan, index) => (
            <View
              key={plan.id || index}
              style={[
                styles.planCard,
                plan.featured && styles.featuredCard,
              ]}
            >
              {plan.featured && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}

              <Text
                style={[
                  styles.planName,
                  plan.featured && styles.featuredText,
                ]}
              >
                {plan.name}
              </Text>

              <Text
                style={[
                  styles.planDescription,
                  plan.featured && styles.featuredSubText,
                ]}
              >
                {plan.description || "Best plan for students"}
              </Text>

              <View style={styles.priceRow}>
                <Text
                  style={[
                    styles.price,
                    plan.featured && styles.featuredText,
                  ]}
                >
                  ₹{plan.price}
                </Text>

                <Text
                  style={[
                    styles.duration,
                    plan.featured && styles.featuredSubText,
                  ]}
                >
                  / {plan.duration || activeTab}
                </Text>
              </View>

              <View style={styles.featuresBox}>
                {plan?.features?.length > 0 ? (
                  plan.features.map((feature, i) => (
                    <Text
                      key={i}
                      style={[
                        styles.featureText,
                        plan.featured && styles.featuredSubText,
                      ]}
                    >
                      ✅ {feature}
                    </Text>
                  ))
                ) : (
                  <>
                    <Text
                      style={[
                        styles.featureText,
                        plan.featured && styles.featuredSubText,
                      ]}
                    >
                      ✅ Course Access
                    </Text>
                    <Text
                      style={[
                        styles.featureText,
                        plan.featured && styles.featuredSubText,
                      ]}
                    >
                      ✅ Notes Included
                    </Text>
                    <Text
                      style={[
                        styles.featureText,
                        plan.featured && styles.featuredSubText,
                      ]}
                    >
                      ✅ Certificate
                    </Text>
                  </>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.getStartedButton,
                  plan.featured && styles.featuredButton,
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
            "Do you offer yearly discounts?",
            "What payment methods are accepted?",
            "Is there a free trial?",
          ].map((question, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.question}>{question}</Text>
              <Text style={styles.answer}>
                Yes, you can manage your plan from your billing section.
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successIcon}>✅</Text>

            <Text style={styles.successTitle}>Payment Successful!</Text>

            <Text style={styles.successSubtitle}>
              Your plan has been activated successfully.
            </Text>

            <TouchableOpacity
              style={styles.dashboardButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/");
              }}
            >
              <Text style={styles.dashboardText}>Go to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.billingButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/payment/billing");
              }}
            >
              <Text style={styles.billingButtonText}>View Billing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    position: "relative",
  },

  featuredCard: {
    backgroundColor: "#EA580C",
  },

  popularBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },

  popularText: {
    color: "#EA580C",
    fontSize: 12,
    fontWeight: "bold",
  },

  planName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },

  featuredText: {
    color: "#fff",
  },

  planDescription: {
    color: "#6B7280",
    marginTop: 8,
    fontSize: 15,
  },

  featuredSubText: {
    color: "#FFEDD5",
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

  featuredButton: {
    backgroundColor: "#111827",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  successModal: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },

  successIcon: {
    fontSize: 70,
  },

  successTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 18,
  },

  successSubtitle: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
  },

  dashboardButton: {
    backgroundColor: "#22C55E",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
  },

  dashboardText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  billingButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#EA580C",
  },

  billingButtonText: {
    color: "#EA580C",
    fontWeight: "bold",
    fontSize: 16,
  },
});