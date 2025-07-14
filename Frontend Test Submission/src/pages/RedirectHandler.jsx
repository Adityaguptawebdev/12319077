import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, CircularProgress } from '@mui/material';
import { Home, Error } from '@mui/icons-material';
import { accessShortUrl } from '../services/urlService';
import logger from '../middleware/logger';

function RedirectHandler() {
  const { code } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    handleRedirect();
  }, [code]);

  const handleRedirect = async () => {
    try {
      logger.info(`Trying to access: ${code}`, 'page');

      const urlData = accessShortUrl(code);
      setIsRedirecting(true);

      setTimeout(() => {
        window.location.href = urlData.originalUrl;
      }, 1000);

    } catch (err) {
      setErrorMsg(err.message);
      logger.error(`Access failed for ${code}: ${err.message}`, 'page');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Looking up short URL...
        </Typography>
      </Container>
    );
  }

  if (isRedirecting) {
    return (
      <Container maxWidth="sm" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Redirecting you now...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          If you're not redirected automatically, please check your browser settings.
        </Typography>
      </Container>
    );
  }

  if (errorMsg) {
    return (
      <Container maxWidth="md" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <Paper sx={{
          p: 6,
          textAlign: 'center',
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 8px 32px rgba(244, 67, 54, 0.15)',
          border: '2px solid #ffcdd2',
          borderRadius: 4,
          bgcolor: '#fafafa'
        }}>
          <Error sx={{ fontSize: 80, mb: 3, color: '#d32f2f' }} />

          <Typography variant="h4" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
            🚫 URL Not Found
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {errorMsg}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The short URL "/{code}" may have expired or doesn't exist.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
            <Button
              variant="contained"
              component={Link}
              to="/"
              startIcon={<Home />}
              size="large"
              sx={{
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' }
              }}
            >
              Create New URL
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/statistics"
              size="large"
              sx={{
                borderColor: '#ff6f00',
                color: '#ff6f00',
                '&:hover': {
                  borderColor: '#e65100',
                  bgcolor: 'rgba(255, 111, 0, 0.04)'
                }
              }}
            >
              View Statistics
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return null;
}

export default RedirectHandler;
