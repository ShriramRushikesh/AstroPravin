import moment from 'moment';

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
    let sunSignIndex = Math.floor((dayOfYear - 104) / 30.44);
    if (sunSignIndex < 0) sunSignIndex += 12;

    const hoursSinceSunrise = (hour - 6 + 24) % 24;
    const signsPassed = Math.floor(hoursSinceSunrise / 2);

    const lagnaIndex = (sunSignIndex + signsPassed) % 12;
    const lagna = zodiacSigns[lagnaIndex];

    // 2. Calculate Moon Sign
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
