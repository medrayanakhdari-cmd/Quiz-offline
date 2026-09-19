import { QuizQuestion, WordGuessItem, ProjectSummary } from '../types';

export const DEFAULT_PROJECT_SUMMARY: ProjectSummary = {
  title: 'Project Revision & Study Briefing',
  subtitle: 'Ali & Rayan Interactive Platform',
  author: 'Ali & Rayan',
  category: 'System Architecture & Knowledge Review',
  overview: 'Welcome to the revision summary for the Ali & Rayan project! Review the key concepts, architectural highlights, and essential facts below before starting the live quiz challenge. Everything you learn in this briefing will help you climb the leaderboard.',
  keyPoints: [
    {
      id: 'p1',
      title: 'Local Real-Time Networking',
      description: 'The platform runs 100% offline over a local Wi-Fi hotspot or LAN using Node.js, Express, and Socket.io. No internet access or external cloud servers are required.',
      icon: '⚡',
      category: 'Architecture'
    },
    {
      id: 'p2',
      title: 'Two-Screen Controller Paradigm',
      description: 'The host screen (projector/PC) displays the full question text, timer, visual hints, and answers. Student devices function purely as tactile color & geometric shape buzzers.',
      icon: '🎮',
      category: 'User Experience'
    },
    {
      id: 'p3',
      title: 'Speed & Streak Combo Scoring',
      description: 'Base points are scaled according to response speed, with progressive bonuses awarded for consecutive correct answers (🔥 Streaks up to 500 bonus points).',
      icon: '🔥',
      category: 'Scoring Engine'
    },
    {
      id: 'p4',
      title: 'Mystery Word Guessing Challenge',
      description: 'A second game mode where players decipher hidden words letter-by-letter with visual clues, emoji hints, and real-time rank tracking.',
      icon: '🔤',
      category: 'Game Modes'
    },
    {
      id: 'p5',
      title: 'Built-in Synthesized Audio',
      description: 'Sound effects (ticks, fanfares, buzzers) are generated locally in real time using the native Web Audio API without requiring any external audio files.',
      icon: '🔊',
      category: 'Audio'
    }
  ],
  importantNotes: 'Key Takeaway: The admin host enters #*admin*# as username to control the session. Students connect via the local IP address or QR code.',
  quizTips: 'Keep your eyes on the host projector screen and tap your buzzer button quickly on your smartphone!',
  lastUpdated: Date.now()
};

export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which planet is closest to the Sun in our solar system?',
    category: 'Astronomy & Science',
    timeLimit: 20,
    points: 1000,
    visualClue: '🪐',
    choices: ['Venus', 'Mercury', 'Mars', 'Jupiter'],
    correctIndex: 1,
    explanation: 'Mercury orbits closest to the Sun at an average distance of roughly 58 million km.'
  },
  {
    id: 'q2',
    question: 'What is the fastest land animal on planet Earth?',
    category: 'Animals & Nature',
    timeLimit: 20,
    points: 1000,
    visualClue: '⚡',
    choices: ['Cheetah', 'Lion', 'Pronghorn Antelope', 'Greyhound'],
    correctIndex: 0,
    explanation: 'The cheetah can reach top sprint speeds of up to 110-120 km/h (70 mph) in short bursts.'
  },
  {
    id: 'q3',
    question: 'Which programming language powers interactive behavior across modern web browsers?',
    category: 'Computer Science & Tech',
    timeLimit: 20,
    points: 1000,
    visualClue: '💻',
    choices: ['Python', 'C++', 'JavaScript', 'Cobol'],
    correctIndex: 2,
    explanation: 'JavaScript was created in 1995 by Brendan Eich and remains the ubiquitous interactive runtime of the web.'
  },
  {
    id: 'q4',
    question: 'What is the official capital city of Australia?',
    category: 'Geography',
    timeLimit: 20,
    points: 1000,
    visualClue: '🌏',
    choices: ['Sydney', 'Melbourne', 'Brisbane', 'Canberra'],
    correctIndex: 3,
    explanation: 'Canberra was chosen in 1908 as a federal compromise capital between rival cities Sydney and Melbourne.'
  },
  {
    id: 'q5',
    question: 'How many bones are in the average adult human skeleton?',
    category: 'Human Biology',
    timeLimit: 20,
    points: 1000,
    visualClue: '🦴',
    choices: ['184', '206', '248', '312'],
    correctIndex: 1,
    explanation: 'An adult has 206 bones. Infants are born with roughly 270 bones which fuse together as they grow.'
  },
  {
    id: 'q6',
    question: 'In what year did humans first set foot on the Moon?',
    category: 'History',
    timeLimit: 20,
    points: 1000,
    visualClue: '🚀',
    choices: ['1965', '1969', '1972', '1975'],
    correctIndex: 1,
    explanation: 'On July 20, 1969, astronauts Neil Armstrong and Buzz Aldrin landed the Apollo 11 Lunar Module on the Moon.'
  },
  {
    id: 'q7',
    question: 'What chemical element has the atomic symbol "Au" on the periodic table?',
    category: 'Chemistry',
    timeLimit: 20,
    points: 1000,
    visualClue: '✨',
    choices: ['Silver', 'Gold', 'Aluminum', 'Copper'],
    correctIndex: 1,
    explanation: '"Au" comes from the Latin word "Aurum", which means shining gold.'
  },
  {
    id: 'q8',
    question: 'Which is the largest and deepest ocean basin on Earth?',
    category: 'Geography',
    timeLimit: 20,
    points: 1000,
    visualClue: '🌊',
    choices: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    correctIndex: 2,
    explanation: 'The Pacific Ocean spans over 165 million square kilometers, covering more than 30% of Earth\'s surface.'
  }
];

export const DEFAULT_WORDS: WordGuessItem[] = [
  {
    id: 'w1',
    word: 'GIRAFFE',
    category: 'Wild Fauna',
    visualClues: ['🦒', 'African Savanna', 'Towering Neck', 'Spotted Coat'],
    revealedLetters: [0, 4],
    timeLimit: 30,
    points: 1000,
    explanation: 'The giraffe is the tallest living terrestrial animal on Earth.'
  },
  {
    id: 'w2',
    word: 'PYRAMID',
    category: 'History & Monuments',
    visualClues: ['🏜️', 'Ancient Egypt', 'Pharaohs & Tombs', 'Triangular Stone Monument'],
    revealedLetters: [1, 5],
    timeLimit: 35,
    points: 1000,
    explanation: 'The Great Pyramids of Giza were built over 4,500 years ago.'
  },
  {
    id: 'w3',
    word: 'VOLCANO',
    category: 'Earth Sciences',
    visualClues: ['🌋', 'Magma & Molten Lava', 'Crater Eruption', 'Ash Cloud'],
    revealedLetters: [0, 3],
    timeLimit: 30,
    points: 1000,
    explanation: 'A volcano erupts molten rock and gases from beneath the Earth\'s crust.'
  },
  {
    id: 'w4',
    word: 'TELESCOPE',
    category: 'Scientific Instruments',
    visualClues: ['🔭', 'Deep Space Observation', 'Lenses & Mirrors', 'Distant Galaxies'],
    revealedLetters: [0, 3, 7],
    timeLimit: 35,
    points: 1000,
    explanation: 'The James Webb and Hubble space telescopes capture light from early cosmic dawn.'
  },
  {
    id: 'w5',
    word: 'GALAXY',
    category: 'Astronomy & Cosmos',
    visualClues: ['🌌', 'Billions of Stars', 'Milky Way & Andromeda', 'Spiral Cosmic Structure'],
    revealedLetters: [0, 3],
    timeLimit: 30,
    points: 1000,
    explanation: 'A gravitationally bound system of stars, stellar remnants, interstellar gas, and dark matter.'
  },
  {
    id: 'w6',
    word: 'GUITAR',
    category: 'Music & Instruments',
    visualClues: ['🎸', 'Plucked Strings', 'Fretboard & Neck', 'Acoustic or Electric Solo'],
    revealedLetters: [0, 4],
    timeLimit: 30,
    points: 1000,
    explanation: 'A versatile six-stringed instrument played worldwide across rock, jazz, and classical music.'
  }
];
