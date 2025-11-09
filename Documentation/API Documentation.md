# Air Quality Monitor - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [External API Integration](#external-api-integration)
4. [Component API](#component-api)
5. [Data Structures](#data-structures)
6. [Functions Reference](#functions-reference)
7. [Error Handling](#error-handling)
8. [Rate Limits & Optimization](#rate-limits--optimization)
9. [Deployment Guide](#deployment-guide)
10. [Testing](#testing)

---

## 1. Overview

### Purpose
Technical documentation for developers implementing, extending, or integrating the Air Quality Monitor application.

### Technology Stack
- **Frontend Framework**: React 18+
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Charts**: Recharts 2.5+
- **Icons**: Lucide React
- **API**: OpenWeatherMap Air Pollution API v2.5
- **Styling**: Inline CSS with CSS-in-JS patterns
- **Build Tool**: Create React App / Vite compatible

### Key Dependencies
```json
{
  "react": "^18.0.0",
  "recharts": "^2.5.0",
  "lucide-react": "^0.263.1"
}
```

---

## 2. Architecture

### Component Structure
```
AirQualityDashboard (Main Component)
├── Header Section
│   ├── Location Badge
│   ├── Timestamp Badge
│   └── Action Buttons (Refresh, Export, Notifications)
├── Error Messages Display
├── Main AQI Card
│   ├── AQI Display
│   ├── Health Category
│   └── Pollutant Grid
├── Chart Section
│   ├── 7-Day AQI Trend (AreaChart)
│   └── Particulate Matter Comparison (LineChart)
├── Quick Action Buttons
├── Documentation Section (Conditional)
├── City Comparison Section (Conditional)
├── Health Tips Section (Conditional)
├── Pollutant Comparison Chart (BarChart)
└── AQI Scale Reference
```

### Data Flow
```
1. Component Mount
   └→ useEffect triggers
      └→ fetchAirQuality()
         └→ OpenWeatherMap API Call
            ├→ Success: setCurrentData()
            └→ Error: Demo Mode / Error Display

2. Auto-Refresh (Every 5 minutes)
   └→ setInterval calls fetchAirQuality()

3. Manual Refresh
   └→ User clicks Refresh
      └→ handleRefresh()
         └→ fetchAirQuality()

4. City Comparison
   └→ User enters city
      └→ searchCity()
         ├→ Geocoding API
         └→ Air Pollution API
            └→ setCompareData()
```

### State Management
```javascript
// Core State
const [currentData, setCurrentData] = useState(null);
const [historicalData, setHistoricalData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Feature Toggles
const [notifications, setNotifications] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [showCityCompare, setShowCityCompare] = useState(false);
const [showHealthTips, setShowHealthTips] = useState(false);
const [showDocumentation, setShowDocumentation] = useState(false);

// Comparison Feature
const [compareCity, setCompareCity] = useState('');
const [compareData, setCompareData] = useState(null);
```

---

## 3. External API Integration

### OpenWeatherMap Air Pollution API

#### Base URL
```
https://api.openweathermap.org/data/2.5/air_pollution
```

#### Authentication
```javascript
const API_KEY = 'your_api_key_here';
// Include in query parameters: &appid={API_KEY}
```

#### Endpoints Used

##### 1. Get Air Pollution Data
```http
GET /data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lat | float | Yes | Latitude (-90 to 90) |
| lon | float | Yes | Longitude (-180 to 180) |
| appid | string | Yes | API key |

**Example Request:**
```javascript
fetch('https://api.openweathermap.org/data/2.5/air_pollution?lat=13.0827&lon=80.2707&appid=YOUR_KEY')
```

**Response Structure:**
```json
{
  "coord": {
    "lon": 80.2707,
    "lat": 13.0827
  },
  "list": [
    {
      "main": {
        "aqi": 2
      },
      "components": {
        "co": 327.36,
        "no": 0.15,
        "no2": 18.21,
        "o3": 68.66,
        "so2": 7.58,
        "pm2_5": 25.41,
        "pm10": 45.82,
        "nh3": 2.67
      },
      "dt": 1699526400
    }
  ]
}
```

**AQI Conversion:**
```javascript
// API returns AQI on scale 1-5
// We convert to standard 0-500 scale
const standardAQI = apiAQI * 50;
```

**AQI Scale Mapping:**
| API Value | Standard Range | Category |
|-----------|---------------|----------|
| 1 | 0-50 | Good |
| 2 | 51-100 | Fair/Moderate |
| 3 | 101-150 | Moderate/USG |
| 4 | 151-200 | Poor/Unhealthy |
| 5 | 201-300 | Very Poor |

##### 2. Geocoding API (for City Search)
```http
GET /geo/1.0/direct?q={city_name}&limit=1&appid={API_KEY}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | City name (e.g., "London") |
| limit | integer | No | Max results (default: 1) |
| appid | string | Yes | API key |

**Example Request:**
```javascript
fetch('https://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=YOUR_KEY')
```

**Response Structure:**
```json
[
  {
    "name": "London",
    "lat": 51.5074,
    "lon": -0.1278,
    "country": "GB",
    "state": "England"
  }
]
```

#### Rate Limits
- **Free Tier**: 1,000 calls/day
- **Rate**: 60 calls/minute
- **Response Time**: ~200-500ms average

#### Error Responses
```javascript
// 401 Unauthorized
{
  "cod": 401,
  "message": "Invalid API key"
}

// 404 Not Found
{
  "cod": "404",
  "message": "city not found"
}

// 429 Too Many Requests
{
  "cod": 429,
  "message": "rate limit exceeded"
}
```

---

## 4. Component API

### Main Component: AirQualityDashboard

#### Props
```javascript
// No props - self-contained component
<AirQualityDashboard />
```

#### Public Methods (Exported)
```javascript
export default AirQualityDashboard;
```

### Customization Props (If Extended)
```javascript
interface AirQualityDashboardProps {
  defaultLocation?: {
    lat: number;
    lon: number;
    name: string;
  };
  apiKey?: string;
  refreshInterval?: number; // milliseconds
  enableNotifications?: boolean;
  theme?: 'light' | 'dark';
  onDataUpdate?: (data: AirQualityData) => void;
}
```

---

## 5. Data Structures

### AirQualityData
```typescript
interface AirQualityData {
  aqi: number;              // Air Quality Index (0-500+)
  pm25: number;             // PM2.5 in µg/m³
  pm10: number;             // PM10 in µg/m³
  co: number;               // Carbon Monoxide in µg/m³
  no2: number;              // Nitrogen Dioxide in µg/m³
  o3: number;               // Ozone in µg/m³
  so2: number;              // Sulfur Dioxide in µg/m³
  location: string;         // "City, Country"
  timestamp: string;        // Formatted date string
}
```

### HistoricalData
```typescript
interface HistoricalDataPoint {
  date: string;             // "Nov 8"
  aqi: number;              // Rounded AQI value
  pm25: number;             // Rounded PM2.5 value
  pm10: number;             // Rounded PM10 value
}

type HistoricalData = HistoricalDataPoint[];
```

### AQICategory
```typescript
interface AQICategory {
  level: string;            // "Good", "Moderate", etc.
  color: string;            // Hex color code
  recommendation: string;   // Health recommendation text
  icon: string;            // Emoji icon
  healthEffects: string;   // Brief health effect description
}
```

### PollutantInfo
```typescript
interface PollutantInfo {
  name: string;            // Display name (e.g., "PM2.5")
  unit: string;            // "µg/m³"
  safe: number;            // WHO safe limit
}
```

### HealthTips
```typescript
interface HealthTips {
  outdoor: string[];       // Outdoor activity tips
  indoor: string[];        // Indoor recommendations
  general: string[];       // General health advice
}
```

---

## 6. Functions Reference

### Core Functions

#### fetchAirQuality()
Fetches air quality data from OpenWeatherMap API.

```javascript
const fetchAirQuality = useCallback(async (lat, lon, cityName) => {
  // Implementation
}, [showNotification]);
```

**Parameters:**
- `lat` (number): Latitude coordinate
- `lon` (number): Longitude coordinate  
- `cityName` (string): Display name for location

**Returns:** void (updates state)

**Side Effects:**
- Updates `currentData` state
- Updates `historicalData` state
- Triggers notification if AQI > 100
- Sets error states on failure

**Error Handling:**
- API key missing → Demo mode
- API call fails → Error display
- Network error → Retry prompt

---

#### searchCity()
Searches for city and retrieves air quality data.

```javascript
const searchCity = async (cityName) => {
  try {
    // 1. Geocoding API call
    const geoResponse = await fetch(geocodingURL);
    const geoData = await geoResponse.json();
    
    // 2. Air Pollution API call
    const response = await fetch(airPollutionURL);
    const data = await response.json();
    
    // 3. Return processed data
    return processedData;
  } catch (err) {
    throw err;
  }
};
```

**Parameters:**
- `cityName` (string): City name to search

**Returns:** Promise\<AirQualityData\>

**Throws:**
- 'City not found' if geocoding fails
- 'Failed to fetch air quality data' if API call fails

---

#### generateHistoricalData()
Generates simulated 7-day historical data based on current AQI.

```javascript
const generateHistoricalData = (currentAQI) => {
  const days = 7;
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    // Generate realistic variations
    const variation = (Math.random() - 0.5) * 40;
    const aqi = Math.max(10, Math.min(200, currentAQI + variation));
    // ... calculate other pollutants
    data.push(dataPoint);
  }
  
  return data;
};
```

**Parameters:**
- `currentAQI` (number): Current AQI value as baseline

**Returns:** HistoricalDataPoint[]

**Algorithm:**
- Creates 7 data points (1 per day)
- Adds random variation (±20 AQI points)
- Maintains realistic relationships (PM10 ~1.5x PM2.5)
- Clamps values to reasonable ranges

---

#### getAQICategory()
Determines health category based on AQI value.

```javascript
const getAQICategory = (aqi) => {
  if (aqi <= 50) return { level: 'Good', color: '#10b981', ... };
  if (aqi <= 100) return { level: 'Moderate', color: '#f59e0b', ... };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', ... };
  if (aqi <= 200) return { level: 'Unhealthy', color: '#ef4444', ... };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: '#dc2626', ... };
  return { level: 'Hazardous', color: '#991b1b', ... };
};
```

**Parameters:**
- `aqi` (number): Air Quality Index value

**Returns:** AQICategory object

**Categories:** 6 levels based on EPA standards

---

#### getPollutantInfo()
Returns metadata for specific pollutant.

```javascript
const getPollutantInfo = (pollutant) => {
  const info = {
    pm25: { name: 'PM2.5', unit: 'µg/m³', safe: 12 },
    pm10: { name: 'PM10', unit: 'µg/m³', safe: 50 },
    co: { name: 'CO', unit: 'µg/m³', safe: 4000 },
    no2: { name: 'NO₂', unit: 'µg/m³', safe: 40 },
    o3: { name: 'O₃', unit: 'µg/m³', safe: 100 },
    so2: { name: 'SO₂', unit: 'µg/m³', safe: 20 }
  };
  return info[pollutant] || {};
};
```

**Parameters:**
- `pollutant` (string): Pollutant key (pm25, pm10, co, no2, o3, so2)

**Returns:** PollutantInfo object

**Safe Limits:** Based on WHO Air Quality Guidelines (2021)

---

#### getHealthTips()
Provides context-aware health recommendations.

```javascript
const getHealthTips = (aqi) => {
  // Returns different tips based on AQI ranges
  // 6 categories: 0-50, 51-100, 101-150, 151-200, 201-300, 301+
  return {
    outdoor: [...],
    indoor: [...],
    general: [...]
  };
};
```

**Parameters:**
- `aqi` (number): Current AQI value

**Returns:** HealthTips object with 3 categories

---

#### exportToCSV()
Exports current and historical data to CSV file.

```javascript
const exportToCSV = () => {
  if (!currentData || !historicalData.length) return;
  
  // 1. Create CSV structure
  const headers = ['Date', 'AQI', 'PM2.5', ...];
  const rows = [currentRow, ...historicalRows];
  
  // 2. Generate CSV content
  const csvContent = rows.map(r => r.join(',')).join('\n');
  
  // 3. Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `air-quality-${location}-${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
```

**Parameters:** None

**Returns:** void (triggers download)

**File Format:** RFC 4180 compliant CSV

---

#### showNotification()
Displays browser notification for poor air quality.

```javascript
const showNotification = useCallback((aqi) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const category = getAQICategory(aqi);
    new Notification('Air Quality Alert', {
      body: `AQI is ${Math.round(aqi)} (${category.level})...`,
      icon: '🌫️'
    });
  }
}, []);
```

**Parameters:**
- `aqi` (number): Current AQI value

**Returns:** void

**Requirements:**
- Browser supports Notification API
- User granted permission
- Triggers only when AQI > 100

---

### Event Handlers

#### handleRefresh()
Manually refreshes air quality data.

```javascript
const handleRefresh = () => {
  fetchAirQuality(13.0827, 80.2707, 'Chennai, Tamil Nadu');
};
```

---

#### handleCityCompare()
Searches and compares air quality for entered city.

```javascript
const handleCityCompare = async () => {
  if (!compareCity.trim()) return;
  
  try {
    setLoading(true);
    const data = await searchCity(compareCity);
    setCompareData(data);
    setError(null);
  } catch (err) {
    setError('City not found...');
    setCompareData(null);
  } finally {
    setLoading(false);
  }
};
```

---

#### requestNotificationPermission()
Requests browser notification permission.

```javascript
const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};
```

---

## 7. Error Handling

### Error States

#### API_KEY_MISSING
**Trigger:** No API key provided
**Response:** Demo mode with simulated data
**User Message:** "⚠️ Demo Mode: Using sample data"

#### API_KEY_INVALID
**Trigger:** API returns 401/403
**Response:** Demo mode with error message
**User Message:** "❌ Invalid API Key"

#### CITY_NOT_FOUND
**Trigger:** Geocoding returns empty array
**Response:** Clear comparison data, show error
**User Message:** "City not found. Try another city name."

#### NETWORK_ERROR
**Trigger:** fetch() fails or times out
**Response:** Show error, keep previous data
**User Message:** "Failed to fetch data. Please try again."

### Error Recovery

```javascript
try {
  // API call
} catch (err) {
  if (err.message === 'API_KEY_MISSING' || err.message === 'API_KEY_INVALID') {
    // Enter demo mode
    setCurrentData(generateDemoData());
    setError(err.message);
  } else {
    // Show generic error
    setError('Failed to fetch data');
  }
} finally {
  setLoading(false);
}
```

---

## 8. Rate Limits & Optimization

### API Call Optimization

#### Caching Strategy
```javascript
// Auto-refresh every 5 minutes (300,000 ms)
const interval = setInterval(() => {
  fetchAirQuality(lat, lon, city);
}, 300000);
```

**Daily API Calls:**
- Auto-refresh: 288 calls/day (every 5 min)
- Manual refresh: Variable (user-initiated)
- City searches: Variable (user-initiated)
- **Total**: ~300-400 calls/day (well under 1,000 limit)

#### Debouncing City Search
```javascript
// Wait for Enter key or button click
// Prevents API call on every keystroke
onKeyPress={(e) => e.key === 'Enter' && handleCityCompare()}
```

#### Request Deduplication
```javascript
// Prevent multiple simultaneous requests
if (refreshing) return;
setRefreshing(true);
// ... API call ...
setRefreshing(false);
```

### Performance Optimization

#### Memoization
```javascript
// Expensive calculations cached
const aqiCategory = useMemo(
  () => getAQICategory(currentData.aqi),
  [currentData.aqi]
);
```

#### Lazy Rendering
```javascript
// Conditional rendering reduces DOM nodes
{showHealthTips && <HealthTipsSection />}
{showCityCompare && <CityCompareSection />}
```

---

## 9. Deployment Guide

### Prerequisites
1. OpenWeatherMap API key
2. Modern web hosting (Netlify, Vercel, GitHub Pages)
3. Node.js 16+ (for build)

### Build Process

#### Using Create React App
```bash
# Install dependencies
npm install

# Set API key in source code
# Find: const API_KEY = 'your_api_key_here';
# Replace with your key

# Build for production
npm run build

# Deploy 'build' folder
```

#### Using Vite
```bash
# Install dependencies
npm install

# Build
npm run build

# Deploy 'dist' folder
```

### Environment Variables (Optional)
```javascript
// .env file
REACT_APP_OPENWEATHER_API_KEY=your_key_here

// In code
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
```

### Deployment Platforms

#### Netlify
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "build"
```

#### Vercel
```bash
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build"
}
```

#### GitHub Pages
```bash
# package.json
{
  "homepage": "https://yourusername.github.io/air-quality-monitor",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### Post-Deployment Checklist
- ✅ Verify API key is active
- ✅ Test all features in production
- ✅ Enable HTTPS
- ✅ Configure CORS if needed
- ✅ Test on multiple devices/browsers
- ✅ Monitor API usage in OpenWeatherMap dashboard

---

## 10. Testing

### Manual Testing Checklist

#### Core Functionality
- [ ] Dashboard loads without errors
- [ ] Current AQI displays correctly
- [ ] All 6 pollutants show values
- [ ] Color coding matches AQI level
- [ ] Recommendations display appropriately
- [ ] Auto-refresh works (wait 5 min)

#### Charts
- [ ] 7-day trend renders
- [ ] PM2.5/PM10 comparison renders
- [ ] Bar chart (current vs safe) renders
- [ ] Tooltips show on hover
- [ ] Charts responsive on mobile

#### Features
- [ ] Manual refresh updates data
- [ ] CSV export downloads file
- [ ] CSV contains correct data
- [ ] Notification toggle works
- [ ] Browser permission requested
- [ ] City comparison finds cities
- [ ] Comparison displays correctly
- [ ] Health tips show for all AQI levels
- [ ] Documentation section displays

#### Error Handling
- [ ] Demo mode activates without API key
- [ ] Invalid API key shows error
- [ ] City not found shows error
- [ ] Network error handled gracefully

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast sufficient

### Automated Testing (Future)

#### Unit Tests (Jest)
```javascript
describe('getAQICategory', () => {
  test('returns Good for AQI <= 50', () => {
    expect(getAQICategory(45).level).toBe('Good');
  });
  
  test('returns Moderate for AQI 51-100', () => {
    expect(getAQICategory(75).level).toBe('Moderate');
  });
});
```

#### Integration Tests (React Testing Library)
```javascript
describe('AirQualityDashboard', () => {
  test('fetches and displays data on mount', async () => {
    render(<AirQualityDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Air Quality Index/i)).toBeInTheDocument();
    });
  });
});
```

---

## Appendix A: API Response Examples

### Successful Air Pollution Response
```json
{
  "coord": {
    "lon": 80.2707,
    "lat": 13.0827
  },
  "list": [
    {
      "main": {
        "aqi": 2
      },
      "components": {
        "co": 327.36,
        "no": 0.15,
        "no2": 18.21,
        "o3": 68.66,
        "so2": 7.58,
        "pm2_5": 25.41,
        "pm10": 45.82,
        "nh3": 2.67
      },
      "dt": 1699526400
    }
  ]
}
```

### Successful Geocoding Response
```json
[
  {
    "name": "Chennai",
    "local_names": {
      "ta": "சென்னை",
      "en": "Chennai"
    },
    "lat": 13.0878,
    "lon": 80.2785,
    "country": "IN",
    "state": "Tamil Nadu"
  }
]
```

---

## Appendix B: Constants Reference

### Color Codes
```javascript
const AQI_COLORS = {
  good: '#10b981',          // Green
  moderate: '#f59e0b',      // Yellow
  usg: '#f97316',           // Orange
  unhealthy: '#ef4444',     // Red
  veryUnhealthy: '#dc2626', // Dark Red
  hazardous: '#991b1b'      // Maroon
};
```

### AQI Breakpoints
```javascript
const AQI_BREAKPOINTS = {
  good: 50,
  moderate: 100,
  usg: 150,
  unhealthy: 200,
  veryUnhealthy: 300,
  hazardous: Infinity
};
```

### WHO Safe Limits (µg/m³)
```javascript
const WHO_LIMITS = {
  pm25: 12,    // Annual mean
  pm10: 50,    // 24-hour mean
  co: 4000,    // 24-hour mean
  no2: 40,     // Annual mean
  o3: 100,     // 8-hour mean
  so2: 20      // 24-hour mean
};
```

---

## Appendix C: Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| Core App | 90+ | 88+ | 14+ | 90+ | ✅ |
| Notifications | ✅ | ✅ | ❌ | ✅ | Varies |
| CSV Export | ✅ | ✅ | ✅ | ✅ | ✅ |
| Charts | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fetch API | ✅ | ✅ | ✅ | ✅ | ✅ |

---

**Document Version**: 1.0
**Last Updated**: November 9, 2025
**API Version**: OpenWeatherMap v2.5
**For**: Academic Project Submission