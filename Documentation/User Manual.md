# Air Quality Monitor - User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard Overview](#dashboard-overview)
4. [Features Guide](#features-guide)
5. [Understanding Air Quality Data](#understanding-air-quality-data)
6. [Troubleshooting](#troubleshooting)
7. [FAQs](#faqs)

---

## 1. Introduction

### What is Air Quality Monitor?
Air Quality Monitor is a real-time web application that displays current air pollution levels, provides health recommendations, and tracks historical air quality trends. It helps users make informed decisions about outdoor activities based on current air quality conditions.

### Key Features
- ✅ Real-time Air Quality Index (AQI) monitoring
- 📊 7-day historical trend analysis
- 🌍 Multi-city comparison
- 💾 CSV data export
- 🔔 Browser notifications for poor air quality
- 💊 Personalized health recommendations
- 📱 Mobile-responsive design
- ♿ Fully accessible interface

### System Requirements
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet Connection**: Required for real-time data
- **Screen Resolution**: Minimum 320px width (mobile-friendly)
- **JavaScript**: Must be enabled

---

## 2. Getting Started

### First Time Setup

#### Step 1: Access the Application
Open your web browser and navigate to the application URL.

#### Step 2: Enable Notifications (Optional)
When you first visit, you may see a notification permission request:
- Click **Allow** to receive air quality alerts
- Click **Block** if you prefer no notifications
- You can change this later in browser settings

#### Step 3: Allow Location Access (If Prompted)
The app defaults to Chennai, Tamil Nadu but may request your location:
- Click **Allow** for your current location
- Click **Block** to continue with Chennai data

### Quick Start Guide
1. **View Current AQI**: The large number on the main card shows current air quality
2. **Read Recommendations**: Scroll to see health advice based on current conditions
3. **Check Trends**: View 7-day charts to understand air quality patterns
4. **Compare Cities**: Use the Compare Cities feature to check other locations
5. **Export Data**: Click Export button to download CSV for analysis

---

## 3. Dashboard Overview

### Main Components

#### 🎯 Header Section
- **Location Badge**: Shows current monitoring location (default: Chennai, Tamil Nadu)
- **Timestamp Badge**: Displays last update time
- **Refresh Button**: Manually update data
- **Export Button**: Download data as CSV
- **Notifications Toggle**: Enable/disable browser alerts

#### 📊 AQI Display Card
The main colored card shows:
- **AQI Number**: Large number (0-500+)
- **Emoji Indicator**: Visual mood indicator
- **Health Category**: Good, Moderate, Unhealthy, etc.
- **Health Effects**: Brief health impact summary
- **Recommendation Box**: Specific advice for current conditions
- **Pollutant Grid**: 6 key pollutants (PM2.5, PM10, CO, NO₂, O₃, SO₂)

#### 📈 Chart Section
**7-Day AQI Trend**: Area chart showing AQI over past week
**Particulate Matter**: Line chart comparing PM2.5 and PM10 levels

#### 🔘 Quick Action Buttons
- **Compare Cities**: Search and compare air quality in different cities
- **Health Tips**: View detailed health recommendations
- **Documentation**: Access technical information

#### 📊 Additional Visualizations
- **Current vs Safe Limits**: Bar chart comparing pollutants to WHO standards
- **AQI Scale Reference**: Color-coded scale with health descriptions

---

## 4. Features Guide

### 4.1 Real-Time Monitoring

#### How It Works
- Data refreshes **automatically every 5 minutes**
- Manual refresh available via Refresh button
- Spinner indicates data loading

#### Reading the Display
```
AQI: 75 🙂
Level: Moderate
Health Effects: Acceptable for most
```

**Color Coding:**
- 🟢 Green (0-50): Good
- 🟡 Yellow (51-100): Moderate
- 🟠 Orange (101-150): Unhealthy for Sensitive Groups
- 🔴 Red (151-200): Unhealthy
- 🔴 Dark Red (201-300): Very Unhealthy
- ⚫ Maroon (301+): Hazardous

### 4.2 City Comparison

#### How to Compare Cities
1. Click **Compare Cities** button
2. Enter city name in search box
   - Examples: "London", "Tokyo", "New York", "Delhi"
3. Press **Enter** or click **Search**
4. View side-by-side comparison

#### Understanding Comparison Results
- Both cities display AQI, category, and key pollutants
- Summary shows which city has better air quality
- Color coding helps visualize differences

#### Supported Cities
Any city worldwide with OpenWeatherMap coverage (195+ countries)

### 4.3 Health Tips

#### Accessing Health Tips
1. Click **Health Tips** button
2. View three categories:
   - 🏃 **Outdoor Activities**: Exercise and outdoor guidance
   - 🏠 **Indoor Recommendations**: Home air quality tips
   - ⚕️ **General Health**: Overall health advice

#### Health Tip Categories by AQI

**Good (0-50):**
- Perfect for outdoor exercise
- Open windows for fresh air
- No restrictions

**Moderate (51-100):**
- Generally safe for most people
- Sensitive individuals monitor symptoms
- Air purifiers beneficial for at-risk groups

**Unhealthy for Sensitive (101-150):**
- Reduce prolonged outdoor exertion
- Use air purifiers indoors
- Sensitive groups limit outdoor time

**Unhealthy (151-200):**
- Avoid prolonged outdoor activities
- Wear N95 masks if going outside
- Keep windows closed

**Very Unhealthy (201-300):**
- Avoid all outdoor activities
- Run air purifiers continuously
- Health alert for everyone

**Hazardous (301+):**
- DO NOT go outside
- Emergency conditions
- Consider evacuation

#### At-Risk Groups
Special precautions recommended for:
- Children under 12
- Adults over 65
- Pregnant women
- People with asthma or COPD
- People with heart disease
- People with respiratory conditions

### 4.4 Data Export

#### Exporting to CSV
1. Click **Export** button in header
2. CSV file downloads automatically
3. Filename format: `air-quality-[location]-[date].csv`

#### CSV File Contents
```csv
Date,AQI,PM2.5,PM10,CO,NO2,O3,SO2
11/9/2025 10:30 AM,75,25,45,300,20,40,10
Nov 8,73,24,44,0,0,0,0
Nov 7,78,26,46,0,0,0,0
...
```

#### Using Exported Data
- Open in Excel, Google Sheets, or any spreadsheet software
- Create custom visualizations
- Perform statistical analysis
- Track long-term trends
- Share with health professionals

### 4.5 Notifications

#### Enabling Notifications
1. Click notification toggle (Bell icon)
2. Browser requests permission → Click **Allow**
3. Button shows "ON" when enabled

#### When Notifications Trigger
Automatic alerts when:
- AQI exceeds 100 (Unhealthy for Sensitive Groups)
- Significant AQI changes (>20 points)

#### Notification Content
```
🌫️ Air Quality Alert
AQI is 125 (Unhealthy for Sensitive Groups)
Sensitive groups should reduce outdoor exertion.
```

#### Disabling Notifications
- Click notification toggle to turn OFF
- Or adjust in browser settings

### 4.6 Documentation

#### Accessing Documentation
Click **Documentation** button to view:
- Project overview
- Feature list
- Tech stack details
- Setup instructions
- Keyboard navigation guide

---

## 5. Understanding Air Quality Data

### Air Quality Index (AQI)

#### What is AQI?
AQI is a standardized indicator of air pollution levels:
- **Scale**: 0 to 500+
- **Higher = Worse**: Higher numbers mean more pollution
- **Color Coded**: Easy visual identification

#### AQI Categories

| AQI Range | Level | Color | Health Concern |
|-----------|-------|-------|----------------|
| 0-50 | Good | Green | No health concerns |
| 51-100 | Moderate | Yellow | Acceptable for most |
| 101-150 | Unhealthy for Sensitive | Orange | Sensitive groups affected |
| 151-200 | Unhealthy | Red | Everyone affected |
| 201-300 | Very Unhealthy | Dark Red | Health alert |
| 301+ | Hazardous | Maroon | Emergency conditions |

### Key Pollutants Explained

#### PM2.5 (Fine Particulate Matter)
- **Size**: 2.5 micrometers or smaller
- **Sources**: Vehicle emissions, industrial processes, wildfires
- **Health Impact**: Penetrates deep into lungs, enters bloodstream
- **Safe Limit**: 12 µg/m³ (WHO guideline)
- **Most Dangerous**: Smallest and most harmful pollutant

#### PM10 (Coarse Particulate Matter)
- **Size**: 10 micrometers or smaller
- **Sources**: Dust, construction, road traffic
- **Health Impact**: Affects respiratory system
- **Safe Limit**: 50 µg/m³ (WHO guideline)

#### CO (Carbon Monoxide)
- **Source**: Vehicle exhaust, combustion
- **Health Impact**: Reduces oxygen delivery to organs
- **Safe Limit**: 4000 µg/m³

#### NO₂ (Nitrogen Dioxide)
- **Source**: Vehicle emissions, power plants
- **Health Impact**: Respiratory inflammation
- **Safe Limit**: 40 µg/m³

#### O₃ (Ozone)
- **Formation**: Chemical reaction of pollutants in sunlight
- **Health Impact**: Respiratory irritation, reduced lung function
- **Safe Limit**: 100 µg/m³
- **Note**: Ground-level ozone is harmful (unlike stratospheric ozone)

#### SO₂ (Sulfur Dioxide)
- **Source**: Fossil fuel combustion, industrial processes
- **Health Impact**: Respiratory problems, asthma trigger
- **Safe Limit**: 20 µg/m³

### Reading Pollutant Data

#### Normal Display
```
PM2.5
25
µg/m³
```

#### High Level Warning
```
PM2.5
85
µg/m³
⚠️ High
```

When a pollutant shows "⚠️ High", it exceeds safe WHO limits.

---

## 6. Troubleshooting

### Common Issues and Solutions

#### Issue: "Demo Mode: Using sample data"
**Cause**: No API key configured or using default key
**Solution**: 
- This is normal for demo/testing
- For real data, add your OpenWeatherMap API key
- Data is simulated but realistic

#### Issue: "Invalid API Key"
**Cause**: API key is incorrect or expired
**Solution**:
1. Verify API key at OpenWeatherMap dashboard
2. Ensure key has Air Pollution API access
3. Wait 10-20 minutes after creating new key (activation time)

#### Issue: "City not found"
**Cause**: City name not recognized or misspelled
**Solution**:
- Try different spelling: "New York" vs "New York City"
- Use official city names: "Mumbai" not "Bombay"
- Include country if ambiguous: "Paris, France" vs "Paris, Texas"

#### Issue: Data Not Updating
**Symptoms**: Timestamp doesn't change
**Solution**:
1. Check internet connection
2. Click Refresh button manually
3. Check browser console for errors (F12)
4. Clear browser cache and reload

#### Issue: Charts Not Displaying
**Solution**:
1. Ensure JavaScript is enabled
2. Try different browser
3. Check if browser supports SVG graphics
4. Disable browser extensions temporarily

#### Issue: Notifications Not Working
**Solution**:
1. Check if browser supports notifications
2. Verify notification permission granted
3. Check browser notification settings
4. Ensure app is not muted in system settings

#### Issue: Export Not Working
**Solution**:
1. Check if pop-ups are blocked
2. Verify browser allows downloads
3. Check download folder permissions
4. Try different browser

### Performance Issues

#### Slow Loading
- Check internet speed
- Clear browser cache
- Close other tabs/applications
- Try during off-peak hours

#### High Memory Usage
- Dashboard auto-refreshes every 5 minutes
- Close tab when not actively monitoring
- Refresh page to clear accumulated data

---

## 7. FAQs

### General Questions

**Q: Is this application free to use?**
A: Yes, completely free for personal and educational use.

**Q: How accurate is the data?**
A: Data comes from OpenWeatherMap, which aggregates government monitoring stations. Accuracy depends on local monitoring infrastructure.

**Q: How often does data update?**
A: Automatic refresh every 5 minutes. Manual refresh available anytime.

**Q: Can I use this for my location?**
A: Yes, use City Comparison to search any city worldwide.

**Q: Does this work offline?**
A: No, internet connection required for real-time data. Consider PWA version for offline capabilities.

### Data Questions

**Q: What does AQI mean?**
A: Air Quality Index - standardized measure of air pollution (0-500+ scale).

**Q: Why does AQI sometimes differ from local news?**
A: Different monitoring stations, update timing, and calculation methods can cause variations.

**Q: Which pollutant is most dangerous?**
A: PM2.5 is generally most harmful as it penetrates deepest into lungs and bloodstream.

**Q: What's a safe AQI level?**
A: 0-50 (Good) is considered safe for everyone. 51-100 (Moderate) is acceptable for most people.

**Q: Why are some pollutant readings zero?**
A: Zero may indicate data unavailable or below detection limits (not literal zero pollution).

### Technical Questions

**Q: Which browsers are supported?**
A: All modern browsers: Chrome, Firefox, Safari, Edge (last 2 versions).

**Q: Is my data private?**
A: Yes, no personal data collected. Only anonymous API requests to OpenWeatherMap.

**Q: Can I integrate this with my website?**
A: Yes, source code can be customized and embedded. Check API Documentation.

**Q: Does this work on mobile?**
A: Yes, fully responsive design optimized for mobile devices.

**Q: Can I run this locally?**
A: Yes, download source code and open in web browser. Node.js not required.

### Health Questions

**Q: When should I wear a mask?**
A: Consider N95 masks when AQI exceeds 150 (Unhealthy level).

**Q: Is it safe to exercise outdoors?**
A: Safe when AQI ≤50. Reduce intensity at 51-100. Avoid outdoor exercise above 150.

**Q: Should I keep windows closed?**
A: Close windows when AQI >100 or during high traffic hours.

**Q: When should I run air purifier?**
A: Run continuously when AQI >100. Beneficial for sensitive groups even at moderate levels.

**Q: Are children more affected?**
A: Yes, children are more vulnerable due to developing lungs and higher breathing rates.

### Feature Requests

**Q: Can you add weather data?**
A: Planned for future update. Currently focused on air quality.

**Q: Will there be a mobile app?**
A: Considering React Native version based on user demand.

**Q: Can you add air purifier recommendations?**
A: Good suggestion! May add product recommendations in future.

**Q: Will you support more cities?**
A: Already supports 195+ countries through OpenWeatherMap coverage.

---

## Support and Feedback

### Getting Help
- Check this User Manual first
- Review API Documentation for technical details
- Check browser console (F12) for error messages

### Reporting Issues
When reporting problems, include:
- Browser name and version
- Operating system
- Steps to reproduce issue
- Screenshot if applicable
- Error messages from console

### Feature Suggestions
We welcome suggestions for improving the Air Quality Monitor. Consider:
- User benefit
- Technical feasibility
- Privacy implications
- Performance impact

---

## Appendix

### Keyboard Shortcuts
- **Tab**: Navigate between interactive elements
- **Enter**: Activate buttons and submit forms
- **Space**: Toggle buttons
- **Ctrl/Cmd + R**: Refresh page (updates data)
- **Ctrl/Cmd + S**: Export data (when Export button focused)

### Accessibility Features
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ High contrast color schemes
- ✅ Screen reader compatible
- ✅ Focus indicators on all controls
- ✅ Semantic HTML structure

### Data Sources
- **Air Quality Data**: OpenWeatherMap Air Pollution API
- **Health Guidelines**: WHO Air Quality Guidelines
- **AQI Standards**: EPA Air Quality Index
- **Safe Limits**: WHO Global Air Quality Guidelines (2021)

### Version Information
- **Version**: 1.0.0
- **Last Updated**: November 2025
- **API Version**: OpenWeatherMap Air Pollution API v2.5

---

**Document Version**: 1.0
**Last Updated**: November 9, 2025
**For**: Academic Project Submission