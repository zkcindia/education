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

const classBanners = [
  {
    id: "6",
    className: "CLASS 6",
    title: "Build Strong Fundamentals",
    subtitle: "CBSE • ICSE • Odisha Board",
features: [
  "NCERT Based",
  "Smart Notes",
  "Chapter Tests",
  "Doubt Support"
],
    icon: "📚",
    colors: ["#4F46E5", "#7C3AED"],
  },
  {
    id: "7",
    className: "CLASS 7",
    title: "Learn Beyond Books",
    subtitle: "All subjects in one place",
    // subjects: ["Maths", "Science", "English", "SST"],
    features: ["MCQ", "Q&A", "Practice"],
    icon: "📝",
    colors: ["#2563EB", "#06B6D4"],
  },
  {
    id: "8",
    className: "CLASS 8",
    title: "Prepare For Higher Classes",
    subtitle: "Strong concepts for future",
    // subjects: ["Maths", "Science", "English", "History"],
    features: ["Revision", "Mock Test", "Solved Q&A"],
    icon: "🎯",
    colors: ["#10B981", "#14B8A6"],
  },
  {
    id: "9",
    className: "CLASS 9",
    title: "Start Board Preparation",
    subtitle: "Concept learning with practice",
    // subjects: ["Physics", "Chemistry", "Biology", "Maths"],
    features: ["PYQ", "NCERT", "Doubts"],
    icon: "🚀",
    colors: ["#EC4899", "#8B5CF6"],
  },
  {
    id: "10",
    className: "CLASS 10",
    title: "Ace Your Boards",
    subtitle: "Board exam ready learning",
    // subjects: ["Science", "Maths", "SST", "English"],
    features: ["Sample Paper", "Full Test", "Board Qs"],
    icon: "🏆",
    colors: ["#F97316", "#EF4444"],
  },
];

export default function ClassBannerSlider() {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
          <View style={styles.decorCircleOne} />
          <View style={styles.decorCircleTwo} />

          <View style={styles.topRow}>
            <View style={styles.leftContent}>
              <View style={styles.classPill}>
                <Text style={styles.classPillText}>{item.className}</Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
          </View>

          {/* <View style={styles.chipWrap}>
            {item.subjects.map((subject, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{subject}</Text>
              </View>
            ))}
          </View> */}

<View style={styles.featureContainer}>
  {item.features.map((feature,index)=>(
    <View
      key={index}
      style={styles.featureBox}
    >
      <Text style={styles.featureText}>
        ✨ {feature}
      </Text>
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
    marginTop: 16,
  },

  slideWrapper: {
    width: width,
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  banner: {
    width: CARD_WIDTH,
    minHeight: 235,
    borderRadius: 28,
    padding: 20,
    overflow: "hidden",
  },

  decorCircleOne: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.12)",
    right: -35,
    top: -35,
  },

  decorCircleTwo: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.10)",
    left: -25,
    bottom: -25,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  leftContent: {
    width: "68%",
  },

  classPill: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    alignSelf: "flex-start",
  },

  classPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },

  title: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 28,
  },

  subtitle: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 7,
    opacity: 0.95,
  },

  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 48,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },

  chip: {
    backgroundColor: "rgba(255,255,255,0.20)",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  chipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  featureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },

  featureItem: {
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },

  featureText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
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