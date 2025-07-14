import logger from '../middleware/logger.js';

// Handle saving/loading URL data from browser storage

const STORAGE_KEY = 'my_url_data';

function saveToStorage(urlList) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urlList));
    logger.info(`Saved ${urlList.length} URLs`, 'service');
  } catch (error) {
    logger.error(`Failed to save: ${error.message}`, 'service');
  }
}

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

function addNewUrl(urlData) {
  const allUrls = loadFromStorage();
  allUrls.push(urlData);
  saveToStorage(allUrls);
  return urlData;
}

function updateExistingUrl(id, updates) {
  const allUrls = loadFromStorage();
  const urlIndex = allUrls.findIndex(url => url.id === id);

  if (urlIndex >= 0) {
    allUrls[urlIndex] = { ...allUrls[urlIndex], ...updates };
    saveToStorage(allUrls);
    return allUrls[urlIndex];
  }
  return null;
}

function findUrlByCode(shortCode) {
  const allUrls = loadFromStorage();
  return allUrls.find(url => url.shortCode === shortCode);
}

export { saveToStorage, loadFromStorage, addNewUrl, updateExistingUrl, findUrlByCode };
