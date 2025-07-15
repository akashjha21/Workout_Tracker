import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';

const Auth = ({ navigation }:any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isDarkMode } = useTheme();
  const [checking, setChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check for token
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        setChecking(false);
        return;
      }
      // Check for stored credentials
      const storedEmail = await SecureStore.getItemAsync('email');
      const storedPassword = await SecureStore.getItemAsync('password');
      if (storedEmail && storedPassword) {
        navigation.replace('Home');
        setChecking(false);
        return;
      }
      setChecking(false);
    };
    checkAuth();
  }, [navigation]);

  if (checking) {
    return null; // or a loading spinner
  }

  const handleLogin = async () => {
    if (email && password) {
      await SecureStore.setItemAsync('email', email);
      await SecureStore.setItemAsync('password', password);
      navigation.replace('Home');
    } else {
      Alert.alert('Error', 'Please enter both email and password.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}> 
      <Header simple />
      <Text style={[styles.title, { color: '#232946' }]}>Login</Text>
      <TextInput
        style={[styles.input, { color: '#232946', backgroundColor: '#fff', borderColor: '#ccc' }]}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.input, { color: '#232946', backgroundColor: '#fff', borderColor: '#ccc', paddingRight: 40 }]}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 10, top: 12 }}
          onPress={() => setShowPassword((v) => !v)}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
        </TouchableOpacity>
      </View>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default Auth;
