import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Entypo, Feather, FontAwesome6 } from '@expo/vector-icons'
import { COLOR } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';

export default function allMentors() {
  const navigation = useNavigation()
    const mentor = [
        {
            id :1,
            name: 'Huberta Raj',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6yjbJWG1j_49spMwNZtTmZpDVYxbXKfsXIXM670iaYRBWllosNKVDwZAOXvvoJxCIB9s&usqp=CAU',
            sub:'UI Designer'
        },
        {
            id :2,
            name: 'Carol Tefer',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSreiQIZuSQOuhhpxnX-cAb_0JuAjbkqjwV_nusHTQ0jCzBbBoT2ntbKY3z_KrjTBvE8-E&usqp=CAU',
            sub:'UI Designer'
        },
        {
            id :3,
            name: 'Robert Lewis',
            image: 'https://icon2.cleanpng.com/20230906/bkc/transparent-school-girl-1711077758858.webp',
            sub:'UI Designer'
        },
        {
            id :4,
            name: 'John Doe',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKCSaoXit_JgiD3Vk3qtGci1WePrdw3Jwrgmn2WxBuFIdqJ2XBgHgut6VGwVf0Nl_nUT8&usqp=CAU',
            sub:'UI Designer'
        },
        {
            id :5,
            name: 'John Doe',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGOh8TED96Bz0RrBFf-hS4q0Vk1x9zpLozZxUDEkhrsN0H8u6MJfcmpNDz4WDJlgUUj7M&usqp=CAU',
            sub:'UI Designer'
        },
        {
            id :6,
            name: 'John Doe',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOkbYp23mYOx_f1G93x90eBXjyTYGuwUlZ6GhpJFmy0qji3lR-nrIgadn2_hN8B6-JYAQ&usqp=CAU',
            sub:'UI Designer'
        },
        {
            id :7,
            name: 'John Doe',
            image: 'https://png.pngtree.com/png-clipart/20231002/original/pngtree-young-man-working-and-studying-on-laptop-computer-png-image_13226121.png',
            sub:'UI Designer'
        },
        {
            id :8,
            name: 'John Doe',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6yjbJWG1j_49spMwNZtTmZpDVYxbXKfsXIXM670iaYRBWllosNKVDwZAOXvvoJxCIB9s&usqp=CAU',
            sub:'UI Designer'
        },
        {
            id :9,
            name: 'John Doe',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6yjbJWG1j_49spMwNZtTmZpDVYxbXKfsXIXM670iaYRBWllosNKVDwZAOXvvoJxCIB9s&usqp=CAU',
            sub:'UI Designer'
        },
        {
            id :10,
            name: 'John Doe',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6yjbJWG1j_49spMwNZtTmZpDVYxbXKfsXIXM670iaYRBWllosNKVDwZAOXvvoJxCIB9s&usqp=CAU',
            sub:'UI Designer'
        },
        {
            id :11,
            name: 'John Doe',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6yjbJWG1j_49spMwNZtTmZpDVYxbXKfsXIXM670iaYRBWllosNKVDwZAOXvvoJxCIB9s&usqp=CAU',
            sub:'UI Designer'
        },
        {
            id :12,
            name: 'John Doe',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6yjbJWG1j_49spMwNZtTmZpDVYxbXKfsXIXM670iaYRBWllosNKVDwZAOXvvoJxCIB9s&usqp=CAU',
            sub:'UI Designer'
        },
    ]
  return (
    <View style={styles.container}>
       <View style={styles.headerContainer}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
        <FontAwesome6 name="angle-left" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={{fontFamily: 'roboto-bold', fontSize: 18}}>Mentors</Text>
        <View style={styles.headerIcon}>
          <TouchableOpacity>
             <Feather name="search" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name="sound-mix" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.topText}>240 mentors</Text>
      <View style={styles.mentorsContainer}>
        {
            mentor ?  mentor.map((item, index) => <TouchableOpacity key={index}>
                <Image source={{uri:item?.image}} style={styles.mentorImage}/>
                <Text style={{fontFamily:'roboto-bold',textAlign:'center',fontSize:15}}>{item?.name}</Text>
                <Text style={{color:'gray'}}>{item?.sub}</Text>
            </TouchableOpacity>) : <Text>No mentor fount</Text>

        }
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: COLOR.white,
      padding: 20,
      paddingTop: 40
    },
    headerContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 10
    },
    headerIcon: {
      flexDirection: 'row',
      gap: 20
    },
    topText:{
        width:'100%',
        fontSize: 13,
        textAlign:'right',
        color:'#918d8d',
        marginVertical:10
    },
    mentorsContainer:{
       flexDirection:'row',
       flexWrap:'wrap',
       gap:20,
       justifyContent:'space-between',
       marginTop:20
    },
    mentorImage:{
        width: 80,
        height: 80,
        borderRadius:50,
    }
  });