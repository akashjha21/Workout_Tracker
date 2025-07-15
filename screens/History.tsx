import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';

const History = ({ navigation }: any) => {
  const [history, setHistory] = useState([]);
  const isFocused = useIsFocused();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchHistory = async () => {
      const email = await SecureStore.getItemAsync('email');
      const key = email ? `workoutHistory_${email}` : 'workoutHistory';
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory([]);
      }
    };
    if (isFocused) {
      fetchHistory();
    }
  }, [isFocused]);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121629' : '#fff' }]}>
      <Header navigation={navigation} showBack onBack={() => navigation.goBack()} />
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#232946' }]}>Workout History</Text>
      {history.length === 0 ? (
        <Text style={[styles.noHistory, { color: isDarkMode ? '#aaa' : '#999' }]}>No workouts completed yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }:any) => (
            <View style={[styles.card, { backgroundColor: isDarkMode ? '#232946' : '#f0f0f0' }]}>
              <Text style={[styles.workoutName, { color: isDarkMode ? '#fff' : '#232946' }]}>{item.name}</Text>
              <Text style={[styles.date, { color: isDarkMode ? '#eebbc3' : '#666' }]}>{item.date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noHistory: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  card: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default History;