import { AUTH_CONFIG, API_BASE_URL } from '../config/auth.js';

// My custom logger for the URL shortener app
class MyLogger {
  constructor() {
    this.logHistory = [];
    this.authToken = null;
    this.apiEndpoint = API_BASE_URL;
    this.setupAuth();
  }

  async setupAuth() {
    // Try to get auth token
    try {
      const response = await fetch(`${this.apiEndpoint}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(AUTH_CONFIG)
      });

      if (response.ok) {
        const data = await response.json();
        this.authToken = data.access_token;
      }
    } catch (error) {
      // Just use local logging if API doesn't work
    }
  }

  async sendLogToAPI(logData) {
    if (!this.authToken) return;

    try {
      await fetch(`${this.apiEndpoint}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify(logData)
      });
    } catch (error) {
      // Don't worry if API call fails
    }
  }

  writeLog(level, message, category = 'component') {
    const logEntry = {
      time: new Date().toISOString(),
      level: level.toLowerCase(),
      message
    };

    this.logHistory.push(logEntry);

    // Save to browser storage
    try {
      localStorage.setItem('my_logs', JSON.stringify(this.logHistory.slice(-50)));
    } catch (error) {
      // Storage might be full, ignore
    }

    // Try to send to API
    this.sendLogToAPI({
      stack: 'frontend',
      level: level.toLowerCase(),
      package: category,
      message
    });
  }

  info(message, category = 'component') {
    this.writeLog('info', message, category);
  }

  error(message, category = 'component') {
    this.writeLog('error', message, category);
  }

  warn(message, category = 'component') {
    this.writeLog('warn', message, category);
  }
}

const myLogger = new MyLogger();
export default myLogger;
