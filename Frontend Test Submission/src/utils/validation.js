// My validation functions for the URL shortener

function checkUrl(url) {
  if (!url || !url.trim()) {
    return { ok: false, msg: 'Please enter a URL' };
  }

  const cleanUrl = url.trim();

  // Check if it starts with http or https
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return { ok: false, msg: 'URL needs to start with http:// or https://' };
  }

  return { ok: true, url: cleanUrl };
}

function checkCode(code, usedCodes = []) {
  // Code is optional
  if (!code || !code.trim()) {
    return { ok: true, code: null };
  }

  const cleanCode = code.trim();

  // Length check
  if (cleanCode.length < 3 || cleanCode.length > 15) {
    return { ok: false, msg: 'Code should be 3-15 characters' };
  }

  // Only letters and numbers
  if (!/^[a-zA-Z0-9]+$/.test(cleanCode)) {
    return { ok: false, msg: 'Use only letters and numbers' };
  }

  // Check if already used
  if (usedCodes.includes(cleanCode)) {
    return { ok: false, msg: 'This code is already taken' };
  }

  return { ok: true, code: cleanCode };
}

function checkTime(minutes) {
  // Default to 30 minutes if empty
  if (!minutes) return { ok: true, time: 30 };

  const num = parseInt(minutes);
  if (isNaN(num) || num < 1) {
    return { ok: false, msg: 'Enter a positive number' };
  }

  return { ok: true, time: num };
}

export { checkUrl, checkCode, checkTime };
