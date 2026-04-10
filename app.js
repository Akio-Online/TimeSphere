/* =============================================
   THE TIME SPHERE — app.js
   thetimesphere.com
   ============================================= */

// --- City Data ---
const CITIES = [
  // ── Featured cities (shown on homepage grid) ──
  { id: 'new-york',    name: 'New York',    state: 'New York',         country: 'USA',           tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 40.71,  lon: -74.01 },
  { id: 'los-angeles', name: 'Los Angeles', state: 'California',       country: 'USA',           tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'americas', lat: 34.05,  lon: -118.24 },
  { id: 'chicago',     name: 'Chicago',     state: 'Illinois',         country: 'USA',           tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 41.85,  lon: -87.65 },
  { id: 'toronto',     name: 'Toronto',     state: 'Ontario',          country: 'Canada',        tz: 'America/Toronto',     flag: '🇨🇦', region: 'americas', lat: 43.70,  lon: -79.42 },
  { id: 'mexico-city', name: 'Mexico City',                            country: 'Mexico',        tz: 'America/Mexico_City', flag: '🇲🇽', region: 'americas', lat: 19.43,  lon: -99.13 },
  { id: 'sao-paulo',   name: 'São Paulo',                              country: 'Brazil',        tz: 'America/Sao_Paulo',   flag: '🇧🇷', region: 'americas', lat: -23.55, lon: -46.63 },
  { id: 'london',      name: 'London',                                 country: 'United Kingdom',tz: 'Europe/London',       flag: '🇬🇧', region: 'europe',   lat: 51.51,  lon: -0.13 },
  { id: 'paris',       name: 'Paris',                                  country: 'France',        tz: 'Europe/Paris',        flag: '🇫🇷', region: 'europe',   lat: 48.85,  lon: 2.35 },
  { id: 'berlin',      name: 'Berlin',                                 country: 'Germany',       tz: 'Europe/Berlin',       flag: '🇩🇪', region: 'europe',   lat: 52.52,  lon: 13.40 },
  { id: 'rome',        name: 'Rome',                                   country: 'Italy',         tz: 'Europe/Rome',         flag: '🇮🇹', region: 'europe',   lat: 41.90,  lon: 12.50 },
  { id: 'madrid',      name: 'Madrid',                                 country: 'Spain',         tz: 'Europe/Madrid',       flag: '🇪🇸', region: 'europe',   lat: 40.42,  lon: -3.70 },
  { id: 'moscow',      name: 'Moscow',                                 country: 'Russia',        tz: 'Europe/Moscow',       flag: '🇷🇺', region: 'europe',   lat: 55.75,  lon: 37.62 },
  { id: 'tokyo',       name: 'Tokyo',                                  country: 'Japan',         tz: 'Asia/Tokyo',          flag: '🇯🇵', region: 'asia',     lat: 35.69,  lon: 139.69 },
  { id: 'singapore',   name: 'Singapore',                              country: 'Singapore',     tz: 'Asia/Singapore',      flag: '🇸🇬', region: 'asia',     lat: 1.35,   lon: 103.82 },
  { id: 'hong-kong',   name: 'Hong Kong',                              country: 'China',         tz: 'Asia/Hong_Kong',      flag: '🇭🇰', region: 'asia',     lat: 22.32,  lon: 114.17 },
  { id: 'seoul',       name: 'Seoul',                                  country: 'South Korea',   tz: 'Asia/Seoul',          flag: '🇰🇷', region: 'asia',     lat: 37.57,  lon: 127.00 },
  { id: 'mumbai',      name: 'Mumbai',                                 country: 'India',         tz: 'Asia/Kolkata',        flag: '🇮🇳', region: 'asia',     lat: 19.08,  lon: 72.88 },
  { id: 'sydney',      name: 'Sydney',                                 country: 'Australia',     tz: 'Australia/Sydney',    flag: '🇦🇺', region: 'asia',     lat: -33.87, lon: 151.21 },
  { id: 'dubai',       name: 'Dubai',                                  country: 'UAE',           tz: 'Asia/Dubai',          flag: '🇦🇪', region: 'africa',   lat: 25.20,  lon: 55.27 },
  { id: 'istanbul',    name: 'Istanbul',                               country: 'Turkey',        tz: 'Europe/Istanbul',     flag: '🇹🇷', region: 'africa',   lat: 41.01,  lon: 28.95 },
  { id: 'cairo',       name: 'Cairo',                                  country: 'Egypt',         tz: 'Africa/Cairo',        flag: '🇪🇬', region: 'africa',   lat: 30.06,  lon: 31.25 },
  { id: 'johannesburg',name: 'Johannesburg',                           country: 'South Africa',  tz: 'Africa/Johannesburg', flag: '🇿🇦', region: 'africa',   lat: -26.20, lon: 28.04 },
  { id: 'amsterdam',   name: 'Amsterdam',                              country: 'Netherlands',   tz: 'Europe/Amsterdam',    flag: '🇳🇱', region: 'europe',   lat: 52.37,  lon: 4.90 },
  { id: 'bangkok',     name: 'Bangkok',                                country: 'Thailand',      tz: 'Asia/Bangkok',        flag: '🇹🇭', region: 'asia',     lat: 13.75,  lon: 100.52 },
  // ── Search-only cities (not shown on homepage grid) ──
  // USA — existing
  { id: 'miami',          name: 'Miami',          state: 'Florida',          country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 25.77,  lon: -80.19,  searchOnly: true },
  { id: 'las-vegas',      name: 'Las Vegas',      state: 'Nevada',           country: 'USA', tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'americas', lat: 36.17,  lon: -115.14, searchOnly: true },
  { id: 'seattle',        name: 'Seattle',        state: 'Washington',       country: 'USA', tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'americas', lat: 47.61,  lon: -122.33, searchOnly: true },
  { id: 'denver',         name: 'Denver',         state: 'Colorado',         country: 'USA', tz: 'America/Denver',      flag: '🇺🇸', region: 'americas', lat: 39.74,  lon: -104.98, searchOnly: true },
  { id: 'houston',        name: 'Houston',        state: 'Texas',            country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 29.76,  lon: -95.37,  searchOnly: true },
  { id: 'phoenix',        name: 'Phoenix',        state: 'Arizona',          country: 'USA', tz: 'America/Phoenix',     flag: '🇺🇸', region: 'americas', lat: 33.45,  lon: -112.07, searchOnly: true },
  { id: 'atlanta',        name: 'Atlanta',        state: 'Georgia',          country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 33.75,  lon: -84.39,  searchOnly: true },
  { id: 'boston',         name: 'Boston',         state: 'Massachusetts',    country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 42.36,  lon: -71.06,  searchOnly: true },
  { id: 'philadelphia',   name: 'Philadelphia',   state: 'Pennsylvania',     country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 39.95,  lon: -75.16,  searchOnly: true },
  { id: 'washington-dc',  name: 'Washington DC',  state: 'D.C.',             country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 38.91,  lon: -77.04,  searchOnly: true },
  { id: 'san-francisco',  name: 'San Francisco',  state: 'California',       country: 'USA', tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'americas', lat: 37.77,  lon: -122.42, searchOnly: true },
  { id: 'dallas',         name: 'Dallas',         state: 'Texas',            country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 32.78,  lon: -96.80,  searchOnly: true },
  { id: 'minneapolis',    name: 'Minneapolis',    state: 'Minnesota',        country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 44.98,  lon: -93.27,  searchOnly: true },
  { id: 'detroit',        name: 'Detroit',        state: 'Michigan',         country: 'USA', tz: 'America/Detroit',     flag: '🇺🇸', region: 'americas', lat: 42.33,  lon: -83.05,  searchOnly: true },
  { id: 'portland',       name: 'Portland',       state: 'Oregon',           country: 'USA', tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'americas', lat: 45.52,  lon: -122.68, searchOnly: true },
  { id: 'san-diego',      name: 'San Diego',      state: 'California',       country: 'USA', tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'americas', lat: 32.72,  lon: -117.16, searchOnly: true },
  { id: 'honolulu',       name: 'Honolulu',       state: 'Hawaii',           country: 'USA', tz: 'Pacific/Honolulu',    flag: '🇺🇸', region: 'americas', lat: 21.31,  lon: -157.86, searchOnly: true },
  { id: 'anchorage',      name: 'Anchorage',      state: 'Alaska',           country: 'USA', tz: 'America/Anchorage',   flag: '🇺🇸', region: 'americas', lat: 61.22,  lon: -149.90, searchOnly: true },
  // USA — new
  { id: 'tampa',          name: 'Tampa',          state: 'Florida',          country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 27.95,  lon: -82.46,  searchOnly: true },
  { id: 'orlando',        name: 'Orlando',        state: 'Florida',          country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 28.54,  lon: -81.38,  searchOnly: true },
  { id: 'jacksonville',   name: 'Jacksonville',   state: 'Florida',          country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 30.33,  lon: -81.66,  searchOnly: true },
  { id: 'charlotte',      name: 'Charlotte',      state: 'North Carolina',   country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 35.23,  lon: -80.84,  searchOnly: true },
  { id: 'raleigh',        name: 'Raleigh',        state: 'North Carolina',   country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 35.78,  lon: -78.64,  searchOnly: true },
  { id: 'nashville',      name: 'Nashville',      state: 'Tennessee',        country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 36.17,  lon: -86.78,  searchOnly: true },
  { id: 'memphis',        name: 'Memphis',        state: 'Tennessee',        country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 35.15,  lon: -90.05,  searchOnly: true },
  { id: 'louisville',     name: 'Louisville',     state: 'Kentucky',         country: 'USA', tz: 'America/Kentucky/Louisville', flag: '🇺🇸', region: 'americas', lat: 38.25, lon: -85.76, searchOnly: true },
  { id: 'indianapolis',   name: 'Indianapolis',   state: 'Indiana',          country: 'USA', tz: 'America/Indiana/Indianapolis', flag: '🇺🇸', region: 'americas', lat: 39.77, lon: -86.16, searchOnly: true },
  { id: 'columbus',       name: 'Columbus',       state: 'Ohio',             country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 39.96,  lon: -82.99,  searchOnly: true },
  { id: 'cleveland',      name: 'Cleveland',      state: 'Ohio',             country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 41.50,  lon: -81.69,  searchOnly: true },
  { id: 'cincinnati',     name: 'Cincinnati',     state: 'Ohio',             country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 39.10,  lon: -84.51,  searchOnly: true },
  { id: 'pittsburgh',     name: 'Pittsburgh',     state: 'Pennsylvania',     country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 40.44,  lon: -79.99,  searchOnly: true },
  { id: 'baltimore',      name: 'Baltimore',      state: 'Maryland',         country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 39.29,  lon: -76.61,  searchOnly: true },
  { id: 'richmond',       name: 'Richmond',       state: 'Virginia',         country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 37.54,  lon: -77.43,  searchOnly: true },
  { id: 'norfolk',        name: 'Norfolk',        state: 'Virginia',         country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 36.85,  lon: -76.29,  searchOnly: true },
  { id: 'buffalo',        name: 'Buffalo',        state: 'New York',         country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 42.89,  lon: -78.88,  searchOnly: true },
  { id: 'albany',         name: 'Albany',         state: 'New York',         country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 42.65,  lon: -73.75,  searchOnly: true },
  { id: 'hartford',       name: 'Hartford',       state: 'Connecticut',      country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 41.76,  lon: -72.68,  searchOnly: true },
  { id: 'providence',     name: 'Providence',     state: 'Rhode Island',     country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 41.82,  lon: -71.42,  searchOnly: true },
  { id: 'portland-me',    name: 'Portland',       state: 'Maine',            country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 43.66,  lon: -70.26,  searchOnly: true },
  { id: 'burlington',     name: 'Burlington',     state: 'Vermont',          country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 44.48,  lon: -73.21,  searchOnly: true },
  { id: 'albuquerque',    name: 'Albuquerque',    state: 'New Mexico',       country: 'USA', tz: 'America/Denver',      flag: '🇺🇸', region: 'americas', lat: 35.08,  lon: -106.65, searchOnly: true },
  { id: 'tucson',         name: 'Tucson',         state: 'Arizona',          country: 'USA', tz: 'America/Phoenix',     flag: '🇺🇸', region: 'americas', lat: 32.22,  lon: -110.97, searchOnly: true },
  { id: 'el-paso',        name: 'El Paso',        state: 'Texas',            country: 'USA', tz: 'America/Denver',      flag: '🇺🇸', region: 'americas', lat: 31.76,  lon: -106.49, searchOnly: true },
  { id: 'san-antonio',    name: 'San Antonio',    state: 'Texas',            country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 29.42,  lon: -98.49,  searchOnly: true },
  { id: 'austin',         name: 'Austin',         state: 'Texas',            country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 30.27,  lon: -97.74,  searchOnly: true },
  { id: 'fort-worth',     name: 'Fort Worth',     state: 'Texas',            country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 32.75,  lon: -97.33,  searchOnly: true },
  { id: 'oklahoma-city',  name: 'Oklahoma City',  state: 'Oklahoma',         country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 35.47,  lon: -97.52,  searchOnly: true },
  { id: 'tulsa',          name: 'Tulsa',          state: 'Oklahoma',         country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 36.15,  lon: -95.99,  searchOnly: true },
  { id: 'wichita',        name: 'Wichita',        state: 'Kansas',           country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 37.69,  lon: -97.34,  searchOnly: true },
  { id: 'omaha',          name: 'Omaha',          state: 'Nebraska',         country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 41.26,  lon: -95.94,  searchOnly: true },
  { id: 'des-moines',     name: 'Des Moines',     state: 'Iowa',             country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 41.59,  lon: -93.62,  searchOnly: true },
  { id: 'milwaukee',      name: 'Milwaukee',      state: 'Wisconsin',        country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 43.04,  lon: -87.91,  searchOnly: true },
  { id: 'madison',        name: 'Madison',        state: 'Wisconsin',        country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 43.07,  lon: -89.40,  searchOnly: true },
  { id: 'grand-rapids',   name: 'Grand Rapids',   state: 'Michigan',         country: 'USA', tz: 'America/Detroit',     flag: '🇺🇸', region: 'americas', lat: 42.97,  lon: -85.67,  searchOnly: true },
  { id: 'kansas-city',    name: 'Kansas City',    state: 'Missouri',         country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 39.10,  lon: -94.58,  searchOnly: true },
  { id: 'st-louis',       name: 'St. Louis',      state: 'Missouri',         country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 38.63,  lon: -90.20,  searchOnly: true },
  { id: 'little-rock',    name: 'Little Rock',    state: 'Arkansas',         country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 34.75,  lon: -92.29,  searchOnly: true },
  { id: 'jackson',        name: 'Jackson',        state: 'Mississippi',      country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 32.30,  lon: -90.18,  searchOnly: true },
  { id: 'birmingham',     name: 'Birmingham',     state: 'Alabama',          country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 33.52,  lon: -86.80,  searchOnly: true },
  { id: 'montgomery',     name: 'Montgomery',     state: 'Alabama',          country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 32.37,  lon: -86.30,  searchOnly: true },
  { id: 'mobile',         name: 'Mobile',         state: 'Alabama',          country: 'USA', tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 30.69,  lon: -88.04,  searchOnly: true },
  { id: 'savannah',       name: 'Savannah',       state: 'Georgia',          country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 32.08,  lon: -81.10,  searchOnly: true },
  { id: 'charleston',     name: 'Charleston',     state: 'South Carolina',   country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 32.78,  lon: -79.93,  searchOnly: true },
  { id: 'columbia-sc',    name: 'Columbia',       state: 'South Carolina',   country: 'USA', tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 34.00,  lon: -81.03,  searchOnly: true },
  { id: 'boise',          name: 'Boise',          state: 'Idaho',            country: 'USA', tz: 'America/Boise',       flag: '🇺🇸', region: 'americas', lat: 43.62,  lon: -116.21, searchOnly: true },
  { id: 'salt-lake-city', name: 'Salt Lake City', state: 'Utah',             country: 'USA', tz: 'America/Denver',      flag: '🇺🇸', region: 'americas', lat: 40.76,  lon: -111.89, searchOnly: true },
  { id: 'reno',           name: 'Reno',           state: 'Nevada',           country: 'USA', tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'americas', lat: 39.53,  lon: -119.81, searchOnly: true },
  { id: 'spokane',        name: 'Spokane',        state: 'Washington',       country: 'USA', tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'americas', lat: 47.66,  lon: -117.43, searchOnly: true },
  // Canada — existing
  { id: 'montreal',       name: 'Montreal',       state: 'Quebec',           country: 'Canada', tz: 'America/Toronto',   flag: '🇨🇦', region: 'americas', lat: 45.50,  lon: -73.57,  searchOnly: true },
  { id: 'vancouver',      name: 'Vancouver',      state: 'British Columbia', country: 'Canada', tz: 'America/Vancouver', flag: '🇨🇦', region: 'americas', lat: 49.25,  lon: -123.12, searchOnly: true },
  { id: 'calgary',        name: 'Calgary',        state: 'Alberta',          country: 'Canada', tz: 'America/Edmonton',  flag: '🇨🇦', region: 'americas', lat: 51.05,  lon: -114.07, searchOnly: true },
  // Canada — new
  { id: 'winnipeg',       name: 'Winnipeg',       state: 'Manitoba',         country: 'Canada', tz: 'America/Winnipeg',  flag: '🇨🇦', region: 'americas', lat: 49.90,  lon: -97.14,  searchOnly: true },
  { id: 'edmonton',       name: 'Edmonton',       state: 'Alberta',          country: 'Canada', tz: 'America/Edmonton',  flag: '🇨🇦', region: 'americas', lat: 53.55,  lon: -113.47, searchOnly: true },
  { id: 'quebec-city',    name: 'Quebec City',    state: 'Quebec',           country: 'Canada', tz: 'America/Toronto',   flag: '🇨🇦', region: 'americas', lat: 46.81,  lon: -71.21,  searchOnly: true },
  { id: 'halifax',        name: 'Halifax',        state: 'Nova Scotia',      country: 'Canada', tz: 'America/Halifax',   flag: '🇨🇦', region: 'americas', lat: 44.65,  lon: -63.57,  searchOnly: true },
  // Latin America — existing
  { id: 'buenos-aires',   name: 'Buenos Aires',   country: 'Argentina',    tz: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', region: 'americas', lat: -34.60, lon: -58.38, searchOnly: true },
  { id: 'santiago',       name: 'Santiago',       country: 'Chile',        tz: 'America/Santiago',       flag: '🇨🇱', region: 'americas', lat: -33.45, lon: -70.67,  searchOnly: true },
  { id: 'lima',           name: 'Lima',           country: 'Peru',         tz: 'America/Lima',           flag: '🇵🇪', region: 'americas', lat: -12.05, lon: -77.04,  searchOnly: true },
  { id: 'bogota',         name: 'Bogotá',         country: 'Colombia',     tz: 'America/Bogota',         flag: '🇨🇴', region: 'americas', lat: 4.71,   lon: -74.07,  searchOnly: true },
  { id: 'caracas',        name: 'Caracas',        country: 'Venezuela',    tz: 'America/Caracas',        flag: '🇻🇪', region: 'americas', lat: 10.48,  lon: -66.88,  searchOnly: true },
  { id: 'panama-city',    name: 'Panama City',    country: 'Panama',       tz: 'America/Panama',         flag: '🇵🇦', region: 'americas', lat: 8.99,   lon: -79.52,  searchOnly: true },
  { id: 'havana',         name: 'Havana',         country: 'Cuba',         tz: 'America/Havana',         flag: '🇨🇺', region: 'americas', lat: 23.13,  lon: -82.38,  searchOnly: true },
  // Latin America — new
  { id: 'monterrey',      name: 'Monterrey',      country: 'Mexico',       tz: 'America/Monterrey',      flag: '🇲🇽', region: 'americas', lat: 25.67,  lon: -100.31, searchOnly: true },
  { id: 'guadalajara',    name: 'Guadalajara',    country: 'Mexico',       tz: 'America/Mexico_City',    flag: '🇲🇽', region: 'americas', lat: 20.67,  lon: -103.35, searchOnly: true },
  { id: 'tijuana',        name: 'Tijuana',        country: 'Mexico',       tz: 'America/Tijuana',        flag: '🇲🇽', region: 'americas', lat: 32.52,  lon: -117.04, searchOnly: true },
  { id: 'medellin',       name: 'Medellín',       country: 'Colombia',     tz: 'America/Bogota',         flag: '🇨🇴', region: 'americas', lat: 6.25,   lon: -75.56,  searchOnly: true },
  { id: 'montevideo',     name: 'Montevideo',     country: 'Uruguay',      tz: 'America/Montevideo',     flag: '🇺🇾', region: 'americas', lat: -34.90, lon: -56.19,  searchOnly: true },
  { id: 'quito',          name: 'Quito',          country: 'Ecuador',      tz: 'America/Guayaquil',      flag: '🇪🇨', region: 'americas', lat: -0.23,  lon: -78.52,  searchOnly: true },
  { id: 'la-paz',         name: 'La Paz',         country: 'Bolivia',      tz: 'America/La_Paz',         flag: '🇧🇴', region: 'americas', lat: -16.50, lon: -68.15,  searchOnly: true },
  { id: 'san-jose-cr',    name: 'San José',       country: 'Costa Rica',   tz: 'America/Costa_Rica',     flag: '🇨🇷', region: 'americas', lat: 9.93,   lon: -84.08,  searchOnly: true },
  { id: 'guatemala-city', name: 'Guatemala City', country: 'Guatemala',    tz: 'America/Guatemala',      flag: '🇬🇹', region: 'americas', lat: 14.63,  lon: -90.52,  searchOnly: true },
  { id: 'kingston',       name: 'Kingston',       country: 'Jamaica',      tz: 'America/Jamaica',        flag: '🇯🇲', region: 'americas', lat: 17.99,  lon: -76.79,  searchOnly: true },
  { id: 'port-of-spain',  name: 'Port of Spain',  country: 'Trinidad',     tz: 'America/Port_of_Spain',  flag: '🇹🇹', region: 'americas', lat: 10.65,  lon: -61.52,  searchOnly: true },
  // Europe — existing
  { id: 'barcelona',      name: 'Barcelona',      country: 'Spain',        tz: 'Europe/Madrid',          flag: '🇪🇸', region: 'europe',   lat: 41.39,  lon: 2.15,    searchOnly: true },
  { id: 'brussels',       name: 'Brussels',       country: 'Belgium',      tz: 'Europe/Brussels',        flag: '🇧🇪', region: 'europe',   lat: 50.85,  lon: 4.35,    searchOnly: true },
  { id: 'vienna',         name: 'Vienna',         country: 'Austria',      tz: 'Europe/Vienna',          flag: '🇦🇹', region: 'europe',   lat: 48.21,  lon: 16.37,   searchOnly: true },
  { id: 'warsaw',         name: 'Warsaw',         country: 'Poland',       tz: 'Europe/Warsaw',          flag: '🇵🇱', region: 'europe',   lat: 52.23,  lon: 21.01,   searchOnly: true },
  { id: 'budapest',       name: 'Budapest',       country: 'Hungary',      tz: 'Europe/Budapest',        flag: '🇭🇺', region: 'europe',   lat: 47.50,  lon: 19.04,   searchOnly: true },
  { id: 'prague',         name: 'Prague',         country: 'Czech Republic',tz: 'Europe/Prague',         flag: '🇨🇿', region: 'europe',   lat: 50.08,  lon: 14.44,   searchOnly: true },
  { id: 'lisbon',         name: 'Lisbon',         country: 'Portugal',     tz: 'Europe/Lisbon',          flag: '🇵🇹', region: 'europe',   lat: 38.72,  lon: -9.14,   searchOnly: true },
  { id: 'athens',         name: 'Athens',         country: 'Greece',       tz: 'Europe/Athens',          flag: '🇬🇷', region: 'europe',   lat: 37.98,  lon: 23.73,   searchOnly: true },
  { id: 'stockholm',      name: 'Stockholm',      country: 'Sweden',       tz: 'Europe/Stockholm',       flag: '🇸🇪', region: 'europe',   lat: 59.33,  lon: 18.07,   searchOnly: true },
  { id: 'oslo',           name: 'Oslo',           country: 'Norway',       tz: 'Europe/Oslo',            flag: '🇳🇴', region: 'europe',   lat: 59.91,  lon: 10.75,   searchOnly: true },
  { id: 'copenhagen',     name: 'Copenhagen',     country: 'Denmark',      tz: 'Europe/Copenhagen',      flag: '🇩🇰', region: 'europe',   lat: 55.68,  lon: 12.57,   searchOnly: true },
  { id: 'helsinki',       name: 'Helsinki',       country: 'Finland',      tz: 'Europe/Helsinki',        flag: '🇫🇮', region: 'europe',   lat: 60.17,  lon: 24.94,   searchOnly: true },
  { id: 'dublin',         name: 'Dublin',         country: 'Ireland',      tz: 'Europe/Dublin',          flag: '🇮🇪', region: 'europe',   lat: 53.33,  lon: -6.25,   searchOnly: true },
  { id: 'zurich',         name: 'Zurich',         country: 'Switzerland',  tz: 'Europe/Zurich',          flag: '🇨🇭', region: 'europe',   lat: 47.38,  lon: 8.54,    searchOnly: true },
  { id: 'milan',          name: 'Milan',          country: 'Italy',        tz: 'Europe/Rome',            flag: '🇮🇹', region: 'europe',   lat: 45.46,  lon: 9.19,    searchOnly: true },
  { id: 'munich',         name: 'Munich',         country: 'Germany',      tz: 'Europe/Berlin',          flag: '🇩🇪', region: 'europe',   lat: 48.14,  lon: 11.58,   searchOnly: true },
  { id: 'hamburg',        name: 'Hamburg',        country: 'Germany',      tz: 'Europe/Berlin',          flag: '🇩🇪', region: 'europe',   lat: 53.55,  lon: 10.00,   searchOnly: true },
  { id: 'frankfurt',      name: 'Frankfurt',      country: 'Germany',      tz: 'Europe/Berlin',          flag: '🇩🇪', region: 'europe',   lat: 50.11,  lon: 8.68,    searchOnly: true },
  { id: 'edinburgh',      name: 'Edinburgh',      country: 'United Kingdom',tz: 'Europe/London',         flag: '🇬🇧', region: 'europe',   lat: 55.95,  lon: -3.19,   searchOnly: true },
  { id: 'manchester',     name: 'Manchester',     country: 'United Kingdom',tz: 'Europe/London',         flag: '🇬🇧', region: 'europe',   lat: 53.48,  lon: -2.24,   searchOnly: true },
  { id: 'kyiv',           name: 'Kyiv',           country: 'Ukraine',      tz: 'Europe/Kiev',            flag: '🇺🇦', region: 'europe',   lat: 50.45,  lon: 30.52,   searchOnly: true },
  { id: 'bucharest',      name: 'Bucharest',      country: 'Romania',      tz: 'Europe/Bucharest',       flag: '🇷🇴', region: 'europe',   lat: 44.43,  lon: 26.10,   searchOnly: true },
  // Asia/Pacific — existing
  { id: 'jakarta',        name: 'Jakarta',        country: 'Indonesia',    tz: 'Asia/Jakarta',           flag: '🇮🇩', region: 'asia',     lat: -6.21,  lon: 106.85,  searchOnly: true },
  { id: 'kuala-lumpur',   name: 'Kuala Lumpur',   country: 'Malaysia',     tz: 'Asia/Kuala_Lumpur',      flag: '🇲🇾', region: 'asia',     lat: 3.14,   lon: 101.69,  searchOnly: true },
  { id: 'manila',         name: 'Manila',         country: 'Philippines',  tz: 'Asia/Manila',            flag: '🇵🇭', region: 'asia',     lat: 14.60,  lon: 120.98,  searchOnly: true },
  { id: 'ho-chi-minh',    name: 'Ho Chi Minh City',country: 'Vietnam',    tz: 'Asia/Ho_Chi_Minh',       flag: '🇻🇳', region: 'asia',     lat: 10.82,  lon: 106.63,  searchOnly: true },
  { id: 'hanoi',          name: 'Hanoi',          country: 'Vietnam',      tz: 'Asia/Bangkok',           flag: '🇻🇳', region: 'asia',     lat: 21.03,  lon: 105.85,  searchOnly: true },
  { id: 'taipei',         name: 'Taipei',         country: 'Taiwan',       tz: 'Asia/Taipei',            flag: '🇹🇼', region: 'asia',     lat: 25.05,  lon: 121.55,  searchOnly: true },
  { id: 'osaka',          name: 'Osaka',          country: 'Japan',        tz: 'Asia/Tokyo',             flag: '🇯🇵', region: 'asia',     lat: 34.69,  lon: 135.50,  searchOnly: true },
  { id: 'beijing',        name: 'Beijing',        country: 'China',        tz: 'Asia/Shanghai',          flag: '🇨🇳', region: 'asia',     lat: 39.91,  lon: 116.39,  searchOnly: true },
  { id: 'shanghai',       name: 'Shanghai',       country: 'China',        tz: 'Asia/Shanghai',          flag: '🇨🇳', region: 'asia',     lat: 31.23,  lon: 121.47,  searchOnly: true },
  { id: 'chengdu',        name: 'Chengdu',        country: 'China',        tz: 'Asia/Shanghai',          flag: '🇨🇳', region: 'asia',     lat: 30.57,  lon: 104.07,  searchOnly: true },
  { id: 'dhaka',          name: 'Dhaka',          country: 'Bangladesh',   tz: 'Asia/Dhaka',             flag: '🇧🇩', region: 'asia',     lat: 23.72,  lon: 90.41,   searchOnly: true },
  { id: 'karachi',        name: 'Karachi',        country: 'Pakistan',     tz: 'Asia/Karachi',           flag: '🇵🇰', region: 'asia',     lat: 24.86,  lon: 67.01,   searchOnly: true },
  { id: 'lahore',         name: 'Lahore',         country: 'Pakistan',     tz: 'Asia/Karachi',           flag: '🇵🇰', region: 'asia',     lat: 31.55,  lon: 74.35,   searchOnly: true },
  { id: 'colombo',        name: 'Colombo',        country: 'Sri Lanka',    tz: 'Asia/Colombo',           flag: '🇱🇰', region: 'asia',     lat: 6.93,   lon: 79.85,   searchOnly: true },
  { id: 'kathmandu',      name: 'Kathmandu',      country: 'Nepal',        tz: 'Asia/Kathmandu',         flag: '🇳🇵', region: 'asia',     lat: 27.71,  lon: 85.31,   searchOnly: true },
  { id: 'almaty',         name: 'Almaty',         country: 'Kazakhstan',   tz: 'Asia/Almaty',            flag: '🇰🇿', region: 'asia',     lat: 43.26,  lon: 76.95,   searchOnly: true },
  { id: 'tashkent',       name: 'Tashkent',       country: 'Uzbekistan',   tz: 'Asia/Tashkent',          flag: '🇺🇿', region: 'asia',     lat: 41.30,  lon: 69.24,   searchOnly: true },
  { id: 'melbourne',      name: 'Melbourne',      country: 'Australia',    tz: 'Australia/Melbourne',    flag: '🇦🇺', region: 'asia',     lat: -37.81, lon: 144.96,  searchOnly: true },
  { id: 'brisbane',       name: 'Brisbane',       country: 'Australia',    tz: 'Australia/Brisbane',     flag: '🇦🇺', region: 'asia',     lat: -27.47, lon: 153.02,  searchOnly: true },
  { id: 'perth',          name: 'Perth',          country: 'Australia',    tz: 'Australia/Perth',        flag: '🇦🇺', region: 'asia',     lat: -31.95, lon: 115.86,  searchOnly: true },
  { id: 'auckland',       name: 'Auckland',       country: 'New Zealand',  tz: 'Pacific/Auckland',       flag: '🇳🇿', region: 'asia',     lat: -36.87, lon: 174.77,  searchOnly: true },
  { id: 'wellington',     name: 'Wellington',     country: 'New Zealand',  tz: 'Pacific/Auckland',       flag: '🇳🇿', region: 'asia',     lat: -41.29, lon: 174.78,  searchOnly: true },
  // Asia — new
  { id: 'baku',           name: 'Baku',           country: 'Azerbaijan',   tz: 'Asia/Baku',              flag: '🇦🇿', region: 'asia',     lat: 40.41,  lon: 49.87,   searchOnly: true },
  { id: 'yangon',         name: 'Yangon',         country: 'Myanmar',      tz: 'Asia/Rangoon',           flag: '🇲🇲', region: 'asia',     lat: 16.87,  lon: 96.19,   searchOnly: true },
  { id: 'phnom-penh',     name: 'Phnom Penh',     country: 'Cambodia',     tz: 'Asia/Phnom_Penh',        flag: '🇰🇭', region: 'asia',     lat: 11.55,  lon: 104.92,  searchOnly: true },
  { id: 'vientiane',      name: 'Vientiane',      country: 'Laos',         tz: 'Asia/Vientiane',         flag: '🇱🇦', region: 'asia',     lat: 17.97,  lon: 102.60,  searchOnly: true },
  // Middle East — existing
  { id: 'tehran',         name: 'Tehran',         country: 'Iran',         tz: 'Asia/Tehran',            flag: '🇮🇷', region: 'africa',   lat: 35.69,  lon: 51.39,   searchOnly: true },
  { id: 'baghdad',        name: 'Baghdad',        country: 'Iraq',         tz: 'Asia/Baghdad',           flag: '🇮🇶', region: 'africa',   lat: 33.34,  lon: 44.40,   searchOnly: true },
  { id: 'riyadh',         name: 'Riyadh',         country: 'Saudi Arabia', tz: 'Asia/Riyadh',            flag: '🇸🇦', region: 'africa',   lat: 24.69,  lon: 46.72,   searchOnly: true },
  { id: 'kuwait-city',    name: 'Kuwait City',    country: 'Kuwait',       tz: 'Asia/Kuwait',            flag: '🇰🇼', region: 'africa',   lat: 29.37,  lon: 47.98,   searchOnly: true },
  { id: 'doha',           name: 'Doha',           country: 'Qatar',        tz: 'Asia/Qatar',             flag: '🇶🇦', region: 'africa',   lat: 25.29,  lon: 51.53,   searchOnly: true },
  { id: 'abu-dhabi',      name: 'Abu Dhabi',      country: 'UAE',          tz: 'Asia/Dubai',             flag: '🇦🇪', region: 'africa',   lat: 24.45,  lon: 54.38,   searchOnly: true },
  { id: 'muscat',         name: 'Muscat',         country: 'Oman',         tz: 'Asia/Muscat',            flag: '🇴🇲', region: 'africa',   lat: 23.61,  lon: 58.59,   searchOnly: true },
  { id: 'beirut',         name: 'Beirut',         country: 'Lebanon',      tz: 'Asia/Beirut',            flag: '🇱🇧', region: 'africa',   lat: 33.89,  lon: 35.50,   searchOnly: true },
  { id: 'amman',          name: 'Amman',          country: 'Jordan',       tz: 'Asia/Amman',             flag: '🇯🇴', region: 'africa',   lat: 31.95,  lon: 35.93,   searchOnly: true },
  { id: 'tel-aviv',       name: 'Tel Aviv',       country: 'Israel',       tz: 'Asia/Jerusalem',         flag: '🇮🇱', region: 'africa',   lat: 32.08,  lon: 34.78,   searchOnly: true },
  // Africa — existing
  { id: 'nairobi',        name: 'Nairobi',        country: 'Kenya',        tz: 'Africa/Nairobi',         flag: '🇰🇪', region: 'africa',   lat: -1.29,  lon: 36.82,   searchOnly: true },
  { id: 'lagos',          name: 'Lagos',          country: 'Nigeria',      tz: 'Africa/Lagos',           flag: '🇳🇬', region: 'africa',   lat: 6.52,   lon: 3.38,    searchOnly: true },
  { id: 'accra',          name: 'Accra',          country: 'Ghana',        tz: 'Africa/Accra',           flag: '🇬🇭', region: 'africa',   lat: 5.56,   lon: -0.20,   searchOnly: true },
  { id: 'casablanca',     name: 'Casablanca',     country: 'Morocco',      tz: 'Africa/Casablanca',      flag: '🇲🇦', region: 'africa',   lat: 33.59,  lon: -7.62,   searchOnly: true },
  { id: 'tunis',          name: 'Tunis',          country: 'Tunisia',      tz: 'Africa/Tunis',           flag: '🇹🇳', region: 'africa',   lat: 36.82,  lon: 10.17,   searchOnly: true },
  { id: 'algiers',        name: 'Algiers',        country: 'Algeria',      tz: 'Africa/Algiers',         flag: '🇩🇿', region: 'africa',   lat: 36.74,  lon: 3.06,    searchOnly: true },
  { id: 'addis-ababa',    name: 'Addis Ababa',    country: 'Ethiopia',     tz: 'Africa/Addis_Ababa',     flag: '🇪🇹', region: 'africa',   lat: 9.02,   lon: 38.75,   searchOnly: true },
  { id: 'dar-es-salaam',  name: 'Dar es Salaam',  country: 'Tanzania',     tz: 'Africa/Dar_es_Salaam',   flag: '🇹🇿', region: 'africa',   lat: -6.79,  lon: 39.21,   searchOnly: true },
  { id: 'cape-town',      name: 'Cape Town',      country: 'South Africa', tz: 'Africa/Johannesburg',    flag: '🇿🇦', region: 'africa',   lat: -33.93, lon: 18.42,   searchOnly: true },
  // Africa — new
  { id: 'kampala',        name: 'Kampala',        country: 'Uganda',       tz: 'Africa/Kampala',         flag: '🇺🇬', region: 'africa',   lat: 0.32,   lon: 32.58,   searchOnly: true },
  { id: 'lusaka',         name: 'Lusaka',         country: 'Zambia',       tz: 'Africa/Lusaka',          flag: '🇿🇲', region: 'africa',   lat: -15.42, lon: 28.28,   searchOnly: true },
  { id: 'harare',         name: 'Harare',         country: 'Zimbabwe',     tz: 'Africa/Harare',          flag: '🇿🇼', region: 'africa',   lat: -17.83, lon: 31.05,   searchOnly: true },
  { id: 'maputo',         name: 'Maputo',         country: 'Mozambique',   tz: 'Africa/Maputo',          flag: '🇲🇿', region: 'africa',   lat: -25.97, lon: 32.59,   searchOnly: true },
];

// --- Utility: get current time in a timezone ---
function getTimeInZone(tz) {
  return new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
}

function formatTime(date, seconds = true) {
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const hStr = h.toString().padStart(2, '0');
  return seconds ? `${hStr}:${m}:${s} ${ampm}` : `${hStr}:${m} ${ampm}`;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// Get UTC offset string like "+05:30" or "-07:00"
function getUTCOffset(tz) {
  const now = new Date();
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate  = new Date(now.toLocaleString('en-US', { timeZone: tz }));
  const diffMin = Math.round((tzDate - utcDate) / 60000);
  const sign = diffMin >= 0 ? '+' : '-';
  const h = Math.floor(Math.abs(diffMin) / 60).toString().padStart(2, '0');
  const m = (Math.abs(diffMin) % 60).toString().padStart(2, '0');
  return `UTC${sign}${h}:${m}`;
}

// --- City display label: "City, State" for US/Canada, "City, Country" otherwise ---
function cityLabel(city) {
  if (city.state) return `${city.name}, ${city.state}`;
  return `${city.name}, ${city.country}`;
}

// Simple DST check: compare Jan and Jun offsets
function isDST(tz) {
  const now = new Date();
  const jan = new Date(now.getFullYear(), 0, 1);
  const jun = new Date(now.getFullYear(), 5, 1);
  const getOff = (d) => {
    const u = new Date(d.toLocaleString('en-US', { timeZone: 'UTC' }));
    const t = new Date(d.toLocaleString('en-US', { timeZone: tz }));
    return Math.round((t - u) / 60000);
  };
  const offJan = getOff(jan);
  const offJun = getOff(jun);
  const offNow = getOff(now);
  return offNow !== Math.min(offJan, offJun);
}

// --- Homepage: render city grid ---
function renderCityGrid() {
  const grid = document.getElementById('city-grid');
  if (!grid) return;

  const searchInput = document.getElementById('city-search');
  let activeRegion = 'all';

  function render(filter = '', region = 'all') {
    const filtered = CITIES.filter(c => {
      // Only show non-searchOnly cities unless user is searching
      const isSearching = filter.trim().length > 0;
      if (c.searchOnly && !isSearching) return false;
      const lf = filter.toLowerCase();
      const matchesText = c.name.toLowerCase().includes(lf) ||
                          c.country.toLowerCase().includes(lf) ||
                          (c.state && c.state.toLowerCase().includes(lf)) ||
                          cityLabel(c).toLowerCase().includes(lf);
      const matchesRegion = region === 'all' || c.region === region;
      return matchesText && matchesRegion;
    });

    grid.innerHTML = filtered.map(city => `
      <a href="time.html?city=${city.id}" class="city-card" data-id="${city.id}" data-region="${city.region}">
        <div class="city-name">${city.flag} ${city.name}</div>
        <div class="city-time" id="mini-${city.id}">--:--:--</div>
        <div class="city-tz">${cityLabel(city)} · ${city.tz}</div>
      </a>
    `).join('');
  }

  render();

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => render(e.target.value, activeRegion));
  }

  // Region tab filter
  document.querySelectorAll('.region-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.region-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeRegion = tab.dataset.region;
      render(searchInput ? searchInput.value : '', activeRegion);
    });
  });

  // Tick clocks every second
  function tickGrid() {
    CITIES.forEach(city => {
      const el = document.getElementById(`mini-${city.id}`);
      if (el) el.textContent = formatTime(getTimeInZone(city.tz));
    });
  }
  tickGrid();
  setInterval(tickGrid, 1000);
}

// Search button handler with autocomplete dropdown
function setupSearch() {
  const btn      = document.getElementById('search-btn');
  const input    = document.getElementById('city-search');
  const dropdown = document.getElementById('search-autocomplete');
  if (!btn || !input) return;

  let activeIndex = -1;

  function getMatches(val) {
    if (!val.trim()) return [];
    const lv = val.trim().toLowerCase();
    return CITIES.filter(c =>
      c.name.toLowerCase().includes(lv) ||
      c.id.includes(lv.replace(/\s+/g, '-')) ||
      (c.state && c.state.toLowerCase().includes(lv)) ||
      cityLabel(c).toLowerCase().includes(lv)
    ).slice(0, 8);
  }

  function renderDropdown(matches) {
    if (!dropdown) return;
    if (!matches.length) { dropdown.style.display = 'none'; return; }
    dropdown.innerHTML = matches.map((c, i) => `
      <div class="autocomplete-item${i === 0 ? ' autocomplete-highlighted' : ''}" data-id="${c.id}">
        <span class="ac-flag">${c.flag}</span>
        <span class="ac-label">${cityLabel(c)}</span>
      </div>
    `).join('');
    activeIndex = 0;
    dropdown.style.display = 'block';
    dropdown.querySelectorAll('.autocomplete-item').forEach((item, i) => {
      item.addEventListener('mouseenter', () => setActive(i));
      item.addEventListener('click', () => { window.location.href = `time.html?city=${item.dataset.id}`; });
    });
  }

  function setActive(idx) {
    const items = dropdown ? dropdown.querySelectorAll('.autocomplete-item') : [];
    items.forEach(el => el.classList.remove('autocomplete-highlighted'));
    if (idx >= 0 && idx < items.length) {
      items[idx].classList.add('autocomplete-highlighted');
      activeIndex = idx;
    }
  }

  function navigate() {
    const items = dropdown ? dropdown.querySelectorAll('.autocomplete-item') : [];
    if (items.length && activeIndex >= 0 && activeIndex < items.length) {
      window.location.href = `time.html?city=${items[activeIndex].dataset.id}`;
      return;
    }
    const val = input.value.trim().toLowerCase();
    const match = CITIES.find(c =>
      c.name.toLowerCase().includes(val) ||
      c.id.includes(val.replace(/\s+/g, '-')) ||
      (c.state && c.state.toLowerCase().includes(val)) ||
      cityLabel(c).toLowerCase().includes(val)
    );
    if (match) {
      window.location.href = `time.html?city=${match.id}`;
    } else {
      input.style.borderColor = '#ff4466';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
    }
  }

  input.addEventListener('input', (e) => renderDropdown(getMatches(e.target.value)));

  input.addEventListener('keydown', (e) => {
    const items = dropdown ? dropdown.querySelectorAll('.autocomplete-item') : [];
    const open  = dropdown && dropdown.style.display !== 'none';
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (open) setActive(Math.min(activeIndex + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (open) setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      navigate();
    } else if (e.key === 'Escape') {
      if (dropdown) dropdown.style.display = 'none';
    }
  });

  btn.addEventListener('click', navigate);

  document.addEventListener('click', (e) => {
    if (dropdown && !input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
}

// --- City page (time.html): render live clock ---
function renderCityPage() {
  const clockEl  = document.getElementById('live-clock');
  const dateEl   = document.getElementById('live-date');
  const titleEl  = document.getElementById('city-page-title');
  const labelEl  = document.getElementById('city-label');
  const offsetEl = document.getElementById('utc-offset');
  const dstEl    = document.getElementById('dst-status');
  const tzNameEl = document.getElementById('tz-name');

  if (!clockEl) return;

  const params = new URLSearchParams(window.location.search);
  const cityId = params.get('city') || 'london';
  const city = CITIES.find(c => c.id === cityId) || CITIES.find(c => c.id === 'london');

  // Set city-specific night photo
  const overlay = document.querySelector('.city-banner-overlay');
  if (overlay) {
    const imgUrl = CITY_IMAGES[city.id] || CITY_IMAGES['default'];
    overlay.style.backgroundImage = `url('${imgUrl}')`;
  }

  // Page title
  document.title = `Current time in ${city.name} — Live Clock | The Time Sphere`;
  if (titleEl) titleEl.textContent = `${city.flag} ${city.name}`;
  if (labelEl) labelEl.textContent = `${cityLabel(city)} · Current Local Time`;

  // Static TZ info
  const offset = getUTCOffset(city.tz);
  const dst    = isDST(city.tz);
  if (offsetEl) offsetEl.textContent = offset;
  if (dstEl)    dstEl.textContent = dst ? 'DST Active' : 'No DST';
  if (tzNameEl) tzNameEl.textContent = city.tz;
  const dstBadge = document.getElementById('dst-badge');
  if (dstBadge && dst) dstBadge.classList.add('dst-active');

  // Related city badges inline in the tz-row
  const tzRow = document.getElementById('tz-row');
  if (tzRow) {
    const related = CITIES.filter(c => c.region === city.region && c.id !== city.id && !c.searchOnly).slice(0, 3);
    related.forEach(c => {
      const badge = document.createElement('a');
      badge.href = `time.html?city=${c.id}`;
      badge.className = 'tz-badge tz-badge-related';
      badge.innerHTML = `<strong id="rel-${c.id}">--:--</strong>${c.flag} ${c.name}`;
      tzRow.appendChild(badge);
    });
  }

  // Travel card heading
  const travelHeading = document.getElementById('travel-heading');
  if (travelHeading) travelHeading.textContent = `Explore ${city.name}`;

  // Dynamic city-specific affiliate links
  const aid = '8058275';
  const sid = '304813083';
  const sub3 = 'D15250377';
  const cityEncoded = encodeURIComponent(city.name);
  const baseParams = `Allianceid=${aid}&SID=${sid}&trip_sub1=&trip_sub3=${sub3}`;
  const isAsiaAfrica = city.region === 'asia' || city.region === 'africa';

  // Flights
  const flightsLink = document.getElementById('flights-link');
  if (flightsLink) {
    flightsLink.href = isAsiaAfrica
      ? `https://www.trip.com/flights/welcome/?to=${cityEncoded}&${baseParams}`
      : `https://expedia.com/affiliate?siteid=1&landingPage=${encodeURIComponent(`https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${city.name}`)}&camref=1011l5FtnD&creativeref=1100l68075&adref=PZsdtQ7jiB`;
  }

  // Hotels — Trip.com for Asia/Africa, Hotels.com for Americas/Europe
  const hotelsLink = document.getElementById('hotels-link');
  if (hotelsLink) {
    hotelsLink.href = isAsiaAfrica
      ? `https://www.trip.com/hotels/?searchWord=${cityEncoded}&${baseParams}`
      : `https://www.hotels.com/affiliate?landingPage=${encodeURIComponent(`https://www.hotels.com/search.do?destination=${city.name}`)}&camref=1110lCi3P&creativeref=1011l66481&adref=PZtELLwj2M`;
  }

  // Tours (Viator — all regions)
  const toursLink = document.getElementById('tours-link');
  if (toursLink) toursLink.href = `https://www.viator.com/search/${cityEncoded}?pid=P00295924&mcid=42383&medium=link&medium_version=selector`;

  // Cars
  const carsLink = document.getElementById('cars-link');
  if (carsLink) {
    carsLink.href = isAsiaAfrica
      ? `https://www.trip.com/carhire/?${baseParams}`
      : `https://expedia.com/affiliate?siteid=1&landingPage=${encodeURIComponent(`https://www.expedia.com/carsearch?locn=${city.name}`)}&camref=1011l5FtnD&creativeref=1100l68075&adref=PZ2Q47j9j0`;
  }

  // Cruises (placeholder — CruiseDirect pending approval)
  const cruisesLink = document.getElementById('cruises-link');
  if (cruisesLink) cruisesLink.href = '#';

  // Packages
  const packagesLink = document.getElementById('packages-link');
  if (packagesLink) {
    packagesLink.href = isAsiaAfrica
      ? `https://www.trip.com/flights/welcome/?to=${cityEncoded}&${baseParams}`
      : `https://expedia.com/affiliate?siteid=1&landingPage=${encodeURIComponent('https://www.expedia.com/Vacation-Packages')}&camref=1011l5FtnD&creativeref=1100l68075&adref=PZFikPKL6y`;
  }

  // Reserve a Table — regional logic
  const reserveBtn = document.getElementById('reserve-table-btn');
  if (reserveBtn) {
    const r = city.region;
    if (r === 'americas') {
      reserveBtn.href = '#'; reserveBtn.textContent = '🍴 Reserve a Table — OpenTable';
    } else if (r === 'europe') {
      reserveBtn.href = '#'; reserveBtn.textContent = '🍴 Reserve a Table — TheFork';
    } else if (r === 'asia' && ['singapore','kuala-lumpur','bangkok','jakarta','manila','ho-chi-minh','hanoi'].includes(city.id)) {
      reserveBtn.href = '#'; reserveBtn.textContent = '🍴 Reserve a Table — Eatigo';
    } else if (r === 'asia' && ['mumbai','delhi','bangalore','karachi','lahore','tehran','baghdad','riyadh','kuwait-city','doha','abu-dhabi','muscat','beirut','amman'].includes(city.id)) {
      reserveBtn.href = '#'; reserveBtn.textContent = '🍴 Reserve a Table — Zomato';
    } else if (r === 'asia') {
      reserveBtn.href = '#'; reserveBtn.textContent = '🍴 Reserve a Table — Quandoo';
    } else if (r === 'africa') {
      reserveBtn.href = '#'; reserveBtn.textContent = '🍴 Reserve a Table — Zomato';
    } else {
      reserveBtn.href = '#'; reserveBtn.textContent = '🍴 Reserve a Table';
    }
  }

  // Day/Night indicator
  function updateDayNight(now) {
    const hour  = now.getHours();
    const icon  = document.getElementById('daynight-icon');
    const label = document.getElementById('daynight-label');
    const sub   = document.getElementById('daynight-sub');
    if (!icon) return;
    if (hour >= 6 && hour < 20) {
      icon.textContent  = '☀️'; label.textContent = 'Daytime';
      sub.textContent   = `Business hours in ${city.name}`;
    } else if (hour >= 20 || hour < 1) {
      icon.textContent  = '🌆'; label.textContent = 'Evening';
      sub.textContent   = `Evening hours in ${city.name}`;
    } else {
      icon.textContent  = '🌙'; label.textContent = 'Nighttime';
      sub.textContent   = `Late night in ${city.name}`;
    }
  }

  // Live clock tick
  function tick() {
    const now = getTimeInZone(city.tz);
    if (clockEl) clockEl.textContent = formatTime(now);
    if (dateEl)  dateEl.textContent  = formatDate(now);
    updateDayNight(now);
    // Related city times
    CITIES.filter(c => c.region === city.region && c.id !== city.id && !c.searchOnly).slice(0, 3).forEach(c => {
      const el = document.getElementById(`rel-${c.id}`);
      if (el) el.textContent = formatTime(getTimeInZone(c.tz), false);
    });
  }

  tick();
  setInterval(tick, 1000);

  // Load weather strip
  loadWeather(city);

  // Load discover section
  loadDiscoverContent(city);
}

// --- City Night Photography (Unsplash — free commercial use) ---
const CITY_IMAGES = {
  'new-york':    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1600&q=80',
  'los-angeles': 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1600&q=80',
  'chicago':     'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  'toronto':     'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1600&q=80',
  'mexico-city': 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1600&q=80',
  'sao-paulo':   'https://images.unsplash.com/photo-1554168848-228452c09d60?w=1600&q=80',
  'london':      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=80',
  'paris':       'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&q=80',
  'berlin':      'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1600&q=80',
  'rome':        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&q=80',
  'madrid':      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1600&q=80',
  'moscow':      'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1600&q=80',
  'tokyo':       'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=80',
  'singapore':   'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&q=80',
  'hong-kong':   'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1600&q=80',
  'seoul':       'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1600&q=80',
  'mumbai':      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1600&q=80',
  'sydney':      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1600&q=80',
  'dubai':       'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80',
  'istanbul':    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80',
  'cairo':       'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1600&q=80',
  'johannesburg':'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=1600&q=80',
  // USA — new cities
  'tampa':           'https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=1600&q=80',
  'orlando':         'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=1600&q=80',
  'jacksonville':    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1600&q=80',
  'charlotte':       'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&q=80',
  'raleigh':         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
  'nashville':       'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?w=1600&q=80',
  'memphis':         'https://images.unsplash.com/photo-1568894411339-29e5fb8e4428?w=1600&q=80',
  'louisville':      'https://images.unsplash.com/photo-1572026640804-763a3e5c6a79?w=1600&q=80',
  'indianapolis':    'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1600&q=80',
  'columbus':        'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80',
  'cleveland':       'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=1600&q=80',
  'cincinnati':      'https://images.unsplash.com/photo-1558452919-08ae4aea8e29?w=1600&q=80',
  'pittsburgh':      'https://images.unsplash.com/photo-1530841344095-5e0c1d0c7f51?w=1600&q=80',
  'baltimore':       'https://images.unsplash.com/photo-1574518861790-2c64c36b1d2a?w=1600&q=80',
  'richmond':        'https://images.unsplash.com/photo-1597500931372-44f6c4cb63e3?w=1600&q=80',
  'norfolk':         'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1600&q=80',
  'buffalo':         'https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?w=1600&q=80',
  'albany':          'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1600&q=80',
  'hartford':        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  'providence':      'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=1600&q=80',
  'portland-me':     'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80',
  'burlington':      'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?w=1600&q=80',
  'albuquerque':     'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1600&q=80',
  'tucson':          'https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=1600&q=80',
  'el-paso':         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
  'san-antonio':     'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80',
  'austin':          'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1600&q=80',
  'fort-worth':      'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=1600&q=80',
  'oklahoma-city':   'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80',
  'tulsa':           'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1600&q=80',
  'wichita':         'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  'omaha':           'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80',
  'des-moines':      'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=1600&q=80',
  'milwaukee':       'https://images.unsplash.com/photo-1559566740-e63e29d3948f?w=1600&q=80',
  'madison':         'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?w=1600&q=80',
  'grand-rapids':    'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=1600&q=80',
  'kansas-city':     'https://images.unsplash.com/photo-1558452919-08ae4aea8e29?w=1600&q=80',
  'st-louis':        'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=1600&q=80',
  'little-rock':     'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  'jackson':         'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  'birmingham':      'https://images.unsplash.com/photo-1559566740-e63e29d3948f?w=1600&q=80',
  'montgomery':      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  'mobile':          'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  'savannah':        'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=1600&q=80',
  'charleston':      'https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=1600&q=80',
  'columbia-sc':     'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  'boise':           'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?w=1600&q=80',
  'salt-lake-city':  'https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=1600&q=80',
  'reno':            'https://images.unsplash.com/photo-1559566740-e63e29d3948f?w=1600&q=80',
  'spokane':         'https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?w=1600&q=80',
  // Canada — new
  'winnipeg':        'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=1600&q=80',
  'edmonton':        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80',
  'quebec-city':     'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=1600&q=80',
  'halifax':         'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80',
  // Latin America — new
  'monterrey':       'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1600&q=80',
  'guadalajara':     'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1600&q=80',
  'tijuana':         'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
  'medellin':        'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1600&q=80',
  'montevideo':      'https://images.unsplash.com/photo-1559566740-e63e29d3948f?w=1600&q=80',
  'quito':           'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1600&q=80',
  'la-paz':          'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1600&q=80',
  'san-jose-cr':     'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1600&q=80',
  'guatemala-city':  'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1600&q=80',
  'kingston':        'https://images.unsplash.com/photo-1559566740-e63e29d3948f?w=1600&q=80',
  'port-of-spain':   'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=1600&q=80',
  // Africa — new
  'kampala':         'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1600&q=80',
  'lusaka':          'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80',
  'harare':          'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80',
  'maputo':          'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80',
  // Asia — new
  'baku':            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1600&q=80',
  'yangon':          'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=1600&q=80',
  'phnom-penh':      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=80',
  'vientiane':       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=80',
  // fallback
  'default':         'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
};

// --- Weather (Open-Meteo — free, no API key needed) ---
function weatherCodeToInfo(code) {
  if (code === 0)  return { label: 'Clear Sky',    icon: '☀️' };
  if (code <= 2)   return { label: 'Partly Cloudy',icon: '🌤️' };
  if (code === 3)  return { label: 'Overcast',     icon: '☁️' };
  if (code <= 48)  return { label: 'Foggy',        icon: '🌫️' };
  if (code <= 55)  return { label: 'Drizzle',      icon: '🌦️' };
  if (code <= 65)  return { label: 'Rain',          icon: '🌧️' };
  if (code <= 75)  return { label: 'Snow',          icon: '❄️' };
  if (code <= 82)  return { label: 'Rain Showers', icon: '🌧️' };
  if (code <= 86)  return { label: 'Snow Showers', icon: '🌨️' };
  if (code <= 99)  return { label: 'Thunderstorm', icon: '⛈️' };
  return                   { label: 'Unknown',      icon: '🌡️' };
}

async function loadWeather(city) {
  const strip = document.getElementById('weather-strip');
  if (!strip || !city.lat) return;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}`
      + `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m`
      + `&daily=weather_code,temperature_2m_max,temperature_2m_min`
      + `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=7`;
    const res  = await fetch(url);
    const data = await res.json();
    const cur  = data.current;
    const info = weatherCodeToInfo(cur.weather_code);
    const tempF  = Math.round(cur.temperature_2m);
    const tempC  = Math.round((tempF - 32) * 5 / 9);
    const feelsF = Math.round(cur.apparent_temperature);
    const wind   = Math.round(cur.wind_speed_10m);
    const humid  = cur.relative_humidity_2m;

    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const daily = data.daily;
    const forecastBoxes = daily.time.slice(1).map((dateStr, i) => {
      const d    = new Date(dateStr + 'T12:00:00');
      const inf  = weatherCodeToInfo(daily.weather_code[i + 1]);
      const hi   = Math.round(daily.temperature_2m_max[i + 1]);
      const lo   = Math.round(daily.temperature_2m_min[i + 1]);
      return `<div class="wx-day-box">
        <div class="wx-day-name">${dayNames[d.getDay()]}</div>
        <div class="wx-day-icon">${inf.icon}</div>
        <div class="wx-day-hi">${hi}°</div>
        <div class="wx-day-lo">${lo}°</div>
      </div>`;
    }).join('');

    strip.innerHTML = `
      <div class="wx-current">
        <div class="wx-cur-icon">${info.icon}</div>
        <div class="wx-cur-info">
          <div class="wx-cur-temp">${tempF}°F <span class="wx-cur-c">/ ${tempC}°C</span></div>
          <div class="wx-cur-label">${info.label}</div>
          <div class="wx-cur-extra">🌡️ ${feelsF}°F · 💧 ${humid}% · 💨 ${wind} mph</div>
        </div>
      </div>
      <div class="wx-forecast">${forecastBoxes}</div>
    `;
  } catch(e) {
    strip.innerHTML = `<div class="wx-current"><div class="wx-cur-icon">🌡️</div><div class="wx-cur-info"><div class="wx-cur-label">Weather unavailable</div></div></div>`;
  }
}

// --- API Keys ---
const TICKETMASTER_KEY = 'oU45aN6HSWpgHLNGHJNJe7tz0870uGGj';
const EVENTBRITE_KEY   = 'SBQORL5REUVO342LNKQ5';
const VIATOR_PID       = 'P00295924';
const VIATOR_MCID      = '42383';

function renderEventItems(events, containerId, linkBase) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!events.length) {
    el.innerHTML = `<div class="discover-item"><div class="discover-item-text"><small>No upcoming events found for this city.</small></div></div>`;
    return;
  }
  el.innerHTML = events.map(ev => `
    <a href="${ev.url || linkBase}" target="_blank" rel="noopener" class="event-item ${ev.image ? 'event-item-has-image' : ''}">
      ${ev.image ? `<div class="event-item-img"><img src="${ev.image}" alt="${ev.name}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` : ''}
      <div class="event-item-content">
        <div class="event-item-name">${ev.name}</div>
        <div class="event-item-meta">
          <span class="event-item-date">📅 ${ev.date}</span>
          <span>📍 ${ev.venue}</span>
          ${ev.genre ? `<span class="event-item-genre">${ev.genre}</span>` : ''}
        </div>
      </div>
    </a>
  `).join('');
}

async function loadTicketmasterEvents(city) {
  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_KEY}&city=${encodeURIComponent(city.name)}&size=9&sort=date,asc`;
    const res  = await fetch(url);
    const data = await res.json();
    const seen = new Set();
    const events = (data._embedded?.events || [])
      .filter(e => {
        const key = e.id || e.name.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 3)
      .map(e => ({
        name:  e.name,
        date:  e.dates?.start?.localDate || 'Upcoming',
        venue: e._embedded?.venues?.[0]?.name || city.name,
        url:   e.url,
        image: e.images?.find(i => i.ratio === '16_9' && i.width > 300)?.url || e.images?.[0]?.url || null,
        genre: e.classifications?.[0]?.genre?.name || ''
      }));
    return events;
  } catch(e) {
    return [];
  }
}

async function loadEventbriteEvents(city) {
  try {
    const url = `https://www.eventbriteapi.com/v3/events/search/?location.address=${encodeURIComponent(city.name)}&expand=venue,logo&page_size=3&sort_by=date&token=${EVENTBRITE_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    const events = (data.events || []).map(e => ({
      name:  e.name?.text || 'Local Event',
      date:  e.start?.local ? new Date(e.start.local).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : 'Upcoming',
      venue: e.venue?.name || city.name,
      url:   e.url,
      image: e.logo?.url || null,
      genre: 'Local Event'
    }));
    return events;
  } catch(e) {
    return [];
  }
}

async function loadDiscoverContent(city) {
  const titleEl = document.getElementById('discover-title');
  const subEl   = document.getElementById('discover-sub');

  if (titleEl) titleEl.textContent = `Discover ${city.name}`;
  if (subEl)   subEl.textContent   = `Things to do, places to eat, and upcoming events in ${city.name}`;

  // ── Viator affiliate link ──
  const viatorUrl  = `https://www.viator.com/search/${encodeURIComponent(city.name)}?pid=${VIATOR_PID}&mcid=${VIATOR_MCID}&medium=link&medium_version=selector`;
  const viatorWrap = document.getElementById('viator-widget');
  if (viatorWrap) {
    viatorWrap.innerHTML = `
      <div class="widget-placeholder">
        <p class="widget-placeholder-icon">🎟️</p>
        <p class="widget-placeholder-title">Experiences in ${city.name}</p>
        <p class="widget-placeholder-sub">Browse top-rated tours, activities and experiences.</p>
        <a href="${viatorUrl}" target="_blank" rel="noopener" class="btn" style="display:inline-block;margin-top:16px;padding:12px 28px;background:linear-gradient(135deg,#c8860a,#f0a830);color:#050810;font-weight:700;border-radius:50px;text-decoration:none;font-size:0.85rem;letter-spacing:0.05em;">
          Browse Experiences in ${city.name} →
        </a>
      </div>`;
  }

  // ── Load Ticketmaster events (deduplicated by event ID) ──
  const tmEl = document.getElementById('ticketmaster-body');
  if (tmEl) tmEl.innerHTML = `<div class="discover-loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>`;
  const tmEvents = await loadTicketmasterEvents(city);
  renderEventItems(
    tmEvents.length ? tmEvents : [{name:`Live events in ${city.name}`,date:'See all dates',venue:city.name,url:`https://www.ticketmaster.com/search?q=${encodeURIComponent(city.name)}`}],
    'ticketmaster-body',
    `https://www.ticketmaster.com/search?q=${encodeURIComponent(city.name)}`
  );

  // ── Eventbrite branded cards ──
  const ebEl = document.getElementById('eventbrite-body');
  if (ebEl) {
    const enc = encodeURIComponent(city.name);
    ebEl.innerHTML = `
      <a href="https://www.eventbrite.com/d/${enc}/events/" target="_blank" rel="noopener" class="event-item event-item-has-image">
        <div class="event-item-img" style="background:linear-gradient(135deg,#1a1a2e,#0f3460);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;">
          <div style="font-size:2.5rem;">📅</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.1rem;color:#fff;font-weight:700;text-align:center;padding:0 20px;">Local Events in ${city.name}</div>
          <div style="font-size:0.75rem;color:rgba(255,255,255,0.6);text-align:center;padding:0 20px;">Festivals, meetups, markets &amp; more</div>
        </div>
        <div class="event-item-content">
          <div class="event-item-name">Browse All Local Events →</div>
          <div class="event-item-meta">
            <span class="event-item-date">📍 ${city.name}, ${city.country}</span>
            <span class="event-item-genre" style="background:rgba(255,105,65,0.15);border-color:rgba(255,105,65,0.3);color:#ff6941;">Eventbrite</span>
          </div>
        </div>
      </a>
      <a href="https://www.eventbrite.com/d/${enc}/food-and-drink--events/" target="_blank" rel="noopener" class="event-item event-item-has-image">
        <div class="event-item-img" style="background:linear-gradient(135deg,#1a0a00,#6b2f00);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;">
          <div style="font-size:2.5rem;">🍽️</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.1rem;color:#fff;font-weight:700;text-align:center;padding:0 20px;">Food &amp; Drink Events</div>
        </div>
        <div class="event-item-content">
          <div class="event-item-name">Browse Food Events in ${city.name} →</div>
          <div class="event-item-meta">
            <span class="event-item-date">📍 ${city.name}</span>
            <span class="event-item-genre" style="background:rgba(255,105,65,0.15);border-color:rgba(255,105,65,0.3);color:#ff6941;">Eventbrite</span>
          </div>
        </div>
      </a>`;
  }

  // ── Load AI content ──
  await loadAIContent(city);
}
async function loadAIContent(city) {
  const todoEl  = document.getElementById('todo-body');
  const restEl  = document.getElementById('restaurant-body');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: `For the city of ${city.name}, ${city.country}, give me exactly this JSON format and nothing else:
{
  "todo": [
    {"name": "attraction name", "desc": "one sentence description"},
    {"name": "attraction name", "desc": "one sentence description"},
    {"name": "attraction name", "desc": "one sentence description"}
  ],
  "restaurants": [
    {"name": "restaurant name", "desc": "cuisine type and one sentence why it's great"},
    {"name": "restaurant name", "desc": "cuisine type and one sentence why it's great"},
    {"name": "restaurant name", "desc": "cuisine type and one sentence why it's great"}
  ]
}`
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text.trim();
    const parsed = JSON.parse(text);

    // Render Things To Do
    if (todoEl && parsed.todo) {
      todoEl.innerHTML = parsed.todo.map((item, i) => `
        <div class="discover-item">
          <div class="discover-item-num">${i + 1}</div>
          <div class="discover-item-text">
            <strong>${item.name}</strong>
            <small>${item.desc}</small>
          </div>
        </div>
      `).join('');
    }

    // Render Restaurants
    if (restEl && parsed.restaurants) {
      restEl.innerHTML = parsed.restaurants.map((item, i) => `
        <div class="discover-item">
          <div class="discover-item-num">${i + 1}</div>
          <div class="discover-item-text">
            <strong>${item.name}</strong>
            <small>${item.desc}</small>
          </div>
        </div>
      `).join('');
    }

  } catch (err) {
    // Fallback if API not available
    const fallback = (el, items) => {
      if (!el) return;
      el.innerHTML = items.map((item, i) => `
        <div class="discover-item">
          <div class="discover-item-num">${i + 1}</div>
          <div class="discover-item-text">
            <strong>${item.name}</strong>
            <small>${item.desc}</small>
          </div>
        </div>
      `).join('');
    };

    const todoFallback = {
      'new-york':    [{name:'Central Park',desc:'800 acres of iconic green space in the heart of Manhattan.'},{name:'The Metropolitan Museum of Art',desc:'World-class art collection spanning 5,000 years of history.'},{name:'Brooklyn Bridge',desc:'Walk across one of the world\'s most famous suspension bridges.'}],
      'los-angeles': [{name:'Griffith Observatory',desc:'Stunning views of LA and the Hollywood sign, free admission.'},{name:'Getty Center',desc:'World-class art museum with breathtaking city views.'},{name:'Santa Monica Pier',desc:'Iconic beachfront pier with rides, food, and ocean views.'}],
      'london':      [{name:'Tower of London',desc:'Nearly 1,000 years of royal history and the Crown Jewels.'},{name:'British Museum',desc:'World\'s greatest collection of human history and culture, free entry.'},{name:'Borough Market',desc:'London\'s oldest and most celebrated food market.'}],
      'tokyo':       [{name:'Senso-ji Temple',desc:'Tokyo\'s oldest temple in the historic Asakusa district.'},{name:'Shibuya Crossing',desc:'The world\'s busiest pedestrian crossing, a true spectacle.'},{name:'Tsukiji Outer Market',desc:'Fresh sushi and Japanese street food at its finest.'}],
    };

    const restFallback = {
      'new-york':    [{name:'Le Bernardin',desc:'French seafood. Arguably the finest restaurant in New York City.'},{name:'Katz\'s Delicatessen',desc:'Jewish deli. Iconic pastrami sandwiches since 1888.'},{name:'Di Fara Pizza',desc:'Italian-American. Legendary Brooklyn pizza made fresh daily.'}],
      'los-angeles': [{name:'Nobu Malibu',desc:'Japanese fusion. Celebrity hotspot with stunning ocean views.'},{name:'Grand Central Market',desc:'American eclectic. Historic market hall with diverse food stalls.'},{name:'In-N-Out Burger',desc:'American classic. An LA institution since 1948.'}],
      'london':      [{name:'Dishoom',desc:'Indian. Beloved Bombay-style café with legendary black daal.'},{name:'The Ledbury',desc:'Modern European. Two Michelin stars in Notting Hill.'},{name:'Padella',desc:'Italian. Fresh handmade pasta at unbeatable prices.'}],
      'tokyo':       [{name:'Sukiyabashi Jiro',desc:'Sushi. The world\'s most famous sushi restaurant, 3 Michelin stars.'},{name:'Ichiran Ramen',desc:'Japanese ramen. Private solo dining booths for full focus on flavor.'},{name:'Tsuta',desc:'Japanese soba. World\'s first Michelin-starred ramen restaurant.'}],
    };

    const genericTodo = [{name:`Explore ${city.name}`,desc:`Discover the top landmarks and attractions in ${city.name}.`},{name:'Local Museums & Galleries',desc:'Immerse yourself in the history and culture of the region.'},{name:'City Food Markets',desc:'Sample the best local cuisine and street food the city has to offer.'}];
    const genericRest = [{name:'Local Fine Dining',desc:'Experience the best of the local culinary scene.'},{name:'Traditional Cuisine',desc:`Authentic ${city.country} flavors in a classic setting.`},{name:'Street Food Tour',desc:'Explore the city\'s vibrant street food culture.'}];

    fallback(todoEl, todoFallback[city.id] || genericTodo);
    fallback(restEl, restFallback[city.id] || genericRest);
  }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  renderCityGrid();
  setupSearch();
  renderCityPage();
});
