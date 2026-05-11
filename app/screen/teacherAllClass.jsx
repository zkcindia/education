import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather, FontAwesome6 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLOR } from '../../constants/Colors';
import { allClassFetch } from '../../constants/api/apiHome';

export default function AllClass() {
    const navigation = useNavigation();
    // const [allClass,setAllClass] = useState();
    const [search,setSearch] = useState('');
    const [loader,setLoader] = useState(false);

    const allClass =[
      {
        id:1,
        name:'Std. 3rd',
        img:'https://us.123rf.com/450wm/galitskaya/galitskaya1903/galitskaya190301798/120051460-woman-shows-a-ring-with-an-airplane-have-fun-on-the-beach-watching-the-landing-planes-traveling-on.jpg?ver=6',
        sub:10,
        
      },
      {
        id:2,
        name:'Std.4th',
        img:'https://st4.depositphotos.com/4366637/25512/i/450/depositphotos_255128774-stock-photo-young-african-student-with-backpack.jpg',
        sub:7,
        
      },
      {
        id:3,
        name:'Std.5th',
        img:'https://www.indiarentalz.com/blog/wp-content/uploads/2023/10/studentlaptop-scaled.webp',
        sub:5,
        
      },
      {
        id:4,
        name:'Std.6th',
        img:'https://st4.depositphotos.com/4366637/25512/i/450/depositphotos_255128774-stock-photo-young-african-student-with-backpack.jpg',
        sub:10,
        
      },
      {
        id:5,
        name:'Std.5th',
        img:'https://www.indiarentalz.com/blog/wp-content/uploads/2023/10/studentlaptop-scaled.webp',
        sub:5,
        
      },
      {
        id:6,
        name:'Std.6th',
        img:'https://st4.depositphotos.com/4366637/25512/i/450/depositphotos_255128774-stock-photo-young-african-student-with-backpack.jpg',
        sub:10,
        
      },
      {
        id:7,
        name:'Std.5th',
        img:'https://www.indiarentalz.com/blog/wp-content/uploads/2023/10/studentlaptop-scaled.webp',
        sub:5,
        
      },
      {
        id:8,
        name:'Std.6th',
        img:'https://st4.depositphotos.com/4366637/25512/i/450/depositphotos_255128774-stock-photo-young-african-student-with-backpack.jpg',
        sub:10,
        
      },
    ]
    // useEffect(()=>{
    //   fetchClasses()
    // },[search])
    const fetchClasses = async() =>{
      setLoader(true)
      try {
        const response = await allClassFetch(search);
        console.log(response);
        if(response.status === 200){
          // setAllClass(response.data);
        }
      } catch (error) {
        console.log(error);
      }
      setLoader(false);
    }
  return (
    <SafeAreaView style={styles.topContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{position:'absolute',left:0}}>
            <FontAwesome6 name="angle-left" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Classes</Text>
      </View>
      <View style={styles.searchContainer}>
      <Feather name="search" size={20} color="#969191" />
      <TextInput placeholder='Search Course Here...' style={styles.searchInput} onChangeText={setSearch}/>
      </View>
      <Text style={styles.courseTitle}>Class List</Text>
      <FlatList data={allClass}  showsVerticalScrollIndicator={false} onRefresh={fetchClasses} refreshing={loader} renderItem={({item,index})=>(
                <TouchableOpacity style={{display:"flex",flexDirection:'row',gap:10,marginVertical:10,shadowColor:'#000',borderRadius:10,overflow:'hidden',backgroundColor:'#fff'}} onPress={()=>navigation.navigate('screen/subjectScreen',{ id: item.id })}>
                    <Image  source={{uri:item.image}} style={{width:100,height:90}} />
                    <View style={{display:'flex',flexDirection:'column',gap:5,justifyContent:'center'}}>
                        <Text style={{fontFamily:'roboto-medium',fontSize:18,color:COLOR.background}}>{item?.name}</Text>
                        <Text style={{fontFamily:'roboto',fontSize:15}}>Subject : {item?.subjects_count}</Text>
                    </View>
                </TouchableOpacity>
            )} style={{marginTop:15}}/>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  topContainer:{
    flex:1,
    padding:15,
    paddingTop:28
  },
  headerContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  headerText:{
    fontFamily:'roboto-bold',
    fontSize:18,
  },searchContainer:{
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    backgroundColor:"#DDD",
    padding:5,
    paddingHorizontal:10,
    borderRadius:5,
    marginVertical:20
  },
  searchInput:{
    fontFamily:'roboto',
    fontSize:18,
    width:'100%'
  },
  courseTitle:{
    fontFamily:'roboto-medium',
    fontSize:18,
  },
  courseContainer:{
    padding:10,
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    backgroundColor:COLOR.white,
    paddingHorizontal:15,
    marginBottom:15
  }
})
