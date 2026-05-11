import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, FlatList, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { COLOR } from '../../../constants/Colors';
import { allQuestions } from '../../../constants/api/apiTeacher';

export default function AllClass() {
    const navigation = useNavigation();
    const router = useRoute()
    const [allQuestion,setAllQuestions] = useState([]);
    const [search,setSearch] = useState('');
    const [loader,setLoader] = useState(false);

    useFocusEffect(
      useCallback(() => {
        fetchQuestions();
      }, [search])
    );

    const fetchQuestions = async() =>{
      setLoader(true)
      try {
        const response = await allQuestions();
        console.log(response.data.questions);
        if(response.status === 200){
          setAllQuestions(response.data?.questions);
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
        <Text style={styles.headerText}>All Questions</Text>
      </View>
      <View style={styles.searchContainer}>
      <Feather name="search" size={20} color="#969191" />
      <TextInput placeholder='Search Course Here...' style={styles.searchInput} onChangeText={setSearch}/>
      </View>
      <Text style={styles.courseTitle}>Questions List</Text>
      <FlatList data={allQuestion}  showsVerticalScrollIndicator={false} onRefresh={fetchQuestions} refreshing={loader} renderItem={({item,index})=>(
                <TouchableOpacity style={{marginVertical:10,shadowColor:'#000',borderRadius:10,overflow:'hidden',backgroundColor:'#fff',padding:10,paddingVertical:15}} onPress={()=>navigation.navigate('screen/questionsDetails',{ item })}>
           
                        <Text style={{fontFamily:'roboto-medium',fontSize:18,color:COLOR.background}}>{item?.question}</Text>
                       
                </TouchableOpacity>
            )} style={{marginTop:15}}/>
            <TouchableOpacity style={{backgroundColor:COLOR.background,width:60,height:60,borderRadius:50,justifyContent:'center',alignItems:'center',position:'absolute',bottom:10,right:10}} onPress={() => navigation.navigate('screen/QuestionUpload')}>
                <AntDesign name="plus" size={35} color={COLOR.white} />
            </TouchableOpacity>
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
