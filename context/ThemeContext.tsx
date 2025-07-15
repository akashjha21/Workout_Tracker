import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = ({
    isDarkMode : boolean,
    toggleTheme: () => void;
    setIsDarkMode: (val: boolean) => void;
});

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: ():any => {},
  setIsDarkMode: (_: boolean) => {},
});

export const ThemeProvider = ({ children }:any) => {
  const colorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('isDarkMode');
      if (stored !== null) {
        setIsDarkMode(stored === 'true');
      }
    })();
  }, []);

  const toggleTheme = async () => {
    setIsDarkMode((prev) => {
      AsyncStorage.setItem('isDarkMode', (!prev).toString());
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
