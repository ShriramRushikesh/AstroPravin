// Industrial-grade URL resolution: Env Var > Production Hardcode > Localhost
export const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://api.astropravin.com' : `http://${window.location.hostname}:5002`);
