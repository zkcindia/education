import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLOR } from '../../constants/Colors';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import { allClassFetch, fetchSubject } from '../../constants/api/apiHome';
import { uploadQuestions } from '../../constants/api/apiTeacher';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const QuestionUpload = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const [classData, setClassData] = useState([]);
  const [search,setSearch] = useState('')
  const [questionData, setQuestionData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_answer: '',
    subject: selectedSubject,
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [subjectData, setSubjectData] = useState([]);

useEffect(()=>{
  openBottomSheet()
  getClasses()
},[])


  const getClasses = async()=>{
    try {
      const response = await allClassFetch(search);
      console.log(response);
      if(response.status === 200){
        setClassData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Fetch subjects based on selected class
  const getSubjectsByClass = async (id) => {
   
    try {
      const response = await fetchSubject({id,search}); // Call your API
  
      if (response.status === 200) {
        setSubjectData(response.data); // Set subjects for the selected class
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  // Handle class selection and trigger subject fetch
  const handleClassSelection = (classId) => {
    setSelectedClass(classId); // Update selected class
    getSubjectsByClass(classId); // Fetch subjects for the selected class
  };


  const handleInputChange = (field, value) => {
    setQuestionData({ ...questionData, [field]: value });
  };

  const addQuestion = () => {
    if (
      questionData.question &&
      questionData.option1 &&
      questionData.option2 &&
      questionData.option3 &&
      questionData.option4 &&
      questionData.correct_answer &&
      questionData.subject
    ) {
      setQuestions([...questions, questionData]);
      setQuestionData({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_answer: '',
        subject: 1,
      });
    } else {
      Alert.alert("All fields are required");
    }
  };

const handleSubmit = async() => {
    const payload = { questions };
    const userData = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userData)
    const id = parsedData.id
try {

  const response = await uploadQuestions({id,payload})
  console.log(response);
  if(response){
    toast.show('Question saved successfully', {
      type: 'success',
      duration: 2000,
      animationType: 'zoom-in',
      placement:'top',
  })
  navigation.navigate('question');
  }
} catch (error) {
  toast.show('Some error occure',{
    type: 'danger',
    duration: 2000,
    animationType: 'zoom-in',
    placement:'top',
  })
}
  };


  const openBottomSheet = () => {
    setModalVisible(true);
  };

  const closeBottomSheet = () => {
    setModalVisible(false);
  };

  const handleConfirmSelection = () => {
    if (selectedClass && selectedSubject) {
      setQuestionData((prev) => ({
        ...prev,
        subject: selectedSubject, // Update subject id
      }));
      closeBottomSheet();
    } else {
      Alert.alert('Please select both class and subject');
    }
  };

  const classes = classData.map((item) => ({
    label: item.name,
    value: item.id, // Use the ID for value
    // Optionally, you can pass the image or other data here if needed
  }));

  const subjects = subjectData.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Questions</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter question"
        value={questionData.question}
        onChangeText={(value) => handleInputChange('question', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 1"
        value={questionData.option1}
        onChangeText={(value) => handleInputChange('option1', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 2"
        value={questionData.option2}
        onChangeText={(value) => handleInputChange('option2', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 3"
        value={questionData.option3}
        onChangeText={(value) => handleInputChange('option3', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 4"
        value={questionData.option4}
        onChangeText={(value) => handleInputChange('option4', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correct Answer"
        value={questionData.correct_answer}
        onChangeText={(value) => handleInputChange('correct_answer', value)}
      />

      <TouchableOpacity style={styles.addButton} onPress={addQuestion}>
        <Text style={styles.addButtonText}>Add Question</Text>
      </TouchableOpacity>

      <FlatList
        data={questions}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{item.question}</Text>
            <Text style={styles.optionText}>Option 1: {item.option1}</Text>
            <Text style={styles.optionText}>Option 2: {item.option2}</Text>
            <Text style={styles.optionText}>Option 3: {item.option3}</Text>
            <Text style={styles.optionText}>Option 4: {item.option4}</Text>
            <Text style={styles.correctAnswer}>Correct Answer: {item.correct_answer}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Questions</Text>
      </TouchableOpacity>

       {/* Modal for Bottom Sheet */}
       <Modal isVisible={isModalVisible} onBackdropPress={closeBottomSheet}>
        <View style={styles.bottomSheet}>
          <Text style={styles.modalHeader}>Select Class & Subject</Text>

          <Text style={styles.label}>Class</Text>
          <RNPickerSelect
            onValueChange={(value) => handleClassSelection(value)}
            items={classes}
            placeholder={{ label: 'Select Class', value: null }}
            style={pickerSelectStyles}
          />

          <Text style={styles.label}>Subject</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedSubject(value)}
            items={subjects}
            placeholder={{ label: 'Select Subject', value: null }}
            style={pickerSelectStyles}
          />

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSelection}>
            <Text style={styles.confirmButtonText}>Confirm Selection</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  addButton: {
    backgroundColor: '#28A745',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
  },
  correctAnswer: {
    fontSize: 16,
    color: '#28A745',
    fontWeight: 'bold',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: COLOR.background,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  bottomSheet: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
};

export default QuestionUpload;
