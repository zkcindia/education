import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { COLOR } from '../../../../constants/Colors';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.15; // Adjust image size based on screen width

export default function Index() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLOR.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inbox</Text>
        <TouchableOpacity>
          <Feather name="search" size={24} color={COLOR.white} />
        </TouchableOpacity>
      </View>
      
      <View>
        {Array.from({ length: 10 }).map((_, index) => (
          <TouchableOpacity key={index} style={styles.messageContainer}>
            <View style={styles.messageInfo}>
              <Image
                source={{ uri: 'https://i.pinimg.com/474x/3d/ed/c4/3dedc41dad74595f0088265bd0672bfc.jpg' }}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.messageTitle}>John Doe</Text>
                <Text style={styles.messageText}>Hyyy</Text>
              </View>
            </View>
            <View style={styles.timeInfo}>
              {index % 2 === 0 && (
                <Text style={styles.unreadCount}>1</Text>
              )}
              <Text style={styles.timeText}>03:00 PM</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.background,
    padding: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 18,
    color: COLOR.white,
  },
  messageContainer: {
    padding: 20,
    borderBottomColor: '#cfcfcf',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
  messageTitle: {
    color: COLOR.background,
    fontSize: 17,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 15,
    color: '#7e7c7c',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  unreadCount: {
    backgroundColor: COLOR.background,
    padding: 2,
    color: COLOR.white,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    textAlign: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#7e7c7c',
  },
});
