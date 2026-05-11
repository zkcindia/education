import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { COLOR } from '../../constants/Colors'
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { allClassFetch } from '../../constants/api/apiHome'

export default function FeaturedCourse() {
const navigation = useNavigation();
const [allClass,setAllClass] = useState();
const [search,setSearch] = useState('');
const [loader,setLoader] = useState(false);
const [searchVisible,setSearchVisible] =useState(false)

    useFocusEffect(
      useCallback(() => {
       fetchClasses()
      }, []));
    const fetchClasses = async() =>{
      setLoader(true)
      try {
        const response = await allClassFetch(search);
        console.log(response.data);
        if(response.status === 200){
          setAllClass(response.data);
        }
      } catch (error) {
        console.log(error);
      }
      setLoader(false);
    }
    // const allClass =[
    //     {
    //       id:1,
    //       name:'Std. 3rd',
    //       img:'https://us.123rf.com/450wm/galitskaya/galitskaya1903/galitskaya190301798/120051460-woman-shows-a-ring-with-an-airplane-have-fun-on-the-beach-watching-the-landing-planes-traveling-on.jpg?ver=6',
    //       sub:10,
          
    //     },
    //     {
    //       id:2,
    //       name:'Std.4',
    //       img:'https://st4.depositphotos.com/4366637/25512/i/450/depositphotos_255128774-stock-photo-young-african-student-with-backpack.jpg',
    //       sub:7,
          
    //     },
    //     {
    //       id:3,
    //       name:'Std.5',
    //       img:'https://www.indiarentalz.com/blog/wp-content/uploads/2023/10/studentlaptop-scaled.webp',
    //       sub:5,
          
    //     },
    //     {
    //       id:4,
    //       name:'Std.6',
    //       img:'https://st4.depositphotos.com/4366637/25512/i/450/depositphotos_255128774-stock-photo-young-african-student-with-backpack.jpg',
    //       sub:10,
          
    //     },
    //   ]
  return (
    <View style={{margin:10, marginHorizontal:20}}>
      <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{fontSize: 18, color: '#333', fontFamily:'roboto-medium'}}>Class List</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('screen/allClass')}>
        <Text style={{fontFamily:'roboto',color:COLOR.background}}>See more</Text>
        </TouchableOpacity>
      </View>
      <View>
            <FlatList data={allClass} horizontal showsHorizontalScrollIndicator={false} renderItem={({item,index})=>(
                <TouchableOpacity style={{width: 180,display:"flex",flexDirection:'row',gap:5,marginLeft:10,marginVertical:10,shadowColor:'#000',borderRadius:10,overflow:'hidden',backgroundColor:'#fff'}} onPress={()=>navigation.navigate('screen/subjectScreen',{ id: item.id })}>
                    <Image  source={{uri:item.image}} style={{width:80,height:90}} />
                    <View style={{display:'flex',flexDirection:'column',gap:5,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontFamily:'roboto-medium',fontSize:17,color:COLOR.background}}>{item?.name}</Text>
                        <Text style={{fontFamily:'roboto',fontSize:12}}>Subject : {item?.subjects_count}</Text>
                    </View>
                </TouchableOpacity>
            )} />
      </View>
    </View>
  )
}