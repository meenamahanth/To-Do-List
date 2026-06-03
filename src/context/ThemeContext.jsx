import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme_mode');
    return saved ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme_mode', mode);
    // Apply theme class to document element for global custom styling outside MUI
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#8b5cf6' : '#6366f1', // Electric Violet / Indigo
            light: mode === 'dark' ? '#a78bfa' : '#818cf8',
            dark: mode === 'dark' ? '#6d28d9' : '#4f46e5',
          },
          secondary: {
            main: mode === 'dark' ? '#06b6d4' : '#0d9488', // Teal
          },
          background: {
            default: mode === 'dark' ? '#070a13' : '#f8fafc',
            paper: mode === 'dark' ? 'rgba(15, 23, 42, 0.55)' : 'rgba(255, 255, 255, 0.75)',
            sidebar: mode === 'dark' ? 'rgba(10, 15, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          },
          text: {
            primary: mode === 'dark' ? '#f8fafc' : '#0f172a',
            secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
          },
          divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
          h1: { fontWeight: 800, letterSpacing: '-0.02em' },
          h2: { fontWeight: 700, letterSpacing: '-0.02em' },
          h3: { fontWeight: 700, letterSpacing: '-0.01em' },
          h4: { fontWeight: 600, letterSpacing: '-0.01em' },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: {
          borderRadius: 16,
        },
        shadows: [
          'none',
          '0 2px 4px 0 rgba(0,0,0,0.02)',
          '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
          '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)',
          '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)',
          '0 25px 50px -12px rgba(0,0,0,0.1)',
          ...Array(19).fill('none'), // Fill standard MUI shadow count
        ],
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.3s ease, color 0.3s ease',
                backgroundImage: mode === 'dark'
                  ? 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.0) 45%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.1) 0%, rgba(7, 10, 19, 0.0) 50%)'
                  : 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, rgba(248, 250, 252, 0.0) 40%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.04) 0%, rgba(241, 245, 249, 0.0) 50%)',
                backgroundAttachment: 'fixed',
                scrollbarWidth: 'thin',
                scrollbarColor: mode === 'dark' ? '#334155 #0f172a' : '#cbd5e1 #f1f5f9',
                '&::-webkit-scrollbar': {
                  width: '6px',
                  height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: mode === 'dark' ? '#0f172a' : '#f1f5f9',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: mode === 'dark' ? '#334155' : '#cbd5e1',
                  borderRadius: '10px',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '12px',
                padding: '8px 16px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: mode === 'dark' 
                    ? '0 4px 12px rgba(139, 92, 246, 0.25)' 
                    : '0 4px 12px rgba(99, 102, 241, 0.15)',
                },
              },
              contained: {
                background: mode === 'dark' 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' 
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                border: 'none',
                color: '#fff',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: mode === 'dark' 
                  ? '1px solid rgba(255, 255, 255, 0.08)' 
                  : '1px solid rgba(15, 23, 42, 0.06)',
                backgroundImage: 'none',
                boxShadow: mode === 'dark' 
                  ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' 
                  : '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme: muiTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
