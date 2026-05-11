import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, Dimensions } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useNavigation } from 'expo-router';
import { COLOR } from './../../../../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { allClassFetch } from '../../../../constants/api/apiHome';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const navigation = useNavigation();
  const [allClass, setAllClass] = useState([]);
  const [search, setSearch] = useState('');
  const [loader, setLoader] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchClasses();
    }, [])
  );

  const fetchClasses = async () => {
    setLoader(true);
    try {
      const response = await allClassFetch(search);
      if (response.status === 200) {
        setAllClass(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLOR.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Classes</Text>
        <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
          <Feather name="search" size={24} color={COLOR.white} />
        </TouchableOpacity>
      </View>
      {searchVisible && (
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#969191" />
          <TextInput
            placeholder="Search Course Here..."
            style={styles.searchInput}
            onChangeText={setSearch}
          />
        </View>
      )}
      <View style={styles.listContainer}>
        <Text style={styles.courseTitle}>Class List</Text>
        <FlatList
          data={allClass}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchClasses}
          refreshing={loader}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.classCard}
              onPress={() => navigation.navigate('screen/subjectScreen', { id: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.classImage} />
              <View style={styles.classInfo}>
                <Text style={styles.className}>{item?.name}</Text>
                <Text style={styles.classSubjects}>Subject: {item?.subjects_count}</Text>
              </View>
            </TouchableOpacity>
          )}
          style={{ marginTop: 15 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.background,
    padding: 20,
    paddingTop: height * 0.05,
  },
  headerTitle: {
    fontSize: width * 0.045,
    color: COLOR.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: "#DDD",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  searchInput: {
    fontFamily: 'roboto',
    fontSize: width * 0.04,
    width: '85%',
  },
  listContainer: {
    marginHorizontal: 15,
  },
  courseTitle: {
    fontFamily: 'roboto-medium',
    fontSize: width * 0.05,
  },
  classCard: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
    shadowColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: width * 0.03,
  },
  classImage: {
    width: width * 0.25,
    height: height * 0.12,
  },
  classInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  className: {
    fontFamily: 'roboto-medium',
    fontSize: width * 0.045,
    color: COLOR.background,
  },
  classSubjects: {
    fontFamily: 'roboto',
    fontSize: width * 0.04,
  },
});

