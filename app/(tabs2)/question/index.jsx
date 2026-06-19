import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLOR } from '../../../constants/Colors';
import { useToast } from 'react-native-toast-notifications';
import { 
    getBoards, 
    getClassesByBoard, 
    getSubjects,
    getQuestionsBySubject,
    deleteQuestions 
} from '../../../constants/api/apiTeacher';

export default function AllClasses() {
    const navigation = useNavigation();
    const toast = useToast();
    
    // States
    const [boards, setBoards] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [questions, setQuestions] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    
    const [viewMode, setViewMode] = useState('boards');
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // ============================================
    // 1️⃣ FETCH BOARDS
    // ============================================
    const fetchBoards = async () => {
        setLoading(true);
        try {
            const response = await getBoards();
            if (response.data?.status === true) {
                setBoards(response.data.data || []);
            }
        } catch (error) {
            toast.show('Error fetching boards', {
                type: 'danger',
                duration: 2000,
                placement: 'top',
            });
        }
        setLoading(false);
    };

    // ============================================
    // 2️⃣ FETCH CLASSES BY BOARD
    // ============================================
    const fetchClasses = async (boardName) => {
        setLoading(true);
        try {
            const response = await getClassesByBoard(boardName);
            if (response.data?.status === true) {
                setClasses(response.data.data || []);
            } else {
                setClasses([]);
            }
        } catch (error) {
            toast.show('Error fetching classes', {
                type: 'danger',
                duration: 2000,
                placement: 'top',
            });
            setClasses([]);
        }
        setLoading(false);
    };

    // ============================================
    // 3️⃣ FETCH SUBJECTS
    // ============================================
    const fetchSubjects = async (boardName, className) => {
        setLoading(true);
        try {
            const response = await getSubjects(boardName, className);
            if (response.data?.status === true) {
                setSubjects(response.data.data || []);
            } else {
                setSubjects([]);
            }
        } catch (error) {
            toast.show('Error fetching subjects', {
                type: 'danger',
                duration: 2000,
                placement: 'top',
            });
            setSubjects([]);
        }
        setLoading(false);
    };

    // ============================================
    // 4️⃣ FETCH QUESTIONS BY SUBJECT
    // ============================================
    const fetchQuestions = async (subjectId) => {
        setLoading(true);
        try {
            const response = await getQuestionsBySubject(subjectId);
            if (response.status === 200) {
                let data = response.data;
                if (data.questions) data = data.questions;
                if (!Array.isArray(data)) data = [];
                setQuestions(data);
            } else {
                setQuestions([]);
            }
        } catch (error) {
            toast.show('Error fetching questions', {
                type: 'danger',
                duration: 2000,
                placement: 'top',
            });
            setQuestions([]);
        }
        setLoading(false);
    };

    // ============================================
    // 5️⃣ DELETE QUESTION
    // ============================================
    const handleDelete = (question) => {
        Alert.alert(
            'Delete Question',
            'Are you sure you want to delete this question?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await deleteQuestions(question.id);
                            if (response.status === 200) {
                                toast.show('Question deleted', { 
                                    type: 'success', 
                                    duration: 2000, 
                                    placement: 'top' 
                                });
                                if (selectedSubject) {
                                    fetchQuestions(selectedSubject.id);
                                }
                            }
                        } catch (error) {
                            toast.show('Delete failed', { 
                                type: 'danger', 
                                duration: 2000, 
                                placement: 'top' 
                            });
                        }
                    }
                }
            ]
        );
    };

    // ============================================
    // 6️⃣ NAVIGATION HANDLERS
    // ============================================
    const handleBoardClick = (board) => {
        setSelectedBoard(board);
        setViewMode('classes');
        setSearch('');
        fetchClasses(board.board_name);
    };

    const handleClassClick = (classItem) => {
        setSelectedClass(classItem);
        setViewMode('subjects');
        setSearch('');
        fetchSubjects(selectedBoard?.board_name, classItem.name);
    };

    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
        setViewMode('questions');
        setSearch('');
        fetchQuestions(subject.id);
    };

    const handleBack = () => {
        if (viewMode === 'questions') {
            setViewMode('subjects');
            setSelectedSubject(null);
            setQuestions([]);
        } else if (viewMode === 'subjects') {
            setViewMode('classes');
            setSelectedClass(null);
            setSubjects([]);
        } else if (viewMode === 'classes') {
            setViewMode('boards');
            setSelectedBoard(null);
            setClasses([]);
        } else {
            navigation.goBack();
        }
    };

    // ============================================
    // 7️⃣ GET HEADER
    // ============================================
    const getTitle = () => {
        if (viewMode === 'questions') return selectedSubject?.name || 'Questions';
        if (viewMode === 'subjects') return selectedClass?.name || 'Subjects';
        if (viewMode === 'classes') return selectedBoard?.board_name || 'Classes';
        return 'Education Boards';
    };

    const getSubtitle = () => {
        if (viewMode === 'questions') return `${selectedClass?.name} • ${questions.length}`;
        if (viewMode === 'subjects') return `${subjects.length} subjects`;
        if (viewMode === 'classes') return `${classes.length} classes`;
        return `${boards.length} boards`;
    };

    // ============================================
    // 8️⃣ RENDER FUNCTIONS
    // ============================================
    const renderBoards = () => {
        const filtered = boards.filter(b => 
            b.board_name?.toLowerCase().includes(search.toLowerCase())
        );

        if (loading) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLOR.background} />
                    <Text style={styles.loadingText}>Loading boards...</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filtered}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => handleBoardClick(item)}>
                        <View style={styles.cardLeft}>
                            <View style={[styles.icon, { backgroundColor: '#6C63FF20' }]}>
                                <Text style={[styles.iconText, { color: '#6C63FF' }]}>
                                    {item.board_name?.charAt(0) || 'B'}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>{item.board_name}</Text>
                                <Text style={styles.cardSubtitle}>View Classes</Text>
                            </View>
                        </View>
                        <FontAwesome6 name="chevron-right" size={16} color="#CCC" />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No boards found</Text>
                    </View>
                )}
            />
        );
    };

    const renderClasses = () => {
        const filtered = classes.filter(c => 
            c.name?.toLowerCase().includes(search.toLowerCase())
        );

        if (loading) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLOR.background} />
                    <Text style={styles.loadingText}>Loading classes...</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filtered}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => handleClassClick(item)}>
                        <View style={styles.cardLeft}>
                            <View style={[styles.icon, { backgroundColor: COLOR.background + '20' }]}>
                                <Text style={[styles.iconText, { color: COLOR.background }]}>
                                    {item.name?.charAt(0) || 'C'}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardSubtitle}>View Subjects</Text>
                            </View>
                        </View>
                        <FontAwesome6 name="chevron-right" size={16} color="#CCC" />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No classes found</Text>
                    </View>
                )}
            />
        );
    };

    const renderSubjects = () => {
        const filtered = subjects.filter(s => 
            s.name?.toLowerCase().includes(search.toLowerCase())
        );

        if (loading) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLOR.background} />
                    <Text style={styles.loadingText}>Loading subjects...</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filtered}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => handleSubjectClick(item)}>
                        <View style={styles.cardLeft}>
                            <View style={[styles.icon, { backgroundColor: '#6C63FF20' }]}>
                                <Text style={[styles.iconText, { color: '#6C63FF' }]}>
                                    {item.name?.charAt(0) || 'S'}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardSubtitle}>
                                    {item.id === 1 ? `${questions.length} Questions` : '0 Questions'}
                                </Text>
                            </View>
                        </View>
                        <FontAwesome6 name="chevron-right" size={16} color="#CCC" />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No subjects found</Text>
                    </View>
                )}
            />
        );
    };

    const renderQuestions = () => {
        const filtered = questions.filter(q => 
            q.question?.toLowerCase().includes(search.toLowerCase())
        );

        if (loading) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLOR.background} />
                    <Text style={styles.loadingText}>Loading questions...</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filtered}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.questionCard}>
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionNumber}>Q{index + 1}.</Text>
                            <View style={styles.actions}>
                                {/* ✅ EDIT BUTTON */}
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.editBtn]}
                                    onPress={() => navigation.navigate('screen/questionEditScreen', { 
                                        item,
                                        subjectName: selectedSubject?.name,
                                        className: selectedClass?.name,
                                        boardName: selectedBoard?.board_name
                                    })}
                                >
                                    <Feather name="edit-2" size={14} color="#FFF" />
                                </TouchableOpacity>
                                
                                {/* ✅ DELETE BUTTON */}
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.deleteBtn]}
                                    onPress={() => handleDelete(item)}
                                >
                                    <Feather name="trash-2" size={14} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <Text style={styles.questionText}>{item.question}</Text>
                        
                        <View style={styles.options}>
                            <Text style={styles.optionText}>1. {item.option1}</Text>
                            <Text style={styles.optionText}>2. {item.option2}</Text>
                            <Text style={styles.optionText}>3. {item.option3}</Text>
                            <Text style={styles.optionText}>4. {item.option4}</Text>
                        </View>
                        
                        <View style={styles.correct}>
                            <Text style={styles.correctLabel}>Correct:</Text>
                            <Text style={styles.correctValue}>{item.correct_answer}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No questions found</Text>
                        <TouchableOpacity 
                            style={styles.addQuestionBtn}
                            onPress={() => navigation.navigate('screen/QuestionUpload')}
                        >
                            <Text style={styles.addQuestionBtnText}>+ Add Question</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        );
    };

    // ============================================
    // 9️⃣ EFFECTS
    // ============================================
    useEffect(() => {
        fetchBoards();
    }, []);

    // ============================================
    // 🔟 MAIN RENDER
    // ============================================
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                    <FontAwesome6 name="angle-left" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>{getTitle()}</Text>
                    <Text style={styles.headerSub}>{getSubtitle()}</Text>
                </View>
                {viewMode === 'questions' && (
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => navigation.navigate('screen/QuestionUpload')}
                    >
                        <AntDesign name="plus" size={20} color="#FFF" />
                    </TouchableOpacity>
                )}
                {viewMode !== 'questions' && <View style={styles.headerRight} />}
            </View>

            {/* Search */}
            <View style={styles.search}>
                <Feather name="search" size={20} color="#969191" />
                <TextInput
                    placeholder={
                        viewMode === 'boards' ? 'Search boards...' :
                        viewMode === 'classes' ? 'Search classes...' :
                        viewMode === 'subjects' ? 'Search subjects...' :
                        'Search questions...'
                    }
                    style={styles.searchInput}
                    onChangeText={setSearch}
                    value={search}
                />
            </View>

            <Text style={styles.sectionTitle}>
                {viewMode === 'questions' ? 'Questions' :
                 viewMode === 'subjects' ? 'Subjects' :
                 viewMode === 'classes' ? 'Classes' : 'Boards'}
            </Text>

            {/* Content */}
            {viewMode === 'boards' && renderBoards()}
            {viewMode === 'classes' && renderClasses()}
            {viewMode === 'subjects' && renderSubjects()}
            {viewMode === 'questions' && renderQuestions()}

            {/* FAB */}
            {(viewMode === 'boards' || viewMode === 'classes' || viewMode === 'subjects') && (
                <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('screen/QuestionUpload')}>
                    <AntDesign name="plus" size={30} color="#FFF" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

// ============================================
// 1️⃣1️⃣ STYLES
// ============================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 28,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    backBtn: {
        padding: 5,
        width: 40,
    },
    headerCenter: {
        alignItems: 'center',
        flex: 1,
    },
    headerTitle: {
        fontFamily: 'roboto-bold',
        fontSize: 18,
        color: '#333',
    },
    headerSub: {
        fontFamily: 'roboto',
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    headerRight: {
        width: 40,
    },
    addBtn: {
        backgroundColor: COLOR.background,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: "#DDD",
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginVertical: 15,
    },
    searchInput: {
        fontFamily: 'roboto',
        fontSize: 18,
        flex: 1,
    },
    sectionTitle: {
        fontFamily: 'roboto-medium',
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        fontFamily: 'roboto',
        fontSize: 14,
        color: '#999',
        marginTop: 10,
    },
    emptyText: {
        fontFamily: 'roboto',
        fontSize: 16,
        color: '#999',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardTitle: {
        fontFamily: 'roboto-medium',
        fontSize: 16,
        color: '#333',
    },
    cardSubtitle: {
        fontFamily: 'roboto',
        fontSize: 13,
        color: '#999',
        marginTop: 2,
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
        fontFamily: 'roboto-bold',
        fontSize: 16,
        color: '#6C63FF',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBtn: {
        backgroundColor: '#4CAF50',
    },
    deleteBtn: {
        backgroundColor: '#FF4444',
    },
    questionText: {
        fontFamily: 'roboto-medium',
        fontSize: 17,
        color: '#333',
        marginBottom: 8,
    },
    options: {
        marginBottom: 8,
    },
    optionText: {
        fontFamily: 'roboto',
        fontSize: 14,
        color: '#666',
        marginBottom: 1,
    },
    correct: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: 6,
        borderRadius: 6,
    },
    correctLabel: {
        fontFamily: 'roboto-bold',
        fontSize: 13,
        color: '#2E7D32',
        marginRight: 5,
    },
    correctValue: {
        fontFamily: 'roboto-medium',
        fontSize: 13,
        color: '#2E7D32',
    },
    addQuestionBtn: {
        backgroundColor: COLOR.background,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 15,
    },
    addQuestionBtnText: {
        color: '#FFF',
        fontFamily: 'roboto-medium',
        fontSize: 16,
    },
    fab: {
        backgroundColor: COLOR.background,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});