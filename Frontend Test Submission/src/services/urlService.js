import makeCode from '../utils/generator.js';
import { checkUrl, checkCode, checkTime } from '../utils/validation.js';
import { addNewUrl, loadFromStorage, updateExistingUrl, findUrlByCode } from './storageService.js';
import logger from '../middleware/logger.js';

// Main function to create short URLs
function createShortUrl(originalUrl, customCode, timeInMinutes) {
  // Check if URL is valid
  const urlResult = checkUrl(originalUrl);
  if (!urlResult.ok) {
    throw new Error(urlResult.msg);
  }

  // Get existing URLs to check for duplicates
  const existingUrls = loadFromStorage();
  const usedCodes = existingUrls.map(item => item.shortCode);

  // Check custom code if provided
  const codeResult = checkCode(customCode, usedCodes);
  if (!codeResult.ok) {
    throw new Error(codeResult.msg);
  }

  // Check time validity
  const timeResult = checkTime(timeInMinutes);
  if (!timeResult.ok) {
    throw new Error(timeResult.msg);
  }

  // Generate code if none provided
  const finalCode = codeResult.code || makeCode(usedCodes);

  // Calculate expiry time
  const createdTime = new Date();
  const expiryTime = new Date(createdTime.getTime() + timeResult.time * 60 * 1000);

  // Create the URL object
  const urlObject = {
    id: Date.now().toString(),
    originalUrl: urlResult.url,
    shortCode: finalCode,
    createdAt: createdTime.toISOString(),
    expiresAt: expiryTime.toISOString(),
    validityMinutes: timeResult.time,
    clicks: []
  };

  logger.info(`Created short URL: ${finalCode}`, 'service');
  return addNewUrl(urlObject);
}

// Handle accessing a short URL
function accessShortUrl(shortCode) {
  const urlData = findUrlByCode(shortCode);

  if (!urlData) {
    throw new Error('Short URL not found');
  }

  // Check if expired
  const now = new Date();
  const expiry = new Date(urlData.expiresAt);

  if (now > expiry) {
    throw new Error('This URL has expired');
  }

  // Record the click
  const clickInfo = {
    timestamp: now.toISOString(),
    source: document.referrer || 'direct',
    location: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown'
  };

  urlData.clicks.push(clickInfo);
  updateExistingUrl(urlData.id, { clicks: urlData.clicks });

  logger.info(`Short URL accessed: ${shortCode}`, 'service');
  return urlData;
}

// Get all URLs from storage
function getAllUrls() {
  return loadFromStorage();
}

// Get statistics about URLs
function getUrlStats() {
  const allUrls = loadFromStorage();
  const currentTime = new Date();

  const stats = {
    total: allUrls.length,
    active: allUrls.filter(url => new Date(url.expiresAt) > currentTime).length,
    clicks: allUrls.reduce((total, url) => total + url.clicks.length, 0)
  };

  return stats;
}

export { createShortUrl, accessShortUrl, getAllUrls, getUrlStats };
