import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';
import { COLOR } from '../../constants/Colors';

export default function AboutMentor() {
  return (
    <SafeAreaView style={{height:'50%'}}>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.mentorImage}>
        <Image source={{ uri: 'https://p.turbosquid.com/ts-thumb/I6/97Nsb8/15/00/jpg/1662013743/300x300/sharp_fit_q85/bd528747aa0cdaccbd650a91d396dea06855f39e/00.jpg' }} width={100} height={100} style={styles.img} />
        <View>
          <Text style={styles.name}>Huberto Raj</Text>
          <Text style={styles.title}>Senior UI - UX Designer</Text>
        </View>
      </View>
      <View style={styles.aboutUsContainer}>
        <Text style={styles.aboutHead}>About Course</Text>
        <Text style={styles.aboutText}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima vitae optio praesentium necessitatibus iure, quam voluptatum repellat commodi similique ullam assumenda? Repellendus, similique quam! Laboriosam voluptatem cum eligendi doloribus commodi aliquid cumque quasi ut odit eius assumenda magni obcaecati error necessitatibus voluptates voluptatum debitis culpa dolore accusamus, quis quas inventore. Voluptatem aspernatur blanditiis officiis id voluptate maiores repellat magnam velit molestiae enim quaerat, sit eaque doloribus provident. Provident facilis perspiciatis mollitia totam sequi, corrupti cupiditate necessitatibus libero possimus hic in quam, aperiam nobis deleniti eligendi nostrum! Vel fuga aperiam quas, sunt adipisci explicabo cum, non maxime cupiditate temporibus expedita suscipit?
        </Text>
      </View>
    </ScrollView>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.button}>Enroll Course - $ Free</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLOR.white,
    // padding: 20,
  },
  img: {
    borderRadius: 10,
    width: 100,
    height: 100,
  },
  mentorImage: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 15,
    gap: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    color: COLOR.black,
    fontFamily: 'roboto-bold',
  },
  title: {
    fontSize: 14,
    color: 'gray',
  },
  aboutHead: {
    fontSize: 18,
    fontFamily: 'roboto-bold',
    marginBottom: 5,
  },
  aboutText: {
    fontFamily: 'roboto',
    color: 'gray',
    fontSize: 15,
    paddingBottom:40
  },
  aboutUsContainer: {
    flexDirection: 'column',
    gap: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    position:'absolute',
    alignItems: 'center',
    backgroundColor:COLOR.background,
    width:'100%',
    borderRadius:5,
    bottom:10
  },
  button: {
    backgroundColor: COLOR.primary,
    color: COLOR.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontFamily: 'roboto-bold',
    fontSize: 16,
  },
});
