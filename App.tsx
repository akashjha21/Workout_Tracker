import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Auth from './screens/Auth';
import Home from './screens/Home';
import WorkoutDetails from './screens/WorkoutDetails';
import History from './screens/History';
import { ThemeProvider } from './context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
          <Stack.Screen name="WorkoutDetail" component={WorkoutDetails} options={{ headerShown: false }}/>
          <Stack.Screen name="History" component={History} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
