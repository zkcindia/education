import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import { COLOR } from '../../constants/Colors'
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons'

export default function PopularCourse() {

  const popularCourse =[
    {
      id:1,
      name:'Ramesh Gupta',
      img:'https://img.freepik.com/free-photo/young-student-woman-wearing-denim-jacket-eyeglasses-holding-colorful-folders-showing-thumb-up-pink_176532-13861.jpg',
      class: '10th',
      rank:112,
      
    },
    {
      id:2,
      name:'Pritam Patra',
      img:'https://img.freepik.com/free-photo/beautiful-female-student-showing-v-sign-smiling-happy-holding-notebooks-with-study-material-attending-courses-standing-blue-background_1258-70146.jpg',
      class: '10th',
      rank:90,
      
    },
    {
      id:3,
      name:'Manoj Dee',
      img:'https://www.indiarentalz.com/blog/wp-content/uploads/2023/10/studentlaptop-scaled.webp',
      class: '10th',
      rank:98,
      
    },
    {
      id:4,
      name:'Trilokya Rana',
      img:'https://st4.depositphotos.com/4366637/25512/i/450/depositphotos_255128774-stock-photo-young-african-student-with-backpack.jpg',
      class: '10th',
      rank:343,
      
    },
  ]
  return (
    <View style={{marginHorizontal:20,marginTop:20}}>
      <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{fontSize: 18, color: '#333', fontFamily:'roboto-medium'}}>Top Students</Text>
        <TouchableOpacity>
        <Text style={{fontFamily:'roboto',color:COLOR.background}}>See more</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop:20}}>
        <FlatList data={popularCourse} horizontal showsHorizontalScrollIndicator={false} renderItem={({item,index})=>(
          <TouchableOpacity key={index} style={{width:145,borderTopLeftRadius:10,borderTopRightRadius:10,overflow:'hidden',marginLeft:10}}>
            <View style={{width:145,height:80}}>
              <Image source={{uri:item.img}} style={{width:145,height:80}}/>
            </View>
            <View style={{padding:5,backgroundColor:COLOR.white}}>
              <Text style={{fontSize: 13, color: COLOR.background, fontFamily:'roboto-medium',textAlign:'center'}}>{item.name}</Text>
              <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginVertical:5}}>
                <Text style={{fontSize:12,fontFamily:'roboto'}}>class : {item?.class}</Text>
                <Text style={{fontSize:12,fontFamily:'roboto'}}>Rank : {item?.rank}</Text>
              </View>
              {/* <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={{fontSize: 12, color:COLOR.background, fontFamily:'roboto-medium'}}>{item?.price}</Text>
                <Text style={{fontSize: 10, color:COLOR.background, fontFamily:'roboto-medium'}}><Entypo name="star" size={10} color="orange" /> {item?.reting}</Text>
              </View> */}
            </View>
          </TouchableOpacity>
        )}/>
      </View>
    </View>
  )
}