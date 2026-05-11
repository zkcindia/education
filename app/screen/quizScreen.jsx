import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions,ScrollView  } from 'react-native';
import { RadioButton } from 'react-native-paper'; // Assuming you're using react-native-paper for RadioButton
import { AnimatedCircularProgress } from 'react-native-circular-progress'; // For circular timer
import { fetchQuiz } from '../../constants/api/apiHome';
import { COLOR } from '../../constants/Colors';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const QuizScreen = () => {
  const navigation = useNavigation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30); // 30 second timer
  const router = useRoute();
  const { id } = router.params || {}; // Get subject ID from route

  console.log(id);

  // Fetch quiz questions from API when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetchQuiz(id);
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      handleAnswer(); // Auto-submit when timer ends
    }
  }, [timer]);

  // Handle user's selected answer and move to the next question
  const handleAnswer = () => {
    if (selectedAnswer === null) {
      // No answer selected, move to the next question without incrementing the score
    } else if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      // Increment score if the answer is correct
      setScore((prevScore) => prevScore + 1);
    }

    // Reset timer and selected answer
    setTimer(30);
    setSelectedAnswer(null);

    // Move to the next question or navigate to result screen
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Use the latest score after state update
      setTimeout(() => {
        navigation.navigate('screen/resultScreen', {
          score: score + (selectedAnswer === questions[currentQuestionIndex].correct_answer ? 1 : 0),
          totalQuestions: questions.length,
          subject: id,
          teacherId: questions[0].teacher,
          teacherName: questions[0].teacher_name,
        });
      }, 500); // Delay to ensure score is updated
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display question number */}
      <Text style={styles.questionText}>
        Question {currentQuestionIndex + 1} / {questions.length}
      </Text>

      {/* Circular timer */}
      <View style={styles.timerContainer}>
        <AnimatedCircularProgress
          size={100}
          width={10}
          fill={(timer / 30) * 100} // Progress based on timer
          tintColor={COLOR.background}
          backgroundColor="#d9f7f4"
          style={styles.timer}
        >
          {() => (
            <Text style={styles.timerText}>{timer}</Text>
          )}
        </AnimatedCircularProgress>
        
        {/* Display current question */}
        <Text style={styles.question}>{currentQuestion.question}</Text>
      </View>

      {/* Options with TouchableOpacity for background change on selection */}
      <View style={styles.optionsContainer}>
        {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map(
          (option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedAnswer === option && { backgroundColor: COLOR.background } // Change background if selected
              ]}
              onPress={() => setSelectedAnswer(option)}
            >
              <Text style={[selectedAnswer === option && { color: COLOR.white }, styles.optionText]}>{option}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <TouchableOpacity 
        style={styles.submitButton} 
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
    padding: 20 
  },
  questionText: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginBottom: 10, 
    fontWeight: 'bold' 
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
    minHeight: 200 
  },
  timerText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: COLOR.background 
  },
  question: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginBottom: 20, 
    marginTop: 10 
  },
  optionsContainer: { 
    marginTop: 20 
  },
  option: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: COLOR.white, // Default option background color
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
  submitButtonText: {
    color: COLOR.white,
    fontSize: 17,
    textAlign: 'center',
  },
});

export default QuizScreen;