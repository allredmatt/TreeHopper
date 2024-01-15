import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      light: 'hsl(87, 100%, 79%)',
      main: '#45523e',
      dark: 'hsl(89, 48%, 41%)',
    },
    secondary: {
      light: '#ffc1e3',
      main: '#369b99',
      dark: '#67369b',
    },
    transparentBackground: 'hsla(116, 25%, 91% ,0.85)'
  },
  sizes:{
    drawWidth: '240px'
  },
});


export default theme;