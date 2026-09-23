export type GameMode = 'briefing' | 'quiz' | 'word_guess';

export type QuizPhase = 
  | 'LOBBY'
  | 'QUESTION_PREVIEW'
  | 'QUESTION_ACTIVE'
  | 'ANSWER_REVEAL'
  | 'SCOREBOARD'
  | 'PODIUM';

export type WordPhase =
  | 'WORD_LOBBY'
  | 'WORD_ACTIVE'
  | 'WORD_REVEAL'
  | 'WORD_SCOREBOARD'
  | 'WORD_PODIUM';

export interface Player {
  id: string;
  username: string;
  avatar: string;
  score: number;
  streak: number;
  isReady: boolean;
  isReadyForQuiz?: boolean;
  hasAnswered: boolean;
  lastAnswer: {
    choiceIndex?: number;
    timeMs?: number;
    isCorrect?: boolean;
    pointsAwarded?: number;
    wordGuess?: string;
  } | null;
  hasGuessedWord?: boolean;
  guessRank?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  category: string;
  timeLimit: number; // in seconds (e.g. 20)
  points: number; // default 1000
  choices: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3
  explanation?: string;
  visualClue?: string; // emoji or keyword
}

export interface WordGuessItem {
  id: string;
  word: string; // uppercase
  category: string;
  visualClues: string[]; // e.g. ["🦒", "Afrique", "Cou géant", "Herbivore"]
  revealedLetters: number[]; // indices of revealed letters
  timeLimit: number; // in seconds (e.g. 30)
  points: number;
  explanation?: string;
}

export interface SummaryPoint {
  id: string;
  title: string;
  description: string;
  icon?: string;
  category?: string;
}

export interface ProjectSummary {
  title: string;
  subtitle: string;
  author: string;
  category: string;
  overview: string;
  keyPoints: SummaryPoint[];
  importantNotes?: string;
  quizTips?: string;
  lastUpdated?: number;
}

export interface AdminSettings {
  quizTimeLimit: number;
  wordTimeLimit: number;
  speedBonusEnabled: boolean;
  streakBonusEnabled: boolean;
  soundEnabled: boolean;
}

export interface NetworkInterfaceInfo {
  name: string;
  address: string;
  isHotspotOrWifi?: boolean;
}

export interface GameState {
  mode: GameMode;
  quizPhase: QuizPhase;
  wordPhase: WordPhase;
  currentQuestionIndex: number;
  currentWordIndex: number;
  timeRemaining: number;
  timeTotal: number;
  players: Record<string, Player>;
  questions: QuizQuestion[];
  wordList: WordGuessItem[];
  projectSummary: ProjectSummary;
  adminSettings: AdminSettings;
  revealedLetters: number[]; // For active word round
  correctWordGuessesCount: number;
  hostIp: string;
  hostPort: number;
  detectedIps?: NetworkInterfaceInfo[];
  questionStartTime: number;
}
