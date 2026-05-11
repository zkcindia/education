import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { COLOR } from '../../constants/Colors';
import { useToast } from 'react-native-toast-notifications';
import { editQuestions } from '../../constants/api/apiTeacher';

export default function EditQuestion() {
  const route = useRoute();
  const navigation = useNavigation();
  const toast = useToast();
  
  // Destructure item passed from the previous screen
  const { item } = route.params || {};

  // Set up state for each input field, initialized with current values
  const [question, setQuestion] = useState(item?.question || '');
  const [option1, setOption1] = useState(item?.option1 || '');
  const [option2, setOption2] = useState(item?.option2 || '');
  const [option3, setOption3] = useState(item?.option3 || '');
  const [option4, setOption4] = useState(item?.option4 || '');
  const [correctAnswer, setCorrectAnswer] = useState(item?.correct_answer || '');

  // Function to handle save (You can add an API call to update the data here)
  const handleSave = async() => {
    // For now, we'll just log the updated values
    console.log('Updated Question:', { question, option1, option2, option3, option4, correctAnswer });
    try {
        const data = {question,option1,option2,option3,option4,correct_answer:correctAnswer}
        const response = await editQuestions({id:item?.id,data})
        console.log(response);
        if(response.status===200){
            toast.show('Question updated successfully', {
                type: 'success',
                duration: 2000,
                animationType: 'zoom-in',
                placement:'top',
            })
        }
        // Navigate back to the previous screen or show a success message
        navigation.navigate('question');
    } catch (error) {
        toast.show('Some error occure',{
            type: 'danger',
            duration: 2000,
            animationType: 'zoom-in',
            placement:'top',
          })
    }
    
  };

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{position:'absolute',left:0}}>
            <FontAwesome6 name="angle-left" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Question</Text>
      </View>
      {/* Label and Editable Fields */}
      <Text style={styles.label}>Question</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter question"
        value={question}
        onChangeText={setQuestion}
      />

      <Text style={styles.label}>Option 1</Text>
      <TextInput
        style={styles.input}
        placeholder="Option 1"
        value={option1}
        onChangeText={setOption1}
      />

      <Text style={styles.label}>Option 2</Text>
      <TextInput
        style={styles.input}
        placeholder="Option 2"
        value={option2}
        onChangeText={setOption2}
      />

      <Text style={styles.label}>Option 3</Text>
      <TextInput
        style={styles.input}
        placeholder="Option 3"
        value={option3}
        onChangeText={setOption3}
      />

      <Text style={styles.label}>Option 4</Text>
      <TextInput
        style={styles.input}
        placeholder="Option 4"
        value={option4}
        onChangeText={setOption4}
      />

      <Text style={styles.label}>Correct Answer</Text>
      <TextInput
        style={styles.input}
        placeholder="Correct Answer"
        value={correctAnswer}
        onChangeText={setCorrectAnswer}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop:25,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 15, // Space between inputs
  },
  saveButton: {
    backgroundColor: COLOR.background,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
