import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightColors = {
  mode: 'light',
  primary: '#0284C7',
  primaryDark: '#0369A1',
  primaryLight: '#E0F2FE',
  secondary: '#0D9488',
  accent: '#06B6D4',
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardAlt: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  dealerBadge: '#6366F1',
  dealerBadgeLight: '#EEF2FF',
  adminBadge: '#DC2626',
  adminBadgeLight: '#FEE2E2',
  gold: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.6)'
};

const darkColors = {
  mode: 'dark',
  primary: '#38BDF8',
  primaryDark: '#0284C7',
  primaryLight: '#082F49',
  secondary: '#2DD4BF',
  accent: '#22D3EE',
  background: '#0F172A',
  card: '#1E293B',
  cardAlt: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#334155',
  borderLight: '#1E293B',
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  danger: '#F87171',
  dangerLight: '#7F1D1D',
  dealerBadge: '#818CF8',
  dealerBadgeLight: '#312E81',
  adminBadge: '#F87171',
  adminBadgeLight: '#7F1D1D',
  gold: '#FBBF24',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.75)'
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@califnco_dark_mode').then((val) => {
      if (val !== null) {
        setIsDarkMode(val === 'true');
      }
    }).catch(() => {});
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem('@califnco_dark_mode', String(next)).catch(() => {});
      return next;
    });
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
