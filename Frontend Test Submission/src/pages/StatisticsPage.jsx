import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Home, ExpandMore, Launch } from '@mui/icons-material';
import { getAllUrls, getUrlStats } from '../services/urlService';
import logger from '../middleware/logger';

function StatisticsPage() {
  const [urlData, setUrlData] = useState([]);
  const [statsData, setStatsData] = useState({ total: 0, active: 0, clicks: 0 });

  useEffect(() => {
    const allUrls = getAllUrls();
    const stats = getUrlStats();
    setUrlData(allUrls);
    setStatsData(stats);
    logger.info(`Stats page loaded with ${allUrls.length} URLs`, 'page');
  }, []);

  const isExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  const getStatusChip = (url) => {
    if (isExpired(url.expiresAt)) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  const handleUrlClick = (shortCode, originalUrl) => {
    logger.info(`User clicked URL ${shortCode} from statistics page`, 'page');
    window.open(`/${shortCode}`, '_blank');
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#1b5e20' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            URL Statistics
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<Home />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              borderRadius: 2
            }}
          >
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4, color: '#1b5e20' }}>
          📈 Statistics Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{
              bgcolor: '#e8f5e9',
              border: '2px solid #4caf50',
              '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.2s ease' }
            }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📝 Total URLs
                </Typography>
                <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  {statsData.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{
              bgcolor: '#f3e5f5',
              border: '2px solid #9c27b0',
              '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.2s ease' }
            }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  ✅ Active URLs
                </Typography>
                <Typography variant="h4" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
                  {statsData.active}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{
              bgcolor: '#fff3e0',
              border: '2px solid #ff9800',
              '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.2s ease' }
            }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  👆 Total Clicks
                </Typography>
                <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                  {statsData.clicks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* URLs Table */}
        <Paper sx={{ mb: 4, width: '100%', boxShadow: 3 }}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              All Shortened URLs
            </Typography>
          </Box>

          {urlData.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No URLs created yet. <Link to="/">Create your first URL</Link>
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Short URL</TableCell>
                    <TableCell>Original URL</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Clicks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {urlData.map((url) => (
                    <TableRow key={url.id}>
                      <TableCell>
                        <Typography variant="body2" color="primary">
                          {window.location.origin}/{url.shortCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {url.originalUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(url.createdAt)}</TableCell>
                      <TableCell>{formatDate(url.expiresAt)}</TableCell>
                      <TableCell>{getStatusChip(url)}</TableCell>
                      <TableCell>
                        <Chip label={url.clicks.length} variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<Launch />}
                          onClick={() => handleUrlClick(url.shortCode, url.originalUrl)}
                          disabled={isExpired(url.expiresAt)}
                        >
                          Visit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Click Details */}
        {urlData.some(url => url.clicks.length > 0) && (
          <Paper sx={{ mb: 4, width: '100%', boxShadow: 3 }}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Click Details
              </Typography>
            </Box>
            
            {urlData.filter(url => url.clicks.length > 0).map((url) => (
              <Accordion key={url.id}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography>{url.shortCode}</Typography>
                    <Chip label={`${url.clicks.length} clicks`} size="small" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {url.clicks.map((click, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={formatDate(click.timestamp)}
                          secondary={`Source: ${click.source} | Location: ${click.location}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        )}
      </Container>
    </>
  );
}

export default StatisticsPage;
