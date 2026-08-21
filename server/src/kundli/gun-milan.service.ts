/**
 * gun-milan.service.ts
 * Pure-math Ashta Koota 36-Guna Milan calculator.
 * No AI, no external APIs, no cost — just Vedic astrology rules.
 *
 * Based on traditional Ashta Koota system:
 * 1. Varna    (0–1)
 * 2. Vashya   (0–2)
 * 3. Tara     (0–3)
 * 4. Yoni     (0–4)
 * 5. Graha Maitri (0–5)
 * 6. Gana     (0–6)
 * 7. Bhakoot  (0–7)
 * 8. Nadi     (0–8)
 *            ─────
 * Total       0–36
 */

import { Injectable } from '@nestjs/common';

// ─── Nakshatra data tables ───────────────────────────────────────────────────

const NAKSHATRA_INDEX: Record<string, number> = {
    'Ashwini': 0, 'Bharani': 1, 'Krittika': 2, 'Rohini': 3,
    'Mrigashira': 4, 'Mrigashirsha': 4, 'Ardra': 5, 'Punarvasu': 6,
    'Pushya': 7, 'Ashlesha': 8, 'Magha': 9, 'Purva Phalguni': 10,
    'Uttara Phalguni': 11, 'Hasta': 12, 'Chitra': 13, 'Swati': 14,
    'Vishakha': 15, 'Anuradha': 16, 'Jyeshtha': 17, 'Mula': 18,
    'Purva Ashadha': 19, 'Purva Ashada': 19,
    'Uttara Ashadha': 20, 'Uttara Ashada': 20, 'Shravana': 21,
    'Dhanishta': 22, 'Dhanista': 22, 'Shatabhisha': 23,
    'Purva Bhadrapada': 24, 'Uttara Bhadrapada': 25, 'Revati': 26,
};

const NAKSHATRA_NADI: Record<number, string> = {
    0: 'Vata', 1: 'Pitta', 2: 'Kapha', 3: 'Kapha', 4: 'Pitta', 5: 'Vata',
    6: 'Vata', 7: 'Pitta', 8: 'Kapha', 9: 'Kapha', 10: 'Pitta', 11: 'Vata',
    12: 'Vata', 13: 'Pitta', 14: 'Kapha', 15: 'Kapha', 16: 'Pitta', 17: 'Vata',
    18: 'Vata', 19: 'Pitta', 20: 'Kapha', 21: 'Kapha', 22: 'Pitta', 23: 'Vata',
    24: 'Vata', 25: 'Pitta', 26: 'Kapha',
};

const NAKSHATRA_GANA: Record<number, string> = {
    0: 'Deva', 1: 'Manusha', 2: 'Rakshasa', 3: 'Rakshasa', 4: 'Deva', 5: 'Rakshasa',
    6: 'Deva', 7: 'Deva', 8: 'Rakshasa', 9: 'Rakshasa', 10: 'Rakshasa', 11: 'Manusha',
    12: 'Deva', 13: 'Rakshasa', 14: 'Deva', 15: 'Rakshasa', 16: 'Deva', 17: 'Rakshasa',
    18: 'Rakshasa', 19: 'Rakshasa', 20: 'Deva', 21: 'Deva', 22: 'Rakshasa', 23: 'Rakshasa',
    24: 'Rakshasa', 25: 'Deva', 26: 'Deva',
};

const NAKSHATRA_YONI: Record<number, string> = {
    0: 'Horse', 1: 'Elephant', 2: 'Goat', 3: 'Serpent', 4: 'Serpent',
    5: 'Dog', 6: 'Cat', 7: 'Sheep', 8: 'Cat', 9: 'Rat', 10: 'Rat',
    11: 'Cow', 12: 'Buffalo', 13: 'Tiger', 14: 'Buffalo', 15: 'Tiger',
    16: 'Deer', 17: 'Deer', 18: 'Dog', 19: 'Monkey', 20: 'Mongoose',
    21: 'Monkey', 22: 'Lion', 23: 'Horse', 24: 'Lion', 25: 'Cow', 26: 'Elephant',
};

// Friendly yoni pairs score higher
const YONI_COMPAT_MATRIX: Record<string, Record<string, number>> = {
    Horse:    { Horse: 4, Elephant: 1, Goat: 2, Serpent: 1, Dog: 0, Cat: 1, Sheep: 2, Rat: 1, Cow: 2, Buffalo: 1, Tiger: 0, Deer: 2, Monkey: 2, Mongoose: 2, Lion: 0 },
    Elephant: { Elephant: 4, Horse: 1, Goat: 2, Serpent: 1, Dog: 0, Cat: 1, Sheep: 2, Rat: 1, Cow: 3, Buffalo: 2, Tiger: 0, Deer: 2, Monkey: 2, Mongoose: 1, Lion: 0 },
    Goat:     { Goat: 4, Horse: 2, Elephant: 2, Serpent: 1, Dog: 0, Cat: 2, Sheep: 3, Rat: 2, Cow: 3, Buffalo: 2, Tiger: 0, Deer: 3, Monkey: 2, Mongoose: 2, Lion: 0 },
    Serpent:  { Serpent: 4, Horse: 1, Elephant: 1, Goat: 1, Dog: 0, Cat: 1, Sheep: 1, Rat: 1, Cow: 1, Buffalo: 1, Tiger: 0, Deer: 1, Monkey: 1, Mongoose: 0, Lion: 0 },
    Dog:      { Dog: 4, Horse: 0, Elephant: 0, Goat: 0, Serpent: 0, Cat: 1, Sheep: 2, Rat: 1, Cow: 0, Buffalo: 0, Tiger: 0, Deer: 1, Monkey: 3, Mongoose: 1, Lion: 1 },
    Cat:      { Cat: 4, Horse: 1, Elephant: 1, Goat: 2, Serpent: 1, Dog: 1, Sheep: 3, Rat: 0, Cow: 2, Buffalo: 1, Tiger: 0, Deer: 2, Monkey: 3, Mongoose: 2, Lion: 0 },
    Sheep:    { Sheep: 4, Horse: 2, Elephant: 2, Goat: 3, Serpent: 1, Dog: 2, Cat: 3, Rat: 1, Cow: 3, Buffalo: 3, Tiger: 0, Deer: 3, Monkey: 2, Mongoose: 2, Lion: 0 },
    Rat:      { Rat: 4, Horse: 1, Elephant: 1, Goat: 2, Serpent: 1, Dog: 1, Cat: 0, Sheep: 1, Cow: 2, Buffalo: 1, Tiger: 0, Deer: 2, Monkey: 1, Mongoose: 1, Lion: 0 },
    Cow:      { Cow: 4, Horse: 2, Elephant: 3, Goat: 3, Serpent: 1, Dog: 0, Cat: 2, Sheep: 3, Rat: 2, Buffalo: 3, Tiger: 0, Deer: 3, Monkey: 2, Mongoose: 2, Lion: 0 },
    Buffalo:  { Buffalo: 4, Horse: 1, Elephant: 2, Goat: 2, Serpent: 1, Dog: 0, Cat: 1, Sheep: 3, Rat: 1, Cow: 3, Tiger: 0, Deer: 2, Monkey: 2, Mongoose: 1, Lion: 0 },
    Tiger:    { Tiger: 4, Horse: 0, Elephant: 0, Goat: 0, Serpent: 0, Dog: 0, Cat: 0, Sheep: 0, Rat: 0, Cow: 0, Buffalo: 0, Deer: 0, Monkey: 0, Mongoose: 0, Lion: 2 },
    Deer:     { Deer: 4, Horse: 2, Elephant: 2, Goat: 3, Serpent: 1, Dog: 1, Cat: 2, Sheep: 3, Rat: 2, Cow: 3, Buffalo: 2, Tiger: 0, Monkey: 2, Mongoose: 2, Lion: 0 },
    Monkey:   { Monkey: 4, Horse: 2, Elephant: 2, Goat: 2, Serpent: 1, Dog: 3, Cat: 3, Sheep: 2, Rat: 1, Cow: 2, Buffalo: 2, Tiger: 0, Deer: 2, Mongoose: 1, Lion: 0 },
    Mongoose: { Mongoose: 4, Horse: 2, Elephant: 1, Goat: 2, Serpent: 0, Dog: 1, Cat: 2, Sheep: 2, Rat: 1, Cow: 2, Buffalo: 1, Tiger: 0, Deer: 2, Monkey: 1, Lion: 0 },
    Lion:     { Lion: 4, Horse: 0, Elephant: 0, Goat: 0, Serpent: 0, Dog: 1, Cat: 0, Sheep: 0, Rat: 0, Cow: 0, Buffalo: 0, Tiger: 2, Deer: 0, Monkey: 0, Mongoose: 0 },
};

// Rashi data
const RASHI_INDEX: Record<string, number> = {
    'Aries': 0, 'Mesh': 0, 'Taurus': 1, 'Vrishabha': 1, 'Gemini': 2, 'Mithuna': 2,
    'Cancer': 3, 'Karka': 3, 'Leo': 4, 'Simha': 4, 'Virgo': 5, 'Kanya': 5,
    'Libra': 6, 'Tula': 6, 'Scorpio': 7, 'Vrishchika': 7, 'Sagittarius': 8, 'Dhanu': 8,
    'Capricorn': 9, 'Makar': 9, 'Aquarius': 10, 'Kumbha': 10, 'Pisces': 11, 'Meena': 11,
};

const RASHI_LORD: string[] = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
    'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter',
];

const PLANET_FRIENDS: Record<string, string[]> = {
    Sun:     ['Moon', 'Mars', 'Jupiter'],
    Moon:    ['Sun', 'Mercury'],
    Mars:    ['Sun', 'Moon', 'Jupiter'],
    Mercury: ['Sun', 'Venus'],
    Jupiter: ['Sun', 'Moon', 'Mars'],
    Venus:   ['Mercury', 'Saturn'],
    Saturn:  ['Mercury', 'Venus'],
    Rahu:    ['Venus', 'Saturn', 'Mercury'],
    Ketu:    ['Mars', 'Venus', 'Saturn'],
};

const PLANET_ENEMIES: Record<string, string[]> = {
    Sun:     ['Venus', 'Saturn'],
    Moon:    ['Rahu', 'Ketu'],
    Mars:    ['Mercury'],
    Mercury: ['Moon'],
    Jupiter: ['Mercury', 'Venus'],
    Venus:   ['Sun', 'Moon'],
    Saturn:  ['Sun', 'Moon', 'Mars'],
    Rahu:    ['Sun', 'Moon', 'Mars'],
    Ketu:    ['Sun', 'Moon', 'Mercury'],
};

// Vedha pairs — mutual blocking nakshatras
const VEDHA_PAIRS: [number, number][] = [
    [0, 17], [1, 16], [2, 15], [3, 14], [4, 13], [5, 12], [6, 11],
    [7, 10], [8, 9], [18, 26], [19, 25], [20, 24], [21, 23],
];

// Bhakoot — rashi distance compatibility
const BHAKOOT_SCORES: Record<string, number> = {
    '1/7': 0, '7/1': 0,
    '6/8': 0, '8/6': 0,
    '5/9': 0, '9/5': 0,
    '2/12': 0, '12/2': 0,
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface KundliInput {
    rashi?: string | null;
    nakshatra?: string | null;
    nadi?: string | null;
    planetaryPositions?: Record<string, string>;
}

export interface AshtaKootaBreakdown {
    varna: number;     // max 1
    vashya: number;    // max 2
    tara: number;      // max 3
    yoni: number;      // max 4
    grahaMaitri: number; // max 5
    gana: number;      // max 6
    bhakoot: number;   // max 7
    nadi: number;      // max 8
}

export interface GunMilanResult {
    totalScore: number;
    maxScore: number;
    percentage: number;
    breakdown: AshtaKootaBreakdown;
    compatibility: 'poor' | 'average' | 'good' | 'excellent';
    verdict: string;
    remedies: string[];
    auspicious: boolean;
    dosha: string[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class GunMilanService {

    calculate(kundli1: KundliInput, kundli2: KundliInput): GunMilanResult {
        const n1 = NAKSHATRA_INDEX[kundli1.nakshatra ?? ''] ?? null;
        const n2 = NAKSHATRA_INDEX[kundli2.nakshatra ?? ''] ?? null;
        const r1 = RASHI_INDEX[kundli1.rashi ?? ''] ?? null;
        const r2 = RASHI_INDEX[kundli2.rashi ?? ''] ?? null;

        const breakdown: AshtaKootaBreakdown = {
            varna:       this.calcVarna(r1, r2),
            vashya:      this.calcVashya(r1, r2),
            tara:        this.calcTara(n1, n2),
            yoni:        this.calcYoni(n1, n2),
            grahaMaitri: this.calcGrahaMaitri(r1, r2, kundli1.planetaryPositions, kundli2.planetaryPositions),
            gana:        this.calcGana(n1, n2),
            bhakoot:     this.calcBhakoot(r1, r2),
            nadi:        this.calcNadi(n1, n2, kundli1.nadi, kundli2.nadi),
        };

        const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);
        const percentage = Math.round((totalScore / 36) * 100);
        const compatibility = this.getCompatibility(totalScore);
        const dosha = this.detectDosha(n1, n2, r1, r2, kundli1.nadi, kundli2.nadi);
        const remedies = this.getRemedies(totalScore, breakdown, dosha);

        return {
            totalScore,
            maxScore: 36,
            percentage,
            breakdown,
            compatibility,
            verdict: this.getVerdict(totalScore),
            remedies,
            auspicious: totalScore >= 24,
            dosha,
        };
    }

    // ─── Koota calculators ────────────────────────────────────────────────────

    /** Varna — social/spiritual order. Max 1 */
    private calcVarna(r1: number | null, r2: number | null): number {
        if (r1 === null || r2 === null) return 0;
        const varna = [3, 2, 3, 0, 1, 3, 2, 1, 2, 0, 3, 0]; // 0=Brahmin,1=Kshatriya,2=Vaishya,3=Shudra
        const v1 = varna[r1], v2 = varna[r2];
        return v1 >= v2 ? 1 : 0;
    }

    /** Vashya — dominance/control. Max 2 */
    private calcVashya(r1: number | null, r2: number | null): number {
        if (r1 === null || r2 === null) return 0;
        // Simplified vashya groups: quadruped, manava, jalchar, vanchar, keeta
        const group = [2, 0, 0, 2, 2, 0, 0, 3, 2, 0, 1, 4]; // 0=manava,1=jalchar,2=quadruped,3=vanchar,4=keeta
        const g1 = group[r1], g2 = group[r2];
        if (g1 === g2) return 2;
        const vashyaFriendly: Record<number, number[]> = {
            0: [1, 4], 1: [0, 2], 2: [0, 3], 3: [2, 1], 4: [0, 3],
        };
        if (vashyaFriendly[g1]?.includes(g2)) return 1;
        return 0;
    }

    /** Tara — birth star relationship. Max 3 */
    private calcTara(n1: number | null, n2: number | null): number {
        if (n1 === null || n2 === null) return 0;
        // Tara is calculated as (n2 - n1 + 27) % 9
        const tara1 = ((n2 - n1 + 27) % 27) % 9;
        const tara2 = ((n1 - n2 + 27) % 27) % 9;
        // Friendly taras: 1,3,5,7 are good; 2,4,6,9 are bad
        const goodTaras = new Set([1, 3, 5, 7]);
        const t1Good = goodTaras.has(tara1 === 0 ? 9 : tara1);
        const t2Good = goodTaras.has(tara2 === 0 ? 9 : tara2);
        if (t1Good && t2Good) return 3;
        if (t1Good || t2Good) return 1.5;
        return 0;
    }

    /** Yoni — animal instinct compatibility. Max 4 */
    private calcYoni(n1: number | null, n2: number | null): number {
        if (n1 === null || n2 === null) return 0;
        const y1 = NAKSHATRA_YONI[n1];
        const y2 = NAKSHATRA_YONI[n2];
        if (!y1 || !y2) return 0;
        return YONI_COMPAT_MATRIX[y1]?.[y2] ?? 0;
    }

    /** Graha Maitri — planetary friendship. Max 5 */
    private calcGrahaMaitri(
        r1: number | null, r2: number | null,
        pos1?: Record<string, string>,
        pos2?: Record<string, string>,
    ): number {
        if (r1 === null || r2 === null) return 0;

        const lord1 = RASHI_LORD[r1];
        const lord2 = RASHI_LORD[r2];

        const isFriend = (a: string, b: string): boolean => PLANET_FRIENDS[a]?.includes(b) ?? false;
        const isEnemy  = (a: string, b: string): boolean => PLANET_ENEMIES[a]?.includes(b) ?? false;

        if (lord1 === lord2) return 5;
        if (isFriend(lord1, lord2) && isFriend(lord2, lord1)) return 5;
        if (isFriend(lord1, lord2) || isFriend(lord2, lord1)) return 4;
        if (isEnemy(lord1, lord2) && isEnemy(lord2, lord1)) return 0;
        if (isEnemy(lord1, lord2) || isEnemy(lord2, lord1)) return 1;
        return 3; // neutral
    }

    /** Gana — temperament. Max 6 */
    private calcGana(n1: number | null, n2: number | null): number {
        if (n1 === null || n2 === null) return 0;
        const g1 = NAKSHATRA_GANA[n1];
        const g2 = NAKSHATRA_GANA[n2];
        if (!g1 || !g2) return 0;
        if (g1 === g2) return 6;
        if ((g1 === 'Deva' && g2 === 'Manusha') || (g1 === 'Manusha' && g2 === 'Deva')) return 3;
        if ((g1 === 'Manusha' && g2 === 'Rakshasa') || (g1 === 'Rakshasa' && g2 === 'Manusha')) return 1;
        return 0; // Deva+Rakshasa = incompatible
    }

    /** Bhakoot — rashi emotional compatibility. Max 7 */
    private calcBhakoot(r1: number | null, r2: number | null): number {
        if (r1 === null || r2 === null) return 0;
        const diff = Math.abs(r1 - r2);
        const adjustedDiff = Math.min(diff, 12 - diff);

        // Inauspicious rashi relationships
        const forward = ((r2 - r1 + 12) % 12) + 1; // 1-based position of r2 from r1
        const backward = ((r1 - r2 + 12) % 12) + 1;

        const inauspicious = new Set([2, 12, 5, 9, 6, 8]);
        if (inauspicious.has(forward) || inauspicious.has(backward)) return 0;
        if (r1 === r2) return 7;
        if (adjustedDiff <= 2) return 7;
        if (adjustedDiff <= 4) return 4;
        return 2;
    }

    /** Nadi — physiological/health compatibility. Max 8 */
    private calcNadi(
        n1: number | null, n2: number | null,
        nadi1?: string | null, nadi2?: string | null,
    ): number {
        // Try from nakshatra index first
        let nd1 = n1 !== null ? NAKSHATRA_NADI[n1] : nadi1;
        let nd2 = n2 !== null ? NAKSHATRA_NADI[n2] : nadi2;

        // Fall back to passed nadi strings
        if (!nd1 && nadi1) nd1 = nadi1;
        if (!nd2 && nadi2) nd2 = nadi2;

        if (!nd1 || !nd2) return 0;
        // Same nadi = Nadi Dosha = 0 points
        return nd1 === nd2 ? 0 : 8;
    }

    // ─── Dosha detection ─────────────────────────────────────────────────────

    private detectDosha(
        n1: number | null, n2: number | null,
        r1: number | null, r2: number | null,
        nadi1?: string | null, nadi2?: string | null,
    ): string[] {
        const dosha: string[] = [];

        // Nadi Dosha
        if (n1 !== null && n2 !== null) {
            if (NAKSHATRA_NADI[n1] === NAKSHATRA_NADI[n2]) dosha.push('Nadi Dosha');
        } else if (nadi1 && nadi2 && nadi1 === nadi2) {
            dosha.push('Nadi Dosha');
        }

        // Bhakoot Dosha (6-8, 9-5, 12-2 positions)
        if (r1 !== null && r2 !== null) {
            const fwd = ((r2 - r1 + 12) % 12) + 1;
            if ([6, 8, 9, 5, 2, 12].includes(fwd)) dosha.push('Bhakoot Dosha');
        }

        // Vedha Dosha
        if (n1 !== null && n2 !== null) {
            for (const [a, b] of VEDHA_PAIRS) {
                if ((n1 === a && n2 === b) || (n1 === b && n2 === a)) {
                    dosha.push('Vedha Dosha');
                    break;
                }
            }
        }

        return dosha;
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private getCompatibility(score: number): 'poor' | 'average' | 'good' | 'excellent' {
        if (score < 18) return 'poor';
        if (score < 24) return 'average';
        if (score < 30) return 'good';
        return 'excellent';
    }

    private getVerdict(score: number): string {
        if (score < 18) return 'Match not recommended. Consult a qualified astrologer for deeper analysis and remedies.';
        if (score < 24) return 'Average compatibility. Marriage can proceed with astrological guidance and remedies.';
        if (score < 30) return 'Good compatibility. A harmonious and auspicious match.';
        return 'Excellent compatibility! Highly auspicious match blessed by cosmic forces.';
    }

    private getRemedies(score: number, breakdown: AshtaKootaBreakdown, dosha: string[]): string[] {
        const remedies: string[] = [];

        if (dosha.includes('Nadi Dosha')) {
            remedies.push('Perform Nadi Dosha Nivaran Pooja before marriage.');
            remedies.push('Mahamrityunjaya mantra chanting (1,25,000 times) is advised.');
        }
        if (dosha.includes('Bhakoot Dosha')) {
            remedies.push('Chant Vishnu Sahasranama and perform Rudrabhishek for Bhakoot Dosha relief.');
        }
        if (dosha.includes('Vedha Dosha')) {
            remedies.push('Perform protective Navagraha shanti for Vedha Dosha.');
        }
        if (score < 18) {
            remedies.push('Consult Pandit Acharya Pravin for a detailed horoscope matching session.');
            remedies.push('Perform Mangal Dosha pooja if either partner is Manglik.');
        }
        if (breakdown.nadi === 0 && !dosha.includes('Nadi Dosha')) {
            remedies.push('Nadi compatibility could not be determined — manually verify Nadi from original Kundli.');
        }

        return remedies;
    }
}
