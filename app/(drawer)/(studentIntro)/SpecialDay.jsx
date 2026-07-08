import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";
import { getSpecialDayMessage } from "../../../constants/api/apiHome"; // Import the API function

const { width, height } = Dimensions.get("window");

export default function SpecialDay() {
  const [specialDayData, setSpecialDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpecialDay();
  }, []);

  const fetchSpecialDay = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSpecialDayMessage();
      // ✅ FIX: Access the message object from response
      setSpecialDayData(response.data.message || response.data);
    } catch (error) {
      console.error("Error fetching special day:", error);
      setError("Failed to load special day");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={["#3b82f6", "#60a5fa", "#bfdbfe"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#3b82f6", "#60a5fa", "#bfdbfe"]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSpecialDay}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // ✅ Now specialDayData is the message object directly
  const dayName = specialDayData?.title || "Special Day";
  const description = specialDayData?.description || "Every day is special when you learn something new and make it count!";
  const imageUrl = specialDayData?.image_url || specialDayData?.image || specialDayData?.icon;

  return (
    <LinearGradient colors={["#3b82f6", "#60a5fa", "#bfdbfe"]} style={styles.container}>
      <Animatable.View animation="fadeInDown" delay={300} style={styles.headingContainer}>
        <Text style={styles.headingText}>Special Day</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={500} style={styles.content}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.icon}
            defaultSource={require("../../../assets/images/Layer_1.png")}
          />
        ) : (
          <Image
            source={require("../../../assets/images/Layer_1.png")}
            style={styles.icon}
          />
        )}

        <Animatable.Text animation="zoomIn" delay={700} style={styles.dayName}>
          {dayName}
        </Animatable.Text>

        <Text style={styles.description}>{description}</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={1000} style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push("/(drawer)/(studentIntro)/StudentDob")}
        >
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    paddingTop: height * 0.08,
    justifyContent: "space-between",
  },
  headingContainer: {
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  headingText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    alignItems: "center",
    marginTop: height * 0.02,
  },
  icon: {
    width: width * 0.7,
    height: height * 0.3,
    resizeMode: "contain",
    marginBottom: height * 0.03,
    borderRadius: 10,
  },
  dayName: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  description: {
    fontSize: width * 0.04,
    color: "#E0F2FE",
    textAlign: "center",
    paddingHorizontal: width * 0.05,
    lineHeight: height * 0.03,
    marginBottom: height * 0.05,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: height * 0.1,
  },
  continueButton: {
    backgroundColor: "#1e40af",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.25,
    borderRadius: 10,
  },
  continueText: {
    color: "#ffffff",
    fontSize: width * 0.045,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: width * 0.04,
    marginTop: height * 0.02,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  errorText: {
    color: "#ffffff",
    fontSize: width * 0.045,
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  retryButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});