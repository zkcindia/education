import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { fetchQuiz } from '../../constants/api/apiHome';
import { COLOR } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const QuizScreen = () => {
  const navigation = useNavigation();
  const router = useRoute();

  const { id } = router.params || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    fetchQuestions();
  }, [id]);

  const fetchQuestions = async () => {
    try {
      const response = await fetchQuiz(id);
      setQuestions(response.data || []);
    } catch (error) {
      console.log('QUIZ ERROR:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || questions.length === 0) return;

    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      handleAnswer();
    }
  }, [timer, loading, questions]);

  const handleAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];

    const isCorrect =
      selectedAnswer !== null &&
      selectedAnswer === currentQuestion.correct_answer;

    const finalScore = score + (isCorrect ? 1 : 0);

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    setTimer(30);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // ✅ Fix: Send subject as "subject" not "subjectId"
      navigation.navigate('screen/resultScreen', {
        score: finalScore,
        totalQuestions: questions.length,
        subject: id,  // ✅ Ye sahi hai - "subject" naam se bhej rahe hain
        teacherId: questions[0]?.teacher,
        teacherName: questions[0]?.teacher_name,
      });
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (!questions.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No quiz found for this subject</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.questionText}>
        Question {currentQuestionIndex + 1} / {questions.length}
      </Text>

      <View style={styles.timerContainer}>
        <AnimatedCircularProgress
          size={100}
          width={10}
          fill={(timer / 30) * 100}
          tintColor={COLOR.background}
          backgroundColor="#d9f7f4"
          style={styles.timer}
        >
          {() => <Text style={styles.timerText}>{timer}</Text>}
        </AnimatedCircularProgress>

        <Text style={styles.question}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {[
          currentQuestion.option1,
          currentQuestion.option2,
          currentQuestion.option3,
          currentQuestion.option4,
        ].map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedAnswer === option && {
                backgroundColor: COLOR.background,
              },
            ]}
            onPress={() => setSelectedAnswer(option)}
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
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          !selectedAnswer && styles.disabledButton,
        ]}
        onPress={handleAnswer}
        disabled={!selectedAnswer}
      >
        <Text style={styles.submitButtonText}>SUBMIT ANSWER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },

  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 18,
    fontFamily: 'roboto-medium',
  },

  questionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },

  timerContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    marginTop: 80,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    minHeight: 200,
  },

  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLOR.background,
  },

  question: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },

  optionsContainer: {
    marginTop: 20,
  },

  option: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  optionText: {
    fontFamily: 'roboto-medium',
    fontSize: 16,
  },

  submitButton: {
    backgroundColor: COLOR.background,
    borderRadius: 10,
    padding: 10,
    marginTop: 30,
  },

  disabledButton: {
    opacity: 0.5,
  },

  submitButtonText: {
    color: COLOR.white,
    fontSize: 17,
    textAlign: 'center',
  },
});

export default QuizScreen;