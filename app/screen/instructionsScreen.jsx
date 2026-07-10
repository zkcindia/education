// import { FontAwesome6 } from '@expo/vector-icons';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions } from 'react-native';
// import { COLOR } from '../../constants/Colors';

// const { width, height } = Dimensions.get('window'); // Get screen dimensions

// const InstructionsScreen = () => {
//     const navigation = useNavigation();
//     const router = useRoute();
//     const { id } = router.params || {};
    
//     return (
//         <SafeAreaView style={styles.topContainer}>
//             <View style={styles.headerContainer}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                     <FontAwesome6 name="angle-left" size={24} color="gray" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerText}>Test Instructions</Text>
//             </View>
//             <View style={styles.instructionsContainer}>
//                 <Image 
//                     source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/woman-wishing-best-of-luck-11725050-9555791.png?f=webp' }} 
//                     style={styles.topImage}
//                 />
//                 <View style={styles.textList}>
//                     <Text style={styles.text}>1. You will be presented with one question at a time. Once you select your answer, you can proceed to the next question.</Text>
//                     <Text style={styles.text}>2. Once you submit your answer, you cannot go back to the previous question, so choose wisely.</Text>
//                     <Text style={styles.text}>3. Complete each question within the 30 sec time limit</Text>
//                     <Text style={styles.text}>4. Your score will be based on the number of correct answers. Answer as many questions correctly as possible to achieve a high score.</Text>
//                     <Text style={styles.text}>5. At the end of the quiz, your score will be displayed, and it will be stored under your user profile.</Text>
//                 </View>
//                 <Text style={styles.finalText}>Try your best! Don't rush, and have fun!</Text>
//                 <TouchableOpacity 
//                     style={styles.startButton} 
//                     onPress={() => navigation.navigate('screen/quizScreen', { id })}
//                 >
//                     <Text style={styles.startButtonText}>Start Test</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     topContainer: {
//         flex: 1,
//         padding: width * 0.05, // Responsive padding
//         paddingTop: height * 0.04, // Responsive top padding
//         backgroundColor: COLOR.white,
//     },
//     headerContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: height * 0.02, // Margin based on height
//     },
//     backButton: {
//         position: 'absolute',
//         left: 0,
//     },
//     headerText: {
//         fontFamily: 'roboto-bold',
//         fontSize: width * 0.05, // Responsive font size
//     },
//     topImage: {
//         width: width * 0.4, // Responsive width
//         height: width * 0.4, // Responsive height
//         marginBottom: height * 0.02, // Bottom margin based on height
//     },
//     instructionsContainer: {
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: COLOR.background,
//         padding: width * 0.05, // Responsive padding
//         borderRadius: 10,
//         gap: 20,
//         paddingBottom: height * 0.03, // Responsive bottom padding
//     },
//     textList: {
//         flexDirection: 'column',
//         gap: height * 0.01, // Vertical spacing between texts based on height
//     },
//     text: {
//         fontSize: width * 0.04, // Responsive font size
//         fontFamily: 'roboto',
//         color: COLOR.white,
//     },
//     finalText: {
//         color: COLOR.white,
//         fontSize: width * 0.04, // Responsive font size
//         textAlign: 'center',
//         marginTop: height * 0.01, // Margin based on height
//     },
//     startButton: {
//         backgroundColor: COLOR.white,
//         borderRadius: 50,
//         padding: height * 0.02, // Responsive padding
//         paddingHorizontal: width * 0.1, // Responsive horizontal padding
//         marginTop: height * 0.02, // Margin above button based on height
//     },
//     startButtonText: {
//         textAlign: 'center',
//         fontFamily: 'roboto-medium',
//         fontSize: width * 0.045, // Responsive font size
//         color: COLOR.background,
//     },
// });

// export default InstructionsScreen;


import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions, ScrollView } from 'react-native';
import { COLOR } from '../../constants/Colors';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const InstructionsScreen = () => {
    const navigation = useNavigation();
    const router = useRoute();
    const { id } = router.params || {};
    
    return (
        <SafeAreaView style={styles.topContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome6 name="angle-left" size={24} color="gray" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Test Instructions</Text>
            </View>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                <View style={styles.instructionsContainer}>
                    <Image 
                        source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/woman-wishing-best-of-luck-11725050-9555791.png?f=webp' }} 
                        style={styles.topImage}
                    />
                    <View style={styles.textList}>
                        <Text style={styles.text}>1. You will be presented with one question at a time. Once you select your answer, you can proceed to the next question.</Text>
                        <Text style={styles.text}>2. Once you submit your answer, you cannot go back to the previous question, so choose wisely.</Text>
                        <Text style={styles.text}>3. Complete each question within the 30 sec time limit</Text>
                        <Text style={styles.text}>4. Your score will be based on the number of correct answers. Answer as many questions correctly as possible to achieve a high score.</Text>
                        <Text style={styles.text}>5. At the end of the quiz, your score will be displayed, and it will be stored under your user profile.</Text>
                    </View>
                    <Text style={styles.finalText}>Try your best! Don't rush, and have fun!</Text>
                    <TouchableOpacity 
                        style={styles.startButton} 
                        onPress={() => navigation.navigate('screen/quizScreen', { id })}
                    >
                        <Text style={styles.startButtonText}>Start Test</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        padding: width * 0.04,
        paddingTop: height * 0.03,
        backgroundColor: COLOR.white,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: height * 0.015,
    },
    backButton: {
        position: 'absolute',
        left: 0,
    },
    headerText: {
        fontFamily: 'roboto-bold',
        fontSize: width * 0.048,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: height * 0.02,
    },
    topImage: {
        width: width * 0.32,
        height: width * 0.32,
        marginBottom: height * 0.015,
    },
    instructionsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.background,
        padding: width * 0.04,
        borderRadius: 10,
        gap: 16,
        paddingBottom: height * 0.025,
    },
    textList: {
        flexDirection: 'column',
        gap: height * 0.008,
    },
    text: {
        fontSize: width * 0.038,
        fontFamily: 'roboto',
        color: COLOR.white,
        lineHeight: 22,
    },
    finalText: {
        color: COLOR.white,
        fontSize: width * 0.038,
        textAlign: 'center',
        marginTop: height * 0.008,
    },
    startButton: {
        backgroundColor: COLOR.white,
        borderRadius: 50,
        padding: height * 0.016,
        paddingHorizontal: width * 0.085,
        marginTop: height * 0.015,
    },
    startButtonText: {
        textAlign: 'center',
        fontFamily: 'roboto-medium',
        fontSize: width * 0.042,
        color: COLOR.background,
    },
});

export default InstructionsScreen;