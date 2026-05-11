import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Image } from 'react-native';
import React, { useState } from 'react';

const LessonItem = ({ item, onPress, isExpanded,index }) => (
  <View style={styles.accordionContainer} key={index}>
    <TouchableOpacity onPress={() => onPress(item.id)} style={styles.header}>
        <Text style={styles.headerText}>{item.id}</Text>
      <Text style={styles.headerText}>{item.name}</Text>
    </TouchableOpacity>
    {isExpanded && (
      <Animated.View style={styles.body}>
        <Image source={{uri:item.img}} width={100} height={90}/>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    )}
  </View>
);

export default function Lesson() {
  const [expanded, setExpanded] = useState(null);

  const lesson = [
    { id: 1, name: 'Getting Started', description: 'This is lesson 1',img:'https://img.freepik.com/premium-photo/science-2d-cartoon-vector-illustration-white-background_889056-27462.jpg' },
    { id: 2, name: 'Create UI Design in Figma', description: 'Create Frame in Figma' ,img:'https://img.freepik.com/free-vector/scientist-girl-cartoon-character-with-laboratory-equipments_1308-102788.jpg'},
    { id: 3, name: 'Advanced UI Design Techniques', description: 'This is lesson 3',img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSafibGz2LWkl82zp3Utxa66T-o4xoF9mZWglR0gfXSWaaFeNiypd3ctMU7C_AVDMdhUc&usqp=CAU' },
  ];

  const handlePress = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>124 Lessons</Text>
      <FlatList
        data={lesson}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LessonItem
            item={item}
            onPress={handlePress}
            isExpanded={expanded === item.id}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:15
  },
  title: {
    fontSize: 13,
    marginBottom: 20,
    textAlign:'right'
  },
  accordionContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius:5
  },
  header: {
    flexDirection:'row',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    gap:10
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    padding: 10,
    flexDirection:'row',
    gap:10
  },
  description: {
    fontSize: 18,
    fontFamily:'roboto-medium'
  },
});
