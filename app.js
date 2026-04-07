/* =============================================
   THE TIME SPHERE — app.js
   thetimesphere.com
   ============================================= */

// --- City Data ---
const CITIES = [
  { id: 'new-york',    name: 'New York',    country: 'USA',           tz: 'America/New_York',    flag: '🇺🇸', region: 'americas', lat: 40.71,  lon: -74.01 },
  { id: 'los-angeles', name: 'Los Angeles', country: 'USA',           tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'americas', lat: 34.05,  lon: -118.24 },
  { id: 'chicago',     name: 'Chicago',     country: 'USA',           tz: 'America/Chicago',     flag: '🇺🇸', region: 'americas', lat: 41.85,  lon: -87.65 },
  { id: 'toronto',     name: 'Toronto',     country: 'Canada',        tz: 'America/Toronto',     flag: '🇨🇦', region: 'americas', lat: 43.70,  lon: -79.42 },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico',        tz: 'America/Mexico_City', flag: '🇲🇽', region: 'americas', lat: 19.43,  lon: -99.13 },
  { id: 'sao-paulo',   name: 'São Paulo',   country: 'Brazil',        tz: 'America/Sao_Paulo',   flag: '🇧🇷', region: 'americas', lat: -23.55, lon: -46.63 },
  { id: 'london',      name: 'London',      country: 'United Kingdom',tz: 'Europe/London',       flag: '🇬🇧', region: 'europe',   lat: 51.51,  lon: -0.13 },
  { id: 'paris',       name: 'Paris',       country: 'France',        tz: 'Europe/Paris',        flag: '🇫🇷', region: 'europe',   lat: 48.85,  lon: 2.35 },
  { id: 'berlin',      name: 'Berlin',      country: 'Germany',       tz: 'Europe/Berlin',       flag: '🇩🇪', region: 'europe',   lat: 52.52,  lon: 13.40 },
  { id: 'rome',        name: 'Rome',        country: 'Italy',         tz: 'Europe/Rome',         flag: '🇮🇹', region: 'europe',   lat: 41.90,  lon: 12.50 },
  { id: 'madrid',      name: 'Madrid',      country: 'Spain',         tz: 'Europe/Madrid',       flag: '🇪🇸', region: 'europe',   lat: 40.42,  lon: -3.70 },
  { id: 'moscow',      name: 'Moscow',      country: 'Russia',        tz: 'Europe/Moscow',       flag: '🇷🇺', region: 'europe',   lat: 55.75,  lon: 37.62 },
  { id: 'tokyo',       name: 'Tokyo',       country: 'Japan',         tz: 'Asia/Tokyo',          flag: '🇯🇵', region: 'asia',     lat: 35.69,  lon: 139.69 },
  { id: 'singapore',   name: 'Singapore',   country: 'Singapore',     tz: 'Asia/Singapore',      flag: '🇸🇬', region: 'asia',     lat: 1.35,   lon: 103.82 },
  { id: 'hong-kong',   name: 'Hong Kong',   country: 'China',         tz: 'Asia/Hong_Kong',      flag: '🇭🇰', region: 'asia',     lat: 22.32,  lon: 114.17 },
  { id: 'seoul',       name: 'Seoul',       country: 'South Korea',   tz: 'Asia/Seoul',          flag: '🇰🇷', region: 'asia',     lat: 37.57,  lon: 127.00 },
  { id: 'mumbai',      name: 'Mumbai',      country: 'India',         tz: 'Asia/Kolkata',        flag: '🇮🇳', region: 'asia',     lat: 19.08,  lon: 72.88 },
  { id: 'sydney',      name: 'Sydney',      country: 'Australia',     tz: 'Australia/Sydney',    flag: '🇦🇺', region: 'asia',     lat: -33.87, lon: 151.21 },
  { id: 'dubai',       name: 'Dubai',       country: 'UAE',           tz: 'Asia/Dubai',          flag: '🇦🇪', region: 'africa',   lat: 25.20,  lon: 55.27 },
  { id: 'istanbul',    name: 'Istanbul',    country: 'Turkey',        tz: 'Europe/Istanbul',     flag: '🇹🇷', region: 'africa',   lat: 41.01,  lon: 28.95 },
  { id: 'cairo',       name: 'Cairo',       country: 'Egypt',         tz: 'Africa/Cairo',        flag: '🇪🇬', region: 'africa',   lat: 30.06,  lon: 31.25 },
  { id: 'johannesburg',name: 'Johannesburg',country: 'South Africa',  tz: 'Africa/Johannesburg', flag: '🇿🇦', region: 'africa',   lat: -26.20, lon: 28.04 },
  // ── Cities 23 & 24 — shown on homepage ──
  { id: 'amsterdam',   name: 'Amsterdam',   country: 'Netherlands',   tz: 'Europe/Amsterdam',    flag: '🇳🇱', region: 'europe',   lat: 52.37,  lon: 4.90 },
  { id: 'bangkok',     name: 'Bangkok',     country: 'Thailand',      tz: 'Asia/Bangkok',        flag: '🇹🇭', region: 'asia',     lat: 13.75,  lon: 100.52 },
  // ── Search-only cities (not shown on homepage grid) ──
  { id: 'miami',          name: 'Miami',          country: 'USA',          tz: 'America/New_York',       flag: '🇺🇸', region: 'americas', lat: 25.77,  lon: -80.19,  searchOnly: true },
  { id: 'las-vegas',      name: 'Las Vegas',      country: 'USA',          tz: 'America/Los_Angeles',    flag: '🇺🇸', region: 'americas', lat: 36.17,  lon: -115.14, searchOnly: true },
  { id: 'seattle',        name: 'Seattle',        country: 'USA',          tz: 'America/Los_Angeles',    flag: '🇺🇸', region: 'americas', lat: 47.61,  lon: -122.33, searchOnly: true },
  { id: 'denver',         name: 'Denver',         country: 'USA',          tz: 'America/Denver',         flag: '🇺🇸', region: 'americas', lat: 39.74,  lon: -104.98, searchOnly: true },
  { id: 'houston',        name: 'Houston',        country: 'USA',          tz: 'America/Chicago',        flag: '🇺🇸', region: 'americas', lat: 29.76,  lon: -95.37,  searchOnly: true },
  { id: 'phoenix',        name: 'Phoenix',        country: 'USA',          tz: 'America/Phoenix',        flag: '🇺🇸', region: 'americas', lat: 33.45,  lon: -112.07, searchOnly: true },
  { id: 'atlanta',        name: 'Atlanta',        country: 'USA',          tz: 'America/New_York',       flag: '🇺🇸', region: 'americas', lat: 33.75,  lon: -84.39,  searchOnly: true },
  { id: 'boston',         name: 'Boston',         country: 'USA',          tz: 'America/New_York',       flag: '🇺🇸', region: 'americas', lat: 42.36,  lon: -71.06,  searchOnly: true },
  { id: 'philadelphia',   name: 'Philadelphia',   country: 'USA',          tz: 'America/New_York',       flag: '🇺🇸', region: 'americas', lat: 39.95,  lon: -75.16,  searchOnly: true },
  { id: 'washington-dc',  name: 'Washington DC',  country: 'USA',          tz: 'America/New_York',       flag: '🇺🇸', region: 'americas', lat: 38.91,  lon: -77.04,  searchOnly: true },
  { id: 'san-francisco',  name: 'San Francisco',  country: 'USA',          tz: 'America/Los_Angeles',    flag: '🇺🇸', region: 'americas', lat: 37.77,  lon: -122.42, searchOnly: true },
  { id: 'dallas',         name: 'Dallas',         country: 'USA',          tz: 'America/Chicago',        flag: '🇺🇸', region: 'americas', lat: 32.78,  lon: -96.80,  searchOnly: true },
  { id: 'minneapolis',    name: 'Minneapolis',    country: 'USA',          tz: 'America/Chicago',        flag: '🇺🇸', region: 'americas', lat: 44.98,  lon: -93.27,  searchOnly: true },
  { id: 'detroit',        name: 'Detroit',        country: 'USA',          tz: 'America/Detroit',        flag: '🇺🇸', region: 'americas', lat: 42.33,  lon: -83.05,  searchOnly: true },
  { id: 'portland',       name: 'Portland',       country: 'USA',          tz: 'America/Los_Angeles',    flag: '🇺🇸', region: 'americas', lat: 45.52,  lon: -122.68, searchOnly: true },
  { id: 'san-diego',      name: 'San Diego',      country: 'USA',          tz: 'America/Los_Angeles',    flag: '🇺🇸', region: 'americas', lat: 32.72,  lon: -117.16, searchOnly: true },
  { id: 'honolulu',       name: 'Honolulu',       country: 'USA',          tz: 'Pacific/Honolulu',       flag: '🇺🇸', region: 'americas', lat: 21.31,  lon: -157.86, searchOnly: true },
  { id: 'anchorage',      name: 'Anchorage',      country: 'USA',          tz: 'America/Anchorage',      flag: '🇺🇸', region: 'americas', lat: 61.22,  lon: -149.90, searchOnly: true },
  { id: 'montreal',       name: 'Montreal',       country: 'Canada',       tz: 'America/Toronto',        flag: '🇨🇦', region: 'americas', lat: 45.50,  lon: -73.57,  searchOnly: true },
  { id: 'vancouver',      name: 'Vancouver',      country: 'Canada',       tz: 'America/Vancouver',      flag: '🇨🇦', region: 'americas', lat: 49.25,  lon: -123.12, searchOnly: true },
  { id: 'calgary',        name: 'Calgary',        country: 'Canada',       tz: 'America/Edmonton',       flag: '🇨🇦', region: 'americas', lat: 51.05,  lon: -114.07, searchOnly: true },
  { id: 'buenos-aires',   name: 'Buenos Aires',   country: 'Argentina',    tz: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', region: 'americas', lat: -34.60, lon: -58.38, searchOnly: true },
  { id: 'santiago',       name: 'Santiago',       country: 'Chile',        tz: 'America/Santiago',       flag: '🇨🇱', region: 'americas', lat: -33.45, lon: -70.67,  searchOnly: true },
  { id: 'lima',           name: 'Lima',           country: 'Peru',         tz: 'America/Lima',           flag: '🇵🇪', region: 'americas', lat: -12.05, lon: -77.04,  searchOnly: true },
  { id: 'bogota',         name: 'Bogotá',         country: 'Colombia',     tz: 'America/Bogota',         flag: '🇨🇴', region: 'americas', lat: 4.71,   lon: -74.07,  searchOnly: true },
  { id: 'caracas',        name: 'Caracas',        country: 'Venezuela',    tz: 'America/Caracas',        flag: '🇻🇪', region: 'americas', lat: 10.48,  lon: -66.88,  searchOnly: true },
  { id: 'panama-city',    name: 'Panama City',    country: 'Panama',       tz: 'America/Panama',         flag: '🇵🇦', region: 'americas', lat: 8.99,   lon: -79.52,  searchOnly: true },
  { id: 'havana',         name: 'Havana',         country: 'Cuba',         tz: 'America/Havana',         flag: '🇨🇺', region: 'americas', lat: 23.13,  lon: -82.38,  searchOnly: true },
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
  { id: 'nairobi',        name: 'Nairobi',        country: 'Kenya',        tz: 'Africa/Nairobi',         flag: '🇰🇪', region: 'africa',   lat: -1.29,  lon: 36.82,   searchOnly: true },
  { id: 'lagos',          name: 'Lagos',          country: 'Nigeria',      tz: 'Africa/Lagos',           flag: '🇳🇬', region: 'africa',   lat: 6.52,   lon: 3.38,    searchOnly: true },
  { id: 'accra',          name: 'Accra',          country: 'Ghana',        tz: 'Africa/Accra',           flag: '🇬🇭', region: 'africa',   lat: 5.56,   lon: -0.20,   searchOnly: true },
  { id: 'casablanca',     name: 'Casablanca',     country: 'Morocco',      tz: 'Africa/Casablanca',      flag: '🇲🇦', region: 'africa',   lat: 33.59,  lon: -7.62,   searchOnly: true },
  { id: 'tunis',          name: 'Tunis',          country: 'Tunisia',      tz: 'Africa/Tunis',           flag: '🇹🇳', region: 'africa',   lat: 36.82,  lon: 10.17,   searchOnly: true },
  { id: 'algiers',        name: 'Algiers',        country: 'Algeria',      tz: 'Africa/Algiers',         flag: '🇩🇿', region: 'africa',   lat: 36.74,  lon: 3.06,    searchOnly: true },
  { id: 'addis-ababa',    name: 'Addis Ababa',    country: 'Ethiopia',     tz: 'Africa/Addis_Ababa',     flag: '🇪🇹', region: 'africa',   lat: 9.02,   lon: 38.75,   searchOnly: true },
  { id: 'dar-es-salaam',  name: 'Dar es Salaam',  country: 'Tanzania',     tz: 'Africa/Dar_es_Salaam',   flag: '🇹🇿', region: 'africa',   lat: -6.79,  lon: 39.21,   searchOnly: true },
  { id: 'cape-town',      name: 'Cape Town',      country: 'South Africa', tz: 'Africa/Johannesburg',    flag: '🇿🇦', region: 'africa',   lat: -33.93, lon: 18.42,   searchOnly: true },
  { id: 'melbourne',      name: 'Melbourne',      country: 'Australia',    tz: 'Australia/Melbourne',    flag: '🇦🇺', region: 'asia',     lat: -37.81, lon: 144.96,  searchOnly: true },
  { id: 'brisbane',       name: 'Brisbane',       country: 'Australia',    tz: 'Australia/Brisbane',     flag: '🇦🇺', region: 'asia',     lat: -27.47, lon: 153.02,  searchOnly: true },
  { id: 'perth',          name: 'Perth',          country: 'Australia',    tz: 'Australia/Perth',        flag: '🇦🇺', region: 'asia',     lat: -31.95, lon: 115.86,  searchOnly: true },
  { id: 'auckland',       name: 'Auckland',       country: 'New Zealand',  tz: 'Pacific/Auckland',       flag: '🇳🇿', region: 'asia',     lat: -36.87, lon: 174.77,  searchOnly: true },
  { id: 'wellington',     name: 'Wellington',     country: 'New Zealand',  tz: 'Pacific/Auckland',       flag: '🇳🇿', region: 'asia',     lat: -41.29, lon: 174.78,  searchOnly: true },
  { id: 'almaty',         name: 'Almaty',         country: 'Kazakhstan',   tz: 'Asia/Almaty',            flag: '🇰🇿', region: 'asia',     lat: 43.26,  lon: 76.95,   searchOnly: true },
  { id: 'tashkent',       name: 'Tashkent',       country: 'Uzbekistan',   tz: 'Asia/Tashkent',          flag: '🇺🇿', region: 'asia',     lat: 41.30,  lon: 69.24,   searchOnly: true },
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
      const matchesText = c.name.toLowerCase().includes(filter.toLowerCase()) ||
                          c.country.toLowerCase().includes(filter.toLowerCase());
      const matchesRegion = region === 'all' || c.region === region;
      return matchesText && matchesRegion;
    });

    grid.innerHTML = filtered.map(city => `
      <a href="time.html?city=${city.id}" class="city-card" data-id="${city.id}" data-region="${city.region}">
        <div class="city-name">${city.flag} ${city.name}</div>
        <div class="city-time" id="mini-${city.id}">--:--:--</div>
        <div class="city-tz">${city.country} · ${city.tz}</div>
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

// Search button handler
function setupSearch() {
  const btn = document.getElementById('search-btn');
  const input = document.getElementById('city-search');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const val = input.value.trim().toLowerCase();
    const match = CITIES.find(c =>
      c.name.toLowerCase().includes(val) ||
      c.id.includes(val.replace(/\s+/g, '-'))
    );
    if (match) {
      window.location.href = `time.html?city=${match.id}`;
    } else {
      input.style.borderColor = '#ff4466';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}

// --- City page (time.html): render live clock ---
function renderCityPage() {
  const clockEl   = document.getElementById('live-clock');
  const dateEl    = document.getElementById('live-date');
  const titleEl   = document.getElementById('city-page-title');
  const labelEl   = document.getElementById('city-label');
  const offsetEl  = document.getElementById('utc-offset');
  const dstEl     = document.getElementById('dst-status');
  const tzNameEl  = document.getElementById('tz-name');
  const convsEl   = document.getElementById('conversions-body');

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
  if (labelEl) labelEl.textContent = `${city.country} · Current Local Time`;

  // Static TZ info
  const offset = getUTCOffset(city.tz);
  const dst    = isDST(city.tz);
  if (offsetEl) offsetEl.textContent = offset;
  if (dstEl)    dstEl.textContent = dst ? 'DST Active' : 'No DST';
  if (tzNameEl) tzNameEl.textContent = city.tz;
  const dstBadge = document.getElementById('dst-badge');
  if (dstBadge && dst) dstBadge.classList.add('dst-active');

  // Travel card heading
  const travelHeading = document.getElementById('travel-heading');
  if (travelHeading) travelHeading.textContent = `Explore ${city.name}`;

  // Conversions
  if (convsEl) {
    const others = CITIES.filter(c => c.id !== city.id).slice(0, 12);
    convsEl.innerHTML = others.map(c => `
      <div class="conv-row">
        <span class="conv-city">${c.flag} ${c.name}</span>
        <span class="conv-time" id="conv-${c.id}">--:--</span>
      </div>
    `).join('');
  }

  // Related cities (same region, different city)
  const relatedEl = document.getElementById('related-grid');
  if (relatedEl) {
    const related = CITIES.filter(c => c.region === city.region && c.id !== city.id).slice(0, 4);
    relatedEl.innerHTML = related.map(c => `
      <a href="time.html?city=${c.id}" class="related-card">
        <div class="r-name">${c.flag} ${c.name}</div>
        <div class="r-time" id="rel-${c.id}">--:--</div>
      </a>
    `).join('');
  }

  // Day/Night indicator
  function updateDayNight(now) {
    const hour = now.getHours();
    const card  = document.getElementById('daynight-card');
    const icon  = document.getElementById('daynight-icon');
    const label = document.getElementById('daynight-label');
    const sub   = document.getElementById('daynight-sub');
    if (!card) return;
    if (hour >= 6 && hour < 20) {
      icon.textContent  = '☀️';
      label.textContent = 'Daytime';
      sub.textContent   = `Business hours in ${city.name}`;
    } else if (hour >= 20 || hour < 1) {
      icon.textContent  = '🌆';
      label.textContent = 'Evening';
      sub.textContent   = `Evening hours in ${city.name}`;
    } else {
      icon.textContent  = '🌙';
      label.textContent = 'Nighttime';
      sub.textContent   = `Late night in ${city.name}`;
    }
  }

  // Live clock tick
  function tick() {
    const now = getTimeInZone(city.tz);
    if (clockEl) clockEl.textContent = formatTime(now);
    if (dateEl)  dateEl.textContent  = formatDate(now);
    updateDayNight(now);

    // Conversions
    CITIES.filter(c => c.id !== city.id).slice(0, 12).forEach(c => {
      const el = document.getElementById(`conv-${c.id}`);
      if (el) el.textContent = formatTime(getTimeInZone(c.tz), false);
    });

    // Related
    CITIES.filter(c => c.region === city.region && c.id !== city.id).slice(0, 4).forEach(c => {
      const el = document.getElementById(`rel-${c.id}`);
      if (el) el.textContent = formatTime(getTimeInZone(c.tz), false);
    });
  }

  tick();
  setInterval(tick, 1000);

  // Load weather
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
  // fallback
  'default':     'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80',
};

// --- Weather (Open-Meteo — free, no API key needed) ---
function weatherCodeToInfo(code) {
  if (code === 0)  return { label: 'Clear Sky',     icon: '☀️' };
  if (code <= 2)   return { label: 'Partly Cloudy', icon: '🌤️' };
  if (code === 3)  return { label: 'Overcast',      icon: '☁️' };
  if (code <= 48)  return { label: 'Foggy',         icon: '🌫️' };
  if (code <= 55)  return { label: 'Drizzle',       icon: '🌦️' };
  if (code <= 65)  return { label: 'Rain',           icon: '🌧️' };
  if (code <= 75)  return { label: 'Snow',           icon: '❄️' };
  if (code <= 82)  return { label: 'Rain Showers',  icon: '🌧️' };
  if (code <= 86)  return { label: 'Snow Showers',  icon: '🌨️' };
  if (code <= 99)  return { label: 'Thunderstorm',  icon: '⛈️' };
  return                   { label: 'Unknown',       icon: '🌡️' };
}

async function loadWeather(city) {
  const el = document.getElementById('weather-card');
  if (!el || !city.lat) return;
  el.innerHTML = `<div class="weather-icon">⏳</div><div class="weather-info"><div class="weather-label">Loading weather…</div></div>`;
  try {
    const url  = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;
    const res  = await fetch(url);
    const data = await res.json();
    const cur  = data.current;
    const info = weatherCodeToInfo(cur.weather_code);
    const tempF   = Math.round(cur.temperature_2m);
    const tempC   = Math.round((tempF - 32) * 5 / 9);
    const feelsF  = Math.round(cur.apparent_temperature);
    const feelsC  = Math.round((feelsF - 32) * 5 / 9);
    const wind    = Math.round(cur.wind_speed_10m);
    const humid   = cur.relative_humidity_2m;
    el.innerHTML = `
      <div class="weather-icon">${info.icon}</div>
      <div class="weather-info">
        <div class="weather-label">${info.label}</div>
        <div class="weather-temp">${tempF}°F <span class="weather-c">/ ${tempC}°C</span></div>
        <div class="weather-extra">
          <span>🌡️ Feels like ${feelsF}°F / ${feelsC}°C</span>
          <span>💧 Humidity ${humid}%</span>
          <span>💨 Wind ${wind} mph</span>
        </div>
      </div>
    `;
  } catch(e) {
    el.innerHTML = `<div class="weather-icon">🌡️</div><div class="weather-info"><div class="weather-label">Weather unavailable</div></div>`;
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
        const key = e.name.toLowerCase().trim();
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
  const titleEl  = document.getElementById('discover-title');
  const subEl    = document.getElementById('discover-sub');
  const viatorEl = document.getElementById('viator-city-name');
  const viatorBtn = document.getElementById('viator-btn');

  if (titleEl) titleEl.textContent = `Discover ${city.name}`;
  if (subEl)   subEl.textContent   = `Things to do, places to eat, and upcoming events in ${city.name}`;
  if (viatorEl) viatorEl.textContent = `Experiences in ${city.name}`;

  // ── Wire Viator affiliate link with city search ──
  const viatorUrl = `https://www.viator.com/search/${encodeURIComponent(city.name)}?pid=${VIATOR_PID}&mcid=${VIATOR_MCID}&medium=link&medium_version=selector`;
  if (viatorBtn) {
    viatorBtn.href = viatorUrl;
    viatorBtn.textContent = `Browse Experiences in ${city.name} →`;
  }

  // Update Viator placeholder content
  const viatorWrap = document.getElementById('viator-widget');
  if (viatorWrap) {
    viatorWrap.innerHTML = `
      <div class="widget-placeholder">
        <p class="widget-placeholder-icon">🎟️</p>
        <p class="widget-placeholder-title" id="viator-city-name">Experiences in ${city.name}</p>
        <p class="widget-placeholder-sub">Browse top-rated tours, activities and experiences. Every booking earns affiliate commission.</p>
        <a href="${viatorUrl}" target="_blank" rel="noopener" class="btn" style="display:inline-block; margin-top:16px; padding: 12px 28px; background: linear-gradient(135deg,#c8860a,#f0a830); color:#050810; font-weight:700; border-radius:50px; text-decoration:none; font-size:0.85rem; letter-spacing:0.05em;">
          Browse Experiences in ${city.name} →
        </a>
      </div>`;
  }

  // ── Load real Ticketmaster events ──
  const tmEl = document.getElementById('ticketmaster-body');
  if (tmEl) tmEl.innerHTML = `<div class="discover-loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>`;
  const tmEvents = await loadTicketmasterEvents(city);
  renderEventItems(
    tmEvents.length ? tmEvents : [{name:`Live events in ${city.name}`,date:'See all dates',venue:city.name,url:`https://www.ticketmaster.com/search?q=${encodeURIComponent(city.name)}`}],
    'ticketmaster-body',
    `https://www.ticketmaster.com/search?q=${encodeURIComponent(city.name)}`
  );

  // ── Eventbrite — show branded city card (CORS blocks direct API) ──
  const ebEl = document.getElementById('eventbrite-body');
  if (ebEl) {
    const ebCitySlug = encodeURIComponent(city.name);
    ebEl.innerHTML = `
      <a href="https://www.eventbrite.com/d/${encodeURIComponent(city.name)}/events/" target="_blank" rel="noopener" class="event-item event-item-has-image">
        <div class="event-item-img" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); display:flex; align-items:center; justify-content:center; flex-direction:column; gap:12px;">
          <div style="font-size:2.5rem;">📅</div>
          <div style="font-family:'Playfair Display',serif; font-size:1.1rem; color:#fff; font-weight:700; text-align:center; padding:0 20px;">Local Events in ${city.name}</div>
          <div style="font-size:0.75rem; color:rgba(255,255,255,0.6); text-align:center; padding:0 20px;">Festivals, meetups, markets &amp; more</div>
        </div>
        <div class="event-item-content">
          <div class="event-item-name">Browse All Local Events →</div>
          <div class="event-item-meta">
            <span class="event-item-date">📍 ${city.name}, ${city.country}</span>
            <span class="event-item-genre" style="background:rgba(255,105,65,0.15); border-color:rgba(255,105,65,0.3); color:#ff6941;">Eventbrite</span>
          </div>
        </div>
      </a>
      <a href="https://www.eventbrite.com/d/${encodeURIComponent(city.name)}/food-and-drink--events/" target="_blank" rel="noopener" class="event-item event-item-has-image">
        <div class="event-item-img" style="background: linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #6b2f00 100%); display:flex; align-items:center; justify-content:center; flex-direction:column; gap:12px;">
          <div style="font-size:2.5rem;">🍽️</div>
          <div style="font-family:'Playfair Display',serif; font-size:1.1rem; color:#fff; font-weight:700; text-align:center; padding:0 20px;">Food &amp; Drink Events</div>
          <div style="font-size:0.75rem; color:rgba(255,255,255,0.6); text-align:center; padding:0 20px;">Tastings, markets &amp; culinary experiences</div>
        </div>
        <div class="event-item-content">
          <div class="event-item-name">Browse Food Events in ${city.name} →</div>
          <div class="event-item-meta">
            <span class="event-item-date">📍 ${city.name}</span>
            <span class="event-item-genre" style="background:rgba(255,105,65,0.15); border-color:rgba(255,105,65,0.3); color:#ff6941;">Eventbrite</span>
          </div>
        </div>
      </a>
      <a href="https://www.eventbrite.com/d/${encodeURIComponent(city.name)}/music--events/" target="_blank" rel="noopener" class="event-item event-item-has-image">
        <div class="event-item-img" style="background: linear-gradient(135deg, #0a001a 0%, #1a0a3d 50%, #2f006b 100%); display:flex; align-items:center; justify-content:center; flex-direction:column; gap:12px;">
          <div style="font-size:2.5rem;">🎵</div>
          <div style="font-family:'Playfair Display',serif; font-size:1.1rem; color:#fff; font-weight:700; text-align:center; padding:0 20px;">Music Events</div>
          <div style="font-size:0.75rem; color:rgba(255,255,255,0.6); text-align:center; padding:0 20px;">Live music, concerts &amp; performances</div>
        </div>
        <div class="event-item-content">
          <div class="event-item-name">Browse Music Events in ${city.name} →</div>
          <div class="event-item-meta">
            <span class="event-item-date">📍 ${city.name}</span>
            <span class="event-item-genre" style="background:rgba(255,105,65,0.15); border-color:rgba(255,105,65,0.3); color:#ff6941;">Eventbrite</span>
          </div>
        </div>
      </a>
    `;
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
