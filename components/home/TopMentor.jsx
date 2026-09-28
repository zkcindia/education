import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { COLOR } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { getTopTeachers } from '../../constants/api/apiTeacher';

const { width } = Dimensions.get('window');

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
    <View style={styles.container}>
      {/* 🏆 Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.trophyCircle}>
            <Text style={styles.trophyEmoji}>🎓</Text>
          </View>
          <View>
            <Text style={styles.sectionTitle}>Top Mentors</Text>
            <Text style={styles.sectionSubtitle}>Learn from the best</Text>
          </View>
        </View>

        {/* <TouchableOpacity onPress={() => navigation.navigate('screen/allMentors')}>
          <Text style={{ fontFamily: 'roboto', color: COLOR.background }}>See more</Text>
        </TouchableOpacity> */}
      </View>

      {/* 📋 List */}
      <View style={styles.listWrap}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#4F46E5"
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            <FlatList
              data={mentors}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingRight: 10, paddingTop: 4 }}
              onScroll={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / 95);
                setActiveIndex(index);
              }}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  style={styles.mentorItem}
                  activeOpacity={0.85}
                >
                  {/* 🖼️ Circle Avatar with Ring */}
                  <View style={styles.avatarWrapper}>
                    {/* Outer Ring */}
                    <View style={styles.avatarRing} />

                    {/* Inner Circle (Image or Initials) */}
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <LinearGradient
                        colors={['#6366F1', '#8B5CF6']}
                        style={styles.avatarPlaceholder}
                      >
                        <Text style={styles.avatarText}>
                          {getInitials(item.name)}
                        </Text>
                      </LinearGradient>
                    )}

                    {/* Online Dot */}
                    <View style={styles.onlineDot} />
                  </View>

                  {/* 📝 Name */}
                  <Text style={styles.mentorName} numberOfLines={1}>
                    {item.name}
                  </Text>

                  {/* 📚 Subject */}
                  <Text style={styles.mentorSubject} numberOfLines={1}>
                    {item.sub}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* ✅ Dots indicator (Commented) */}
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

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
  },

  // 🏆 Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trophyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyEmoji: { fontSize: 20 },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
  },
  sectionSubtitle: {
    fontSize: 10,
    fontFamily: 'roboto',
    color: '#6B7280',
    marginTop: 2,
  },

  // 📋 List Wrap
  listWrap: {
    marginTop: 14,
  },

  // 👤 Mentor Item (No Card, just circle + text)
  mentorItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 90,
  },

  // 🖼️ Avatar
  avatarWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#ddd',
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'roboto-bold',
  },

  // 🟢 Online Dot
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: '#fff',
  },

  // 📝 Text
  mentorName: {
    fontSize: 12,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginTop: 8,
    width: '100%',
  },
  mentorSubject: {
    fontFamily: 'roboto',
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
    width: '100%',
  },
});