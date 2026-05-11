import { View, Text, SafeAreaView, TouchableOpacity, FlatList, StyleSheet, TextInput, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchSubject } from '../../constants/api/apiHome';
import { useToast } from 'react-native-toast-notifications';
import { COLOR } from '../../constants/Colors';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

export default function SubjectScreen() {
    const navigation = useNavigation();
    const toast = useToast();
    const router = useRoute();
    const { id } = router.params || {};
    const [subject, setSubject] = useState([]);
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        fetchallSubject();
    }, [id, search]);

    // Fetch subjects
    const fetchallSubject = async () => {
        setLoader(true);
        try {
            const response = await fetchSubject({ id, search });
            if (response.status === 200) {
                setSubject(response.data);
            }
        } catch (error) {
            toast.show('Some error occurred', {
                type: 'warning',
                duration: 2000,
                animationType: 'zoom-in',
                placement: 'top',
            });
        }
        setLoader(false);
    };

    return (
        <SafeAreaView style={styles.topContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome6 name="angle-left" size={24} color="gray" />
                </TouchableOpacity>
                <Text style={styles.headerText}>All Subject</Text>
            </View>
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#969191" />
                <TextInput
                    placeholder='Search Subject Here...'
                    style={styles.searchInput}
                    onChangeText={setSearch}
                />
            </View>
            <Text style={styles.courseTitle}>Subject List</Text>
            <FlatList
                data={subject}
                showsVerticalScrollIndicator={false}
                onRefresh={fetchallSubject}
                refreshing={loader}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.subjectItem}
                        onPress={() => navigation.navigate('screen/instructionsScreen', { id: item.id })}
                    >
                        <Image source={{ uri: item.image_url }} style={styles.subjectImage} />
                        <View style={styles.subjectDetails}>
                            <Text style={styles.subjectName}>{item?.name}</Text>
                            <Text style={styles.quizCount}>{item?.quiz_count} Questions</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.flatListContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        padding: width * 0.05, // Responsive padding
        paddingTop: height * 0.05, // Top padding based on screen height
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: height * 0.02, // Margin based on screen height
    },
    backButton: {
        position: 'absolute',
        left: 0,
    },
    headerText: {
        fontFamily: 'roboto-bold',
        fontSize: width * 0.045, // Responsive font size based on width
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: "#DDD",
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginVertical: height * 0.02, // Responsive margin based on height
    },
    searchInput: {
        fontFamily: 'roboto',
        fontSize: width * 0.045, // Responsive font size
        width: '100%',
        paddingVertical: 5, // Add vertical padding for better usability
    },
    courseTitle: {
        fontFamily: 'roboto-medium',
        fontSize: width * 0.045, // Responsive font size
        marginVertical: height * 0.01,
    },
    flatListContent: {
        paddingBottom: height * 0.05, // Add bottom padding for FlatList content
    },
    subjectItem: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: height * 0.01, // Responsive margin
        padding: width * 0.04, // Responsive padding
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        elevation: 1, // Add elevation for Android
    },
    subjectImage: {
        width: width * 0.25, // Responsive width
        height: height * 0.1, // Responsive height
        borderRadius: 5, // Rounded corners for images
    },
    subjectDetails: {
        flexDirection: 'column',
        gap: 5,
        justifyContent: 'center',
    },
    subjectName: {
        fontFamily: 'roboto-medium',
        fontSize: width * 0.045, // Responsive font size
        color: COLOR.background,
    },
    quizCount: {
        fontFamily: 'roboto',
        fontSize: width * 0.04, // Responsive font size
    },
});
