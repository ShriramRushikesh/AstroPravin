// Comprehensive Encyclopedic Navagraha Dataset
// Curated by Pandit Pravin Shriram (25+ Years Experience)
// Shriram Samupdeshan Kendra - Astro Pravin

export const planets = [
    {
        id: 'surya',
        name: 'Surya',
        englishName: 'Sun',
        sanskritTitle: 'Ravi / Bhaskara / Aditya',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/800px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg',
        color: 'from-orange-500 to-yellow-500',
        glow: 'shadow-[0_0_50px_rgba(234,179,8,0.5)]',
        element: 'Fire (Agni)',
        direction: 'East (Purva)',
        day: 'Sunday (Ravivaar)',
        metal: 'Gold / Copper',
        gemstone: 'Ruby (Manikya)',
        deity: 'Lord Surya Narayana / Lord Shiva',
        beejMantra: 'Om Hram Hreem Hroum Sah Suryaya Namah',
        gayatriMantra: 'Om Bhaskaraya Vidmahe Divakaraya Dheemahi Tanno Suryah Prachodayat',
        mantra: 'Om Hram Hreem Hroum Sah Suryaya Namah',
        exaltation: 'Aries (Mesha) at 10°',
        debilitation: 'Libra (Tula) at 10°',
        ownSigns: 'Leo (Simha)',
        friends: ['Moon (Chandra)', 'Mars (Mangal)', 'Jupiter (Guru)'],
        enemies: ['Venus (Shukra)', 'Saturn (Shani)', 'Rahu', 'Ketu'],
        neutrals: ['Mercury (Budh)'],
        description: 'The King of the Planetary Cabinet. In Vedic Astrology, Surya represents the pure soul (Atma), physical vitality, father, government authority, royal patronage, and social dignity. As the radiant center of our solar system, a well-placed Sun bestows unshakeable self-confidence, leadership charisma, and enduring fame.',
        mythology: 'Surya is the son of Sage Kashyapa and Aditi (hence named Aditya). Riding a golden chariot drawn by seven horses representing the seven colors of light and the seven days of the week, Surya illuminates both the physical cosmos and spiritual intellect.',
        controls: ['Soul (Atma)', 'Father (Pitra)', 'Vitality & Prana', 'Government Authority', 'Heart & Bones', 'Leadership & Fame', 'Self-Esteem'],
        positiveTraits: [
            'Magnetic leadership and administrative brilliance',
            'Strong physical constitution, sharp vision, and vibrant immunity',
            'Deep respect for parents, elders, and dharmic traditions',
            'Truthfulness, generosity, and commanding social presence'
        ],
        afflictedTraits: [
            'Arrogance, extreme ego conflicts, and tyrannical tendencies',
            'Strained relations with father or authority figures',
            'Prone to heart ailments, eye weaknesses, high fever, and baldness',
            'Frequent administrative hurdles, government penalties, or loss of reputation'
        ],
        careerProfessions: [
            'High-ranking government civil services (IAS/IPS)',
            'Politics, diplomacy, and executive administration',
            'Medicine, surgery, cardiology, and pharmacology',
            'Mining, gold metallurgy, and leadership enterprise'
        ],
        remedies: [
            'Offer water (Surya Arghya) mixed with red kumkum and flowers to the rising Sun every morning.',
            'Chant the Aditya Hridaya Stotram from Valmiki Ramayana daily for vitality and success.',
            'Wear a natural, unheated Ruby (Manikya) in gold or copper on the ring finger on Sunday morning.',
            'Fast on Sundays, consuming only salt-free meals after sunset.',
            'Donate copper vessels, wheat, jaggery, or red cloth to needy persons on Sundays.'
        ],
        do: [
            'Wake up before sunrise during Brahma Muhurta.',
            'Maintain reverence and service towards your father and elders.',
            'Practice Surya Namaskar yoga daily facing East.'
        ],
        dont: [
            'Disrespect your father, teachers, or government laws.',
            'Consume non-vegetarian food or alcohol on Sundays.',
            'Indulge in false pride, arrogance, or deceit.'
        ],
        faqs: [
            {
                q: "What does an exalted Sun in Aries indicate?",
                a: "An exalted Sun in Aries (1st house of the natural zodiac) gives supreme courage, trailblazing leadership, ironclad willpower, and early career authority."
            },
            {
                q: "How do I strengthen a debilitated Sun in Libra?",
                a: "Offer daily Surya Arghya in a copper vessel, chant the Gayatri Mantra 108 times at sunrise, and avoid wearing dark blues or black on Sundays."
            }
        ]
    },
    {
        id: 'chandra',
        name: 'Chandra',
        englishName: 'Moon',
        sanskritTitle: 'Soma / Indu / Shashi',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/800px-FullMoon2010.jpg',
        color: 'from-slate-200 to-white',
        glow: 'shadow-[0_0_50px_rgba(255,255,255,0.4)]',
        element: 'Water (Jala)',
        direction: 'Northwest (Vayavya)',
        day: 'Monday (Somavaar)',
        metal: 'Silver',
        gemstone: 'Natural Pearl (Mukta / Moti)',
        deity: 'Lord Shiva / Goddess Gauri',
        beejMantra: 'Om Shram Shreem Shroum Sah Chandraya Namah',
        gayatriMantra: 'Om Ksheeraputraya Vidmahe Amrita-Tatvaya Dheemahi Tanno Chandrah Prachodayat',
        mantra: 'Om Shram Shreem Shroum Sah Chandraya Namah',
        exaltation: 'Taurus (Vrishabha) at 3°',
        debilitation: 'Scorpio (Vrischika) at 3°',
        ownSigns: 'Cancer (Karka)',
        friends: ['Sun (Surya)', 'Mercury (Budh)'],
        enemies: ['None (Moon has no natural enemies)'],
        neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
        description: 'The Queen of the Cosmic Cabinet. Chandra rules the human subconscious mind (Manas), emotional rhythms, memory, maternal lineage, and body fluids. Because the Moon moves faster than any other celestial body (spending 2.25 days per zodiac sign), it mirrors the shifting emotional tides and intuitive sensitivities of human life.',
        mythology: 'Chandra was born from the cosmic ocean during the Samudra Manthan and resides upon the forehead of Lord Shiva (Chandrashekhara), representing mastery over turbulent emotions.',
        controls: ['Mind (Manas)', 'Mother (Matru)', 'Emotions & Intuition', 'Memory & Sleep', 'Liquids & Blood Lymph', 'Public Appeal', 'Peace of Mind'],
        positiveTraits: [
            'Profound emotional empathy, artistic imagination, and intuition',
            'Strong mental calm, pleasant magnetic personality, and popularity',
            'Loving, nurturing relationship with mother and domestic peace',
            'Deep restorative sleep and high psychological resilience'
        ],
        afflictedTraits: [
            'Severe anxiety, overthinking, chronic depression, and mood swings',
            'Strained relations with mother or childhood emotional neglect',
            'Prone to insomnia, respiratory congestion, and fluid imbalances',
            'Phobias, fear of water, and difficulty making firm decisions'
        ],
        careerProfessions: [
            'Psychology, psychiatric counseling, and emotional therapy',
            'Nursing, healthcare, pediatric medicine, and hospitality',
            'Poetry, creative writing, acting, fine arts, and music',
            'Dairy farming, marine shipping, and public relations'
        ],
        remedies: [
            'Perform Shiva Abhisheka with raw cow milk and pure water on Mondays.',
            'Wear a natural, unblemished Pearl (Moti) set in pure silver on the little finger on Monday evening.',
            'Drink water and milk from pure silver vessels to harmonize emotional frequencies.',
            'Chant the Shiva Panchakshara Stotram or Chandra Beej Mantra 108 times.',
            'Donate white rice, sugar, white sweets, milk, or silver coins to poor women on Mondays.'
        ],
        do: [
            'Respect and take daily blessings from your mother.',
            'Practice moon-gazing (Trataka on Full Moon night) and mindfulness meditation.',
            'Keep your living spaces clean, fresh, and properly ventilated.'
        ],
        dont: [
            'Hurt, disrespect, or ignore elderly women and mothers.',
            'Waste clean drinking water or leave leaky faucets unaddressed.',
            'Indulge in late-night brooding, negative self-talk, or dark isolation.'
        ],
        faqs: [
            {
                q: "What happens when Moon is in Scorpio (Debilitated)?",
                a: "Moon in Scorpio (Neecha) causes emotional turbulence, intense secrecy, and vulnerability to anxiety. This is effectively pacified through daily Shiva worship and wearing silver."
            },
            {
                q: "What is Kemadruma Yoga?",
                a: "Kemadruma Yoga occurs when there are no planets in the 2nd and 12th houses from the Moon. It indicates occasional feelings of loneliness, which can be overcome by worshipping Goddess Lakshmi and keeping a silver square in your pocket."
            }
        ]
    },
    {
        id: 'mangal',
        name: 'Mangal',
        englishName: 'Mars',
        sanskritTitle: 'Kuja / Bhauma / Angaraka',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/800px-OSIRIS_Mars_true_color.jpg',
        color: 'from-red-600 to-orange-600',
        glow: 'shadow-[0_0_50px_rgba(220,38,38,0.5)]',
        element: 'Fire (Agni / Earth)',
        direction: 'South (Dakshina)',
        day: 'Tuesday (Mangalvaar)',
        metal: 'Copper / Red Brass',
        gemstone: 'Red Coral (Moonga / Pravala)',
        deity: 'Lord Hanuman / Lord Kartikeya (Murugan)',
        beejMantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namah',
        gayatriMantra: 'Om Angarakaya Vidmahe Shaktihastaya Dheemahi Tanno Bhaumah Prachodayat',
        mantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namah',
        exaltation: 'Capricorn (Makara) at 28°',
        debilitation: 'Cancer (Karka) at 28°',
        ownSigns: 'Aries (Mesha) & Scorpio (Vrischika)',
        friends: ['Sun (Surya)', 'Moon (Chandra)', 'Jupiter (Guru)'],
        enemies: ['Mercury (Budh)'],
        neutrals: ['Venus (Shukra)', 'Saturn (Shani)'],
        description: 'The Commander-in-Chief of the Cosmic Cabinet. Mangal governs raw physical energy, courage (Parakrama), muscular stamina, brothers, real estate, surgical precision, and executive action. A well-placed Mars gives the fearlessness to conquer adversity, protect the vulnerable, and achieve ambitious goals.',
        mythology: 'Mangal is considered Bhauma (son of the Earth Goddess Bhumi). In mythology, Mars is also embodied by Lord Kartikeya (Skanda), the commander of the divine army who defeated the demon Tarakasura.',
        controls: ['Courage (Parakrama)', 'Physical Stamina & Blood', 'Younger Brothers', 'Real Estate & Land', 'Executive Drive', 'Surgical Skills', 'Defense & Police'],
        positiveTraits: [
            'Unshakeable bravery, athleticism, and high physical stamina',
            'Strong protective instincts for family, siblings, and community',
            'Exceptional leadership under pressure and quick tactical decisions',
            'Success in property development, real estate, and mechanical engineering'
        ],
        afflictedTraits: [
            'Impulsive anger, violent arguments, and destructive impatience',
            'Chronic disputes with siblings or litigation over landed property',
            'Prone to accidental injuries, cuts, burns, blood disorders, and surgeries',
            'Manglik Dosha complications in marital partnerships if unanalyzed'
        ],
        careerProfessions: [
            'Military defense forces, police, security, and intelligence',
            'Surgeons, dentists, sports athletes, and fitness trainers',
            'Civil construction, real estate development, and mining',
            'Mechanical, aerospace, and electrical engineering'
        ],
        remedies: [
            'Recite the Hanuman Chalisa, Sundarkand, or Bajrang Baan every Tuesday.',
            'Wear a natural, triangular Red Coral (Italian Moonga) set in copper/gold on the ring finger on Tuesday morning.',
            'Donate red lentils (Masoor Dal), jaggery, red sweets, or copper utensils on Tuesdays.',
            'Plant a Neem tree or pomegranate tree and nurture it with water.',
            'Fast on Tuesdays with a single salt-free meal prepared with wheat and jaggery.'
        ],
        do: [
            'Exercise rigorously, practice martial arts or cardiovascular workouts.',
            'Support and maintain cordial relations with younger brothers and soldiers.',
            'Donate blood periodically to save lives and balance excess Martian heat.'
        ],
        dont: [
            'Indulge in road rage, aggressive physical conflicts, or violent language.',
            'Incur impulsive high-interest debts or gamble with borrowed capital.',
            'Torture or show cruelty towards animals and defenseless individuals.'
        ],
        faqs: [
            {
                q: "What is Ruchaka Yoga?",
                a: "Ruchaka Yoga is one of the Panch Mahapurusha Yogas formed when Mars is in its own sign (Aries/Scorpio) or exalted in Capricorn in a Kendra house. It bestows immense physical power, military honors, and royal status."
            },
            {
                q: "How does Mars affect marriage (Manglik Dosha)?",
                a: "Mars placed in 1st, 4th, 7th, 8th, or 12th houses can cause high relational energy. When balanced with proper matching or cancellation rules, Manglik individuals enjoy vibrant, loyal marriages."
            }
        ]
    },
    {
        id: 'budh',
        name: 'Budh',
        englishName: 'Mercury',
        sanskritTitle: 'Saumya / Prajna / Grahaputra',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Mercury_in_color_-_Prockter07_centered.jpg/800px-Mercury_in_color_-_Prockter07_centered.jpg',
        color: 'from-emerald-500 to-green-400',
        glow: 'shadow-[0_0_50px_rgba(16,185,129,0.5)]',
        element: 'Earth (Prithvi)',
        direction: 'North (Uttara)',
        day: 'Wednesday (Budhavaar)',
        metal: 'Bronze / Brass / Green Gold',
        gemstone: 'Natural Emerald (Panna / Marakata)',
        deity: 'Lord Vishnu / Lord Ganesha',
        beejMantra: 'Om Bram Breem Broum Sah Budhaya Namah',
        gayatriMantra: 'Om Gajadhwajaya Vidmahe Sukhahastaya Dheemahi Tanno Budhah Prachodayat',
        mantra: 'Om Bram Breem Broum Sah Budhaya Namah',
        exaltation: 'Virgo (Kanya) at 15°',
        debilitation: 'Pisces (Meena) at 15°',
        ownSigns: 'Gemini (Mithuna) & Virgo (Kanya)',
        friends: ['Sun (Surya)', 'Venus (Shukra)'],
        enemies: ['Moon (Chandra)'],
        neutrals: ['Mars', 'Jupiter', 'Saturn'],
        description: 'The Prince of the Cosmic Cabinet. Budh governs analytical intellect (Buddhi), vocal communication, trade, mathematical logic, business acumen, wit, and the nervous system. As the master of transactions and language, Mercury bestows the skills to learn quickly, negotiate masterfully, and build commercial wealth.',
        mythology: 'Budh is the son of Chandra (Moon) and Tara, possessing both the intuitive brilliance of his father and the deep wisdom of Jupiter. Because he represents youth, he is eternally adaptable, playful, and intellectually vibrant.',
        controls: ['Intellect (Buddhi)', 'Speech (Vak)', 'Commerce & Trade', 'Mathematics & Logic', 'Nervous System & Skin', 'Maternal Uncles (Mama)', 'Writing & Media'],
        positiveTraits: [
            'Exceptional eloquence, sharp wit, and persuasive communication',
            'Mastery of commerce, financial analysis, accounting, and trading',
            'Youthful physical appearance, mental agility, and quick problem solving',
            'Strong memory, multiple language skills, and scientific curiosity'
        ],
        afflictedTraits: [
            'Nervous anxiety, speech stammering, and difficulty expressing ideas',
            'Prone to deception, manipulation, gambling, or breach of trust',
            'Skin allergies, digestive eczema, or peripheral neuropathy',
            'Frequent misunderstandings in contracts and loss in commercial trade'
        ],
        careerProfessions: [
            'Software engineering, coding, data science, and IT systems',
            'Journalism, authoring, editing, publishing, and digital marketing',
            'Chartered accountancy, stock market trading, and banking',
            'Diplomacy, law, sales negotiation, and telecommunications'
        ],
        remedies: [
            'Feed green grass, fresh spinach (Palak), or soaked green gram (Moong) to holy cows on Wednesday mornings.',
            'Chant the Vishnu Sahasranama Stotram or Budh Beej Mantra 108 times.',
            'Wear a certified Zambian/Colombian Emerald (Panna) set in gold or silver on the little finger on Wednesday.',
            'Water a sacred Tulsi (Holy Basil) plant daily and offer respect.',
            'Donate green clothes, emerald-colored items, or educational books to needy students on Wednesdays.'
        ],
        do: [
            'Read scholarly books, practice public speaking, and study mathematics.',
            'Maintain absolute integrity in business promises and written contracts.',
            'Respect and care for your sisters, maternal aunts, and daughters.'
        ],
        dont: [
            'Lie, cheat business partners, or spread malicious rumors.',
            'Keep damaged electronics, broken clocks, or clutter in the North zone.',
            'Disrespect teachers, green nature, or educational materials.'
        ],
        faqs: [
            {
                q: "What is Budhaditya Yoga?",
                a: "Budhaditya Yoga is the auspicious conjunction of Sun and Mercury in a single sign. It creates sharp administrative intelligence, scholarly success, and high social prestige."
            },
            {
                q: "What is Bhadra Yoga?",
                a: "Bhadra Yoga is formed when Mercury occupies Gemini or Virgo in a Kendra house. It bestows royal intelligence, longevity, immense wealth, and master-level diplomatic skills."
            }
        ]
    },
    {
        id: 'guru',
        name: 'Guru',
        englishName: 'Jupiter',
        sanskritTitle: 'Brihaspati / Devaguru / Jiva',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/800px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
        color: 'from-yellow-400 to-amber-300',
        glow: 'shadow-[0_0_50px_rgba(251,191,36,0.5)]',
        element: 'Ether / Space (Akasha)',
        direction: 'Northeast (Ishanya)',
        day: 'Thursday (Guruvaar)',
        metal: 'Pure Gold / Brass',
        gemstone: 'Yellow Sapphire (Pukhraj / Pushparaga)',
        deity: 'Lord Brihaspati / Lord Shiva (Dakshinamurthy) / Lord Dattatreya',
        beejMantra: 'Om Gram Greem Groum Sah Gurave Namah',
        gayatriMantra: 'Om Vrishabadhwajaya Vidmahe Krunihastaya Dheemahi Tanno Guruh Prachodayat',
        mantra: 'Om Gram Greem Groum Sah Gurave Namah',
        exaltation: 'Cancer (Karka) at 5°',
        debilitation: 'Capricorn (Makara) at 5°',
        ownSigns: 'Sagittarius (Dhanu) & Pisces (Meena)',
        friends: ['Sun (Surya)', 'Moon (Chandra)', 'Mars (Mangal)'],
        enemies: ['Mercury (Budh)', 'Venus (Shukra)'],
        neutrals: ['Saturn (Shani)'],
        description: 'The Supreme Preceptor (Devaguru) and Greatest Benefic. Guru represents pure spiritual wisdom (Jnana), divine grace, children (Santana), accumulated wealth (Dhana), higher education, dharma, and marital happiness for women. Wherever Jupiter casts its auspicious 5th, 7th, or 9th aspect (Drishti), it blesses that house with protection and prosperity.',
        mythology: 'Brihaspati is the preceptor of the Devas, the master of sacred speech, hymns, and cosmic philosophy. His divine grace dispels the darkest clouds of karmic ignorance.',
        controls: ['Wisdom (Jnana)', 'Children (Santana)', 'Divine Fortune (Bhagya)', 'Wealth (Dhana)', 'Guru & Teachers', 'Liver & Fat Metabolism', 'Husband (for women)'],
        positiveTraits: [
            'Profound philosophical wisdom, high moral integrity, and optimism',
            'Continuous financial abundance, wise investments, and philanthropy',
            'Joy and fulfillment through intelligent, virtuous children',
            'Revered social reputation, academic excellence, and spiritual peace'
        ],
        afflictedTraits: [
            'Dogmatism, false religious hypocrisy, and financial overextension',
            'Delays or distress regarding children and progeny',
            'Prone to liver disorders, obesity, diabetes, and cholesterol buildup',
            'Marital friction or delay in finding a virtuous husband for females'
        ],
        careerProfessions: [
            'Judges, magistrates, Supreme Court advocates, and legal scholars',
            'University professors, school principals, and spiritual educators',
            'Financial advisors, central bankers, wealth managers, and auditors',
            'Religious leaders, temple trustees, and international philanthropists'
        ],
        remedies: [
            'Apply a tilak of pure saffron (Kesar) or yellow sandalwood on the forehead and naval daily.',
            'Wear a natural, certified Ceylon Yellow Sapphire (Pukhraj) set in pure gold on the index finger on Thursday morning.',
            'Water the roots of a sacred Peepal or Banana tree every Thursday.',
            'Chant the Guru Gayatri Mantra or Brihaspati Beej Mantra 108 times.',
            'Donate turmeric, yellow bananas, yellow sweets (Laddus), or religious books to Brahmins and teachers on Thursdays.'
        ],
        do: [
            'Respect your spiritual guru, school teachers, father, and scholars.',
            'Study sacred scriptures, philosophy, and ethical literature regularly.',
            'Practice continuous charity and support orphanages and educational trusts.'
        ],
        dont: [
            'Insult gurus, holy traditions, temples, or learned scholars.',
            'Consume alcohol, eggs, or non-vegetarian food on Thursdays.',
            'Indulge in unethical greed, corruption, or financial exploitation.'
        ],
        faqs: [
            {
                q: "What is Hamsa Yoga?",
                a: "Hamsa Yoga is one of the Panch Mahapurusha Yogas formed when Jupiter occupies Cancer, Sagittarius, or Pisces in a Kendra house. It bestows saintly virtues, royal honors, physical majesty, and long-lasting prosperity."
            },
            {
                q: "Why is Jupiter called the Karaka of Children (Santana Karaka)?",
                a: "Jupiter naturally rules the 5th and 9th houses of past-life merit and progeny. A powerful Jupiter protects the family lineage and blesses the native with brilliant, dutiful children."
            }
        ]
    },
    {
        id: 'shukra',
        name: 'Shukra',
        englishName: 'Venus',
        sanskritTitle: 'Daityaguru / Bhrigu / Kavi',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/800px-Venus-real_color.jpg',
        color: 'from-pink-400 to-rose-300',
        glow: 'shadow-[0_0_50px_rgba(244,114,182,0.5)]',
        element: 'Water (Jala)',
        direction: 'Southeast (Agneya)',
        day: 'Friday (Shukravaar)',
        metal: 'Silver / White Gold / Platinum',
        gemstone: 'Natural Diamond (Heera / Vajra) or White Zircon',
        deity: 'Goddess Mahalakshmi / Goddess Shukreswari',
        beejMantra: 'Om Dram Dreem Droum Sah Shukraya Namah',
        gayatriMantra: 'Om Rajadabaaya Vidmahe Bhrigukanyaya Dheemahi Tanno Shukrah Prachodayat',
        mantra: 'Om Dram Dreem Droum Sah Shukraya Namah',
        exaltation: 'Pisces (Meena) at 27°',
        debilitation: 'Virgo (Kanya) at 27°',
        ownSigns: 'Taurus (Vrishabha) & Libra (Tula)',
        friends: ['Mercury (Budh)', 'Saturn (Shani)', 'Rahu', 'Ketu'],
        enemies: ['Sun (Surya)', 'Moon (Chandra)'],
        neutrals: ['Mars (Mangal)', 'Jupiter (Guru)'],
        description: 'The Preceptor of the Daityas (Daityaguru) and Master of Refinement. Shukra represents romantic love, marital bliss, aesthetic elegance, artistic genius, luxury vehicles, reproductive vitality, and material prosperity. As the master of the Sanjeevani Vidya (the esoteric knowledge of rejuvenation and revitalization), Venus grants magnetic charisma and worldly enjoyment.',
        mythology: 'Shukracharya is the great sage son of Rishi Bhrigu. He obtained the divine Sanjeevani Vidya through intense tapasya to Lord Shiva, granting him the power to bring life back into exhausted souls.',
        controls: ['Love & Romance', 'Spouse & Marriage (Kalatra)', 'Luxury & Vehicles', 'Arts & Music', 'Reproductive Vitality', 'Refinement & Fragrance', 'Material Wealth'],
        positiveTraits: [
            'Irresistible charisma, refined artistic taste, and magnetic elegance',
            'Harmonious, romantic, and deeply fulfilling married life',
            'Abundance of luxury vehicles, beautiful homes, and sensory comforts',
            'Talent in fashion design, music, acting, culinary arts, and poetry'
        ],
        afflictedTraits: [
            'Marital discord, unfaithfulness, addiction to destructive pleasures',
            'Reproductive disorders, kidney ailments, diabetes, and hormonal imbalance',
            'Severe financial dissipation due to reckless luxury spending',
            'Lack of aesthetic appreciation, living in untidy surroundings'
        ],
        careerProfessions: [
            'Cinema, acting, theater, filmmaking, and photography',
            'Fashion design, luxury brand retail, jewelry, and cosmetics',
            'Hospitality, fine dining, interior decoration, and architecture',
            'Automobile engineering, aviation travel, and entertainment'
        ],
        remedies: [
            'Worship Goddess Mahalakshmi with white lotus flowers and recite the Sri Suktam on Fridays.',
            'Wear a certified natural Diamond or sparkling White Zircon set in platinum/silver on the middle/little finger on Friday.',
            'Use natural, non-alcoholic sandalwood or rose fragrances and wear clean, ironed white clothes.',
            'Chant the Shukra Beej Mantra 108 times on Friday evenings.',
            'Donate white items (kheer, curd, white sugar, silk clothing, or ghee) to poor women on Fridays.'
        ],
        do: [
            'Show highest respect, fidelity, and affection to your spouse.',
            'Keep your home and personal wardrobe clean, scented, and orderly.',
            'Support and appreciate artists, musicians, and female creators.'
        ],
        dont: [
            'Be unfaithful in relationships or disrespect female partners.',
            'Wear torn, stained, unwashed, or shabby clothing.',
            'Live in dark, dirty, or foul-smelling environments.'
        ],
        faqs: [
            {
                q: "What is Malavya Yoga?",
                a: "Malavya Yoga is formed when Venus occupies Taurus, Libra, or Pisces in a Kendra house. It bestows peerless beauty, grand luxury vehicles, wealth, artistic mastery, and a serene, joyous marriage."
            },
            {
                q: "What remedies work best for a debilitated Venus in Virgo?",
                a: "Fast on Fridays, chant the Lakshmi Gayatri Mantra, donate pure cow ghee to temples, and respect women to elevate the refined qualities of Venus."
            }
        ]
    },
    {
        id: 'shani',
        name: 'Shani',
        englishName: 'Saturn',
        sanskritTitle: 'Manda / Shanaischara / Suryaputra',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/1280px-Saturn_during_Equinox.jpg',
        color: 'from-indigo-900 to-blue-900',
        glow: 'shadow-[0_0_50px_rgba(30,58,138,0.5)]',
        element: 'Air (Vayu)',
        direction: 'West (Pashchima)',
        day: 'Saturday (Shanivaar)',
        metal: 'Iron / Lead / Blue Steel',
        gemstone: 'Blue Sapphire (Neelam / Indraneel)',
        deity: 'Lord Shani Deva / Lord Hanuman / Lord Shiva',
        beejMantra: 'Om Pram Preem Proum Sah Shanaischaraya Namah',
        gayatriMantra: 'Om Kakadhwajaya Vidmahe Khagahastaya Dheemahi Tanno Mandah Prachodayat',
        mantra: 'Om Pram Preem Proum Sah Shanaischaraya Namah',
        exaltation: 'Libra (Tula) at 20°',
        debilitation: 'Aries (Mesha) at 20°',
        ownSigns: 'Capricorn (Makara) & Aquarius (Kumbha)',
        friends: ['Mercury (Budh)', 'Venus (Shukra)', 'Rahu'],
        enemies: ['Sun (Surya)', 'Moon (Chandra)', 'Mars (Mangal)'],
        neutrals: ['Jupiter (Guru)'],
        description: 'The Divine Dispenser of Justice (Karmaphala Daata). Shani represents karma, discipline, endurance, longevity (Ayushya), hard work, delay, justice, humility, and organizational mastery. As the slowest-moving of the classical seven planets (spending 2.5 years per sign), Saturn ensures that every human action receives its exact karmic recompense.',
        mythology: 'Shani is the son of Surya (Sun) and Chhaya (Shadow). Through supreme austerity and devotion to Lord Shiva, Shani achieved the planetary role of the divine judge over all living beings.',
        controls: ['Karma & Destiny', 'Longevity (Ayushya)', 'Discipline & Perseverance', 'Labor & Subordinates', 'Bones, Joints & Teeth', 'Poverty & Wealth', 'Structural Organization'],
        positiveTraits: [
            'Unmatched patience, tireless work ethic, and ironclad resilience',
            'Profound sense of justice, incorruptible ethics, and humility',
            'Long, healthy lifespan with gradual and massive career heights',
            'Success in large-scale industry, governance, real estate, and law'
        ],
        afflictedTraits: [
            'Severe delays, chronic depression, cynicism, and acute loneliness',
            'Bone fractures, arthritis, dental decay, and nervous exhaustion',
            'Strained relations with subordinates and sudden legal penalties',
            'Poverty, heavy debts, or feeling trapped in repetitive hardship'
        ],
        careerProfessions: [
            'Judiciary, labor law, civil arbitration, and criminal defense',
            'Heavy manufacturing, steel industry, mining, oil, and gas',
            'Civil architecture, bridge engineering, and railway infrastructure',
            'Agriculture, waste management, and public social service'
        ],
        remedies: [
            'Light a mustard oil lamp (Deep Daan) under a sacred Peepal tree on Saturday evenings.',
            'Recite the Hanuman Chalisa or Dasharatha Shani Stotram every Saturday.',
            'Wear a certified natural Blue Sapphire (Neelam) set in silver on the middle finger only after astrological consultation and trial.',
            'Feed street dogs, crows, and disabled people with oily rotis or black sesame laddoos on Saturdays.',
            'Donate black blankets, iron utensils, or black sesame seeds (Til) to poor laborers.'
        ],
        do: [
            'Treat domestic workers, sweepers, and laborers with high respect and fair wages.',
            'Embrace discipline, patience, punctual habits, and clean ethics.',
            'Serve disabled, elderly, and underprivileged members of society.'
        ],
        dont: [
            'Drink alcohol, consume intoxicants, or eat meat on Saturdays.',
            'Exploit, abuse, or underpay manual workers and servants.',
            'Be arrogant, lazy, or procrastinate on lawful duties.'
        ],
        faqs: [
            {
                q: "What is Sasa Yoga?",
                a: "Sasa Yoga is one of the Panch Mahapurusha Yogas formed when Saturn occupies Capricorn, Aquarius, or Libra in a Kendra house. It bestows commanding political power, leadership of vast masses, wealth, and profound spiritual humility."
            },
            {
                q: "Why is Saturn feared and how can we befriend it?",
                a: "Saturn is not an enemy but a strict spiritual teacher. Befriending Saturn requires honesty, humility, hard work, and helping the poor, which immediately pacifies all Saturn afflictions."
            }
        ]
    },
    {
        id: 'rahu',
        name: 'Rahu',
        englishName: 'North Node',
        sanskritTitle: 'Swarbhanu / Bhayanaka / Tamas',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Solar_eclipse_1999_4_NR.jpg/800px-Solar_eclipse_1999_4_NR.jpg',
        color: 'from-gray-700 to-slate-800',
        glow: 'shadow-[0_0_50px_rgba(75,85,99,0.5)]',
        element: 'Air / Smoke (Vayu / Tamas)',
        direction: 'Southwest (Nairrutya)',
        day: 'Saturday / Wednesday night',
        metal: 'Alloy / Mixed Lead',
        gemstone: 'Hessonite Garnet (Gomed / Cinnamon Stone)',
        deity: 'Lord Bhairava / Goddess Durga / Lord Shiva',
        beejMantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namah',
        gayatriMantra: 'Om Nagadhwajaya Vidmahe Padmahastaya Dheemahi Tanno Rahuh Prachodayat',
        mantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namah',
        exaltation: 'Taurus (Vrishabha) / Gemini (Mithuna)',
        debilitation: 'Scorpio (Vrischika) / Sagittarius (Dhanu)',
        ownSigns: 'Aquarius (Kumbha) (Co-ruler with Saturn)',
        friends: ['Mercury (Budh)', 'Venus (Shukra)', 'Saturn (Shani)'],
        enemies: ['Sun (Surya)', 'Moon (Chandra)', 'Mars (Mangal)'],
        neutrals: ['Jupiter (Guru)'],
        description: 'The Cosmic Disruptor and Master of Ambition. Rahu is the north lunar node where the Moon crosses the ecliptic. It represents intense worldly desire (Trishna), future karma, unconventional breakthroughs, artificial intelligence, international travel, mass media, and sudden life transformation. A favorable Rahu catapults individuals to stratospheric wealth and fame.',
        mythology: 'Rahu was the Asura Swarbhanu who drank the nectar of immortality (Amrita) during the Samudra Manthan. When Mohini severed his neck with the Sudarshana Chakra, his immortalized head became Rahu and his body became Ketu.',
        controls: ['Unconventional Ambition', 'Foreign Lands & Travel', 'Mass Media & Fame', 'Technology & AI', 'Sudden Luck / Transformations', 'Illusion & Maya', 'Psychic Mysteries'],
        positiveTraits: [
            'Visionary thinking, groundbreaking innovation, and rapid adaptation',
            'Phenomenal success in global foreign ventures and technology',
            'Charismatic mass popularity and strategic political influence',
            'Fearless disruption of outdated social dogmas'
        ],
        afflictedTraits: [
            'Chronic mental confusion, paranoia, hallucinations, and phobias',
            'Vulnerability to addiction, gambling, and fraudulent scams',
            'Sudden catastrophic losses due to reckless speculation',
            'Restlessness, sleep paralysis, and feelings of alienation'
        ],
        careerProfessions: [
            'Artificial intelligence, software architecture, cybersecurity, and VR',
            'Aviation, aerospace engineering, and international diplomacy',
            'Cinema direction, visual special effects, and mass media PR',
            'Speculative trading, pharmaceutical research, and politics'
        ],
        remedies: [
            'Recite the Durga Saptashati or Bhairava Kavach regularly.',
            'Wear a certified natural, untreated Ceylon Hessonite (Gomed) set in silver on the middle finger on Saturday evening.',
            'Float raw coconuts or blue flowers in flowing river water on Saturdays.',
            'Feed stray dogs and keep your living spaces, especially the Southwest corner, clean.',
            'Donate blankets, dark lentils (Urad Dal), or blue cloth to sweepers on Saturdays.'
        ],
        do: [
            'Embrace disciplined daily meditation to anchor your mind.',
            'Maintain clean, clutter-free electronic devices and living quarters.',
            'Practice total honesty and transparency in business.'
        ],
        dont: [
            'Engage in illegal online gambling, betting, or fraudulent schemes.',
            'Consume toxic intoxicants, narcotics, or spoiled food.',
            'Criticize or mock religious traditions and ancestors.'
        ],
        faqs: [
            {
                q: "Can Rahu make a person rich overnight?",
                a: "Yes. When Rahu is placed in the 3rd, 6th, 10th, or 11th house in friendly signs and connected to wealth lords, its Mahadasha frequently brings sudden multi-million windfalls and global fame."
            },
            {
                q: "What is Kaal Sarp Yoga?",
                a: "Kaal Sarp Yoga occurs when all seven classical planets are hemmed between the Rahu-Ketu nodal axis. It creates intense transformative karma that brings high leadership once pacified."
            }
        ]
    },
    {
        id: 'ketu',
        name: 'Ketu',
        englishName: 'South Node',
        sanskritTitle: 'Shikhi / Mokshakaraka / Dhwaja',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Comet_Hale-Bopp_1995O1.jpg/800px-Comet_Hale-Bopp_1995O1.jpg',
        color: 'from-stone-600 to-amber-900',
        glow: 'shadow-[0_0_50px_rgba(120,53,15,0.5)]',
        element: 'Fire / Spiritual Ether (Agni / Moksha)',
        direction: 'South / Center (Nadir)',
        day: 'Tuesday / Thursday night',
        metal: 'Mixed Metals / Ash Silver',
        gemstone: "Cat's Eye (Lehsunia / Vaidurya)",
        deity: 'Lord Ganesha / Lord Matsya (Vishnu Avatar)',
        beejMantra: 'Om Stram Streem Stroum Sah Ketave Namah',
        gayatriMantra: 'Om Ashwadhwajaya Vidmahe Shoolahastaya Dheemahi Tanno Ketuh Prachodayat',
        mantra: 'Om Stram Streem Stroum Sah Ketave Namah',
        exaltation: 'Scorpio (Vrischika) / Sagittarius (Dhanu)',
        debilitation: 'Taurus (Vrishabha) / Gemini (Mithuna)',
        ownSigns: 'Scorpio (Co-ruler with Mars)',
        friends: ['Mercury (Budh)', 'Venus (Shukra)', 'Saturn (Shani)'],
        enemies: ['Sun (Surya)', 'Moon (Chandra)'],
        neutrals: ['Mars (Mangal)', 'Jupiter (Guru)'],
        description: 'The Spiritual Liberator (Mokshakaraka). Ketu represents past-life mastery, subtle psychic intuition, detachment from material illusion (Vairagya), occult sciences, enlightenment, and ultimate liberation (Moksha). Because Ketu is the headless body of the celestial serpent, it operates purely through inner heart intuition and spiritual perception.',
        mythology: 'Ketu is the headless torso of the dragon Swarbhanu. Having no physical eyes, Ketu perceives reality through transcendental divine vision, guiding sincere spiritual seekers toward final liberation.',
        controls: ['Spiritual Liberation (Moksha)', 'Psychic Intuition & Kundalini', 'Occult Sciences & Astrology', 'Detachment (Vairagya)', 'Past Life Mastery', 'Viral Immunity', 'Surgery & Healing'],
        positiveTraits: [
            'Deep spiritual enlightenment, clairvoyance, and intuitive insight',
            'Complete fearlessness, emotional detachment from vanity, and peace',
            'Mastery of astrology, esoteric scriptures, and diagnostic healing',
            'Spontaneous luck and deep meditative samadhi experiences'
        ],
        afflictedTraits: [
            'Feeling isolated, purposeless, or detached to the point of apathy',
            'Prone to mysterious undiagnosable illnesses, food allergies, and insect bites',
            'Sudden betrayal by trusted associates or loss of ancestral assets',
            'Accident vulnerability or sudden unexpected career cuts'
        ],
        careerProfessions: [
            'Vedic astrologers, occult researchers, and spiritual gurus',
            'Microbiologists, virologists, and genetic researchers',
            'Specialized surgeons, diagnostic radiologists, and herbal healers',
            'Philosophers, monks, recluses, and computer algorithm coders'
        ],
        remedies: [
            'Worship Lord Ganesha with 21 blades of Durva grass daily and recite the Sankata Nashana Ganesha Stotram.',
            'Wear a certified natural Chrysoberyl Cat’s Eye (Lehsunia) with sharp chatoyancy in silver on the little/middle finger on Tuesday.',
            'Feed street dogs (especially multi-colored or black-and-white dogs) with bread or biscuits daily.',
            'Plant a sacred Ashoka tree or Banana tree and offer water.',
            'Donate multi-colored blankets, sesame sweets, or mustard seeds to holy monks on Tuesdays.'
        ],
        do: [
            'Practice daily silent meditation, pranayama, and yoga.',
            'Be charitable and engage in anonymous philanthropic acts.',
            'Nurture and protect street animals and vulnerable stray dogs.'
        ],
        dont: [
            'Harm, abuse, or kick stray dogs or defenseless animals.',
            'Be overly attached to transient material pride and vanity.',
            'Lie, manipulate, or harbor hidden malicious grudges.'
        ],
        faqs: [
            {
                q: "Why is Ketu called the Mokshakaraka?",
                a: "Ketu cuts through the worldly illusions of the 12th house (the house of liberation). When placed in the 12th house in Pisces or Sagittarius, Ketu dissolves the cycle of rebirth and leads to final Moksha."
            },
            {
                q: "How does Ketu affect health?",
                a: "An afflicted Ketu can produce mysterious fevers, skin prickling, or allergies. Daily chanting of Ganesha Atharvashirsha is celebrated in Vedic scriptures for immediate immunity."
            }
        ]
    }
];
