import { createTheme } from '@mui/material/styles';
import { orange, deepOrange } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: orange[500],
      light: orange[300],
      dark: orange[700],
    },
    secondary: {
      main: deepOrange[500],
      light: deepOrange[300],
      dark: deepOrange[700],
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

export default theme;
