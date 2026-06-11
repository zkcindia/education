import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { COLOR } from '../../../constants/Colors';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.15;

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={COLOR.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Inbox</Text>

        <TouchableOpacity>
          <Feather name="search" size={24} color={COLOR.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {Array.from({ length: 10 }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.messageContainer}
          >
            <View style={styles.messageInfo}>
              <Image
                source={{
                  uri: 'https://i.pinimg.com/474x/3d/ed/c4/3dedc41dad74595f0088265bd0672bfc.jpg',
                }}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.background,
    padding: 20,
    paddingTop: 50,
  },

  headerTitle: {
    fontSize: 18,
    color: COLOR.white,
    fontWeight: '600',
  },

  messageContainer: {
    padding: 20,
    borderBottomColor: '#E5E7EB',
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
    gap: 5,
  },

  unreadCount: {
    backgroundColor: COLOR.background,
    color: COLOR.white,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
  },

  timeText: {
    fontSize: 12,
    color: '#7e7c7c',
  },
});