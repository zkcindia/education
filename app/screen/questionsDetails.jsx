import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons'; // For the eye icon
import { deleteQuestions } from '../../constants/api/apiTeacher';
import { useToast } from 'react-native-toast-notifications';

export default function QuestionsDetails() {
  const router = useRoute();
  const toast = useToast()
  const navigation = useNavigation(); // For navigation to edit screen
  const { item } = router.params || {};
  const [showAnswer, setShowAnswer] = useState(false);

  // Toggle answer visibility
  const toggleAnswerVisibility = () => {
    setShowAnswer(!showAnswer);
  };

  // Edit function
  const handleEdit = () => {
    // Navigate to an edit screen, passing the current item as a parameter
    navigation.navigate('screen/questionEditScreen', { item });
  };

  // Delete function with confirmation alert
  const handleDelete = () => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async() => {
            // Implement your delete logic here
            try {
                const response = await deleteQuestions(item?.id)
                if(response.status === 204){
                    toast.show('Question delete successfully', {
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
                  navigation.navigate('question');
            }
            console.log('Deleted question:', item?.id);
            // For example, you can make an API call to delete the item
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
         <View style={styles.headerContainer}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{position:'absolute',left:0}}>
            <FontAwesome6 name="angle-left" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Question Details</Text>
      </View>
      {/* Question */}
      <Text style={styles.questionText}>{item?.question}</Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        <Text style={styles.optionText}>1. {item?.option1}</Text>
        <Text style={styles.optionText}>2. {item?.option2}</Text>
        <Text style={styles.optionText}>3. {item?.option3}</Text>
        <Text style={styles.optionText}>4. {item?.option4}</Text>
      </View>

      {/* Answer Section */}
      <View style={styles.answerContainer}>
        <Text style={styles.answerLabel}>Correct Answer:</Text>

        {/* Eye icon to toggle visibility */}
        <TouchableOpacity onPress={toggleAnswerVisibility} style={styles.eyeIcon}>
          <Ionicons name={showAnswer ? 'eye-off' : 'eye'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Conditionally show/hide the answer */}
      {showAnswer && <Text style={styles.answerText}>{item?.correct_answer}</Text>}

      {/* Edit and Delete Buttons */}
      <View style={styles.buttonContainer}>
        {/* Edit Button */}
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop:25
  },
  headerContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:25
  },
  headerText:{
    fontFamily:'roboto-bold',
    fontSize:18,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionText: {
    fontSize: 18,
    paddingVertical: 8,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    color: '#555',
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  answerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  answerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008000',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
