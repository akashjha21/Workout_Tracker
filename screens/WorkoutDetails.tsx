import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import * as SecureStore from 'expo-secure-store';

const WorkoutDetailScreen = ({ route, navigation }:any) => {
  const { workout } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(10);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    let interval:any;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsRunning(false);
            // Do not auto-advance. Wait for user to press Start/Resume.
            if (currentExerciseIndex === workout.exercises.length - 1) {
              setIsWorkoutFinished(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  useEffect(() => {
    const saveWorkoutToHistory = async () => {
      const completed = {
        name: workout.name,
        date: new Date().toLocaleString(),
      };
      try {
        const email = await SecureStore.getItemAsync('email');
        const key = email ? `workoutHistory_${email}` : 'workoutHistory';
        const stored = await AsyncStorage.getItem(key);
        const history = stored ? JSON.parse(stored) : [];
        history.push(completed);
        await AsyncStorage.setItem(key, JSON.stringify(history));
      } catch (e) {
        console.error('Failed to save workout history:', e);
      }
    };

    if (isWorkoutFinished) {
      saveWorkoutToHistory().then(() => {
        navigation.navigate('History');
      });
    }
  }, [isWorkoutFinished]);

  const startWorkout = () => {
    if (timer === 0) {
      setTimer(10);
    }
    setIsRunning(true);
  };

  const pauseWorkout = () => {
    setIsRunning(false);
  };

  const resumeWorkout = () => {
    if (timer === 0) {
      setTimer(10);
    }
    setIsRunning(true);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((index) => index + 1);
      setTimer(10);
      setIsRunning(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#121629' : '#fff' }}>
      <View style={{ marginTop: 24, paddingTop: 8, paddingHorizontal:20 }}>
        <Header title={workout.name} showBack onBack={() => navigation.goBack()} navigation={navigation} />
      </View>
      <View style={styles.container}>
        <Text style={[styles.exerciseName, { color: isDarkMode ? '#fff' : '#232946' }]}>{workout.exercises[currentExerciseIndex]}</Text>
        <Text style={{ fontSize: 16, marginBottom: 12, color: isDarkMode ? '#eebbc3' : '#232946', textAlign: 'center' }}>
          You will do "{workout.exercises[currentExerciseIndex]}" for the next 10 seconds.
        </Text>
        {/* Timer is always visible */}
        <Text style={styles.timer}>Time left: {timer}s</Text>
        <View style={styles.buttonRow}>
          {!isRunning && timer > 0 && (
            <Button title={currentExerciseIndex === 0 && timer === 10 ? "Start" : "Resume"} onPress={startWorkout} />
          )}
          {isRunning && (
            <Button title="Pause" onPress={pauseWorkout} />
          )}
          {!isRunning && timer === 0 && currentExerciseIndex < workout.exercises.length - 1 && (
            <Button title="Next Exercise" onPress={nextExercise} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#232946',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  timer: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'tomato',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exercise: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default WorkoutDetailScreen;
