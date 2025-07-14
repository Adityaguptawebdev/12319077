# URL Shortener Web Application

## Candidate Details
- **Name:** Aditya Gupta
- **Roll Number:** 12319077
- **Email:** yourcollegeemail@lpu.in
- **GitHub Username:** adityaguptawebdev

## Project Description
A React-based URL Shortener application with analytics and logging integration for the Affordmed Campus Hiring Evaluation.

## Features
- ✅ Shorten up to 5 URLs concurrently
- ✅ Custom shortcodes and validity periods
- ✅ Client-side routing for redirections
- ✅ Click analytics with timestamps and sources
- ✅ Statistics dashboard
- ✅ Material-UI styling
- ✅ Custom logging middleware with API integration

## Tech Stack
- React 19 + Vite
- Material-UI
- React Router DOM
- Custom Logging Middleware

## Setup Instructions

### 1. Install Dependencies
```bash
cd "Frontend Test Submission"
npm install
```

### 2. Configure Logging API (Required)
Before running the app, you need to set up the evaluation service integration:

1. **Register with the evaluation service:**
```bash
curl -X POST http://20.244.56.144/eva1uation-service/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yourcollegeemail@lpu.in",
    "name": "Aditya Gupta",
    "mobileNo": "9999999999",
    "githubUsername": "adityaguptawebdev",
    "rollNo": "12319077",
    "accessCode": "yourAccessCodeFromEmail"
  }'
```

2. **Update credentials in `src/config/auth.js`:**
```javascript
export const AUTH_CONFIG = {
  email: "rahul860152gupta@gmail.com",
  name: "Aditya Gupta",
  rollNo: "12319077",
  accessCode: "xgAsNC",
  clientID: "d9cbb699-6a27-44a5-8d59-8b1befa816da",
  clientSecret: "tVJaaaRBSeXcRXeM" 
};

```

### 3. Run the Application
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Application Structure
```
src/
├── pages/              # Main application pages
│   ├── URLShortenerPage.jsx
│   ├── StatisticsPage.jsx
│   └── RedirectHandler.jsx
├── services/           # Business logic
│   ├── urlService.js
│   └── storageService.js
├── middleware/         # Custom logging middleware
│   └── logger.js
├── utils/             # Utility functions
│   ├── validation.js
│   └── generator.js
├── config/            # Configuration files
│   └── auth.js
└── App.jsx           # Main application component
```

## Logging Integration
The application uses a custom logging middleware that:
- Sends logs to the evaluation service API
- Falls back to local storage if API is unavailable
- Logs all significant events (URL creation, access, errors)
- Uses proper log levels and package categorization

## Usage
1. **Create URLs:** Enter up to 5 URLs with optional custom codes and validity
2. **View Statistics:** See all created URLs with click analytics
3. **Access URLs:** Click short URLs to be redirected to original destinations
4. **Monitor Logs:** All actions are logged to the evaluation service
