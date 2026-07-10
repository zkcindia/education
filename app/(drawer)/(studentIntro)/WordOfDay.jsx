import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { fetchSloka } from "../../../constants/api/apiHome"; // Import the API function

const { width, height } = Dimensions.get("window");

export default function WordOfDay() {
  const [sentenceData, setSentenceData] = useState({
    title: "Word of the Day",
    description: "",
    sloka: "",
    meaning: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSlokaData();
  }, []);

  const loadSlokaData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchSloka();
      
      if (response && response.data) {
        // Assuming API returns data in this structure
        // Adjust based on your actual API response structure
        setSentenceData({
          // title: response.data.title || "Word of the Day",
          description: response.data.description || response.data.sloka || "",
          sloka: response.data.sloka || "",
          meaning: response.data.meaning || "",
        });
      } else {
        // Fallback data if API fails
        setSentenceData({
          title: "Word of the Day",
          description: "Learning something new every day makes you stronger than yesterday. Keep growing and never stop learning!",
          sloka: "",
          meaning: "",
        });
      }
    } catch (error) {
      console.error("Error fetching sloka:", error);
      setError("Failed to load today's sloka. Please try again.");
      // Set fallback data
      setSentenceData({
        title: "Word of the Day",
        description: "Learning something new every day makes you stronger than yesterday. Keep growing and never stop learning!",
        sloka: "",
        meaning: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.push("/(drawer)/(studentIntro)/SpecialDay");
  };

  // Render different content based on API response
  const renderContent = () => {
    if (sentenceData.sloka) {
      // If API returns sloka with meaning
      return (
        <>
          <Animatable.View
            animation="bounceIn"
            delay={800}
            style={styles.imageContainer}
          >
            <Image
              source={require("../../../assets/images/Isolation_Mode.png")}
              style={styles.image}
            />
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            delay={1000}
            style={styles.messageContainer}
          >
            <Text style={styles.title}>{sentenceData.title}</Text>
            
            <Animatable.Text
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              style={styles.slokaText}
            >
              {sentenceData.sloka}
            </Animatable.Text>

            {sentenceData.meaning && (
              <Text style={styles.meaningText}>
                Meaning: {sentenceData.meaning}
              </Text>
            )}
          </Animatable.View>
        </>
      );
    } else {
      // If API returns description (fallback or different format)
      return (
        <>
          <Animatable.View
            animation="bounceIn"
            delay={800}
            style={styles.imageContainer}
          >
            <Image
              source={require("../../../assets/images/Isolation_Mode.png")}
              style={styles.image}
            />
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            delay={1000}
            style={styles.messageContainer}
          >
            <Text style={styles.title}>{sentenceData.title}</Text>

            <Animatable.Text
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              style={styles.message}
            >
              {sentenceData.description}
            </Animatable.Text>
          </Animatable.View>
        </>
      );
    }
  };

  return (
    <LinearGradient colors={["#89f7fe", "#66a6ff"]} style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        delay={300}
        style={styles.headingContainer}
      >
        <Text style={styles.headingText}>Word of the Day</Text>
      </Animatable.View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#003096" />
          <Text style={styles.loadingText}>Loading today's wisdom...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSlokaData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderContent()
      )}

      <Animatable.View
        animation="fadeInUp"
        delay={1500}
        style={styles.buttonContainer}
      >
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
    paddingTop: height * 0.05,
    justifyContent: "center",
  },
  headingContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  headingText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#003096",
  },
  imageContainer: {
    marginTop: height * 0.03,
    alignItems: "center",
  },
  image: {
    width: width * 0.7,
    height: height * 0.25,
    resizeMode: "contain",
    borderRadius: 10,
  },
  messageContainer: {
    marginTop: height * 0.04,
    paddingHorizontal: width * 0.05,
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: "#003096",
    marginBottom: height * 0.015,
    textAlign: "center",
  },
  message: {
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#555",
    fontStyle: "italic",
    lineHeight: height * 0.03,
  },
  slokaText: {
    fontSize: width * 0.05,
    textAlign: "center",
    color: "#003096",
    fontWeight: "bold",
    lineHeight: height * 0.035,
    marginBottom: height * 0.02,
  },
  meaningText: {
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#555",
    lineHeight: height * 0.03,
    marginTop: height * 0.01,
  },
  buttonContainer: {
    marginTop: height * 0.08,
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#003096",
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.18,
    borderRadius: 10,
    marginTop: 20,
  },
  continueText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
    textAlign: "center",
  },
  centerBox: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: height * 0.35,
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: "#003096",
  },
  errorText: {
    fontSize: width * 0.04,
    color: "#ff0000",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  retryButton: {
    backgroundColor: "#003096",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});