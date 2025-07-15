import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../context/ThemeContext';

// Custom theme toggle (copied from Home)
import { Animated } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomThemeToggle = ({ isDarkMode, toggleTheme }: { isDarkMode: boolean, toggleTheme: () => void }) => {
  const offset = React.useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(offset, {
      toValue: isDarkMode ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const thumbPosition = offset.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 34],
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
    width: 64,
    height: 32,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    position: 'relative',
    minHeight: 48,
    paddingTop: Platform.OS === 'android' ? 32 : 48,
  },
  headerSection: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    color: '#232946',
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginLeft: 10,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    // transparent overlay to catch outside presses
  },
  fabMenu: {
    position: 'absolute',
    top: 44,
    right: 0,
    minWidth: 120,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
  },
  fabOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  fabText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  navigation?: any;
  simple?: boolean;
};

const Header = ({ title = "Workout Tracker", showBack = false, onBack, navigation, simple = false }: HeaderProps) => {
  const { isDarkMode, toggleTheme, setIsDarkMode } = useTheme();
  const [menuVisible, setMenuVisible] = React.useState(false);

  // Logout function: clear token and navigate to Auth
  const logout = async () => {
    setMenuVisible(false);
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('email');
    await SecureStore.deleteItemAsync('password');
    const email = await SecureStore.getItemAsync('email');
    const key = email ? `workoutHistory_${email}` : 'workoutHistory';
    await AsyncStorage.removeItem(key);
    await AsyncStorage.setItem('isDarkMode', 'false');
    setIsDarkMode(false);
    navigation?.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  if (simple) {
    return (
      <>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, { justifyContent: 'center' }]}> 
          <Text style={[styles.title, { textAlign: 'center', flex: 1, color: isDarkMode ? '#fff' : '#232946' }]}> {title} </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <View style={styles.headerSection}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }} accessibilityLabel="Go back">
              <Icon name="arrow-left" size={24} color={isDarkMode ? '#fff' : '#232946'} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#232946' }]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        </View>
        <View style={styles.headerRight}>
          <CustomThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          {!showBack && (
            <View>
              <TouchableOpacity
                style={[styles.profileButton, { borderColor: isDarkMode ? '#fff' : '#232946', borderWidth: 1 }]}
                onPress={() => setMenuVisible((v) => !v)}
                accessibilityLabel="Profile"
              >
                <Icon name="user" size={22} color={isDarkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
              {menuVisible && (
                <TouchableOpacity
                  style={styles.menuOverlay}
                  activeOpacity={1}
                  onPress={() => setMenuVisible(false)}
                >
                  <View style={[styles.fabMenu, { backgroundColor: isDarkMode ? '#232946' : '#fff', borderColor: isDarkMode ? '#fff' : '#232946' }]}> 
                    <TouchableOpacity
                      style={styles.fabOption}
                      onPress={() => {
                        setMenuVisible(false);
                        navigation?.navigate('History');
                      }}
                    >
                      <Icon name="clock" size={18} color={isDarkMode ? '#eebbc3' : '#232946'} />
                      <Text style={[styles.fabText, { color: isDarkMode ? '#fff' : '#232946' }]}>History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.fabOption}
                      onPress={logout}
                    >
                      <Icon name="log-out" size={18} color={isDarkMode ? '#eebbc3' : '#232946'} />
                      <Text style={[styles.fabText, { color: isDarkMode ? '#fff' : '#232946' }]}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default Header; 