import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOR } from '../../constants/Colors';

export default function AllClass() {
  const navigation = useNavigation();

  useEffect(() => {
    redirectToSubjects();
  }, []);

  const redirectToSubjects = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');

      if (data) {
        const userData = JSON.parse(data);

        navigation.replace('screen/subjectScreen', {
          boardName: userData?.Education_board,
          className: userData?.class,
        });
      }
    } catch (error) {
      console.log('REDIRECT ERROR:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLOR.background} />
      <Text style={styles.text}>Loading subjects...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    marginTop: 10,
    fontFamily: 'roboto',
  },
});