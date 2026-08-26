import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Feather, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');


export default function TopScorersPage() {
  const [activeTab, setActiveTab] = useState('month');

  // Sample data
  const topStudents = [
    { id: 1, name: 'Rahul Kumar', score: 98, class: '10th A', image: '' },
    { id: 2, name: 'Priya Sharma', score: 95, class: '10th B', image: '' },
    { id: 3, name: 'Amit Singh', score: 92, class: '9th A', image: '' },
    { id: 4, name: 'Sneha Patel', score: 88, class: '10th A', image: '' },
    { id: 5, name: 'Vikram Raj', score: 85, class: '9th B', image: '' },
    { id: 6, name: 'Ananya Reddy', score: 82, class: '8th A', image: '' },
    { id: 7, name: 'Karan Mehta', score: 78, class: '10th B', image: '' },
    { id: 8, name: 'Neha Jain', score: 75, class: '9th A', image: '' },
    { id: 9, name: 'Ravi Desai', score: 72, class: '8th B', image: '' },
    { id: 10, name: 'Pooja Nair', score: 68, class: '7th A', image: '' },
  ];

  const monthlyData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 72 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 82 },
    { month: 'May', score: 88 },
    { month: 'Jun', score: 92 },
    { month: 'Jul', score: 95 },
  ];

  const yearlyData = [
    { month: '2020', score: 70 },
    { month: '2021', score: 78 },
    { month: '2022', score: 85 },
    { month: '2023', score: 92 },
    { month: '2024', score: 98 },
  ];

  const chartData = activeTab === 'month' ? monthlyData : yearlyData;
  const maxScore = Math.max(...chartData.map(item => item.score));

  const getStatus = (index) => {
    if (index < 2) return { text: 'Online', color: '#16a34a' };
    if (index === 2) return { text: '5 min ago', color: '#6b7280' };
    return { text: `${index * 3} min ago`, color: '#9ca3af' };
  };

  const getMultiplier = (index) => {
    if (index === 0) return 'x3';
    if (index === 1) return 'x2';
    if (index === 2) return 'x2';
    return null;
  };

  const getRankStyle = (index) => {
    if (index === 0)
      return {
        label: '1',
        wrapper: ['#fbbf24', '#fb923c'],
        textColor: '#c2410c',
      };
    if (index === 1)
      return {
        label: '2',
        wrapper: ['#e2e8f0', '#cbd5e1'],
        textColor: '#475569',
      };
    if (index === 2)
      return {
        label: '3',
        wrapper: ['#fb923c', '#f59e0b'],
        textColor: '#9a3412',
      };
    return {
      label: index + 1,
      wrapper: ['#dbeafe', '#bfdbfe'],
      textColor: '#1d4ed8',
    };
  };

  const CustomBarChart = ({ data }) => {
    const maxValue = Math.max(...data.map(item => item.score));
    const barColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#3b82f6', '#60a5fa'];
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartBarsWrapper}>
          {data.map((item, index) => {
            const barHeight = (item.score / maxValue) * 150;
            
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: Math.max(barHeight, 4),
                        backgroundColor: barColors[index % barColors.length],
                      }
                    ]}
                  />
                  <Text style={styles.barValue}>{item.score}</Text>
                </View>
                <Text style={styles.barLabel}>{item.month}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏆 Top Scorers</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Leaderboard List */}
        <View style={styles.listContainer}>
          <View style={styles.toolbar}>
            <View style={styles.toolbarLeft}>
              <Ionicons name="time-outline" size={14} color="#1e40af" />
              <Text style={styles.toolbarText}>Top 10 Scorers</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton}>
              <Feather name="refresh-cw" size={14} color="#2563eb" />
            </TouchableOpacity>
          </View>

          {topStudents.map((student, index) => {
            const status = getStatus(index);
            const multiplier = getMultiplier(index);
            const rank = getRankStyle(index);

            return (
              <View key={student.id ?? `${student.name}-${index}`}>
                {index === 5 && (
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <View style={styles.dividerBadge}>
                      <Text style={styles.dividerText}>▲ More Students ▲</Text>
                    </View>
                    <View style={styles.dividerLine} />
                  </View>
                )}

                <View
                  style={[
                    styles.studentRow,
                    index < 3 && styles.topStudentRow,
                  ]}
                >
                  <LinearGradient
                    colors={rank.wrapper}
                    style={styles.rankBadge}
                  >
                    <Text style={[styles.rankText, { color: rank.textColor }]}>
                      {rank.label}
                    </Text>
                  </LinearGradient>

                  <View style={styles.avatarContainer}>
                    {student.image ? (
                      <Image
                        source={{ uri: student.image }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarText}>
                          {student.name?.charAt(0)?.toUpperCase() || 'S'}
                        </Text>
                      </View>
                    )}
                    {index < 3 && (
                      <View style={styles.starBadge}>
                        <Text style={styles.starText}>✨</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName} numberOfLines={1}>
                      {student.name}
                    </Text>
                    <View style={styles.studentMeta}>
                      <Text style={[styles.statusText, { color: status.color }]}>
                        {status.text}
                      </Text>
                      <Text style={styles.classText}>{student.class}</Text>
                    </View>
                  </View>

                  {multiplier && (
                    <View style={styles.multiplierContainer}>
                      <LinearGradient
                        colors={['#3b82f6', '#2563eb']}
                        style={styles.multiplierBadge}
                      >
                        <Ionicons name="flash" size={16} color="white" />
                      </LinearGradient>
                      <View style={styles.multiplierLabel}>
                        <Text style={styles.multiplierText}>{multiplier}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreIcon}>✹</Text>
                    <Text style={styles.scoreText}>{student.score}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <MaterialIcons name="bar-chart" size={20} color="#2563eb" />
              <Text style={styles.chartTitle}>Performance</Text>
            </View>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setActiveTab('month')}
                style={[
                  styles.tabButton,
                  activeTab === 'month' && styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'month' && styles.activeTabText,
                  ]}
                >
                  Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('year')}
                style={[
                  styles.tabButton,
                  activeTab === 'year' && styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'year' && styles.activeTabText,
                  ]}
                >
                  Year
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statBlue]}>
              <Text style={styles.statValue}>92</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={[styles.statCard, styles.statGreen]}>
              <Text style={styles.statValue}>↑18%</Text>
              <Text style={styles.statLabel}>Growth</Text>
            </View>
            <View style={[styles.statCard, styles.statPurple]}>
              <Text style={styles.statValue}>10</Text>
              <Text style={styles.statLabel}>Top</Text>
            </View>
          </View>

          <CustomBarChart data={chartData} />
        </View>
      </ScrollView>

      {/* Continue Your Test FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/classes')}
        activeOpacity={0.85}
      >
        <View style={styles.fabLabel}>
          <Text style={styles.fabText}>Continue Your Test</Text>
        </View>

        <View style={styles.fabCircle}>
          <AntDesign name="arrowright" size={28} color="#FFF" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#93c5fd',
    shadowColor: '#93c5fd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 4,
    marginBottom: 16,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(219, 234, 254, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolbarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1e40af',
  },
  refreshButton: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#bfdbfe',
    borderRadius: 1,
  },
  dividerBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
  },
  dividerText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'white',
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6,
    shadowColor: '#bfdbfe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 2,
  },
  topStudentRow: {
    backgroundColor: '#eff6ff',
    borderColor: '#93c5fd',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#60a5fa',
  },
  avatarPlaceholder: {
    backgroundColor: '#93c5fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  starBadge: {
    position: 'absolute',
    top: -6,
    right: -4,
  },
  starText: {
    fontSize: 12,
  },
  studentInfo: {
    flex: 1,
    marginRight: 4,
  },
  studentName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f2937',
  },
  studentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  classText: {
    fontSize: 9,
    fontWeight: '500',
    color: '#9ca3af',
  },
  multiplierContainer: {
    position: 'relative',
    marginRight: 4,
  },
  multiplierBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#93c5fd',
  },
  multiplierLabel: {
    position: 'absolute',
    bottom: -4,
    right: -6,
    backgroundColor: '#fef08a',
    paddingHorizontal: 4,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  multiplierText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#1e40af',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'flex-end',
  },
  scoreIcon: {
    fontSize: 16,
    marginRight: 2,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  chartSection: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#93c5fd',
    shadowColor: '#93c5fd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9ca3af',
  },
  activeTabText: {
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statBlue: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  statGreen: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  statPurple: {
    backgroundColor: '#faf5ff',
    borderColor: '#e9d5ff',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '500',
    color: '#9ca3af',
    marginTop: 2,
  },
  chartContainer: {
    paddingVertical: 10,
  },
  chartBarsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 4,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 170,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1e3a8a',
    marginTop: 4,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fabLabel: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  fabCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  fabText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: '700',
  },
});