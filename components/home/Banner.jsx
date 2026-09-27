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

const banners = [
  {
    id: "1",
    title: "Learn Courses",
    subtitle: "Interactive lessons for Classes 6th to 10th",
    icon: "📚",
    colors: ["#4F46E5", "#7C3AED"],
  },
  {
    id: "2",
    title: "Questions & Answers",
    subtitle: "Practice solved questions chapter-wise",
    icon: "❓",
    colors: ["#F59E0B", "#F97316"],
  },
  {
    id: "3",
    title: "Mock Exams",
    subtitle: "Take chapter-wise and full syllabus tests",
    icon: "📝",
    colors: ["#10B981", "#059669"],
  },
  {
    id: "4",
    title: "Smart Notes",
    subtitle: "Quick revision notes and formulas",
    icon: "📖",
    colors: ["#EC4899", "#8B5CF6"],
  },
  {
    id: "5",
    title: "Track Progress",
    subtitle: "Check your scores and performance",
    icon: "📊",
    colors: ["#06B6D4", "#2563EB"],
  },
  {
    id: "6",
    title: "Ask Doubts",
    subtitle: "Clear your doubts with expert support",
    icon: "💬",
    colors: ["#6366F1", "#8B5CF6"],
  },
];

export default function HomeBannerSlider() {
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
        activeIndex === banners.length - 1 ? 0 : activeIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const onScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
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
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* 📝 Left Content */}
          <View style={styles.leftContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>

          {/* 🎯 Right Icon with Animation */}
          <Animated.View
            style={[
              styles.iconBox,
              { transform: [{ translateY }] },
            ]}
          >
            <View style={styles.iconGlow} />
            <Text style={styles.icon}>{item.icon}</Text>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
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
        {banners.map((_, index) => (
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
    height: 170,                     // ✅ 200 → 170 (thoda chhota, aap badha bhi sakte hain)
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  // Decorative Circles (Header jaisa)
  decorCircle1: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: -70,
    left: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  // Left Content
  leftContent: {
    width: "65%",
    justifyContent: "center",
    zIndex: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,                    // ✅ 24 → 22
    fontFamily: "roboto-bold",
    lineHeight: 28,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    color: "#FFFFFF",
    fontSize: 13,                    // ✅ 15 → 13
    marginTop: 8,
    lineHeight: 19,
    opacity: 0.95,
    fontFamily: "roboto",
  },

  // Right Icon Box
  iconBox: {
    width: 88,                       // ✅ 96 → 88
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 2,
  },
  iconGlow: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  icon: {
    fontSize: 48,                    // ✅ 54 → 48
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },

  // 🔘 Dots
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
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