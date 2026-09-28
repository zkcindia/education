import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLOR } from '../../../constants/Colors';
import { useToast } from 'react-native-toast-notifications';
import {
  getBoards,
  getClassesByBoard,
  getSubjects,
  getQuestionsBySubject,
  deleteQuestions,
} from '../../../constants/api/apiTeacher';

const { width } = Dimensions.get('window');

export default function AllClasses() {
  const navigation = useNavigation();
  const toast = useToast();

  // States
  const [boards, setBoards] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [viewMode, setViewMode] = useState('boards');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // 🎈 Floating animation for header icon
  const floatAnim = useRef(new Animated.Value(0)).current;

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
    outputRange: [0, -5],
  });

  // ============================================
  // 1️⃣ FETCH BOARDS
  // ============================================
  const fetchBoards = async () => {
    setLoading(true);
    try {
      const response = await getBoards();
      if (response.data?.status === true) {
        setBoards(response.data.data || []);
      }
    } catch (error) {
      toast.show('Error fetching boards', {
        type: 'danger',
        duration: 2000,
        placement: 'top',
      });
    }
    setLoading(false);
  };

  // ============================================
  // 2️⃣ FETCH CLASSES BY BOARD
  // ============================================
  const fetchClasses = async (boardName) => {
    setLoading(true);
    try {
      const response = await getClassesByBoard(boardName);
      if (response.data?.status === true) {
        setClasses(response.data.data || []);
      } else {
        setClasses([]);
      }
    } catch (error) {
      toast.show('Error fetching classes', {
        type: 'danger',
        duration: 2000,
        placement: 'top',
      });
      setClasses([]);
    }
    setLoading(false);
  };

  // ============================================
  // 3️⃣ FETCH SUBJECTS
  // ============================================
  const fetchSubjects = async (boardName, className) => {
    setLoading(true);
    try {
      const response = await getSubjects(boardName, className);
      if (response.data?.status === true) {
        setSubjects(response.data.data || []);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      toast.show('Error fetching subjects', {
        type: 'danger',
        duration: 2000,
        placement: 'top',
      });
      setSubjects([]);
    }
    setLoading(false);
  };

  // ============================================
  // 4️⃣ FETCH QUESTIONS BY SUBJECT
  // ============================================
  const fetchQuestions = async (subjectId) => {
    setLoading(true);
    try {
      const response = await getQuestionsBySubject(subjectId);
      if (response.status === 200) {
        let data = response.data;
        if (data.questions) data = data.questions;
        if (!Array.isArray(data)) data = [];
        setQuestions(data);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      toast.show('Error fetching questions', {
        type: 'danger',
        duration: 2000,
        placement: 'top',
      });
      setQuestions([]);
    }
    setLoading(false);
  };

  // ============================================
  // 5️⃣ DELETE QUESTION
  // ============================================
  const handleDelete = (question) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteQuestions(question.id);
              if (response.status === 200) {
                toast.show('Question deleted', {
                  type: 'success',
                  duration: 2000,
                  placement: 'top',
                });
                if (selectedSubject) {
                  fetchQuestions(selectedSubject.id);
                }
              }
            } catch (error) {
              toast.show('Delete failed', {
                type: 'danger',
                duration: 2000,
                placement: 'top',
              });
            }
          },
        },
      ]
    );
  };

  // ============================================
  // 6️⃣ NAVIGATION HANDLERS
  // ============================================
  const handleBoardClick = (board) => {
    setSelectedBoard(board);
    setViewMode('classes');
    setSearch('');
    fetchClasses(board.board_name);
  };

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    setViewMode('subjects');
    setSearch('');
    fetchSubjects(selectedBoard?.board_name, classItem.name);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setViewMode('questions');
    setSearch('');
    fetchQuestions(subject.id);
  };

  const handleBack = () => {
    if (viewMode === 'questions') {
      setViewMode('subjects');
      setSelectedSubject(null);
      setQuestions([]);
    } else if (viewMode === 'subjects') {
      setViewMode('classes');
      setSelectedClass(null);
      setSubjects([]);
    } else if (viewMode === 'classes') {
      setViewMode('boards');
      setSelectedBoard(null);
      setClasses([]);
    } else {
      navigation.goBack();
    }
  };

  // ============================================
  // 7️⃣ GET HEADER
  // ============================================
  const getTitle = () => {
    if (viewMode === 'questions') return selectedSubject?.name || 'Questions';
    if (viewMode === 'subjects') return selectedClass?.name || 'Subjects';
    if (viewMode === 'classes') return selectedBoard?.board_name || 'Classes';
    return 'Education Boards';
  };

  const getSubtitle = () => {
    if (viewMode === 'questions')
      return `${selectedClass?.name} • ${questions.length}`;
    if (viewMode === 'subjects') return `${subjects.length} subjects`;
    if (viewMode === 'classes') return `${classes.length} classes`;
    return `${boards.length} boards`;
  };

  // ============================================
  // 8️⃣ RENDER FUNCTIONS
  // ============================================
  const renderBoards = () => {
    const filtered = boards.filter((b) =>
      b.board_name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading boards...</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filtered}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleBoardClick(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.icon, { backgroundColor: '#EEF2FF' }]}>
                <Text style={[styles.iconText, { color: '#4F46E5' }]}>
                  {item.board_name?.charAt(0) || 'B'}
                </Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>{item.board_name}</Text>
                <Text style={styles.cardSubtitle}>View Classes</Text>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#4F46E5" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No boards found</Text>
          </View>
        )}
      />
    );
  };

  const renderClasses = () => {
    const filtered = classes.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading classes...</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filtered}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleClassClick(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.icon, { backgroundColor: '#EEF2FF' }]}>
                <Text style={[styles.iconText, { color: '#4F46E5' }]}>
                  {item.name?.charAt(0) || 'C'}
                </Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>View Subjects</Text>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#4F46E5" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No classes found</Text>
          </View>
        )}
      />
    );
  };

  const renderSubjects = () => {
    const filtered = subjects.filter((s) =>
      s.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filtered}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSubjectClick(item)}
            activeOpacity={0.8}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.icon, { backgroundColor: '#EEF2FF' }]}>
                <Text style={[styles.iconText, { color: '#4F46E5' }]}>
                  {item.name?.charAt(0) || 'S'}
                </Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>
                  {item.id === 1
                    ? `${questions.length} Questions`
                    : '0 Questions'}
                </Text>
              </View>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#4F46E5" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No subjects found</Text>
          </View>
        )}
      />
    );
  };

  const renderQuestions = () => {
    const filtered = questions.filter((q) =>
      q.question?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filtered}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionNumberBox}>
                <Text style={styles.questionNumber}>Q{index + 1}</Text>
              </View>

              <View style={styles.actions}>
                {/* ✅ EDIT BUTTON */}
                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() =>
                    navigation.navigate('screen/questionEditScreen', {
                      item,
                      subjectName: selectedSubject?.name,
                      className: selectedClass?.name,
                      boardName: selectedBoard?.board_name,
                    })
                  }
                >
                  <Feather name="edit-2" size={14} color="#FFF" />
                </TouchableOpacity>

                {/* ✅ DELETE BUTTON */}
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleDelete(item)}
                >
                  <Feather name="trash-2" size={14} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.questionText}>{item.question}</Text>

            <View style={styles.options}>
              <Text style={styles.optionText}>1. {item.option1}</Text>
              <Text style={styles.optionText}>2. {item.option2}</Text>
              <Text style={styles.optionText}>3. {item.option3}</Text>
              <Text style={styles.optionText}>4. {item.option4}</Text>
            </View>

            <View style={styles.correct}>
              <Feather name="check-circle" size={14} color="#10B981" />
              <Text style={styles.correctLabel}>Correct:</Text>
              <Text style={styles.correctValue}>{item.correct_answer}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No questions found</Text>
            <TouchableOpacity
              style={styles.addQuestionBtn}
              onPress={() => navigation.navigate('screen/QuestionUpload')}
            >
              <Text style={styles.addQuestionBtnText}>+ Add Question</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

  // ============================================
  // 9️⃣ EFFECTS
  // ============================================
  useEffect(() => {
    fetchBoards();
  }, []);

  // ============================================
  // 🔟 MAIN RENDER
  // ============================================
  return (
    <SafeAreaView style={styles.container}>
      {/* 🔵 GRADIENT HEADER (Bada + Logo) */}
      <LinearGradient
        colors={['#4F46E5', '#6D28D9', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {/* Decorative Circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <FontAwesome6 name="angle-left" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {getTitle()}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {getSubtitle()}
            </Text>
          </View>

          {/* 🎓 Board Logo (Right Side) - Animated */}
          {viewMode === 'questions' ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('screen/QuestionUpload')}
            >
              <AntDesign name="plus" size={20} color="#4F46E5" />
            </TouchableOpacity>
          ) : (
            <Animated.View
              style={[
                styles.headerLogoBox,
                { transform: [{ translateY }] },
              ]}
            >
              <View style={styles.headerGlowCircle} />
              <Text style={styles.headerLogoEmoji}>🎓</Text>
              <Text style={styles.headerLogoEmojiSmall}>📚</Text>
            </Animated.View>
          )}
        </View>
      </LinearGradient>

      {/* 📦 BODY */}
      <View style={styles.body}>
        {/* Search */}
        <View style={styles.search}>
          <Feather name="search" size={18} color="#6B7280" />
          <TextInput
            placeholder={
              viewMode === 'boards'
                ? 'Search boards...'
                : viewMode === 'classes'
                  ? 'Search classes...'
                  : viewMode === 'subjects'
                    ? 'Search subjects...'
                    : 'Search questions...'
            }
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            onChangeText={setSearch}
            value={search}
          />
        </View>

        <Text style={styles.sectionTitle}>
          {viewMode === 'questions'
            ? 'Questions'
            : viewMode === 'subjects'
              ? 'Subjects'
              : viewMode === 'classes'
                ? 'Classes'
                : 'Boards'}
        </Text>

        {/* Content */}
        {viewMode === 'boards' && renderBoards()}
        {viewMode === 'classes' && renderClasses()}
        {viewMode === 'subjects' && renderSubjects()}
        {viewMode === 'questions' && renderQuestions()}

        {/* FAB */}
        {(viewMode === 'boards' ||
          viewMode === 'classes' ||
          viewMode === 'subjects') && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('screen/QuestionUpload')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#7C3AED', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fabGradient}
            >
              <Text style={styles.fabText}>Add Question</Text>
              <View style={styles.fabCircle}>
                <AntDesign name="plus" size={20} color="#7C3AED" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ============================================
// 1️⃣1️⃣ STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // 🔵 HEADER GRADIENT (Bada)
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 28,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',
    position: 'relative',
  },

  // Decorative Circles
  decorCircle1: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontFamily: 'roboto-bold',
    fontSize: 18,
    color: '#fff',
  },
  headerSub: {
    fontFamily: 'roboto',
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  headerRight: {
    width: 38,
  },

  // 🎓 Header Logo (Right Side)
  headerLogoBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerGlowCircle: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  headerLogoEmoji: {
    fontSize: 30,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  headerLogoEmojiSmall: {
    position: 'absolute',
    fontSize: 14,
    right: -2,
    bottom: 0,
    transform: [{ rotate: '20deg' }],
  },

  addBtn: {
    backgroundColor: '#fff',
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  // 📦 BODY
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // 🔍 Search
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    fontFamily: 'roboto',
    fontSize: 14,
    flex: 1,
    color: '#1E3A8A',
    paddingVertical: 0,
  },

  sectionTitle: {
    fontFamily: 'roboto-bold',
    fontSize: 14,
    color: '#1E3A8A',
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 4,
  },

  // 🎯 Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    fontFamily: 'roboto-bold',
  },
  cardTitle: {
    fontFamily: 'roboto-bold',
    fontSize: 15,
    color: '#1E3A8A',
  },
  cardSubtitle: {
    fontFamily: 'roboto',
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },

  // 📝 Question Card
  questionCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumberBox: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  questionNumber: {
    fontFamily: 'roboto-bold',
    fontSize: 12,
    color: '#4F46E5',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#10B981',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
  },
  questionText: {
    fontFamily: 'roboto-bold',
    fontSize: 14,
    color: '#1E3A8A',
    marginBottom: 10,
    lineHeight: 20,
  },
  options: {
    marginBottom: 10,
  },
  optionText: {
    fontFamily: 'roboto',
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 3,
  },
  correct: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  correctLabel: {
    fontFamily: 'roboto-bold',
    fontSize: 12,
    color: '#065F46',
    marginLeft: 2,
  },
  correctValue: {
    fontFamily: 'roboto-bold',
    fontSize: 12,
    color: '#065F46',
  },

  // 🎯 Center / Empty
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontFamily: 'roboto',
    fontSize: 13,
    color: '#6B7280',
    marginTop: 10,
  },
  emptyText: {
    fontFamily: 'roboto',
    fontSize: 14,
    color: '#9CA3AF',
  },

  addQuestionBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 15,
  },
  addQuestionBtnText: {
    color: '#FFF',
    fontFamily: 'roboto-bold',
    fontSize: 14,
  },

  // 🔘 FAB
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
  },
  fabText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'roboto-bold',
    marginRight: 10,
  },
  fabCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});