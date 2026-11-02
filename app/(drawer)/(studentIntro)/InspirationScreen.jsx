import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // 👈 StudentDob wala navigation import
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function InspirationScreen() {
  const navigation = useNavigation(); // 👈 Navigation hook

  const legend = {
    name: 'Swami Vivekananda',
    years: '1863 - 1902',
    role: 'Spiritual Leader',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Swami_Vivekananda-1893-09-signed.jpg/440px-Swami_Vivekananda-1893-09-signed.jpg',
    quote: 'Arise, awake and stop not till the goal is reached.',
    about: 'He introduced Vedanta and Yoga to the West. He taught us to believe in our own inner strength.',
  };

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [comment, setComment] = useState('');
  const [myComment, setMyComment] = useState('');

  // 👇 EXACT SAME STUDENTDOB LOGIC
  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem("hasVisitedStudentIntro", "true");
      console.log("Navigating to home...");
      navigation.replace('(drawer)'); 
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 🔵 SAME THEME BACKGROUND */}
      <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.container}>
        
        {/* 1️⃣ HEADING */}
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Inspiration of the Day</Text>
        </View>

        {/* 2️⃣ IMAGE (Bahar, SpecialDay jaisa) */}
        <View style={styles.imageContainer}>
          <View style={styles.imageRing}>
            <Image source={{ uri: legend.image }} style={styles.image} />
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>✨ TODAYS INSPIRATION</Text>
          </View>
        </View>

        {/* 3️⃣ GLASS CARD (Text, About, Likes, Comment sab isme) */}
        <View style={styles.glassCard}>
          
          <Text style={styles.festivalName}>{legend.name}</Text>
          <Text style={styles.yearsText}>{legend.years}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>⭐ {legend.role}</Text>
          </View>

          <View style={styles.divider} />

          {/* Quote */}
          <View style={styles.quoteBox}>
            <Text style={styles.quoteIcon}>❝</Text>
            <Text style={styles.quoteText}>{legend.quote}</Text>
          </View>

          {/* About (Education lines) */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ABOUT</Text>
            <Text style={styles.sectionText} numberOfLines={3}>
              {legend.about}
            </Text>
          </View>

          {/* ❤️ 👎 ACTIONS */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, liked && styles.activeBtn]} onPress={() => setLiked(!liked)}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={16} color={liked ? '#fff' : '#EF4444'} />
              <Text style={[styles.actionText, liked && { color: '#fff' }]}>245</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, disliked && styles.activeDislikeBtn]} onPress={() => setDisliked(!disliked)}>
              <Ionicons name={disliked ? 'thumbs-down' : 'thumbs-down-outline'} size={16} color={disliked ? '#fff' : '#6B7280'} />
              <Text style={[styles.actionText, disliked && { color: '#fff' }]}>12</Text>
            </TouchableOpacity>
          </View>

          {/* 💬 COMMENT SECTION */}
          <View style={styles.commentSection}>
            {myComment ? (
              <View style={styles.savedCommentBox}>
                <Text style={styles.savedCommentLabel}>Your Comment:</Text>
                <Text style={styles.savedCommentText}>{myComment}</Text>
              </View>
            ) : (
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Write your thoughts..."
                  placeholderTextColor="#6B7280"
                  value={comment}
                  onChangeText={setComment}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={() => { if(comment.trim()) { setMyComment(comment); setComment(''); } }}>
                  <Feather name="send" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* 4️⃣ CONTINUE BUTTON */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.04,
    justifyContent: 'space-between',
    paddingBottom: height * 0.03,
  },
  headingContainer: {
    alignItems: 'center',
  },
  headingText: {
    fontSize: width * 0.06,
    fontWeight: '900',
    color: '#003096',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 48, 150, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: height * 0.015,
  },
  imageRing: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#E0E7FF',
    shadowColor: '#003096',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    backgroundColor: '#003096',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -12,
    zIndex: 10,
  },
  badgeText: {
    fontSize: width * 0.025,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#003096',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
    width: '100%',
    marginTop: 10,
  },
  festivalName: {
    fontSize: width * 0.055,
    fontWeight: '900',
    color: '#003096',
    textAlign: 'center',
  },
  yearsText: {
    fontSize: width * 0.03,
    color: '#1E3A8A',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  roleText: {
    fontSize: width * 0.026,
    color: '#003096',
    fontWeight: '800',
  },
  divider: {
    height: 1.2,
    backgroundColor: 'rgba(0, 48, 150, 0.25)',
    marginVertical: height * 0.01,
    borderRadius: 2,
    width: '100%',
  },
  quoteBox: {
    backgroundColor: '#003096',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quoteIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  quoteText: {
    flex: 1,
    color: '#fff',
    fontSize: width * 0.03,
    fontStyle: 'italic',
    lineHeight: height * 0.02,
  },
  section: {
    marginBottom: 8,
    width: '100%',
  },
  sectionLabel: {
    fontSize: width * 0.028,
    fontWeight: '800',
    color: '#003096',
    marginBottom: 2,
    letterSpacing: 1,
  },
  sectionText: {
    fontSize: width * 0.03,
    color: '#1F2937',
    lineHeight: height * 0.02,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    gap: 6,
  },
  activeBtn: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  activeDislikeBtn: { backgroundColor: '#6B7280', borderColor: '#6B7280' },
  actionText: {
    fontSize: width * 0.028,
    fontWeight: '900',
    color: '#003096',
  },
  commentSection: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: width * 0.028,
    color: '#003096',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#003096',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedCommentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  savedCommentLabel: {
    fontSize: width * 0.026,
    color: '#003096',
    fontWeight: '900',
  },
  savedCommentText: {
    fontSize: width * 0.028,
    color: '#1F2937',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#003096',
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.18,
    borderRadius: 10,
    shadowColor: '#003096',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueText: {
    color: '#fff',
    fontSize: width * 0.038,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
});