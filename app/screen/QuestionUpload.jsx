import React, { useEffect, useState } from 'react';
import {
  View, TextInput, Button, Text, FlatList,
  TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Platform
} from 'react-native';
import { COLOR } from '../../constants/Colors';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import { allClassFetch, fetchSubject } from '../../constants/api/apiHome';
import { uploadQuestions, uploadBulkQuestions, getBoards, getClassesByBoard, getSubjects } from '../../constants/api/apiTeacher';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';

const QuestionUpload = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const [classData, setClassData] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectData, setSubjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  
  // ✅ NEW STATES FOR BOARD
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boardLoading, setBoardLoading] = useState(false);

  const [questionData, setQuestionData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_answer: '',
    subject: null,
  });

  useEffect(() => {
    openBottomSheet();
    getClasses();
    fetchBoards(); // ✅ Fetch boards on load
  }, []);

  // ✅ FETCH BOARDS
  const fetchBoards = async () => {
    setBoardLoading(true);
    try {
      const response = await getBoards();
      if (response.data?.status === true) {
        setBoards(response.data.data || []);
      }
    } catch (error) {
      console.log('Error fetching boards:', error);
    }
    setBoardLoading(false);
  };

  // ✅ FETCH CLASSES BY BOARD (NEW)
  const fetchClassesByBoard = async (boardName) => {
    try {
      const response = await getClassesByBoard(boardName);
      if (response.data?.status === true) {
        setClassData(response.data.data || []);
      }
    } catch (error) {
      console.log('Error fetching classes by board:', error);
    }
  };

  // ✅ FETCH SUBJECTS BY BOARD & CLASS (NEW)
  const fetchSubjectsByBoardClass = async (boardName, className) => {
    try {
      const response = await getSubjects(boardName, className);
      if (response.data?.status === true) {
        setSubjectData(response.data.data || []);
      }
    } catch (error) {
      console.log('Error fetching subjects:', error);
    }
  };

  const getClasses = async () => {
    try {
      const response = await allClassFetch(search);
      console.log(response);
      if (response.status === 200) {
        setClassData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSubjectsByClass = async (id) => {
    try {
      const response = await fetchSubject({ id, search });
      if (response.status === 200) {
        setSubjectData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ HANDLE BOARD SELECTION
  const handleBoardSelection = (boardId) => {
    const board = boards.find(b => b.id === boardId);
    setSelectedBoard(board);
    setSelectedClass(null);
    setSelectedSubject(null);
    setClassData([]);
    setSubjectData([]);
    if (board) {
      fetchClassesByBoard(board.board_name);
    }
  };

  // ✅ HANDLE CLASS SELECTION (UPDATED)
  const handleClassSelection = (classId) => {
    const classItem = classData.find(c => c.id === classId);
    setSelectedClass(classItem);
    setSelectedSubject(null);
    setSubjectData([]);
    if (selectedBoard && classItem) {
      fetchSubjectsByBoardClass(selectedBoard.board_name, classItem.name);
    }
  };

  // ✅ HANDLE SUBJECT SELECTION
  const handleSubjectSelection = (subjectId) => {
    setSelectedSubject(subjectId);
    setQuestionData((prev) => ({
      ...prev,
      subject: subjectId,
    }));
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
        subject: selectedSubject,
      });
      toast.show('Question added successfully', {
        type: 'success',
        duration: 1500,
        animationType: 'zoom-in',
        placement: 'top',
      });
    } else {
      Alert.alert("All fields are required");
    }
  };

  // Bulk Upload Functions - Using uploadBulkQuestions API with Expo Document Picker
  const handleBulkUpload = async () => {
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject first');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv'
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('User cancelled file picker');
        return;
      }

      const file = result.assets[0];
      setSelectedFile(file);
      
      // Show confirmation before uploading
      Alert.alert(
        'Confirm Upload',
        `Upload file: ${file.name}?`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setSelectedFile(null) },
          { text: 'Upload', onPress: () => uploadFileToServer(file) }
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
      console.log('File picker error:', error);
    }
  };

  const uploadFileToServer = async (file) => {
    setIsLoading(true);
    setFileUploadProgress(0);
    
    try {
      const userData = await AsyncStorage.getItem('userData');
      const parsedData = JSON.parse(userData);
      const teacherId = parsedData.id;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setFileUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Using uploadBulkQuestions function
      const response = await uploadBulkQuestions({
        id: teacherId,
        subject: selectedSubject,
        file: file
      });

      clearInterval(progressInterval);
      setFileUploadProgress(100);

      console.log('Bulk upload response:', response);

      if (response.status === 201 || response.status === 200) {
        toast.show('Questions uploaded successfully from Excel file', {
          type: 'success',
          duration: 3000,
          animationType: 'zoom-in',
          placement: 'top',
        });
        
        // Navigate back or refresh
        setTimeout(() => {
          navigation.navigate('question');
        }, 1500);
      } else {
        throw new Error(response.data?.error || 'Upload failed');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.show(error.message || 'Failed to upload questions', {
        type: 'danger',
        duration: 3000,
        animationType: 'zoom-in',
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setFileUploadProgress(0);
    }
  };

  // Alternative: Preview Excel file before uploading
  const handlePreviewAndUpload = async () => {
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject first');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv'
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('User cancelled file picker');
        return;
      }

      const file = result.assets[0];
      
      // Read and parse the file for preview
      const fileUri = file.uri;
      
      // Read the file content
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Parse the file
      const workbook = XLSX.read(fileContent, { type: 'base64' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      if (jsonData.length === 0) {
        Alert.alert('Error', 'The file is empty or invalid');
        return;
      }
      
      // Show preview and confirm
      Alert.alert(
        'Preview Questions',
        `${jsonData.length} questions found in the file. Upload now?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upload', onPress: () => uploadFileToServer(file) }
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to parse the Excel file. Please check the format.');
      console.log('Parse error:', error);
    }
  };

  // Download Template
  const downloadTemplate = async () => {
    try {
      // Create template data with sample questions
      const templateData = [
        {
          'question': 'What is the capital of France?',
          'option1': 'London',
          'option2': 'Paris',
          'option3': 'Berlin',
          'option4': 'Madrid',
          'correct_answer': 'Paris'
        },
        {
          'question': 'What is 2 + 2?',
          'option1': '3',
          'option2': '4',
          'option3': '5',
          'option4': '6',
          'correct_answer': '4'
        },
        {
          'question': 'Which planet is known as the Red Planet?',
          'option1': 'Venus',
          'option2': 'Mars',
          'option3': 'Jupiter',
          'option4': 'Saturn',
          'correct_answer': 'Mars'
        }
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(templateData);
      XLSX.utils.book_append_sheet(wb, ws, 'Questions');
      
      // Generate file
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      
      // Save file
      const fileUri = FileSystem.documentDirectory + 'question_template.xlsx';
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // For web platform
      if (Platform.OS === 'web') {
        // Create a blob from base64
        const byteCharacters = atob(wbout);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'question_template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // For mobile platforms
        Alert.alert(
          'Template Downloaded',
          `Template saved to: ${fileUri}`,
          [
            { text: 'OK', style: 'default' }
          ]
        );
      }

      toast.show('Template downloaded successfully', {
        type: 'success',
        duration: 2000,
        animationType: 'zoom-in',
        placement: 'top',
      });
      
    } catch (error) {
      console.error('Template download error:', error);
      toast.show('Failed to download template', {
        type: 'danger',
        duration: 2000,
        animationType: 'zoom-in',
        placement: 'top',
      });
    }
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      Alert.alert('No Questions', 'Please add at least one question before submitting');
      return;
    }

    setIsLoading(true);
    const payload = { questions };
    const userData = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(userData);
    const id = parsedData.id;

    try {
      const response = await uploadQuestions({ id, payload });
      console.log(response);
      if (response) {
        toast.show('Questions saved successfully', {
          type: 'success',
          duration: 2000,
          animationType: 'zoom-in',
          placement: 'top',
        });
        setQuestions([]);
        navigation.navigate('question');
      }
    } catch (error) {
      toast.show('Some error occurred', {
        type: 'danger',
        duration: 2000,
        animationType: 'zoom-in',
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openBottomSheet = () => {
    setModalVisible(true);
    fetchBoards(); // ✅ Refresh boards on open
  };

  const closeBottomSheet = () => {
    setModalVisible(false);
  };

  // ✅ UPDATED CONFIRM SELECTION
  const handleConfirmSelection = () => {
    if (selectedBoard && selectedClass && selectedSubject) {
      setQuestionData((prev) => ({
        ...prev,
        subject: selectedSubject,
      }));
      closeBottomSheet();
      toast.show(`Selected: ${selectedBoard.board_name} → ${selectedClass.name} → ${selectedSubject.name}`, {
        type: 'success',
        duration: 1500,
        animationType: 'zoom-in',
        placement: 'top',
      });
    } else {
      Alert.alert('Please select Board, Class and Subject');
    }
  };

  // ✅ MAP DATA FOR PICKER
  const boardItems = boards.map((item) => ({
    label: item.board_name,
    value: item.id,
  }));

  const classItems = classData.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const subjectItems = subjectData.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Upload Questions</Text>

      {/* ✅ UPDATED Selection Status - Shows Board → Class → Subject */}
      {selectedSubject && selectedClass && selectedBoard && (
        <View style={styles.selectionStatus}>
          <Text style={styles.selectionText}>
            📚 {selectedBoard?.board_name} → 📖 {selectedClass?.name} → 📝 {subjectData.find(s => s.id === selectedSubject)?.name || 'Loading...'}
          </Text>
          <TouchableOpacity onPress={openBottomSheet} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bulk Upload Section */}
      <View style={styles.bulkSection}>
        <TouchableOpacity 
          style={[styles.bulkButton, !selectedSubject && styles.disabledButton]} 
          onPress={handleBulkUpload}
          disabled={!selectedSubject || isLoading}
        >
          <Text style={styles.bulkButtonText}>📤 Upload Excel File</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.templateButton} 
          onPress={downloadTemplate}
          disabled={isLoading}
        >
          <Text style={styles.templateButtonText}>📄 Download Template</Text>
        </TouchableOpacity>
      </View>

      {/* Preview and Upload Option */}
      <TouchableOpacity 
        style={[styles.previewButton, !selectedSubject && styles.disabledButton]} 
        onPress={handlePreviewAndUpload}
        disabled={!selectedSubject || isLoading}
      >
        <Text style={styles.previewButtonText}>👁️ Preview Excel Before Upload</Text>
      </TouchableOpacity>

      {/* Upload Progress */}
      {isLoading && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Uploading: {fileUploadProgress}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${fileUploadProgress}%` }]} />
          </View>
        </View>
      )}

      <Text style={styles.orText}>OR Add Manually</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter question"
        value={questionData.question}
        onChangeText={(value) => handleInputChange('question', value)}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 1"
        value={questionData.option1}
        onChangeText={(value) => handleInputChange('option1', value)}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 2"
        value={questionData.option2}
        onChangeText={(value) => handleInputChange('option2', value)}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 3"
        value={questionData.option3}
        onChangeText={(value) => handleInputChange('option3', value)}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Option 4"
        value={questionData.option4}
        onChangeText={(value) => handleInputChange('option4', value)}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Correct Answer"
        value={questionData.correct_answer}
        onChangeText={(value) => handleInputChange('correct_answer', value)}
        editable={!isLoading}
      />

      <TouchableOpacity 
        style={[styles.addButton, isLoading && styles.disabledButton]} 
        onPress={addQuestion}
        disabled={isLoading}
      >
        <Text style={styles.addButtonText}>Add Question</Text>
      </TouchableOpacity>

      {/* Display current questions count */}
      <Text style={styles.questionCount}>
        Total Questions: {questions.length}
      </Text>

      <FlatList
        data={questions}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>Q{index + 1}.</Text>
              <TouchableOpacity
                onPress={() => {
                  const updated = [...questions];
                  updated.splice(index, 1);
                  setQuestions(updated);
                }}
                style={styles.deleteButton}
                disabled={isLoading}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.questionText}>{item.question}</Text>
            <Text style={styles.optionText}>Option 1: {item.option1}</Text>
            <Text style={styles.optionText}>Option 2: {item.option2}</Text>
            <Text style={styles.optionText}>Option 3: {item.option3}</Text>
            <Text style={styles.optionText}>Option 4: {item.option4}</Text>
            <Text style={styles.correctAnswer}>Correct Answer: {item.correct_answer}</Text>
          </View>
        )}
      />

      <TouchableOpacity 
        style={[styles.submitButton, (questions.length === 0 || isLoading) && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={questions.length === 0 || isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Uploading...' : `Submit ${questions.length} Questions`}
        </Text>
      </TouchableOpacity>

      {/* ✅ UPDATED Modal - Board → Class → Subject */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeBottomSheet}>
        <View style={styles.bottomSheet}>
          <Text style={styles.modalHeader}>Select Board → Class → Subject</Text>

          {/* 1️⃣ BOARD */}
          <Text style={styles.label}>Board</Text>
          <RNPickerSelect
            onValueChange={(value) => handleBoardSelection(value)}
            items={boardItems}
            placeholder={{ label: 'Select Board', value: null }}
            style={pickerSelectStyles}
            disabled={isLoading || boardLoading}
          />

          {/* 2️⃣ CLASS - Only show when board selected */}
          {selectedBoard && (
            <>
              <Text style={styles.label}>Class</Text>
              <RNPickerSelect
                onValueChange={(value) => handleClassSelection(value)}
                items={classItems}
                placeholder={{ label: 'Select Class', value: null }}
                style={pickerSelectStyles}
                disabled={isLoading}
              />
            </>
          )}

          {/* 3️⃣ SUBJECT - Only show when class selected */}
          {selectedClass && (
            <>
              <Text style={styles.label}>Subject</Text>
              <RNPickerSelect
                onValueChange={(value) => handleSubjectSelection(value)}
                items={subjectItems}
                placeholder={{ label: 'Select Subject', value: null }}
                style={pickerSelectStyles}
                disabled={isLoading}
              />
            </>
          )}

          <TouchableOpacity 
            style={[styles.confirmButton, !selectedSubject && styles.disabledButton]} 
            onPress={handleConfirmSelection}
            disabled={!selectedSubject || isLoading}
          >
            <Text style={styles.confirmButtonText}>
              {selectedSubject ? '✅ Confirm Selection' : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
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
  selectionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  selectionText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
    flex: 1,
  },
  changeButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  changeButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bulkSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bulkButton: {
    flex: 1,
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginRight: 5,
  },
  bulkButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  templateButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginLeft: 5,
  },
  templateButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  previewButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  progressContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 4,
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginVertical: 10,
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
    marginBottom: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  questionCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    marginTop: 10,
    fontWeight: '500',
  },
  bottomSheet: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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