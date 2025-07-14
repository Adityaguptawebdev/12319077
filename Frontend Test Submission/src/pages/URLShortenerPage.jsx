import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Alert,
  IconButton,
  AppBar,
  Toolbar,
  Chip
} from '@mui/material';
import { Add, Delete, ContentCopy, BarChart } from '@mui/icons-material';
import { createShortUrl } from '../services/urlService';
import logger from '../middleware/logger';

function URLShortenerPage() {
  const [urlList, setUrlList] = useState([
    { originalUrl: '', customShortCode: '', validityMinutes: '' }
  ]);
  const [shortResults, setShortResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addNewEntry = () => {
    if (urlList.length < 5) {
      setUrlList([...urlList, { originalUrl: '', customShortCode: '', validityMinutes: '' }]);
    }
  };

  const removeEntry = (index) => {
    if (urlList.length > 1) {
      setUrlList(urlList.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index, field, value) => {
    const updated = [...urlList];
    updated[index][field] = value;
    setUrlList(updated);
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setShortResults([]);

    try {
      const createdUrls = [];

      for (let i = 0; i < urlList.length; i++) {
        const item = urlList[i];

        if (!item.originalUrl.trim()) {
          continue; // Skip empty ones
        }

        try {
          const newUrl = createShortUrl(
            item.originalUrl,
            item.customShortCode,
            item.validityMinutes
          );

          createdUrls.push({
            ...newUrl,
            shortUrl: `${window.location.origin}/${newUrl.shortCode}`
          });
        } catch (itemError) {
          throw new Error(`URL ${i + 1}: ${itemError.message}`);
        }
      }

      if (createdUrls.length === 0) {
        throw new Error('Please add at least one URL');
      }

      setShortResults(createdUrls);
      logger.info(`Created ${createdUrls.length} short URLs`, 'page');

    } catch (err) {
      setErrorMsg(err.message);
      logger.error(`Failed to create URLs: ${err.message}`, 'page');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    logger.info(`URL copied to clipboard: ${text}`, 'component');
  };

  const formatExpiryDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#1b5e20' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            URL Shortener
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/statistics"
            startIcon={<BarChart />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              borderRadius: 2
            }}
          >
            Statistics
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        py: 4
      }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 2 }}>
          URL Shortener
        </Typography>

        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
          Create up to 5 shortened URLs at once
        </Typography>

        <Paper sx={{
          p: 4,
          width: '100%',
          maxWidth: 700,
          boxShadow: '0 8px 32px rgba(46, 125, 50, 0.12)',
          border: '1px solid #e8f5e8',
          borderRadius: 3
        }}>
          {urlList.map((entry, index) => (
            <Box key={index} sx={{
              mb: 4,
              p: 3,
              border: '2px solid #c8e6c9',
              borderRadius: 3,
              bgcolor: '#f1f8e9',
              '&:hover': { borderColor: '#4caf50' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">URL {index + 1}</Typography>
                {urlList.length > 1 && (
                  <IconButton onClick={() => removeEntry(index)} color="error" sx={{ ml: 'auto' }}>
                    <Delete />
                  </IconButton>
                )}
              </Box>

              <TextField
                fullWidth
                label="Original Long URL"
                placeholder="https://example.com/very/long/url"
                value={entry.originalUrl}
                onChange={(e) => updateEntry(index, 'originalUrl', e.target.value)}
                sx={{ mb: 2 }}
                required
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Custom Shortcode (optional)"
                  placeholder="mycode123"
                  value={entry.customShortCode}
                  onChange={(e) => updateEntry(index, 'customShortCode', e.target.value)}
                  sx={{ flex: 1 }}
                  helperText="Alphanumeric characters only"
                />

                <TextField
                  label="Validity (minutes)"
                  type="number"
                  placeholder="30"
                  value={entry.validityMinutes}
                  onChange={(e) => updateEntry(index, 'validityMinutes', e.target.value)}
                  sx={{ width: 180 }}
                  helperText="Default: 30 minutes"
                />
              </Box>
            </Box>
          ))}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            {urlList.length < 5 && (
              <Button variant="outlined" onClick={addNewEntry} startIcon={<Add />}>
                Add Another URL
              </Button>
            )}

            <Button
              variant="contained"
              onClick={handleFormSubmit}
              disabled={isLoading}
              size="large"
              sx={{
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              {isLoading ? 'Shortening...' : 'Shorten URLs'}
            </Button>
          </Box>
        </Paper>

        {errorMsg && (
          <Alert severity="error" sx={{ mt: 4, width: '100%', maxWidth: 700 }}>
            {errorMsg}
          </Alert>
        )}

        {shortResults.length > 0 && (
          <Paper sx={{
            p: 4,
            mt: 4,
            width: '100%',
            maxWidth: 700,
            boxShadow: '0 8px 32px rgba(255, 111, 0, 0.12)',
            border: '1px solid #fff3e0',
            borderRadius: 3
          }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3, color: '#e65100' }}>
              Your Shortened URLs
            </Typography>

            {shortResults.map((result, index) => (
              <Box key={result.id} sx={{
                mb: 3,
                p: 3,
                bgcolor: '#fff8e1',
                borderRadius: 3,
                textAlign: 'center',
                border: '2px solid #ffcc02',
                '&:hover': {
                  borderColor: '#ff6f00',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease'
                }
              }}>
                <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                  Original: {result.originalUrl}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 2 }}>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    {result.shortUrl}
                  </Typography>
                  <IconButton size="small" onClick={() => copyToClipboard(result.shortUrl)} color="primary">
                    <ContentCopy />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Expires: {formatExpiryDate(result.expiresAt)}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Container>
    </>
  );
}

export default URLShortenerPage;
