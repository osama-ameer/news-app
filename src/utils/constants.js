// NEWS API
export const NEWS_API_API_KEY = process.env.REACT_APP_NEWS_API_API_KEY;

// GUARDIAN API
export const GUARDIAN_API_KEY = process.env.REACT_APP_GUARDIAN_API_KEY;

// NEW YORK TIMES API CRED
export const NY_TIMES_API_KEY = process.env.REACT_APP_NY_TIMES_API_KEY;

export const API_SOURCES = {
  NEWS_API: "NEWS_API",
  GUARDIAN_API: "GUARDIAN_API",
  NEW_YORK_TIME_API: "NEW_YORK_TIME_API",
};

export const sourcesOption = [
  { label: "News ", value: API_SOURCES.NEWS_API },
  { label: "Guardian ", value: API_SOURCES.GUARDIAN_API },
  { label: "New York Times ", value: API_SOURCES.NEW_YORK_TIME_API },
];
