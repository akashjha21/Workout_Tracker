import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';

const workouts = [
  {
    id: '1',
    name: 'Full Body Blast',
    exercises: ['Push-ups', 'Squats', 'Burpees'],
  },
  {
    id: '2',
    name: 'Cardio Burnout',
    exercises: ['Jumping Jacks', 'High Knees', 'Mountain Climbers'],
  },
  {
    id: '3',
    name: 'Core Strength',
    exercises: ['Plank', 'Sit-ups', 'Leg Raises'],
  },
];


const CustomThemeToggle = ({ isDarkMode, toggleTheme }: { isDarkMode: boolean, toggleTheme: () => void }) => {
  const offset = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(offset, {
      toValue: isDarkMode ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const thumbPosition = offset.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 34], // px left-right, adjusted for new width
  });

  const backgroundColor = offset.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffe066', '#22223b'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleTheme}
      style={{ marginRight: 8 }}
      accessibilityLabel="Toggle theme"
    >
      <Animated.View style={[toggleStyles.container, { backgroundColor }]}> 
        <Icon name="sun" size={18} color="#f7b801" style={{ marginLeft: 6 }} />
        <Icon name="moon" size={18} color="#fff" style={{ marginRight: 6, marginLeft: 'auto' }} />
        <Animated.View style={[toggleStyles.thumb, { left: thumbPosition }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const toggleStyles = StyleSheet.create({
  container: {
    width: 64, // slightly wider
    height: 32, // slightly taller
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    position: 'relative',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  thumb: {
    position: 'absolute',
    top: 2,
    width: 28, // slightly bigger
    height: 28, // slightly bigger
    borderRadius: 14,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});


const Home = ({ navigation }:any) => {
    
  const handleSelectWorkout = (workout:any) => {
    navigation.navigate('WorkoutDetail', { workout });
  };

  const { isDarkMode, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: isDarkMode ? '#121629' : '#e9eefd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    position: 'relative',
    minHeight: 48,
    paddingTop: Platform.OS === 'android' ? 32 : 48, // Add top padding for status bar
    // Removed backgroundColor, border radius, and shadow/elevation for flat look
  },
  greeting: {
    fontSize: 18,
    color: isDarkMode ? '#eebbc3' : '#232946',
    marginBottom: 8,
    fontWeight: '600',
  },
  card: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIcon: {
    marginRight: 16,
  },
  workoutName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#232946',
  },
  exerciseList: {
    fontSize: 14,
    color: isDarkMode ? '#eebbc3' : '#555',
    marginTop: 4,
  },
  headerSection: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
  },
  spacer: {
    width: 12,
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: isDarkMode ? '#222' : '#eee',
    marginLeft: 10,
  },
  profileText: {
    color: isDarkMode ? '#fff' : '#000',
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
});

  // Add icons for each workout
  const workoutIcons = ['activity', 'zap', 'target'];

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      {/* Greeting */}
      <Text style={styles.greeting}>Hi there! Ready for your next workout?</Text>
      {/* Workout List */}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.92}
            onPress={() => handleSelectWorkout(item)}
          >
            <LinearGradient
              colors={isDarkMode ? ['#232946', '#393e6a'] : ['#f4f6fb', '#eebbc3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardContent}>
                <Icon
                  name={workoutIcons[index % workoutIcons.length]}
                  size={28}
                  color={isDarkMode ? '#eebbc3' : '#232946'}
                  style={styles.workoutIcon}
                />
                <View style={[styles.textContainer, { flex: 1 }]}> 
                  <Text style={styles.workoutName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                  <Text style={styles.exerciseList}>{item.exercises.join(', ')}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};


export default Home;
