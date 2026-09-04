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
import { fetchSloka } from "../../../constants/api/apiHome";

const { width, height } = Dimensions.get("window");

// ✅ Static fallback data with multiple options
const STATIC_WORDS = [
  {
    title: "Word of the Day",
    description: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
    sloka: "Knowledge is power",
    meaning: "The more you learn, the more you can achieve"
  },
  {
    title: "Word of the Day",
    description: "The only true wisdom is in knowing you know nothing.",
    sloka: "Stay curious",
    meaning: "Curiosity leads to continuous learning and growth"
  },
  {
    title: "Word of the Day",
    description: "Education is the most powerful weapon which you can use to change the world.",
    sloka: "Learn to lead",
    meaning: "Education empowers you to make a difference"
  },
  {
    title: "Word of the Day",
    description: "The beautiful thing about learning is that nobody can take it away from you.",
    sloka: "Learn and grow",
    meaning: "Knowledge is the only thing that stays with you forever"
  },
  {
    title: "Word of the Day",
    description: "Success is the sum of small efforts repeated day in and day out.",
    sloka: "Never give up",
    meaning: "Consistency and persistence lead to success"
  }
];

export default function WordOfDay() {
  const [sentenceData, setSentenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('static');

  useEffect(() => {
    loadSlokaData();
  }, []);

  // ✅ Function to get a static word based on today's date
  const getStaticWordForToday = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % STATIC_WORDS.length;
    return STATIC_WORDS[index];
  };

  const loadSlokaData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchSloka();
      console.log('📚 API Response:', JSON.stringify(response, null, 2));
      
      // ✅ Check if API call was successful and returned data
      if (response) {
        // ✅ Case 1: API returned success with data
        if (response.status === true && response.data) {
          const data = response.data;
          
          // Check if line exists and is not empty
          if (data.line && data.line.trim() !== "") {
            setSentenceData({
              // title: "Word of the Day",
              description: data.line,
              sloka: data.line,
              meaning: data.meaning || "",
            });
            setDataSource('dynamic');
            console.log('✅ Using dynamic word of the day');
            setLoading(false);
            return;
          }
        }
        
        // ✅ Case 2: API returned status false (no data available)
        if (response.status === false) {
          console.log(`📅 ${response.message || 'No data available'}`);
          
          // Check specific message
          if (response.message === "No Sloka available for today.") {
            console.log('📅 No sloka available for today, showing static word');
          }
          
          // Use static data
          const staticWord = getStaticWordForToday();
          setSentenceData({
            title: staticWord.title,
            description: staticWord.description,
            sloka: staticWord.sloka,
            meaning: staticWord.meaning,
          });
          setDataSource('static');
          setLoading(false);
          return;
        }
        
        // ✅ Case 3: API returned something else unexpected
        console.warn('⚠️ Unexpected API response format:', response);
        const staticWord = getStaticWordForToday();
        setSentenceData({
          title: staticWord.title,
          description: staticWord.description,
          sloka: staticWord.sloka,
          meaning: staticWord.meaning,
        });
        setDataSource('static');
        setLoading(false);
        return;
        
      } else {
        // ✅ Case 4: No response or null response
        console.warn('⚠️ No response from API');
        const staticWord = getStaticWordForToday();
        setSentenceData({
          title: staticWord.title,
          description: staticWord.description,
          sloka: staticWord.sloka,
          meaning: staticWord.meaning,
        });
        setDataSource('static');
        setLoading(false);
        return;
      }
      
    } catch (error) {
      console.error("❌ Error fetching sloka:", error);
      // ✅ Fallback to static data on error
      const staticWord = getStaticWordForToday();
      setSentenceData({
        title: staticWord.title,
        description: staticWord.description,
        sloka: staticWord.sloka,
        meaning: staticWord.meaning,
      });
      setDataSource('static');
      setLoading(false);
      // Don't set error state here since we have fallback data
    }
  };

  const handleContinue = () => {
    router.push("/(drawer)/(studentIntro)/SpecialDay");
  };

  const handleRetry = () => {
    loadSlokaData();
  };

  // ✅ Render content
  const renderContent = () => {
    if (!sentenceData) {
      return (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>No data available</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

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

          {sentenceData.sloka ? (
            <>
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
            </>
          ) : (
            <Animatable.Text
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              style={styles.message}
            >
              {sentenceData.description}
            </Animatable.Text>
          )}

         
        </Animatable.View>
      </>
    );
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
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
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
  dataSourceBadge: {
    marginTop: height * 0.02,
    backgroundColor: 'rgba(0, 48, 150, 0.1)',
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.05,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 48, 150, 0.2)',
  },
  dataSourceText: {
    fontSize: width * 0.032,
    color: "#003096",
    fontWeight: "500",
  },
});