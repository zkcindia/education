import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = width - HORIZONTAL_PADDING * 2;

const classBanners = [
  {
    id: "6",
    className: "CLASS 6",
    title: "Build Strong Fundamentals",
    subtitle: "CBSE • ICSE • Odisha Board",
    features: ["NCERT Based", "Smart Notes", "Chapter Tests", "Doubt Support"],
    icon: "📚",
    colors: ["#4F46E5", "#7C3AED"],
  },
  {
    id: "7",
    className: "CLASS 7",
    title: "Learn Beyond Books",
    subtitle: "All subjects in one place",
    features: ["MCQ", "Q&A", "Practice"],
    icon: "📝",
    colors: ["#2563EB", "#06B6D4"],
  },
  {
    id: "8",
    className: "CLASS 8",
    title: "Prepare For Higher Classes",
    subtitle: "Strong concepts for future",
    features: ["Revision", "Mock Test", "Solved Q&A"],
    icon: "🎯",
    colors: ["#10B981", "#14B8A6"],
  },
  {
    id: "9",
    className: "CLASS 9",
    title: "Start Board Preparation",
    subtitle: "Concept learning with practice",
    features: ["PYQ", "NCERT", "Doubts"],
    icon: "🚀",
    colors: ["#EC4899", "#8B5CF6"],
  },
  {
    id: "10",
    className: "CLASS 10",
    title: "Ace Your Boards",
    subtitle: "Board exam ready learning",
    features: ["Sample Paper", "Full Test", "Board Qs"],
    icon: "🏆",
    colors: ["#F97316", "#EF4444"],
  },
];

export default function ClassBannerSlider() {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const floatAnim = useRef(new Animated.Value(0)).current;

  // 🎈 Floating Animation for Icon
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  // 🔄 Auto Slider (Same logic)
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        activeIndex === classBanners.length - 1 ? 0 : activeIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const onScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const renderBanner = ({ item }) => {
    return (
      <View style={styles.slideWrapper}>
        <LinearGradient
          colors={item.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          {/* 🎨 Decorative Circles */}
          <View style={styles.decorCircleOne} />
          <View style={styles.decorCircleTwo} />

          {/* 🔝 Top Row */}
          <View style={styles.topRow}>
            <View style={styles.leftContent}>
              {/* 🏷️ Class Pill */}
              <View style={styles.classPill}>
                <View style={styles.classPillDot} />
                <Text style={styles.classPillText}>{item.className}</Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>

            {/* 🎯 Icon with Animation */}
            <Animated.View
              style={[styles.iconBox, { transform: [{ translateY }] }]}
            >
              <View style={styles.iconGlow} />
              <Text style={styles.icon}>{item.icon}</Text>
            </Animated.View>
          </View>

          {/* ✨ Feature Chips */}
          <View style={styles.featureContainer}>
            {item.features.map((feature, index) => (
              <View key={index} style={styles.featureBox}>
                <Text style={styles.featureText}>✨ {feature}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={classBanners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderBanner}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      {/* 🔘 Dots Indicator */}
      <View style={styles.dotsContainer}>
        {classBanners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  slideWrapper: {
    width: width,
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  // 🎨 BANNER
  banner: {
    width: CARD_WIDTH,
    minHeight: 240,
    borderRadius: 26,
    padding: 20,
    overflow: "hidden",
    position: "relative",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  // Decorative Circles
  decorCircleOne: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.10)",
    right: -50,
    top: -50,
  },
  decorCircleTwo: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.08)",
    left: -35,
    bottom: -35,
  },

  // Top Row
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 2,
  },

  leftContent: {
    width: "68%",
  },

  // 🏷️ Class Pill
  classPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    gap: 6,
  },
  classPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  classPillText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "roboto-bold",
    letterSpacing: 1.2,
  },

  // 📝 Title & Subtitle
  title: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 21,
    fontFamily: "roboto-bold",
    lineHeight: 27,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 6,
    opacity: 0.95,
    fontFamily: "roboto",
    lineHeight: 18,
  },

  // 🎯 Icon Box
  iconBox: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
    position: "relative",
    zIndex: 2,
  },
  iconGlow: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  icon: {
    fontSize: 44,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },

  // ✨ Feature Container
  featureContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
    zIndex: 2,
  },
  featureBox: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  featureText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "roboto-bold",
  },

  // 🔘 Dots
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 22,
    backgroundColor: "#4F46E5",
  },
});