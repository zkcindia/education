import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

export default function Banner() {
  const banner = [
    {
      id: 1,
      title: 'React Native Course',
      price: 999,
      img: require('./../../assets/images/banner/cource1.webp'),
    },
    {
      id: 2,
      title: 'WordPress Course',
      price: 499,
      img: require('./../../assets/images/banner/cource2.webp'),
    },
  ];

  const handleBannerClick = (item) => {
    router.push({
      pathname: '/payment',
      params: {
        courseId: item.id,
        title: item.title,
        price: item.price,
      },
    });
  };

  return (
    <View style={{ marginTop: 20, marginLeft: 10 }}>
      <FlatList
        data={banner}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleBannerClick(item)}>
            <View>
              <Image
                source={item.img}
                style={{
                  width: 250,
                  height: 150,
                  borderRadius: 10,
                  marginLeft: 10,
                }}
              />

              <Text
                style={{
                  marginLeft: 12,
                  marginTop: 6,
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  marginLeft: 12,
                  marginTop: 2,
                  color: 'green',
                  fontWeight: '700',
                }}
              >
                ₹{item.price}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}