import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { fetchQuiz } from '../../constants/api/apiHome';
import {
  submitQuizWithAuth,
  getLastQuizAttempt,
} from '../../constants/api/apiScore';
import { COLOR } from '../../constants/Colors';

const QuizScreen = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const { id } = router.params || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [locked, setLocked] = useState(false);
  const [lockInfo, setLockInfo] = useState(null);
  const [noQuestions, setNoQuestions] = useState(false);

  const batchSize = 20;
  const [batchNumber, setBatchNumber] = useState(1);
  const [totalBatches, setTotalBatches] = useState(0);

  useEffect(() => {
    if (id) {
      checkAttemptAndStart();
    }
  }, [id]);

  const checkAttemptAndStart = async () => {
    try {
      setLoading(true);
      setLocked(false);
      setLockInfo(null);
      setNoQuestions(false);

      // First fetch questions to check if any exist
      const response = await fetchQuiz(id);
      let data = [];

      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response.data?.data)) {
        data = response.data.data;
      }

      // ✅ Check if there are no questions
      if (!data || data.length === 0) {
        setNoQuestions(true);
        setLoading(false);
        return;
      }

      // ✅ Questions exist, now check attempts
      const attemptResponse = await getLastQuizAttempt();
      const last = attemptResponse.data?.data;

      console.log('LAST QUIZ ATTEMPT:', last);
      console.log('CURRENT SUBJECT ID:', id);

      if (last && Number(last.subject_id) === Number(id)) {
        if (last.passed === true) {
          setLocked(true);
          setLockInfo({
            title: 'Quiz Completed 🎉',
            message:
              'You already passed this quiz today. Next round will unlock tomorrow.',
            subjectName: last.subject_name,
            score: last.score,
            totalMarks: last.total_marks,
            attemptNo: last.attempt_no,
          });
          setLoading(false);
          return;
        }

        if (last.passed === false && Number(last.attempt_no) >= 3) {
          setLocked(true);
          setLockInfo({
            title: 'Attempts Finished 😔',
            message:
              'You have failed 3 attempts today. Please attempt again next day.',
            subjectName: last.subject_name,
            score: last.score,
            totalMarks: last.total_marks,
            attemptNo: last.attempt_no,
          });
          setLoading(false);
          return;
        }
      }

      // ✅ Set questions and start quiz
      setAllQuestions(data);
      setTotalBatches(Math.ceil(data.length / batchSize));

      if (data.length > 0) {
        loadBatch(1, data);
      } else {
        setNoQuestions(true);
        setLoading(false);
      }
    } catch (error) {
      console.log('Attempt check error:', error.response?.data || error.message);
      // ✅ On error, try to fetch questions anyway
      await fetchQuestions();
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetchQuiz(id);

      let data = [];

      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response.data?.data)) {
        data = response.data.data;
      }

      // ✅ Check if no questions
      if (!data || data.length === 0) {
        setNoQuestions(true);
        setLoading(false);
        return;
      }

      setAllQuestions(data);
      setTotalBatches(Math.ceil(data.length / batchSize));

      if (data.length > 0) {
        loadBatch(1, data);
      } else {
        setNoQuestions(true);
        setLoading(false);
      }
    } catch (error) {
      console.log('QUIZ ERROR:', error.response?.data || error.message);
      setNoQuestions(true);
      setLoading(false);
      Alert.alert('Error', 'Failed to load questions');
    }
  };

  const loadBatch = (batchNum, questionsData = allQuestions) => {
    const start = (batchNum - 1) * batchSize;
    const end = Math.min(start + batchSize, questionsData.length);
    const batch = questionsData.slice(start, end);

    setQuestions(batch);
    setBatchNumber(batchNum);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setTimer(30);
    setNoQuestions(false);
    setLoading(false);
  };

  useEffect(() => {
    if (loading || locked || questions.length === 0 || isSubmitting || noQuestions) return;

    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }

    setSelectedAnswer((prev) => prev ?? '');
    setTimeout(() => {
      handleAnswer();
    }, 100);
  }, [timer, loading, locked, questions, isSubmitting, noQuestions]);

  const handleAnswer = async () => {
    if (isSubmitting || locked || questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];

    const isCorrect =
      selectedAnswer !== null &&
      selectedAnswer === currentQuestion.correct_answer;

    const newScore = isCorrect ? score + 1 : score;

    setScore(newScore);
    setTimer(30);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      await handleQuizComplete(newScore);
    }
  };

  const handleQuizComplete = async (finalScore) => {
    try {
      setIsSubmitting(true);

      const response = await submitQuizWithAuth({
        subjectId: id,
        score: finalScore,
      });

      const data = response.data || {};

      navigation.replace('screen/resultScreen', {
        subject: id,
        score: data.score ?? finalScore,
        totalMarks: data.total_marks ?? 20,
        passed: data.passed ?? false,
        message: data.message ?? '',
        remainingAttempts: data.remaining_attempts ?? 0,
        attemptNo: data.attempt_no ?? 1,
      });
    } catch (error) {
      const errorData = error.response?.data || {};

      setLocked(true);
      setLockInfo({
        title: 'Quiz Locked 🔒',
        message:
          errorData.message ||
          errorData.detail ||
          'You cannot start this quiz now. Please try again later.',
        subjectName: '',
        score: finalScore,
        totalMarks: 20,
        attemptNo: 3,
      });

      setLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishBatch = () => {
    if (selectedAnswer !== null) {
      handleAnswer();
    } else {
      Alert.alert('⚠️ No Answer Selected', 'You have not selected an answer.', [
        { text: 'Select Answer' },
        {
          text: 'Finish Anyway',
          onPress: () => {
            setSelectedAnswer('');
            setTimeout(() => handleAnswer(), 100);
          },
        },
      ]);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR.background} />
        <Text style={styles.loadingText}>Checking quiz status...</Text>
      </View>
    );
  }

  // ✅ Show "No Questions" screen when there are no questions
  if (noQuestions) {
    return (
      <View style={styles.lockContainer}>
        <View style={styles.lockCard}>
          <Text style={styles.lockIcon}>📝</Text>
          <Text style={styles.lockTitle}>No Questions Available</Text>
          <Text style={styles.lockMessage}>
            There are currently no questions available for this subject. Please check back later or contact your instructor.
          </Text>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('(drawer)')}
          >
            <Text style={styles.homeButtonText}>Go To Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (locked || !allQuestions.length) {
    return (
      <View style={styles.lockContainer}>
        <View style={styles.lockCard}>
          <Text style={styles.lockIcon}>🔒</Text>

          <Text style={styles.lockTitle}>
            {lockInfo?.title || 'Attempts Finished 😔'}
          </Text>

          <Text style={styles.lockMessage}>
            {lockInfo?.message ||
              'You have failed 3 attempts today. Please attempt again next day.'}
          </Text>

          <View style={styles.lockInfoBox}>
            <Text style={styles.lockInfoText}>
              Subject: {lockInfo?.subjectName || '-'}
            </Text>

            <Text style={styles.lockInfoText}>
              Last Score: {lockInfo?.score || 0}/{lockInfo?.totalMarks || 20}
            </Text>

            <Text style={styles.lockInfoText}>
              Attempt: {lockInfo?.attemptNo || 3}/3
            </Text>

            <Text style={styles.lockInfoText}>Pass Mark: 18/20</Text>
          </View>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('(drawer)')}
          >
            <Text style={styles.homeButtonText}>Go To Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.batchText}>
          Test {batchNumber} of {totalBatches}
        </Text>
        <Text style={styles.scoreText}>Score: {score}/20</Text>
      </View>

      <View style={styles.nextDayBox}>
        <Text style={styles.nextDayTitle}>🎯 Pass Mark: 18/20</Text>
        <Text style={styles.nextDayText}>
          If you pass, next round will unlock tomorrow. If you fail, you can try
          3 times in a day.
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1}/{questions.length}
        </Text>
      </View>

      <Text style={styles.questionText}>
        Question {currentQuestionIndex + 1} / {questions.length}
      </Text>

      <View style={styles.timerContainer}>
        <AnimatedCircularProgress
          size={100}
          width={10}
          fill={(timer / 30) * 100}
          tintColor={timer < 10 ? '#ff6b6b' : COLOR.background}
          backgroundColor="#d9f7f4"
          style={styles.timer}
        >
          {() => (
            <Text style={[styles.timerText, timer < 10 && styles.timerWarning]}>
              {timer}
            </Text>
          )}
        </AnimatedCircularProgress>

        <Text style={styles.question}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {[
          currentQuestion.option1,
          currentQuestion.option2,
          currentQuestion.option3,
          currentQuestion.option4,
        ].map(
          (option, index) =>
            option && (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  selectedAnswer === option && {
                    backgroundColor: COLOR.background,
                  },
                ]}
                onPress={() => setSelectedAnswer(option)}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === option && {
                      color: COLOR.white,
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            )
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!selectedAnswer || isSubmitting) && styles.disabledButton,
        ]}
        onPress={handleFinishBatch}
        disabled={!selectedAnswer || isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting
            ? 'Submitting...'
            : isLastQuestion
            ? 'FINISH TEST'
            : 'SUBMIT ANSWER'}
        </Text>
      </TouchableOpacity>

      <View style={styles.passInfo}>
        <Text style={styles.passText}>✅ Need 18/20 to PASS</Text>
        <Text style={styles.passText}>📊 Score: {score}/20</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  batchText: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: COLOR.background,
  },
  scoreText: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: COLOR.background,
  },
  nextDayBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextDayTitle: {
    fontSize: 15,
    fontFamily: 'roboto-bold',
    color: COLOR.background,
    marginBottom: 4,
  },
  nextDayText: {
    fontSize: 13,
    fontFamily: 'roboto',
    color: '#666',
    lineHeight: 18,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLOR.background,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
    fontFamily: 'roboto',
  },
  passInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  passText: {
    fontSize: 14,
    fontFamily: 'roboto',
    color: '#666',
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'roboto',
    color: '#666',
  },
  lockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  lockCard: {
    width: '100%',
    backgroundColor: COLOR.white,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  lockIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  lockTitle: {
    fontSize: 24,
    fontFamily: 'roboto-bold',
    color: COLOR.background,
    textAlign: 'center',
    marginBottom: 8,
  },
  lockMessage: {
    fontSize: 15,
    fontFamily: 'roboto-medium',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  lockInfoBox: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    gap: 8,
  },
  lockInfoText: {
    fontSize: 15,
    fontFamily: 'roboto-medium',
    color: COLOR.background,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: COLOR.background,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  homeButtonText: {
    color: COLOR.white,
    fontSize: 16,
    fontFamily: 'roboto-bold',
  },
  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'roboto-bold',
  },
  timerContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
    minHeight: 200,
    padding: 20,
  },
  timer: {
    marginBottom: 10,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLOR.background,
  },
  timerWarning: {
    color: '#ff6b6b',
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'roboto-medium',
  },
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontFamily: 'roboto-medium',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: COLOR.background,
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: COLOR.white,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'roboto-bold',
  },
});

export default QuizScreen;