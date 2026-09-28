import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, AntDesign } from '@expo/vector-icons';
import { allClassFetch, fetchSubject } from '../../constants/api/apiHome';
import {
  uploadQuestions,
  uploadBulkQuestions,
  getBoards,
  getClassesByBoard,
  getSubjects,
} from '../../constants/api/apiTeacher';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

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

  // ✅ Page load par modal automatically open
  useEffect(() => {
    openBottomSheet();
    getClasses();
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    setBoardLoading(true);
    try {
      const response = await getBoards();
      console.log('📚 Boards Response:', response.data);
      if (response.data?.status === true) {
        setBoards(response.data.data || []);
      } else {
        setBoards(response.data || []);
      }
    } catch (error) {
      console.log('Error fetching boards:', error);
      setBoards([]);
    }
    setBoardLoading(false);
  };

  const fetchClassesByBoard = async (boardName) => {
    try {
      const response = await getClassesByBoard(boardName);
      console.log('📖 Classes Response:', response.data);
      if (response.data?.status === true) {
        setClassData(response.data.data || []);
      } else {
        setClassData(response.data || []);
      }
    } catch (error) {
      console.log('Error fetching classes by board:', error);
      setClassData([]);
    }
  };

  const fetchSubjectsByBoardClass = async (boardName, className) => {
    try {
      const response = await getSubjects(boardName, className);
      console.log('📝 Subjects Response:', response.data);
      if (response.data?.status === true) {
        setSubjectData(response.data.data || []);
      } else {
        setSubjectData(response.data || []);
      }
    } catch (error) {
      console.log('Error fetching subjects:', error);
      setSubjectData([]);
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

  const handleBoardSelection = (boardId) => {
    console.log('📚 Board Selected:', boardId);
    if (!boardId) {
      setSelectedBoard(null);
      setSelectedClass(null);
      setSelectedSubject(null);
      setClassData([]);
      setSubjectData([]);
      return;
    }

    const board = boards.find((b) => String(b.id) === String(boardId));
    console.log('📚 Board Found:', board);

    if (board) {
      setSelectedBoard(board);
      setSelectedClass(null);
      setSelectedSubject(null);
      setClassData([]);
      setSubjectData([]);
      fetchClassesByBoard(board.board_name);
    }
  };

  const handleClassSelection = (classId) => {
    console.log('📖 Class Selected:', classId);
    if (!classId) {
      setSelectedClass(null);
      setSelectedSubject(null);
      setSubjectData([]);
      return;
    }

    const classItem = classData.find((c) => String(c.id) === String(classId));
    console.log('📖 Class Found:', classItem);

    if (classItem) {
      setSelectedClass(classItem);
      setSelectedSubject(null);
      setSubjectData([]);
      if (selectedBoard) {
        fetchSubjectsByBoardClass(selectedBoard.board_name, classItem.name);
      }
    }
  };

  const handleSubjectSelection = (subjectId) => {
    console.log('📝 Subject Selected:', subjectId);
    if (!subjectId) {
      setSelectedSubject(null);
      setQuestionData((prev) => ({
        ...prev,
        subject: null,
      }));
      return;
    }

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
      Alert.alert('All fields are required');
    }
  };

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
          'text/csv',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('User cancelled file picker');
        return;
      }

      const file = result.assets[0];
      setSelectedFile(file);

      Alert.alert('Confirm Upload', `Upload file: ${file.name}?`, [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setSelectedFile(null),
        },
        { text: 'Upload', onPress: () => uploadFileToServer(file) },
      ]);
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

      const progressInterval = setInterval(() => {
        setFileUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await uploadBulkQuestions({
        id: teacherId,
        subject: selectedSubject,
        file: file,
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
          'text/csv',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('User cancelled file picker');
        return;
      }

      const file = result.assets[0];
      const fileUri = file.uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const workbook = XLSX.read(fileContent, { type: 'base64' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      if (jsonData.length === 0) {
        Alert.alert('Error', 'The file is empty or invalid');
        return;
      }

      Alert.alert(
        'Preview Questions',
        `${jsonData.length} questions found in the file. Upload now?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upload', onPress: () => uploadFileToServer(file) },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to parse the Excel file. Please check the format.'
      );
      console.log('Parse error:', error);
    }
  };

  const downloadTemplate = async () => {
    try {
      const templateData = [
        {
          question: 'What is the capital of France?',
          option1: 'London',
          option2: 'Paris',
          option3: 'Berlin',
          option4: 'Madrid',
          correct_answer: 'Paris',
        },
        {
          question: 'What is 2 + 2?',
          option1: '3',
          option2: '4',
          option3: '5',
          option4: '6',
          correct_answer: '4',
        },
        {
          question: 'Which planet is known as the Red Planet?',
          option1: 'Venus',
          option2: 'Mars',
          option3: 'Jupiter',
          option4: 'Saturn',
          correct_answer: 'Mars',
        },
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(templateData);
      XLSX.utils.book_append_sheet(wb, ws, 'Questions');

      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const fileUri = FileSystem.documentDirectory + 'question_template.xlsx';
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (Platform.OS === 'web') {
        const byteCharacters = atob(wbout);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'question_template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        Alert.alert('Template Downloaded', `Template saved to: ${fileUri}`, [
          { text: 'OK', style: 'default' },
        ]);
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
      Alert.alert(
        'No Questions',
        'Please add at least one question before submitting'
      );
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
    fetchBoards();
  };

  const closeBottomSheet = () => {
    setModalVisible(false);
  };

  const handleConfirmSelection = () => {
    console.log(
      '✅ Confirm clicked - Board:',
      selectedBoard,
      'Class:',
      selectedClass,
      'Subject:',
      selectedSubject
    );

    if (selectedBoard && selectedClass && selectedSubject) {
      setQuestionData((prev) => ({
        ...prev,
        subject: selectedSubject,
      }));
      setModalVisible(false);

      toast.show(
        `Selected: ${selectedBoard.board_name} → ${selectedClass.name} → ${selectedSubject.name}`,
        {
          type: 'success',
          duration: 1500,
          animationType: 'zoom-in',
          placement: 'top',
        }
      );
    } else {
      Alert.alert('Please select Board, Class and Subject');
    }
  };

  const boardItems = boards.map((item) => ({
    label: item.board_name || item.name || 'Unknown Board',
    value: item.id,
  }));

  const classItems = classData.map((item) => ({
    label: item.name || 'Unknown Class',
    value: item.id,
  }));

  const subjectItems = subjectData.map((item) => ({
    label: item.name || 'Unknown Subject',
    value: item.id,
  }));

  // ✅ CHECK - Subject select hua ya nahi
  const isSubjectSelected = selectedSubject !== null;

  return (
    <View style={styles.container}>
      {/* 🔵 GRADIENT HEADER */}
      <LinearGradient
        colors={['#4F46E5', '#6D28D9', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Upload Questions</Text>

          <View style={styles.headerIconBox}>
            <View style={styles.headerGlowCircle} />
            <Text style={styles.headerIconEmoji}>📝</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ✅ Selection Status - Jab subject select ho tabhi dikhe */}
        {isSubjectSelected && (
          <View style={styles.selectionStatus}>
            <View style={styles.selectionLeft}>
              <View style={styles.selectionIconBox}>
                <Feather name="check-circle" size={16} color="#10B981" />
              </View>
              <Text style={styles.selectionText} numberOfLines={2}>
                {selectedBoard?.board_name || 'Board'} → {selectedClass?.name || 'Class'} →{' '}
                {subjectData.find((s) => String(s.id) === String(selectedSubject))
                  ?.name || 'Subject'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={openBottomSheet}
              style={styles.changeButton}
              activeOpacity={0.8}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ✅ ONLY SHOW FORM WHEN SUBJECT IS SELECTED */}
        {isSubjectSelected ? (
          <>
            <View style={styles.bulkSection}>
              <TouchableOpacity
                style={styles.bulkButton}
                onPress={handleBulkUpload}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Feather name="upload" size={16} color="#fff" />
                <Text style={styles.bulkButtonText}>Upload Excel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.templateButton}
                onPress={downloadTemplate}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Feather name="download" size={16} color="#4F46E5" />
                <Text style={styles.templateButtonText}>Template</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.previewButton}
              onPress={handlePreviewAndUpload}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Feather name="eye" size={16} color="#fff" />
              <Text style={styles.previewButtonText}>
                Preview Excel Before Upload
              </Text>
            </TouchableOpacity>

            {isLoading && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  Uploading: {fileUploadProgress}%
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${fileUploadProgress}%` },
                    ]}
                  />
                </View>
              </View>
            )}

            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR Add Manually</Text>
              <View style={styles.orLine} />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Question</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your question"
                placeholderTextColor="#9CA3AF"
                value={questionData.question}
                onChangeText={(value) => handleInputChange('question', value)}
                editable={!isLoading}
              />

              <Text style={styles.inputLabel}>Options</Text>
              <TextInput
                style={styles.input}
                placeholder="Option 1"
                placeholderTextColor="#9CA3AF"
                value={questionData.option1}
                onChangeText={(value) => handleInputChange('option1', value)}
                editable={!isLoading}
              />
              <TextInput
                style={styles.input}
                placeholder="Option 2"
                placeholderTextColor="#9CA3AF"
                value={questionData.option2}
                onChangeText={(value) => handleInputChange('option2', value)}
                editable={!isLoading}
              />
              <TextInput
                style={styles.input}
                placeholder="Option 3"
                placeholderTextColor="#9CA3AF"
                value={questionData.option3}
                onChangeText={(value) => handleInputChange('option3', value)}
                editable={!isLoading}
              />
              <TextInput
                style={styles.input}
                placeholder="Option 4"
                placeholderTextColor="#9CA3AF"
                value={questionData.option4}
                onChangeText={(value) => handleInputChange('option4', value)}
                editable={!isLoading}
              />

              <Text style={styles.inputLabel}>Correct Answer</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter correct answer"
                placeholderTextColor="#9CA3AF"
                value={questionData.correct_answer}
                onChangeText={(value) =>
                  handleInputChange('correct_answer', value)
                }
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.addButton, isLoading && styles.disabledButton]}
              onPress={addQuestion}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Feather name="plus-circle" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Add Question</Text>
            </TouchableOpacity>

            <View style={styles.questionCountRow}>
              <Text style={styles.questionCountLabel}>Total Questions</Text>
              <View style={styles.questionCountBadge}>
                <Text style={styles.questionCountNumber}>
                  {questions.length}
                </Text>
              </View>
            </View>

            <FlatList
              data={questions}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <View style={styles.questionNumberBox}>
                      <Text style={styles.questionNumber}>Q{index + 1}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        const updated = [...questions];
                        updated.splice(index, 1);
                        setQuestions(updated);
                      }}
                      style={styles.deleteButton}
                      disabled={isLoading}
                    >
                      <Feather name="trash-2" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.questionText}>{item.question}</Text>
                  <Text style={styles.optionText}>1. {item.option1}</Text>
                  <Text style={styles.optionText}>2. {item.option2}</Text>
                  <Text style={styles.optionText}>3. {item.option3}</Text>
                  <Text style={styles.optionText}>4. {item.option4}</Text>
                  <View style={styles.correctRow}>
                    <Feather name="check-circle" size={14} color="#10B981" />
                    <Text style={styles.correctAnswer}>
                      Correct: {item.correct_answer}
                    </Text>
                  </View>
                </View>
              )}
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                (questions.length === 0 || isLoading) && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={questions.length === 0 || isLoading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#7C3AED', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading
                    ? 'Uploading...'
                    : `Submit ${questions.length} Questions`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          // ✅ Jab subject select na ho - sirf yeh message dikhe
          <View style={styles.noSelectionContainer}>
            <View style={styles.noSelectionIconBox}>
              <AntDesign name="exclamationcircle" size={50} color="#4F46E5" />
            </View>
            <Text style={styles.noSelectionText}>
              Please select Board → Class → Subject
            </Text>
            <Text style={styles.noSelectionSubText}>
              You need to select a subject first before adding questions
            </Text>
            <TouchableOpacity
              onPress={openBottomSheet}
              style={styles.selectNowButton}
              activeOpacity={0.85}
            >
              <Feather name="check" size={16} color="#fff" />
              <Text style={styles.selectNowButtonText}>Select Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ✅ MODAL */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeBottomSheet}
        onSwipeComplete={closeBottomSheet}
        swipeDirection="down"
        avoidKeyboard={true}
        style={styles.modalStyle}
      >
        <View style={styles.bottomSheet}>
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalHeader}>
              Select Board → Class → Subject
            </Text>
            <TouchableOpacity
              onPress={closeBottomSheet}
              style={styles.closeModalBtn}
            >
              <Feather name="x" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Board</Text>
          <RNPickerSelect
            onValueChange={(value) => handleBoardSelection(value)}
            items={boardItems}
            placeholder={{ label: 'Select Board', value: null }}
            style={pickerSelectStyles}
            disabled={isLoading || boardLoading}
            useNativeAndroidPickerStyle={false}
          />

          {selectedBoard && (
            <>
              <Text style={styles.label}>Class</Text>
              <RNPickerSelect
                onValueChange={(value) => handleClassSelection(value)}
                items={classItems}
                placeholder={{ label: 'Select Class', value: null }}
                style={pickerSelectStyles}
                disabled={isLoading || classData.length === 0}
                useNativeAndroidPickerStyle={false}
              />
            </>
          )}

          {selectedClass && (
            <>
              <Text style={styles.label}>Subject</Text>
              <RNPickerSelect
                onValueChange={(value) => handleSubjectSelection(value)}
                items={subjectItems}
                placeholder={{ label: 'Select Subject', value: null }}
                style={pickerSelectStyles}
                disabled={isLoading || subjectData.length === 0}
                useNativeAndroidPickerStyle={false}
              />
            </>
          )}

          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!selectedBoard || !selectedClass || !selectedSubject) &&
                styles.disabledButton,
            ]}
            onPress={handleConfirmSelection}
            disabled={
              !selectedBoard || !selectedClass || !selectedSubject || isLoading
            }
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#7C3AED', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.confirmGradient}
            >
              <Text style={styles.confirmButtonText}>
                {selectedBoard && selectedClass && selectedSubject
                  ? '✅ Confirm Selection'
                  : 'Please select Board → Class → Subject'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // 🔵 HEADER GRADIENT
  headerGradient: {
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircle1: {
    position: 'absolute',
    top: -60,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -70,
    left: -60,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerRow: {
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
  headerTitle: {
    fontSize: 17,
    color: '#fff',
    fontFamily: 'roboto-bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  headerIconBox: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerGlowCircle: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  headerIconEmoji: {
    fontSize: 26,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },

  // 📦 Scroll Body
  scrollBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // ✅ Selection Status
  selectionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 8,
  },
  selectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  selectionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 12,
    color: '#065F46',
    fontFamily: 'roboto-bold',
    flex: 1,
    lineHeight: 16,
  },
  changeButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  changeButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'roboto-bold',
  },

  // 📤 Bulk Section
  bulkSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  bulkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 12,
  },
  bulkButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'roboto-bold',
  },
  templateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  templateButtonText: {
    color: '#4F46E5',
    fontSize: 13,
    fontFamily: 'roboto-bold',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  previewButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'roboto-bold',
  },
  disabledButton: {
    opacity: 0.5,
  },

  // 📊 Progress
  progressContainer: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  progressText: {
    fontSize: 13,
    color: '#1E3A8A',
    fontFamily: 'roboto-bold',
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },

  // 🔀 OR Divider
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'roboto-bold',
  },

  // 📝 Form Section
  formSection: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    color: '#1E3A8A',
    fontFamily: 'roboto-bold',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    fontSize: 14,
    color: '#1E3A8A',
    fontFamily: 'roboto',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  // ➕ Add Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'roboto-bold',
  },

  // 🔢 Question Count
  questionCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionCountLabel: {
    fontSize: 14,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
  },
  questionCountBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 32,
    alignItems: 'center',
  },
  questionCountNumber: {
    fontSize: 13,
    fontFamily: 'roboto-bold',
    color: '#4F46E5',
  },

  // 📋 Question Card
  questionCard: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
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
    fontSize: 12,
    fontFamily: 'roboto-bold',
    color: '#4F46E5',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 14,
    fontFamily: 'roboto-bold',
    marginBottom: 8,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  optionText: {
    fontSize: 12,
    color: '#4B5563',
    fontFamily: 'roboto',
    marginBottom: 2,
  },
  correctRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  correctAnswer: {
    fontSize: 12,
    color: '#065F46',
    fontFamily: 'roboto-bold',
  },

  // 🚀 Submit Button
  submitButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'roboto-bold',
  },

  // 📌 Modal
  label: {
    fontSize: 13,
    color: '#1E3A8A',
    marginBottom: 6,
    marginTop: 10,
    fontFamily: 'roboto-bold',
  },
  bottomSheet: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    maxHeight: '80%',
  },
  modalStyle: {
    margin: 0,
    justifyContent: 'center',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeader: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
    flex: 1,
  },
  closeModalBtn: {
    padding: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  confirmGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'roboto-bold',
  },

  // 🚫 No Selection
  noSelectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginTop: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noSelectionIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noSelectionText: {
    fontSize: 16,
    color: '#1E3A8A',
    textAlign: 'center',
    fontFamily: 'roboto-bold',
  },
  noSelectionSubText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'roboto',
    lineHeight: 18,
  },
  selectNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  selectNowButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'roboto-bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    color: '#1E3A8A',
    paddingRight: 30,
    backgroundColor: '#FFF',
    marginBottom: 10,
    fontFamily: 'roboto',
  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    color: '#1E3A8A',
    paddingRight: 30,
    backgroundColor: '#FFF',
    marginBottom: 10,
    fontFamily: 'roboto',
  },
};

export default QuestionUpload;