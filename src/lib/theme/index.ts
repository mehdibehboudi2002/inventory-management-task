import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: "light",
    background: {
      default: "#fff5e8ff", 
    },
    primary: {
      main: "#2e7d32", // Green for header
    },
  },
});

export const darkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: "dark",
    background: {
      default: "#110e0e", // Dark brown
    },
    primary: {
      main: "#66bb6a", // Lighter green for header
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
});