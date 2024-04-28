import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Set default mode to dark
    primary: {
      main: '#3f51b5', // Adjust colors for dark theme
    },
    secondary: {
      main: '#f57c00', // Adjust colors for dark theme
    },
    background: {
      default: '#212121', // Set background color for dark theme
    },
    text: {
      primary: '#fff', // Set text color for dark theme
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light', // Set mode to light
    primary: {
      main: '#007bff', // Adjust colors for light theme
    },
    secondary: {
      main: '#ffc107', // Adjust colors for light theme
    },
    background: {
      default: '#fff', // Set background color for light theme
    },
    text: {
      primary: '#000', // Set text color for light theme
    },
  },
});

export const themes = { darkTheme, lightTheme }; // Export both themes
