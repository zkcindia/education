// PopularCourse.jsx
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLOR } from '../../constants/Colors'
import { getTopStudents } from '../../constants/api/apiClass'
import { router } from 'expo-router'

export default function PopularCourse() {
  const [popularCourse, setPopularCourse] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch top students
  const fetchTopStudents = async () => {
    try {
      setLoading(true)
      const response = await getTopStudents()
      console.log('Popular Course Data:', response)
      
      if (response && response.students && response.students.length > 0) {
        // Map API data to match the component's format
        const formattedData = response.students.map((student, index) => ({
          id: student.id || index,
          name: student.name || 'Unknown',
          img: student.avatar || student.image || 'https://img.freepik.com/free-photo/young-student-woman-wearing-denim-jacket-eyeglasses-holding-colorful-folders-showing-thumb-up-pink_176532-13861.jpg',
          class: student.class || student.grade || 'N/A',
          rank: student.rank || student.score || index + 1,
        }))
        setPopularCourse(formattedData)
      } else {
        // No data received
        setPopularCourse([])
      }
    } catch (error) {
      console.error('Error:', error)
      setPopularCourse([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopStudents()
  }, [])

  // Loading State
  if (loading) {
    return (
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 18, color: '#333', fontFamily: 'roboto-medium' }}>Top Students</Text>
          <TouchableOpacity onPress={() => router.push('/TopScorersPage')}>
            {/* <Text style={{ fontFamily: 'roboto', color: COLOR.background }}>See more</Text> */}
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20, alignItems: 'center', paddingVertical: 30 }}>
          <ActivityIndicator size="small" color={COLOR.background} />
        </View>
      </View>
    )
  }

  return (
    <View style={{ marginHorizontal: 20, marginTop: 20 }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, color: '#333', fontFamily: 'roboto-medium' }}>Top Students</Text>
        <TouchableOpacity onPress={() => router.push('/TopScorersPage')}>
          {/* <Text style={{ fontFamily: 'roboto', color: COLOR.background }}>See more</Text> */}
        </TouchableOpacity>
      </View>
      
      <View style={{ marginTop: 20 }}>
        {popularCourse.length === 0 ? (
          // No Data State
          <View style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            paddingVertical: 20,
            width: '100%',
          }}>
            <Text style={{ 
              fontSize: 14, 
              color: '#999', 
              fontFamily: 'roboto' 
            }}>
              No students found
            </Text>
          </View>
        ) : (
          <FlatList 
            data={popularCourse} 
            horizontal 
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                key={item.id || index} 
                style={{
                  width: 145, 
                  borderTopLeftRadius: 10, 
                  borderTopRightRadius: 10, 
                  overflow: 'hidden', 
                  marginLeft: index === 0 ? 0 : 10,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View style={{ width: 145, height: 80 }}>
                  <Image 
                    source={{ uri: item.img }} 
                    style={{ width: 145, height: 80 }}
                  />
                </View>
                <View style={{ padding: 5, backgroundColor: '#fff' }}>
                  <Text 
                    style={{ 
                      fontSize: 13, 
                      color: COLOR.background, 
                      fontFamily: 'roboto-medium', 
                      textAlign: 'center' 
                    }} 
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                    <Text style={{ fontSize: 12, fontFamily: 'roboto' }}>class : {item?.class}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'roboto' }}>Rank : {item?.rank}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  )
}