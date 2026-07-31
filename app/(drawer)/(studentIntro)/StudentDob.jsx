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
import { getBirthdayUsers } from "../../../constants/api/apiHome";

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
        const data = response.data;
        
        // Check if special_user exists, if not use first user from users array
        let specialUser = data.special_user;
        if (!specialUser && data.users && data.users.length > 0) {
          specialUser = data.users[0];
          // Remove the first user from users list if it's being used as special_user
          const remainingUsers = data.users.slice(1);
          setBirthdayData({
            special_user: {
              name: specialUser.name || "Student",
              image: specialUser.image || null,
              wishing_message: "Wishing you a very Happy Birthday! Keep learning, keep smiling, and have a wonderful year ahead.",
            },
            users: remainingUsers,
          });
        } else {
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
    return require("../../../assets/images/bday.png");
  };

  // Get first name only
  const getFirstName = (fullName) => {
    if (!fullName) return 'Student';
    return fullName.split(' ')[0];
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
        {/* Balloons Animation - Background */}
        <View style={styles.balloonsContainer}>
          <Animatable.Image
            animation={{
              from: { translateY: height },
              to: { translateY: -height * 0.2 },
            }}
            duration={8000}
            iterationCount="infinite"
            style={styles.balloon}
            source={require("../../../assets/images/balloon1.png")}
          />

          <Animatable.Image
            animation={{
              from: { translateY: height },
              to: { translateY: -height * 0.2 },
            }}
            duration={10000}
            iterationCount="infinite"
            style={[styles.balloon, { left: width * 0.6 }]}
            source={require("../../../assets/images/balloon2.png")}
          />
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Happy Birthday with Name - Integrated */}
          <View style={styles.birthdayHeader}>
            <Text style={styles.birthdayGreeting}>Happy Birthday</Text>
            <Text style={styles.birthdayName}>
              {getFirstName(birthdayData.special_user.name)}!
            </Text>
          </View>

          {/* Birthday Person Image */}
          <Animatable.View animation="bounceIn" delay={500} style={styles.birthdayImageContainer}>
            <Image
              source={birthdayData.special_user.image 
                ? getImageSource(birthdayData.special_user.image)
                : require("../../../assets/images/bday.png")
              }
              style={styles.birthdayImage}
            />
          </Animatable.View>

          {/* Wishing Message */}
          <Animatable.Text animation="fadeInUp" delay={700} style={styles.birthdayWish}>
            {birthdayData.special_user.wishing_message}
          </Animatable.Text>

          {/* Other Students with Birthdays */}
          {birthdayData.users.length > 0 && (
            <>
              <Text style={styles.subHeader}>🎂 Other Students Birthday Today:</Text>

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
                          : require("../../../assets/images/bday.png")
                        }
                        style={styles.studentImageItem}
                      />
                    </TouchableOpacity>

                    <Text style={styles.name}>{item.name || item.username}</Text>
                    
                    {item.dob && (
                      <Text style={styles.dobText}>
                        🎂 {new Date(item.dob).toLocaleDateString()}
                      </Text>
                    )}
                  </Animatable.View>
                )}
              />
            </>
          )}
        </View>

        {/* Continue Button */}
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

        {/* Modal for displaying the image */}
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
                    source={selectedImage && selectedImage.startsWith('http') 
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
  // Balloons Styles
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
  // Content Container
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: width * 0.02,
    paddingTop: height * 0.02,
  },
  // Birthday Header - Happy Birthday + Name together
  birthdayHeader: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  birthdayGreeting: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  birthdayName: {
    fontSize: width * 0.09,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginTop: height * 0.005,
  },
  birthdayImageContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  birthdayImage: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.175,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  birthdayWish: {
    fontSize: width * 0.045,
    textAlign: 'center',
    color: '#fff',
    lineHeight: height * 0.04,
    paddingHorizontal: width * 0.05,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: height * 0.02,
  },
  // Other Students Styles
  subHeader: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: height * 0.02,
    zIndex: 1,
    marginTop: height * 0.01,
  },
  studentList: {
    paddingBottom: height * 0.02,
    zIndex: 1,
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.015,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    width: '100%',
  },
  studentImageItem: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: width * 0.045,
    color: "#fff",
    fontWeight: '600',
    flex: 1,
  },
  dobText: {
    fontSize: width * 0.035,
    color: '#fff',
    opacity: 0.8,
  },
  continueButton: {
    alignSelf: "center",
    backgroundColor: "#003096",
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.15,
    borderRadius: width * 0.1,
    zIndex: 1,
    marginBottom: height * 0.16,
    marginTop: height * 0.01,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  // Modal Styles
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
  // Loading & Error Styles
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