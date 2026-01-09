import moment from 'moment';

// Simplified calculation logic for Free Kundli
// In a real production app with high precision requirements, we would use a library like 'swisseph' or an external API.
// For this free tool, we will use simplified algorithms to determine Lagna and Moon Sign based on inputs.

const zodiacSigns = [
    'Aries (Mesh)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)', 'Cancer (Karka)',
    'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchika)',
    'Sagittarius (Dhanu)', 'Capricorn (Makar)', 'Aquarius (Kumbha)', 'Pisces (Meena)'
];

const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const calculateKundli = (dob, tob, place) => {
    // Parse Date and Time
    const date = moment(`${dob} ${tob}`, 'DD/MM/YYYY HH:mm');
    const hour = date.hour();
    const dayOfYear = date.dayOfYear();

    // 1. Calculate Lagna (Ascendant) - Simplified approximation
    // Ascendant changes roughly every 2 hours. 
    // We'll use a basic offset based on time of day + day of year (Sun's position).
    // Sun is in Aries approx mid-April (Day 105).

    // Sun's sign index (approx)
    let sunSignIndex = Math.floor((dayOfYear - 104) / 30.44);
    if (sunSignIndex < 0) sunSignIndex += 12;

    // Sunrise assumed approx 6 AM. Ascendant same as Sun at sunrise.
    // Increases by 1 sign every 2 hours.
    const hoursSinceSunrise = (hour - 6 + 24) % 24;
    const signsPassed = Math.floor(hoursSinceSunrise / 2);

    const lagnaIndex = (sunSignIndex + signsPassed) % 12;
    const lagna = zodiacSigns[lagnaIndex];

    // 2. Calculate Moon Sign - Random for demo/free version (since precise moon calc is complex without ephemeris)
    // In production: Integrate 'swisseph' or similar.
    // Currently using a consistent hash based on inputs so it's deterministic for the same person.
    const uniqueVal = (date.unix() + (place.length * 100)) % 12;
    const moonSign = zodiacSigns[uniqueVal];

    // 3. Nakshatra
    const nakshatraIndex = (uniqueVal * 2.25) % 27;
    const nakshatra = nakshatras[Math.floor(nakshatraIndex)];

    // 4. Mahadasha
    const dashas = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const currentDasha = dashas[Math.floor(date.unix() % 9)];

    // 5. Insights
    const personality = `Born under ${lagna}, you are likely ambitious and driven by purpose.`;
    const career = `With ${currentDasha} influence, fields related to communication or technology suit you well.`;
    const relationship = `Moon in ${moonSign} suggests you seek emotional depth and stability in partners.`;

    return {
        lagna,
        moonSign,
        nakshatra,
        currentDasha,
        personality,
        career,
        relationship
    };
};


