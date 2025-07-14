import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/URLShortenerPage';
import StatsPage from './pages/StatisticsPage';
import RedirectPage from './pages/RedirectHandler';
import logger from './middleware/logger';

// Custom theme colors I picked
const appTheme = createTheme({
  palette: {
    primary: { main: '#2e7d32' },
    secondary: { main: '#ff6f00' },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/statistics" element={<StatsPage />} />
          <Route path="/:code" element={<RedirectPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
