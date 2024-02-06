import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';

const verticalTheme = createTheme({
  palette: {
    primary: {
      main: '#161616', 
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#252323',//to override the default styles of the Paper component
          color: 'rgba(0, 0, 0, 0.87)',
          
        },
      },
    },
  },
});

const VerticalNavbar = () => {
  return (
    <ThemeProvider theme={verticalTheme}>
      <CssBaseline />
      <Drawer variant="permanent" anchor="left" sx={{ bgcolor: '#161616' }}>
        <Toolbar />
      </Drawer>
    </ThemeProvider>
  );
};

export default VerticalNavbar;
