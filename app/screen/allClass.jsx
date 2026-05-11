import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLOR } from '../../constants/Colors';
import { allClassFetch } from '../../constants/api/apiHome';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AllClass() {
    const navigation = useNavigation();
    const [allClass, setAllClass] = useState([]);
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, [search]);

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
        <SafeAreaView style={styles.topContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome6 name="angle-left" size={24} color="gray" />
                </TouchableOpacity>
                <Text style={styles.headerText}>All Classes</Text>
            </View>
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#969191" />
                <TextInput
                    placeholder='Search Course Here...'
                    style={styles.searchInput}
                    onChangeText={setSearch}
                />
            </View>
            <Text style={styles.courseTitle}>Class List</Text>
            <FlatList
                data={allClass}
                showsVerticalScrollIndicator={false}
                onRefresh={fetchClasses}
                refreshing={loader}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.courseContainer}
                        onPress={() => navigation.navigate('screen/subjectScreen', { id: item.id })}
                    >
                        <Image source={{ uri: item.image }} style={styles.courseImage} />
                        <View style={styles.courseDetails}>
                            <Text style={styles.courseName}>{item?.name}</Text>
                            <Text style={styles.subjectCount}>Subject: {item?.subjects_count}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        padding: 15,
        paddingTop: 28,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 0,
    },
    headerText: {
        fontFamily: 'roboto-bold',
        fontSize: 18,
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
    },
    searchInput: {
        fontFamily: 'roboto',
        fontSize: 18,
        width: '80%', // Adjust the width to be responsive
    },
    courseTitle: {
        fontFamily: 'roboto-medium',
        fontSize: 18,
    },
    listContent: {
        paddingBottom: 20, // Provide some bottom padding
    },
    courseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10,
        shadowColor: '#000',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        padding: 10,
    },
    courseImage: {
        width: width * 0.25, // 25% of the screen width
        height: height * 0.12, // Adjusted height
        borderRadius: 5,
    },
    courseDetails: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    courseName: {
        fontFamily: 'roboto-medium',
        fontSize: 18,
        color: COLOR.background,
    },
    subjectCount: {
        fontFamily: 'roboto',
        fontSize: 15,
    },
});
