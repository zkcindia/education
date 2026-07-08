import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBirthdayUsers } from "../../../constants/api/apiHome"; // Import the API function

const { width, height } = Dimensions.get("window");

export default function StudentDob() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [birthdayData, setBirthdayData] = useState({
    special_user: {
      name: "Student",
      image: null,
      wishing_message: "Wishing you a very Happy Birthday! Keep learning, keep smiling, and have a wonderful year ahead.",
    },
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBirthdayUsers();
  }, []);

  const fetchBirthdayUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBirthdayUsers();
      
      if (response.data) {
        // Check if response has the expected structure
        const data = response.data;
        
        setBirthdayData({
          special_user: {
            name: data.special_user?.name || "Student",
            image: data.special_user?.image || null,
            wishing_message: data.special_user?.wishing_message || 
              "Wishing you a very Happy Birthday! Keep learning, keep smiling, and have a wonderful year ahead.",
          },
          users: data.users || [],
        });
      }
    } catch (error) {
      console.error("Error fetching birthday users:", error);
      setError("Failed to load birthday data");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const getImageSource = (image) => {
    if (image && typeof image === 'string' && image.startsWith('http')) {
      return { uri: image };
    }
    return require("../../../assets/images/Isolation_Mode.png");
  };

  if (loading) {
    return (
      <LinearGradient colors={["#FF7F50", "#FF6347", "#FF4500"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading birthday wishes...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#FF7F50", "#FF6347", "#FF4500"]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBirthdayUsers}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#FF7F50", "#FF6347", "#FF4500"]} style={styles.container}>
        <Animatable.View animation="fadeInUp" delay={200} style={styles.header}>
          <Text style={styles.headerText}>
            Happy Birthday, {birthdayData.special_user.name}!
          </Text>
        </Animatable.View>

        <View style={styles.balloonsContainer}>
          <Animatable.Image
            animation={{
              from: { translateY: height },
              to: { translateY: -height * 0.2 },
            }}
            duration={8000}
            iterationCount="infinite"
            style={styles.balloon}
            // source={require("../../../assets/images/balloon1.png")}
          />

          <Animatable.Image
            animation={{
              from: { translateY: height },
              to: { translateY: -height * 0.2 },
            }}
            duration={10000}
            iterationCount="infinite"
            style={[styles.balloon, { left: width * 0.6 }]}
            // source={require("../../../assets/images/balloon2.png")}
          />
        </View>

        <Animatable.View animation="bounceIn" delay={500} style={styles.imageContainer}>
          <Image
            source={birthdayData.special_user.image 
              ? getImageSource(birthdayData.special_user.image)
              : require("../../../assets/images/Isolation_Mode.png")
            }
            style={styles.studentImage}
          />
        </Animatable.View>

        <Animatable.View animation="zoomIn" delay={800} style={styles.wishContainer}>
          <Text style={styles.wishText}>
            {birthdayData.special_user.wishing_message}
          </Text>
        </Animatable.View>

        {birthdayData.users.length > 0 && (
          <>
            <Text style={styles.subHeader}>Other Students Birthday Today:</Text>

            <FlatList
              data={birthdayData.users}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              contentContainerStyle={styles.studentList}
              renderItem={({ item, index }) => (
                <Animatable.View
                  animation="fadeInUp"
                  delay={index * 200}
                  style={styles.studentItem}
                >
                  <TouchableOpacity
                    onPress={() => {
                      const imageUrl = item.image || item.profile_image || item.avatar;
                      handleImagePress(imageUrl);
                    }}
                  >
                    <Image
                      source={item.image 
                        ? getImageSource(item.image)
                        : require("../../../assets/images/Isolation_Mode.png")
                      }
                      style={styles.studentImageItem}
                    />
                  </TouchableOpacity>

                  <Text style={styles.name}>{item.name || item.username}</Text>
                </Animatable.View>
              )}
            />
          </>
        )}

        <TouchableOpacity
          onPress={async () => {
            try {
              await AsyncStorage.setItem("hasVisitedStudentIntro", "true");
              console.log("Navigating to home...");
              navigation.replace('(drawer)');
            } catch (error) {
              console.log("Error:", error);
            }
          }}
          style={styles.continueButton}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View style={styles.modalOverlay}>
              <Animatable.View animation="zoomIn" delay={200} style={styles.modalImageContainer}>
                {selectedImage && (
                  <Image 
                    source={selectedImage.startsWith('http') 
                      ? { uri: selectedImage } 
                      : require("../../../assets/images/Isolation_Mode.png")
                    } 
                    style={styles.modalImage} 
                  />
                )}
              </Animatable.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: Platform.OS === "ios" ? height * 0.02 : height * 0.05,
    paddingBottom: height * 0.01,
  },
  header: {
    marginBottom: height * 0.02,
    alignItems: "center",
    zIndex: 1,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
    zIndex: 1,
  },
  studentImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderWidth: 4,
    borderColor: "#fff",
  },
  wishContainer: {
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.1,
    zIndex: 1,
  },
  wishText: {
    fontSize: width * 0.045,
    textAlign: "center",
    color: "#fff",
    lineHeight: height * 0.04,
  },
  subHeader: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: height * 0.02,
    zIndex: 1,
  },
  studentList: {
    paddingBottom: height * 0.04,
    zIndex: 1,
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  studentImageItem: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    marginRight: width * 0.03,
  },
  name: {
    fontSize: width * 0.045,
    color: "#fff",
  },
  continueButton: {
    alignSelf: "center",
    backgroundColor: "#003096",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.15,
    borderRadius: width * 0.1,
    zIndex: 1,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalImageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  balloonsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  balloon: {
    position: "absolute",
    width: width * 0.2,
    height: height * 0.15,
    resizeMode: "contain",
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