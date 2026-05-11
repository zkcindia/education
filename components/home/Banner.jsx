import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'

export default function Banner() {

    const banner = [
        {
            id:1,
            img:require('./../../assets/images/banner/cource1.webp')
        },
        {
            id:2,
            img:require('./../../assets/images/banner/cource2.webp')
        }
    ]
  return (
    <View style={{marginTop:20,marginLeft:10}}>
      <FlatList data={banner} horizontal showsHorizontalScrollIndicator={false} renderItem={({item,index})=>(
        <View key={index} >
            <Image source={item.img} style={{width:250,height:150,borderRadius:10,marginLeft:10}}/>
        </View>
      )} />
    </View>
  )
}