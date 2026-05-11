import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native'
import React from 'react'
import { COLOR } from '../../constants/Colors'

export default function Reviews() {

    const review =[
        {
            id: 1,
            name: "John Doe",
            rating: 5,
            review: "This is a great product. I love it.Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima vitae optio praesentium necessitatibus iure, quam voluptatum ",
            date: "2020-01-01",
            img :"https://as2.ftcdn.net/v2/jpg/04/04/46/93/1000_F_404469316_AZyHcdoUDuHbnrqdf2swZrDKz3mK72P8.jpg"
        },
        {
            id: 2,
            name: "John Doe",
            rating: 5,
            review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima vitae optio praesentium necessitatibus iure, quam voluptatum repellat commodi similique ullam assumenda? Repellendus, similique quam! Laboriosam voluptatem cum eligendi doloribus commodi aliquid cumque quasi ut odit",
            date: "2020-01-01",
            img :"https://videohive.img.customer.envatousercontent.com/a5577dda-18a4-4be1-95b6-1fbf14988b33/video_preview/video_preview_0000.jpg?auto=compress%2Cformat&fit=crop&crop=top&max-h=8000&max-w=590&s=a76daa89f9082c772701d23bbdbd5b22"
        },
        {
            id: 3,
            name: "John Doe",
            rating: 5,
            review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima vitae optio praesentium necessitatibus iure, quam voluptatum repellat commodi similique ullam assumenda? Repellendus, similique quam! Laboriosam voluptatem cum eligendi doloribus commodi aliquid cumque quasi ut odit",
            date: "2020-01-01",
            img :"https://videohive.img.customer.envatousercontent.com/a5577dda-18a4-4be1-95b6-1fbf14988b33/video_preview/video_preview_0000.jpg?auto=compress%2Cformat&fit=crop&crop=top&max-h=8000&max-w=590&s=a76daa89f9082c772701d23bbdbd5b22"
        },
    ]
  return (
    <SafeAreaView style={{height:'50%',backgroundColor:COLOR.white}}>
        {/* <ScrollView contentContainerStyle={{flexGrow:1,paddingVertical:20}}> */}
            <FlatList data={review} showsVerticalScrollIndicator={false} renderItem={({item,index})=>(
                <View key={item.id} style={styles.container}>
                    <Image source={{uri:item.img}} width={80} height={80} style={styles.reviewImage}/>
                    <View style={styles.reviewTextContainer}>
                        <Text style={{fontFamily:'roboto-bold',fontSize:18}}>{item.name}</Text>
                        <Text style={{fontFamily:'roboto',fontSize:15,color:'gray'}}>{item.review}</Text>
                        <Text style={{fontFamily:'roboto',fontSize:15,color:'gray'}}>{item.date}</Text>
                    </View>
                </View>
            )} style={{paddingVertical:20}}/>
        {/* </ScrollView> */}
        <TouchableOpacity style={styles.button}>
            <Text style={{color:COLOR.white,fontFamily:'roboto-medium',fontSize:18,textAlign:'center'}}>Write a Review</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    gap:20,
    marginBottom:20,
    borderBottomWidth:0.2,
    paddingBottom:10,
    borderBottomColor:'#DDD'
  },
  reviewImage:{
    borderRadius:50
  },
  reviewTextContainer:{
    flexDirection:'column',
    gap:7,
  },
  button:{
    backgroundColor:COLOR.background,
    padding:10,
    borderRadius:5
  }
})
