import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLOR } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { getTopTeachers } from '../../constants/api/apiTeacher';

export default function TopMentor() {
  const navigation = useNavigation();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      const res = await getTopTeachers();
      const list = res?.data || [];

      const formatted = list.map((t, i) => ({
        id: t.teacher_id ?? i,
        name: t.teacher_name || 'Unknown',
        image: t.image || null,
        sub: t.subject || 'Mentor',
      }));

      setMentors(formatted);
    } catch (err) {
      console.log('ERROR:', err?.response?.data || err.message);
    }
    setLoading(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <View style={{ margin: 20 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, color: '#333', fontFamily: 'roboto-medium' }}>
          Top Mentors
        </Text>
        {/* <TouchableOpacity onPress={() => navigation.navigate('screen/allMentors')}>
          <Text style={{ fontFamily: 'roboto', color: COLOR.background }}>See more</Text>
        </TouchableOpacity> */}
      </View>

      {/* List */}
      <View style={{ marginTop: 10 }}>
        {loading ? (
          <ActivityIndicator size="small" color={COLOR.background} style={{ marginTop: 20 }} />
        ) : (
          <>
            <FlatList
              data={mentors}
              horizontal
              showsHorizontalScrollIndicator={true}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingRight: 10 }}
              onScroll={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / 85);
                setActiveIndex(index);
              }}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  style={{ alignItems: 'center', marginRight: 4, width: 85 }}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 80, height: 80, borderRadius: 99 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 75,
                        height: 75,
                        borderRadius: 99,
                        backgroundColor: COLOR.background,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'roboto-bold' }}>
                        {getInitials(item.name)}
                      </Text>
                    </View>
                  )}

                  <View style={{ height: 6 }} />

                  <Text
                    style={{
                      fontSize: 12,
                      color: '#333',
                      fontFamily: 'roboto-medium',
                      textAlign: 'center',
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{ fontFamily: 'roboto', fontSize: 10, textAlign: 'center' }}
                    numberOfLines={1}
                  >
                    {item.sub}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* ✅ Dots indicator */}
            {/* {mentors.length > 3 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 10,
                  gap: 4,
                }}
              >
                {mentors.map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: i === activeIndex ? COLOR.background : '#d1d5db',
                    }}
                  />
                ))}
              </View>
            )} */}
          </>
        )}
      </View>
    </View>
  );
}