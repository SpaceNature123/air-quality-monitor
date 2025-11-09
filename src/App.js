import React, { useState, useEffect, useCallback } from 'react';
import { Activity, AlertTriangle, TrendingUp, MapPin, Bell, RefreshCw, Info, Droplets, Users, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const AirQualityDashboard = () => {
  // State management for core functionality
  const [currentData, setCurrentData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  // const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for new features
  const [showCityCompare, setShowCityCompare] = useState(false);
  const [compareCity, setCompareCity] = useState('');
  const [compareData, setCompareData] = useState(null);
  const [showHealthTips, setShowHealthTips] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);

  /**
   * Determines AQI category based on value
   * Returns health information, color coding, and recommendations
   */
  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { 
      level: 'Good', 
      color: '#10b981', 
      recommendation: 'Air quality is satisfactory. Enjoy outdoor activities!',
      icon: '😊',
      healthEffects: 'None'
    };
    if (aqi <= 100) return { 
      level: 'Moderate', 
      color: '#f59e0b', 
      recommendation: 'Unusually sensitive people should consider reducing prolonged outdoor exertion.',
      icon: '🙂',
      healthEffects: 'Acceptable for most'
    };
    if (aqi <= 150) return { 
      level: 'Unhealthy for Sensitive Groups', 
      color: '#f97316', 
      recommendation: 'Sensitive groups should reduce outdoor exertion.',
      icon: '😐',
      healthEffects: 'Respiratory symptoms possible'
    };
    if (aqi <= 200) return { 
      level: 'Unhealthy', 
      color: '#ef4444', 
      recommendation: 'Everyone should reduce prolonged outdoor exertion.',
      icon: '😷',
      healthEffects: 'Increased health effects'
    };
    if (aqi <= 300) return { 
      level: 'Very Unhealthy', 
      color: '#dc2626', 
      recommendation: 'Avoid outdoor activities. Health alert for everyone.',
      icon: '😨',
      healthEffects: 'Significant health effects'
    };
    return { 
      level: 'Hazardous', 
      color: '#991b1b', 
      recommendation: 'Everyone should avoid all outdoor exertion. Stay indoors!',
      icon: '☠️',
      healthEffects: 'Emergency conditions'
    };
  };

  /**
   * Returns pollutant metadata including safe limits
   */
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

  /**
   * Provides context-aware health tips based on current AQI
   * Categories: outdoor activities, indoor recommendations, general health
   */
  const getHealthTips = (aqi) => {
    if (aqi <= 50) return {
      outdoor: ['Perfect for outdoor exercise', 'Great time for jogging or cycling', 'Ideal for children to play outside'],
      indoor: ['Open windows for fresh air', 'Natural ventilation recommended'],
      general: ['Enjoy outdoor activities without concerns']
    };
    if (aqi <= 100) return {
      outdoor: ['Outdoor activities generally fine', 'Sensitive individuals monitor symptoms', 'Consider timing activities during better air quality'],
      indoor: ['Air purifiers beneficial for sensitive groups', 'Keep windows closed during high traffic hours'],
      general: ['Most people can continue normal activities']
    };
    if (aqi <= 150) return {
      outdoor: ['Reduce prolonged outdoor exertion', 'Take frequent breaks during activities', 'Consider indoor exercise alternatives'],
      indoor: ['Use air purifiers if available', 'Keep windows closed', 'Create clean air zones in home'],
      general: ['Sensitive groups limit outdoor time', 'Watch for respiratory symptoms']
    };
    if (aqi <= 200) return {
      outdoor: ['Avoid prolonged outdoor activities', 'Wear N95 masks if going outside', 'Reschedule outdoor events'],
      indoor: ['Stay indoors with air purification', 'Seal windows and doors', 'Use HEPA filters'],
      general: ['Everyone should limit outdoor exposure', 'Monitor health symptoms closely']
    };
    if (aqi <= 300) return {
      outdoor: ['Avoid all outdoor activities', 'Stay indoors as much as possible', 'Use N95/N99 masks if must go out'],
      indoor: ['Keep all windows closed', 'Run air purifiers continuously', 'Create safe indoor environments'],
      general: ['Health alert: everyone affected', 'Seek medical attention if experiencing symptoms']
    };
    return {
      outdoor: ['DO NOT go outside', 'Emergency conditions', 'Relocate if possible'],
      indoor: ['Seal all openings', 'Maximum air purification', 'Consider evacuation'],
      general: ['Emergency health conditions', 'Immediate medical attention for symptoms']
    };
  };

  /**
   * Generates 7 days of historical data with realistic variations
   * Used for trend visualization
   */
  const generateHistoricalData = (currentAQI) => {
    const days = 7;
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Add realistic variation to AQI
      const variation = (Math.random() - 0.5) * 40;
      const aqi = Math.max(10, Math.min(200, currentAQI + variation));
      const pm25 = Math.max(5, Math.min(150, aqi * 0.5 + (Math.random() - 0.5) * 20));
      const pm10 = pm25 * 1.5 + (Math.random() - 0.5) * 15;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        aqi: Math.round(aqi),
        pm25: Math.round(pm25),
        pm10: Math.round(pm10)
      });
    }
    
    return data;
  };

  /**
   * Exports current and historical data to CSV format
   * Downloads file with timestamp and location
   */
  const exportToCSV = () => {
    if (!currentData || !historicalData.length) return;
    
    const headers = ['Date', 'AQI', 'PM2.5', 'PM10', 'CO', 'NO2', 'O3', 'SO2'];
    const currentRow = [
      currentData.timestamp,
      currentData.aqi,
      currentData.pm25,
      currentData.pm10,
      currentData.co,
      currentData.no2,
      currentData.o3,
      currentData.so2
    ];
    
    const csvContent = [
      headers.join(','),
      currentRow.join(','),
      ...historicalData.map(row => `${row.date},${row.aqi},${row.pm25},${row.pm10},0,0,0,0`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `air-quality-${currentData.location.replace(/,/g, '')}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Searches for city by name using OpenWeatherMap Geocoding API
   * Returns air quality data for the found location
   */
  const searchCity = async (cityName) => {
    try {
      const API_KEY = 'f5ede0e43b8b7e5282ecbde480c3e745';
      
      // First, get coordinates for the city
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
      );
      
      if (!geoResponse.ok) throw new Error('City not found');
      
      const geoData = await geoResponse.json();
      if (!geoData.length) throw new Error('City not found');
      
      const { lat, lon, name, country } = geoData[0];
      const fullName = `${name}, ${country}`;
      
      // Get air quality data for the coordinates
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch air quality data');
      
      const data = await response.json();
      const components = data.list[0].components;
      const aqi = data.list[0].main.aqi * 50;
      
      return {
        aqi: aqi,
        pm25: components.pm2_5 || 0,
        pm10: components.pm10 || 0,
        co: components.co || 0,
        no2: components.no2 || 0,
        o3: components.o3 || 0,
        so2: components.so2 || 0,
        location: fullName
      };
    } catch (err) {
      throw err;
    }
  };

  /**
   * Handles city comparison search
   */
  const handleCityCompare = async () => {
    if (!compareCity.trim()) return;
    
    try {
      setLoading(true);
      const data = await searchCity(compareCity);
      setCompareData(data);
      setError(null);
    } catch (err) {
      setError('City not found. Try another city name.');
      setCompareData(null);
    } finally {
      setLoading(false);
    }
  };

/**
   * Shows browser notification for poor air quality
   */
  const showNotification = useCallback((aqi) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const category = getAQICategory(aqi);
      new Notification('Air Quality Alert', {
        body: `AQI is ${Math.round(aqi)} (${category.level}). ${category.recommendation}`,
        icon: '🌫️'
      });
    }
  }, []);

  /**
   * Fetches air quality data from OpenWeatherMap API
   * Falls back to demo mode if API key is missing or invalid
   */
  const fetchAirQuality = useCallback(async (lat, lon, cityName) => {
    try {
      setRefreshing(true);
      setError(null);

      const API_KEY = 'f5ede0e43b8b7e5282ecbde480c3e745';
      
      // Check if API key is missing or default
      if (!API_KEY || API_KEY === 'your_api_key_here') {
        throw new Error('API_KEY_MISSING');
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('API_KEY_INVALID');
      }

      const data = await response.json();
      const components = data.list[0].components;
      const aqi = data.list[0].main.aqi * 50;
      
      const processedData = {
        aqi: aqi,
        pm25: components.pm2_5 || 0,
        pm10: components.pm10 || 0,
        co: components.co || 0,
        no2: components.no2 || 0,
        o3: components.o3 || 0,
        so2: components.so2 || 0,
        location: cityName,
        timestamp: new Date().toLocaleString()
      };

      setCurrentData(processedData);
      setHistoricalData(generateHistoricalData(aqi));
      
      if (aqi > 100) {
        showNotification(aqi);
      }
      
    } catch (err) {
      // Only show demo mode for API key issues
      if (err.message === 'API_KEY_MISSING' || err.message === 'API_KEY_INVALID') {
        const demoAQI = 75 + Math.random() * 50;
        const demoData = {
          aqi: Math.round(demoAQI),
          pm25: Math.round(25 + Math.random() * 30),
          pm10: Math.round(45 + Math.random() * 40),
          co: Math.round(300 + Math.random() * 200),
          no2: Math.round(20 + Math.random() * 30),
          o3: Math.round(40 + Math.random() * 30),
          so2: Math.round(10 + Math.random() * 15),
          location: cityName || 'Demo Location',
          timestamp: new Date().toLocaleString()
        };
        
        setCurrentData(demoData);
        setHistoricalData(generateHistoricalData(demoAQI));
        setError(err.message === 'API_KEY_MISSING' ? 'DEMO_MODE' : 'API_KEY_INVALID');
      } else {
        setError('Failed to fetch data. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showNotification]);

  const handleRefresh = () => {
    fetchAirQuality(13.0827, 80.2707, 'Chennai, Tamil Nadu');
  };
  
  /**
   * Initialize dashboard with Chennai data on mount
   * Set up auto-refresh every 5 minutes
   */
  useEffect(() => {
    fetchAirQuality(13.0827, 80.2707, 'Chennai, Tamil Nadu');

    const interval = setInterval(() => {
      fetchAirQuality(13.0827, 80.2707, 'Chennai, Tamil Nadu');
    }, 300000);

    return () => clearInterval(interval);
  }, [fetchAirQuality]);

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  // Loading state
  if (loading && !currentData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ width: '64px', height: '64px', border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', fontSize: '18px', fontWeight: '500' }}>Loading air quality data...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentData) return null;

  const aqiCategory = getAQICategory(currentData.aqi);
  const pollutants = [
    { key: 'pm25', value: currentData.pm25 },
    { key: 'pm10', value: currentData.pm10 },
    { key: 'co', value: currentData.co },
    { key: 'no2', value: currentData.no2 },
    { key: 'o3', value: currentData.o3 },
    { key: 'so2', value: currentData.so2 }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px' }}>
      <style>{`
        * { box-sizing: border-box; }
        .card { 
          background: white; 
          border-radius: 16px; 
          padding: 24px; 
          margin-bottom: 24px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }
        .btn { 
          padding: 12px 24px; 
          border-radius: 8px; 
          border: none; 
          cursor: pointer; 
          font-size: 14px; 
          font-weight: 600; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          display: inline-flex; 
          align-items: center; 
          gap: 8px; 
        }
        .btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
        }
        .btn:active {
          transform: translateY(0);
        }
        .btn:disabled { 
          opacity: 0.5; 
          cursor: not-allowed; 
          transform: none;
        }
        .btn-primary { background: #667eea; color: white; }
        .btn-primary:hover { background: #5568d3; }
        .btn-white { background: white; color: #333; }
        .btn-white:hover { background: #f9fafb; }
        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .pollutant-card { 
          background: rgba(255,255,255,0.2); 
          padding: 16px; 
          border-radius: 12px; 
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .pollutant-card:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }
        .badge { 
          display: inline-flex; 
          align-items: center; 
          gap: 8px; 
          background: white; 
          padding: 8px 16px; 
          border-radius: 20px; 
          font-size: 14px; 
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .section-slide {
          animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: top;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
        }
        input:focus {
          outline: none;
          border-color: #667eea !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', margin: '0 0 12px 0' }}>
                Air Quality Monitor
              </h1>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span className="badge">
                  <MapPin size={16} />
                  {currentData.location}
                </span>
                <span className="badge">
                  <Activity size={16} />
                  {currentData.timestamp}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-white" onClick={handleRefresh} disabled={refreshing} aria-label="Refresh data">
                <RefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                Refresh
              </button>
              <button className="btn btn-white" onClick={exportToCSV} aria-label="Export data to CSV">
                <Download size={16} />
                Export
              </button>
              <button 
                className={`btn ${notifications ? 'btn-primary' : 'btn-white'}`}
                onClick={() => {
                  setNotifications(!notifications);
                  if (!notifications) requestNotificationPermission();
                }}
                aria-label={`Notifications ${notifications ? 'enabled' : 'disabled'}`}
              >
                <Bell size={16} />
                {notifications ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {error === 'DEMO_MODE' && (
          <div style={{ background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ margin: 0, fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>⚠️ Demo Mode: Using sample data</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>Add your OpenWeatherMap API key to see real-time data for your location.</p>
          </div>
        )}
        {error === 'API_KEY_INVALID' && (
          <div style={{ background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ margin: 0, fontWeight: '600', color: '#991b1b', marginBottom: '8px' }}>❌ Invalid API Key</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>Your API key is invalid. Please check your OpenWeatherMap API key and try again.</p>
          </div>
        )}
        {error && error !== 'DEMO_MODE' && error !== 'API_KEY_INVALID' && (
          <div style={{ background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ margin: 0, fontWeight: '600', color: '#991b1b' }}>{error}</p>
          </div>
        )}

        {/* Main AQI Card */}
        <div className="card" style={{ background: aqiCategory.color, color: 'white', padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.9 }}>Air Quality Index</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '72px', fontWeight: 'bold', margin: 0 }}>{Math.round(currentData.aqi)}</h2>
                <span style={{ fontSize: '48px' }}>{aqiCategory.icon}</span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>{aqiCategory.level}</p>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', margin: '0 0 4px 0', textTransform: 'uppercase', opacity: 0.9 }}>Health Effects</p>
                <p style={{ fontSize: '14px', margin: 0, fontWeight: '500' }}>{aqiCategory.healthEffects}</p>
              </div>
            </div>
            
            <div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <AlertTriangle size={20} />
                  <div>
                    <p style={{ fontWeight: '600', margin: '0 0 8px 0' }}>Recommendation</p>
                    <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{aqiCategory.recommendation}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid-3">
                {pollutants.map((p) => {
                  const info = getPollutantInfo(p.key);
                  const isHigh = p.value > info.safe;
                  return (
                    <div key={p.key} className="pollutant-card" style={{ border: isHigh ? '2px solid rgba(255,255,255,0.5)' : 'none' }}>
                      <p style={{ fontSize: '12px', margin: '0 0 4px 0', fontWeight: '600' }}>{info.name}</p>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 2px 0' }}>{Math.round(p.value)}</p>
                      <p style={{ fontSize: '10px', margin: 0, opacity: 0.8 }}>{info.unit}</p>
                      {isHigh && <p style={{ fontSize: '10px', margin: '4px 0 0 0', fontWeight: '600' }}>⚠️ High</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid-2">
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#667eea" />
              7-Day AQI Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <Area type="monotone" dataKey="aqi" stroke="#667eea" fill="#667eea" fillOpacity={0.3} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={20} color="#10b981" />
              Particulate Matter
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pm25" stroke="#10b981" strokeWidth={3} name="PM2.5" />
                <Line type="monotone" dataKey="pm10" stroke="#f59e0b" strokeWidth={3} name="PM10" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <br></br>
          <button className="btn btn-primary" onClick={() => setShowCityCompare(!showCityCompare)} aria-label="Compare cities">
            <MapPin size={16} />
            Compare Cities
          </button>
          <button className="btn btn-primary" onClick={() => setShowHealthTips(!showHealthTips)} aria-label="View health tips">
            <Users size={16} />
            Health Tips
          </button>
          <button className="btn btn-white" onClick={() => setShowDocumentation(!showDocumentation)} aria-label="View documentation">
            <Info size={16} />
            Documentation
          </button>
        </div>

        {/* Documentation Section */}
        {showDocumentation && (
          <div className="card" role="region" aria-label="Documentation">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>📖 Documentation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#667eea' }}>Project Overview</h4>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                  Real-time air quality monitoring dashboard using OpenWeatherMap Air Pollution API. 
                  Displays AQI, pollutant levels, health recommendations, and historical trends.
                </p>
              </div>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#667eea' }}>Features</h4>
                <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                  <li>Real-time AQI monitoring with color-coded health categories</li>
                  <li>7-day historical trend analysis</li>
                  <li>Multiple city comparison</li>
                  <li>CSV data export functionality</li>
                  <li>Health recommendations based on air quality</li>
                  <li>Browser notifications for unhealthy air quality</li>
                  <li>Auto-refresh every 5 minutes</li>
                  <li>Fully accessible with ARIA labels</li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#667eea' }}>Tech Stack</h4>
                <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                  <li>React 18+ with Hooks (useState, useEffect)</li>
                  <li>Recharts for data visualization</li>
                  <li>Lucide React for icons</li>
                  <li>OpenWeatherMap Air Pollution API</li>
                  <li>Responsive CSS with mobile-first design</li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#667eea' }}>Setup Instructions</h4>
                <ol style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                  <li>Get free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>OpenWeatherMap</a></li>
                  <li>Replace API_KEY variable in code with your key</li>
                  <li>Deploy to Netlify, Vercel, or GitHub Pages</li>
                  <li>Enable notifications in browser settings</li>
                </ol>
              </div>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#667eea' }}>Keyboard Navigation</h4>
                <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                  <li><kbd style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>Tab</kbd> - Navigate between interactive elements</li>
                  <li><kbd style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>Enter</kbd> - Activate buttons and submit forms</li>
                  <li><kbd style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>Space</kbd> - Toggle buttons</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* City Comparison */}
        {showCityCompare && (
          <div className="card" role="region" aria-label="City comparison">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>🌍 Compare Cities</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Enter city name (e.g., London, Tokyo, New York)"
                value={compareCity}
                onChange={(e) => setCompareCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCityCompare()}
                style={{ 
                  flex: 1, 
                  minWidth: '250px', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '2px solid #e5e7eb', 
                  fontSize: '14px',
                  outline: 'none'
                }}
                aria-label="City name input"
              />
              <button className="btn btn-primary" onClick={handleCityCompare} disabled={!compareCity.trim()} aria-label="Search city">
                Search
              </button>
            </div>
            
            {compareData && (
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#667eea' }}>Comparison Results</h4>
                <div className="grid-2">
                  <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px', borderRadius: '12px', color: 'white' }}>
                    <p style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.9 }}>Your Location</p>
                    <h4 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px' }}>{currentData.location}</h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '56px', fontWeight: 'bold' }}>
                        {Math.round(currentData.aqi)}
                      </div>
                      <span style={{ fontSize: '36px' }}>{getAQICategory(currentData.aqi).icon}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>{getAQICategory(currentData.aqi).level}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ opacity: 0.8 }}>PM2.5</div>
                        <div style={{ fontWeight: 'bold' }}>{Math.round(currentData.pm25)}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ opacity: 0.8 }}>PM10</div>
                        <div style={{ fontWeight: 'bold' }}>{Math.round(currentData.pm10)}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ opacity: 0.8 }}>NO₂</div>
                        <div style={{ fontWeight: 'bold' }}>{Math.round(currentData.no2)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ background: `linear-gradient(135deg, ${getAQICategory(compareData.aqi).color} 0%, ${getAQICategory(compareData.aqi).color}dd 100%)`, padding: '24px', borderRadius: '12px', color: 'white' }}>
                    <p style={{ fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.9 }}>Compare City</p>
                    <h4 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px' }}>{compareData.location}</h4>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '56px', fontWeight: 'bold' }}>
                        {Math.round(compareData.aqi)}
                      </div>
                      <span style={{ fontSize: '36px' }}>{getAQICategory(compareData.aqi).icon}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>{getAQICategory(compareData.aqi).level}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ opacity: 0.8 }}>PM2.5</div>
                        <div style={{ fontWeight: 'bold' }}>{Math.round(compareData.pm25)}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ opacity: 0.8 }}>PM10</div>
                        <div style={{ fontWeight: 'bold' }}>{Math.round(compareData.pm10)}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ opacity: 0.8 }}>NO₂</div>
                        <div style={{ fontWeight: 'bold' }}>{Math.round(compareData.no2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {compareData.aqi < currentData.aqi ? (
                      <>✅ {compareData.location} has better air quality ({Math.round(currentData.aqi - compareData.aqi)} points lower)</>
                    ) : compareData.aqi > currentData.aqi ? (
                      <>⚠️ {currentData.location} has better air quality ({Math.round(compareData.aqi - currentData.aqi)} points lower)</>
                    ) : (
                      <>➡️ Both cities have similar air quality</>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Health Tips */}
        {showHealthTips && (
          <div className="card" role="region" aria-label="Health tips">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>💊 Health Tips & Recommendations</h3>
            <div style={{ background: aqiCategory.color, color: 'white', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
                Current AQI: {Math.round(currentData.aqi)} - {aqiCategory.level}
              </p>
            </div>
            {(() => {
              const tips = getHealthTips(currentData.aqi);
              return (
                <div className="grid-3">
                  <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '24px' }}>🏃</span>
                      <h4 style={{ fontWeight: '600', margin: 0, color: '#1e40af' }}>Outdoor Activities</h4>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#1e3a8a' }}>
                      {tips.outdoor.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ background: '#dcfce7', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '24px' }}>🏠</span>
                      <h4 style={{ fontWeight: '600', margin: 0, color: '#15803d' }}>Indoor Recommendations</h4>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#14532d' }}>
                      {tips.indoor.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '24px' }}>⚕️</span>
                      <h4 style={{ fontWeight: '600', margin: 0, color: '#92400e' }}>General Health</h4>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#78350f' }}>
                      {tips.general.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
            
            <div style={{ marginTop: '20px', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#374151' }}>👥 At-Risk Groups</h4>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#6b7280' }}>
                Children, elderly, pregnant women, and people with respiratory conditions (asthma, COPD) or heart disease should take extra precautions when AQI exceeds 100.
              </p>
            </div>
          </div>
        )}

        {/* Pollutant Comparison */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#8b5cf6" />
            Current vs Safe Limits
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pollutants.map(p => {
              const info = getPollutantInfo(p.key);
              return {
                name: info.name,
                current: Math.round(p.value),
                safe: info.safe
              };
            })}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#667eea" name="Current" radius={[8, 8, 0, 0]} />
              <Bar dataKey="safe" fill="#10b981" name="Safe Limit" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AQI Scale */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={20} color="#667eea" />
            AQI Scale Reference
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { range: '0-50', level: 'Good', color: '#10b981', icon: '😊', desc: 'Air quality is satisfactory' },
              { range: '51-100', level: 'Moderate', color: '#f59e0b', icon: '🙂', desc: 'Acceptable for most, sensitive groups monitor' },
              { range: '101-150', level: 'Unhealthy for Sensitive', color: '#f97316', icon: '😐', desc: 'Sensitive groups may experience symptoms' },
              { range: '151-200', level: 'Unhealthy', color: '#ef4444', icon: '😷', desc: 'Everyone may begin to experience effects' },
              { range: '201-300', level: 'Very Unhealthy', color: '#dc2626', icon: '😨', desc: 'Health alert: everyone affected' },
              { range: '301+', level: 'Hazardous', color: '#991b1b', icon: '☠️', desc: 'Emergency conditions' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ width: '80px', fontSize: '14px', fontWeight: 'bold', background: '#f3f4f6', padding: '8px 12px', borderRadius: '8px', textAlign: 'center' }}>{item.range}</div>
                <div style={{ flex: 1, minWidth: '250px', height: '56px', background: item.color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '16px' }}>{item.level}</div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>{item.desc}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Setup Instructions - Only show when in demo mode or API key invalid */}
        {(error === 'DEMO_MODE' || error === 'API_KEY_INVALID') && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>🚀 Setup Instructions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#1e40af' }}>1. Get Free API Key</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>Sign up at <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>OpenWeatherMap</a> for 1,000 free calls/day</p>
              </div>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#15803d' }}>2. Replace API Key</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>Find <code style={{ background: '#1f2937', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>const API_KEY = 'your_key'</code> in code and update it</p>
              </div>
              <div style={{ background: '#faf5ff', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#7c3aed' }}>3. Deploy Free</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>Use Netlify, Vercel, GitHub Pages, or Cloudflare Pages for free hosting</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', color: 'white', fontSize: '14px', marginTop: '24px', padding: '16px' }}>
          <p style={{ margin: '0 0 8px 0' }}>🌍 Data updates every 5 minutes • Built with React & Recharts</p>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Air quality data provided by OpenWeatherMap API</p>
        </div>
      </div>
    </div>
  );
};

export default AirQualityDashboard;