import { QuizQuestion, WordGuessItem, ProjectSummary } from '../types';

export const DEFAULT_PROJECT_SUMMARY: ProjectSummary = {
  title: 'The 2026 Mass Migration Crisis in Ceuta',
  subtitle: 'Geopolitical, Humanitarian & Diplomatic Analysis Presentation',
  author: 'Ali & Rayan',
  category: 'Geopolitical & Humanitarian Studies (2026)',
  overview:
    'A comprehensive 25-minute analytical presentation breaking down the unprecedented summer 2026 mass migration wave into the Spanish enclave of Ceuta, its structural causes, the July 30–31 border collapse, devastating human toll, and ensuing diplomatic rift between Spain and Morocco.',
  keyPoints: [
    {
      id: 'p1',
      title: 'Geopolitical Context & Enclave Reality',
      description:
        'Ceuta is a fortified Spanish enclave on the northern coast of Africa alongside its sister city Melilla. Stepping foot in Ceuta means entering European Union territory, making it a continuous focal point for migration despite heavy border barriers.',
      icon: '🌍',
      category: 'Context'
    },
    {
      id: 'p2',
      title: 'Spanish Regularization Policy (January 2026)',
      description:
        'Prime Minister Pedro Sánchez introduced a mass regularization program for undocumented migrants in Spain. By early July 2026, nearly 1.2 million undocumented individuals had filed, creating a monumental "pull factor" across Morocco and Sub-Saharan Africa.',
      icon: '📜',
      category: 'Causes'
    },
    {
      id: 'p3',
      title: 'Immediate Detonator & Fnideq Mobilization',
      description:
        'A contentious legal decision passed on July 8, 2026, coupled with severe economic frustrations and viral social media calls to action, catalyzed thousands of people in the neighboring Moroccan border town of Fnideq to mobilize.',
      icon: '⚡',
      category: 'Triggers'
    },
    {
      id: 'p4',
      title: 'The Climax: July 30–31 Human Wave',
      description:
        'Between July 30 and 31, an estimated 60,000 to 80,000 migrants crossed from Fnideq into Ceuta by swimming around border waters and climbing coastal rocks. Ceuta’s regular population of ~85,000 nearly doubled overnight, disabling border security protocols.',
      icon: '🌊',
      category: 'Timeline'
    },
    {
      id: 'p5',
      title: 'Devastating Human Toll & Discrepancies',
      description:
        'Crossing through treacherous night currents and sharp rocks caused extreme casualties. The Moroccan Association for Human Rights reported at least 141 deaths, while the Spanish government officially estimated 80. Victims perished from drowning, stampedes, and falls.',
      icon: '⚠️',
      category: 'Human Toll'
    },
    {
      id: 'p6',
      title: 'Urban Paralysis & Mass Returns',
      description:
        'With no facilities to shelter tens of thousands, migrants and unaccompanied children slept in the streets. Rapid returns saw 25,000 sent back by July 31 and over 48,000 by August 1. Yet, in September 2026, between 5,000 and 13,000 migrants remain in Ceuta.',
      icon: '🏙️',
      category: 'Impact'
    },
    {
      id: 'p7',
      title: 'State of Emergency & Spanish Backlash',
      description:
        'Ceuta Mayor Juan Jesús Vivas declared a "humanitarian and social emergency," pleading with Madrid for military aid as local commerce halted. On September 2 (Day of Ceuta), tens of thousands demonstrated across Spain against Sánchez’s governance.',
      icon: '📢',
      category: 'Political Crisis'
    },
    {
      id: 'p8',
      title: 'Severe Diplomatic Rift (Madrid vs Rabat)',
      description:
        'Morocco condemned Spain’s regularization policy as an "extraordinary machine to create irregular migrants," while Spanish officials and Mayor Vivas accused Moroccan authorities of turning a blind eye to 60,000 people reaching the border fence.',
      icon: '🤝',
      category: 'Diplomacy'
    }
  ],
  importantNotes:
    'Key Takeaway: The crisis illustrates how domestic legal policies, social media virality, and border enforcement weaponization interact to create sudden, historic migration shocks.',
  quizTips:
    'Pay close attention to specific numbers (85,000 population, 60,000-80,000 crossing, 1.2M filings, 141 vs 80 deaths) and dates (July 8 detonator, July 30-31 crossing, September 2 Day of Ceuta)!',
  lastUpdated: Date.now()
};

export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Where is Ceuta located, and what makes its border geopolitically unique?',
    category: 'Geopolitics & Context',
    timeLimit: 20,
    points: 1000,
    visualClue: '🌍',
    choices: [
      'A Moroccan port city jointly administered by the United Nations',
      'A Spanish enclave in northern Africa where entry equals entering the European Union',
      'An autonomous Portuguese island in the Strait of Gibraltar',
      'A demilitarized international trading outpost on the Mediterranean'
    ],
    correctIndex: 1,
    explanation:
      'Ceuta is a Spanish enclave located on the northern coast of Africa. Because it is sovereign Spanish territory, stepping into Ceuta means entering the European Union.'
  },
  {
    id: 'q2',
    question: 'Which Spanish enclave city in North Africa is known as Ceuta\'s "sister city"?',
    category: 'Geography & Context',
    timeLimit: 20,
    points: 1000,
    visualClue: '📍',
    choices: ['Tangier', 'Melilla', 'Tetouan', 'Gibraltar'],
    correctIndex: 1,
    explanation:
      'Melilla is the other Spanish enclave located on the Moroccan coast, frequently referred to as Ceuta\'s sister city.'
  },
  {
    id: 'q3',
    question: 'Before the 2026 crisis, what earlier migration incident in Ceuta was cited as a historical precedent?',
    category: 'Historical Context',
    timeLimit: 20,
    points: 1000,
    visualClue: '📅',
    choices: [
      'May 2021, when approximately 6,000 migrants crossed',
      'July 2015, when 25,000 migrants arrived by boat',
      'October 2018, when 15,000 crossed via cargo ships',
      'March 2023, when 12,000 migrants climbed the main gate'
    ],
    correctIndex: 0,
    explanation:
      'In May 2021, around 6,000 migrants crossed into Ceuta during a diplomatic dispute, though the 2026 crisis dwarfed this historical precedent.'
  },
  {
    id: 'q4',
    question: 'In January 2026, what domestic policy decision by Spanish PM Pedro Sánchez acted as a major "pull factor"?',
    category: 'Underlying Causes',
    timeLimit: 20,
    points: 1000,
    visualClue: '📜',
    choices: [
      'A universal cash subsidy for all North African citizens',
      'A mass regularization program for migrants living illegally in Spain',
      'The complete removal of physical border fences in Ceuta',
      'A visa-free travel treaty signed between Madrid and Rabat'
    ],
    correctIndex: 1,
    explanation:
      'The Sánchez government announced a mass regularization program for undocumented migrants in Spain, triggering widespread hope across Morocco and Sub-Saharan Africa.'
  },
  {
    id: 'q5',
    question: 'How many undocumented individuals had filed for regularization in Spain by early July 2026?',
    category: 'Statistics & Policy',
    timeLimit: 20,
    points: 1000,
    visualClue: '📊',
    choices: ['Roughly 250,000', 'Nearly 1.2 million', 'Exactly 500,000', 'Over 3.5 million'],
    correctIndex: 1,
    explanation:
      'The presentation notes that nearly 1.2 million undocumented individuals had filed for the regularization program by early July 2026.'
  },
  {
    id: 'q6',
    question: 'What specific event on July 8, 2026, served as the immediate detonator for the mobilization in Fnideq?',
    category: 'Crisis Timeline',
    timeLimit: 20,
    points: 1000,
    visualClue: '⚡',
    choices: [
      'A complete naval blockade of northern Moroccan waters',
      'A specific legal decision combined with viral social media calls',
      'The sudden shutdown of commercial border checkpoints',
      'A unilateral declaration of emergency by the Moroccan parliament'
    ],
    correctIndex: 1,
    explanation:
      'A specific legal decision passed on July 8, 2026, alongside economic frustrations and viral calls on social media, mobilized thousands in Fnideq.'
  },
  {
    id: 'q7',
    question: 'How many migrants crossed into Ceuta during the climax between July 30 and 31, 2026?',
    category: 'Crisis Timeline',
    timeLimit: 20,
    points: 1000,
    visualClue: '🌊',
    choices: [
      '5,000 to 10,000 migrants',
      '15,000 to 25,000 migrants',
      '60,000 to 80,000 migrants',
      '150,000 to 200,000 migrants'
    ],
    correctIndex: 2,
    explanation:
      'Between July 30 and 31, an estimated 60,000 to 80,000 migrants crossed from Fnideq into Ceuta, catching Spain and the EU completely off guard.'
  },
  {
    id: 'q8',
    question: 'Given Ceuta\'s normal population of around 85,000, what was the immediate demographic impact?',
    category: 'City Impact',
    timeLimit: 20,
    points: 1000,
    visualClue: '👥',
    choices: [
      'The city population nearly doubled overnight',
      'The population fell by 30% due to local evacuations',
      'The demographic change was negligible because migrants left instantly',
      'Ceuta\'s population expanded by exactly 10%'
    ],
    correctIndex: 0,
    explanation:
      'With an influx of 60,000 to 80,000 people entering a city of 85,000 residents, Ceuta\'s population nearly doubled in a single night.'
  },
  {
    id: 'q9',
    question: 'How did the majority of migrants bypass Ceuta\'s heavy border fences during the July 30–31 influx?',
    category: 'Border Dynamics',
    timeLimit: 20,
    points: 1000,
    visualClue: '🏊',
    choices: [
      'By boarding commercial high-speed car ferries',
      'By swimming through border waters and clambering over coastal rocks',
      'By digging underground tunnels beneath the perimeter fences',
      'By driving commercial trucks through the primary cargo gates'
    ],
    correctIndex: 1,
    explanation:
      'Migrants bypassed fortified fences by swimming through open coastal waters around the border breakwaters and clambering over sharp coastal rocks.'
  },
  {
    id: 'q10',
    question: 'What casualty figures were reported by the Moroccan Association for Human Rights (AMDH) vs the Spanish government?',
    category: 'Human Toll',
    timeLimit: 20,
    points: 1000,
    visualClue: '⚠️',
    choices: [
      'AMDH reported at least 141 deaths; Spain officially estimated 80',
      'AMDH reported 50 deaths; Spain officially estimated 300',
      'AMDH reported no deaths; Spain estimated 1,000 casualties',
      'Both authorities officially confirmed exactly 25 casualties'
    ],
    correctIndex: 0,
    explanation:
      'AMDH reported at least 141 lives lost from drowning, stampedes, and fence falls, whereas the Spanish government officially estimated the death toll at 80.'
  },
  {
    id: 'q11',
    question: 'According to Spanish authorities, how many migrants had returned to Morocco by August 1, 2026?',
    category: 'Post-Crisis Returns',
    timeLimit: 20,
    points: 1000,
    visualClue: '🔄',
    choices: [
      'Under 5,000 migrants',
      'About 15,000 migrants',
      'Over 48,000 migrants (with 25,000 returned by July 31 afternoon)',
      'Every single migrant was repatriated within 24 hours'
    ],
    correctIndex: 2,
    explanation:
      'Mass returns occurred immediately: an estimated 25,000 returned by the afternoon of July 31, and by August 1 over 48,000 had gone back.'
  },
  {
    id: 'q12',
    question: 'What did Ceuta Mayor Juan Jesús Vivas declare, and how did Morocco\'s government respond diplomatically?',
    category: 'Diplomatic Fallout',
    timeLimit: 20,
    points: 1000,
    visualClue: '🏛️',
    choices: [
      'Mayor Vivas praised border security; Morocco welcomed new economic agreements',
      'Mayor Vivas declared a humanitarian emergency; Morocco blamed Spain\'s policy as a "machine to create irregular migrants"',
      'Mayor Vivas ceded administrative control to Madrid; Morocco recalled all naval personnel',
      'Mayor Vivas shut down all schools; Morocco denied any border incident occurred'
    ],
    correctIndex: 1,
    explanation:
      'Mayor Vivas declared a "humanitarian and social emergency," while Morocco blamed Spain for creating an "extraordinary machine to create irregular migrants." Vivas claimed Moroccan forces turned a blind eye.'
  }
];

export const DEFAULT_WORDS: WordGuessItem[] = [
  {
    id: 'w1',
    word: 'CEUTA',
    category: 'Geography & Sovereignty',
    visualClues: ['🇪🇸', 'Spanish Enclave in North Africa', 'Border on Mediterranean', 'Population ~85,000'],
    revealedLetters: [0, 4],
    timeLimit: 30,
    points: 1000,
    explanation: 'Ceuta is a Spanish autonomous city and European Union enclave located on the northern coast of Africa.'
  },
  {
    id: 'w2',
    word: 'FNIDEQ',
    category: 'Locations & Borders',
    visualClues: ['🇲🇦', 'Moroccan Border Town', 'Neighbor to Ceuta', 'Staging Point of July 2026 Mobilization'],
    revealedLetters: [0, 3],
    timeLimit: 30,
    points: 1000,
    explanation: 'Fnideq is the Moroccan town adjacent to Ceuta where tens of thousands mobilized before crossing.'
  },
  {
    id: 'w3',
    word: 'REGULARIZATION',
    category: 'Spanish Domestic Policy',
    visualClues: ['📋', 'January 2026 Spanish Law', '1.2 Million Applicants', 'Major Pull Factor for Migrants'],
    revealedLetters: [0, 5, 12],
    timeLimit: 40,
    points: 1000,
    explanation: 'Spain\'s mass regularization program for undocumented migrants created a major migration pull factor.'
  },
  {
    id: 'w4',
    word: 'ENCLAVE',
    category: 'Political Geography',
    visualClues: ['🗺️', 'Territory Enclosed by Foreign Land', 'Ceuta and Melilla Example', 'Strategic EU Border'],
    revealedLetters: [0, 6],
    timeLimit: 30,
    points: 1000,
    explanation: 'An enclave is a portion of territory entirely surrounded by the land of another state.'
  },
  {
    id: 'w5',
    word: 'SANCHEZ',
    category: 'Political Leadership',
    visualClues: ['👔', 'Prime Minister of Spain', 'Initiated Regularization Policy', 'Target of Sept 2 Protests'],
    revealedLetters: [0, 3],
    timeLimit: 30,
    points: 1000,
    explanation: 'Pedro Sánchez, Prime Minister of Spain whose government introduced the January 2026 regularization policy.'
  },
  {
    id: 'w6',
    word: 'MELILLA',
    category: 'Sister Enclave',
    visualClues: ['🏰', 'Second Spanish Enclave in Africa', 'East of Ceuta on Moroccan Coast', 'Fenced EU Border'],
    revealedLetters: [0, 3],
    timeLimit: 30,
    points: 1000,
    explanation: 'Melilla is Spain\'s other North African enclave city, often referenced alongside Ceuta.'
  },
  {
    id: 'w7',
    word: 'MIGRATION',
    category: 'Geopolitics & Demographics',
    visualClues: ['🚶', 'Movement of People Across Borders', 'Pull Factors & Border Crossings', 'Humanitarian Crisis'],
    revealedLetters: [0, 4, 8],
    timeLimit: 30,
    points: 1000,
    explanation: 'The mass movement of individuals across international borders in search of legal status or refuge.'
  },
  {
    id: 'w8',
    word: 'DIPLOMACY',
    category: 'International Relations',
    visualClues: ['🤝', 'Relations Between Spain & Morocco', 'Madrid vs Rabat Rift', 'Negotiating Border Protocols'],
    revealedLetters: [0, 4],
    timeLimit: 35,
    points: 1000,
    explanation: 'The management of international relations and bilateral tensions between Spain, Morocco, and the EU.'
  }
];
