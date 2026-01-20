export const API_URL = import.meta.env.PROD
    ? 'https://api.astropravin.com'
    : (import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5002`);
