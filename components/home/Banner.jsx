import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
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
          <View style={styles.leftContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>

          <View style={styles.iconBox}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
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
    marginTop: 16,
  },

  slideWrapper: {
    width: width,
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  banner: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 26,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  leftContent: {
    width: "68%",
    justifyContent: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    color: "#FFFFFF",
    fontSize: 15,
    marginTop: 10,
    lineHeight: 23,
    opacity: 0.95,
  },

  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 54,
  },

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