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

      // ✅ FIX: API "data" array bhej rahi hai, "students" nahi
      const studentsArray = response?.data || response?.students || []

      if (studentsArray.length > 0) {
        const formattedData = studentsArray.map((student, index) => ({
          id: student.student_id || student.id || index,
          name: student.student_name || student.name || 'Unknown',
          img: student.image || student.avatar || 'https://img.freepik.com/free-photo/young-student-woman-wearing-denim-jacket-eyeglasses-holding-colorful-folders-showing-thumb-up-pink_176532-13861.jpg',
          // class: student.subject || student.class || student.grade || 'N/A',
          rank: student.rank || student.score || index + 1,
        }))
        setPopularCourse(formattedData)
      } else {
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
                  width: 100,
                  alignItems: 'center',
                  marginLeft: index === 0 ? 0 : 10,
                }}
              >
                {/* 🖼️ Round Circle Image */}
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  overflow: 'hidden',
                  backgroundColor: '#ddd',
                  borderWidth: 3,
                  borderColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}>
                  <Image
                    source={{ uri: item.img }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>

                {/* 📝 Name */}
                <Text
                  style={{
                    fontSize: 13,
                    color: COLOR.background,
                    fontFamily: 'roboto-medium',
                    textAlign: 'center',
                    marginTop: 8,
                    width: '100%',
                  }}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>

                {/* 📚 Class */}
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'roboto',
                  color: '#666',
                  textAlign: 'center',
                  marginTop: 2,
                  width: '100%',
                }} numberOfLines={1}>
                  {item.class}
                </Text>

                {/* 🏅 Rank */}
                <Text style={{
                  fontSize: 11,
                  fontFamily: 'roboto-bold',
                  color: '#B45309',
                  textAlign: 'center',
                  marginTop: 2,
                  width: '100%',
                }} numberOfLines={1}>
                  Rank : {item.rank}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  )
}