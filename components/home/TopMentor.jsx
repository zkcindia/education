import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import { COLOR } from '../../constants/Colors'
import { useNavigation } from '@react-navigation/native'

export default function TopMentor() {
    const navigation = useNavigation();
    const topmentor = [
        {
            id: 1,
            name: 'John Doe',
            image: 'https://t4.ftcdn.net/jpg/03/78/43/25/360_F_378432516_6IlKiCLDAqSCGcfc6o8VqWhND51XqfFm.jpg',
            sub:'Math'
        },
        {
            id: 2,
            name: 'Latas tear',
            image: 'https://www.skooladmission.com/upload/school/0055-ach-090917175504.jpg',
            sub:'Science'
        },
        {
            id: 3,
            name: 'Robert Lewis',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt-nalkZzeiXdv4_SSnC8m33wvBVsjwcvau9vZUs62krkUgqU8MIhkSqjx00AGVJrl3Xo&usqp=CAU',
            sub:'Math'
        },
        {
            id: 4,
            name: 'Penelo Tucker',
            image: 'https://static.vecteezy.com/system/resources/thumbnails/037/211/111/small_2x/ai-generated-portrait-of-pretty-female-professor-with-glasses-in-the-classroom-people-background-photo.jpg',
            sub:'English'
        },
        {
            id: 5,
            name: 'Lily Abraham',
            image: 'https://img.freepik.com/premium-photo/happy-young-woman-teacher_917664-33282.jpg',
            sub:'History'
        },
        {
            id: 6,
            name: 'Robert Lewis',
            image: 'https://media.istockphoto.com/id/1330641849/photo/female-math-teacher-in-school.jpg?s=612x612&w=0&k=20&c=qqqo-pRJBrE5ItkCljXOVfRSSpLnMa0hVrbhy-ZoydU=',
            sub:'English'
        },
    ]
  return (
    <View style={{margin:20}}>
      <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{fontSize: 18, color: '#333', fontFamily:'roboto-medium'}}>Top Mentors</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('screen/allMentors')}>
        <Text style={{fontFamily:'roboto',color:COLOR.background}}>See more</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop:10}}>
        <FlatList data={topmentor} horizontal showsHorizontalScrollIndicator={false} renderItem={({item,index})=>(
            <TouchableOpacity key={index} style={{display:'flex',flexDirection:'column',alignItems:'center',marginLeft:8}} >
                    <Image source={{uri:item?.image}} style={{width: 80, height: 80,borderRadius:99}} />
                <View>
                    <Text style={{fontSize: 12, color: '#333', fontFamily:'roboto-medium'}} >{item?.name}</Text>
                    <Text style={{fontFamily:'roboto',fontSize:10,textAlign:'center'}}>{item?.sub}</Text>
                </View>
            </TouchableOpacity>
        )} />
      </View>
    </View>
  )
}