import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LessonList } from '../components/LessonList';

export const HomeScreen = ({ navigation }: any) => {
  const { name, birthYear, logout } = useAuth();
  
  const currentYear = new Date().getFullYear();
  const age = birthYear ? currentYear - birthYear : 0;
  
  let sectionTitle = "Daily Meditations";
  if (age <= 7) sectionTitle = "Stories for Little Ones";
  else if (age <= 12) sectionTitle = "History and Principles";
  else sectionTitle = "Core Teachings";

  return (
    <View style={styles.container} testID="home-screen">
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, {name || 'Seeker'}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <LessonList onSelectLesson={(id) => navigation.navigate('LessonDetail', { id })} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F0',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  logoutText: {
    color: '#D4AF37',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  }
});
