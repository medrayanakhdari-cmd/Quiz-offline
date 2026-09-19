import express from 'express';
import http from 'http';
import path from 'path';
import os from 'os';
import { Server, Socket } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_QUESTIONS, DEFAULT_WORDS, DEFAULT_PROJECT_SUMMARY } from './src/data/defaultData';
import { GameState, Player, QuizQuestion, WordGuessItem, AdminSettings, ProjectSummary } from './src/types';

// Helper to determine the local LAN IPv4 address (e.g. for Wi-Fi hotspot)
function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  const candidateIps: string[] = [];

  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        candidateIps.push(iface.address);
      }
    }
  }

  // Prioritize typical hotspot/private LAN ranges
  const privateIp = candidateIps.find(ip => 
    ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')
  );

  return privateIp || candidateIps[0] || '127.0.0.1';
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' }
  });
  const PORT = 3000;

  app.use(express.json());

  const hostIp = getLocalIpAddress();

  // Initial Game State
  const state: GameState = {
    mode: 'quiz',
    quizPhase: 'LOBBY',
    wordPhase: 'WORD_LOBBY',
    currentQuestionIndex: 0,
    currentWordIndex: 0,
    timeRemaining: 20,
    timeTotal: 20,
    players: {},
    questions: [...DEFAULT_QUESTIONS],
    wordList: [...DEFAULT_WORDS],
    projectSummary: { ...DEFAULT_PROJECT_SUMMARY },
    adminSettings: {
      quizTimeLimit: 20,
      wordTimeLimit: 30,
      speedBonusEnabled: true,
      streakBonusEnabled: true,
      soundEnabled: true
    },
    revealedLetters: [],
    correctWordGuessesCount: 0,
    hostIp,
    hostPort: PORT,
    questionStartTime: Date.now()
  };

  let timerInterval: NodeJS.Timeout | null = null;
  let adminSocketId: string | null = null;

  function broadcastState() {
    io.emit('state_update', state);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startQuizTimer(durationSeconds: number) {
    stopTimer();
    state.timeTotal = durationSeconds;
    state.timeRemaining = durationSeconds;
    state.questionStartTime = Date.now();
    broadcastState();

    timerInterval = setInterval(() => {
      state.timeRemaining -= 1;
      if (state.timeRemaining <= 0) {
        state.timeRemaining = 0;
        stopTimer();
        handleQuizTimeUp();
      } else {
        broadcastState();
      }
    }, 1000);
  }

  function startWordTimer(durationSeconds: number) {
    stopTimer();
    state.timeTotal = durationSeconds;
    state.timeRemaining = durationSeconds;
    state.questionStartTime = Date.now();
    broadcastState();

    timerInterval = setInterval(() => {
      state.timeRemaining -= 1;
      // Periodically reveal a hint letter if less than 3 revealed
      const currentWord = state.wordList[state.currentWordIndex];
      if (currentWord && state.timeRemaining === Math.floor(state.timeTotal / 2) && state.revealedLetters.length < 3) {
        revealRandomLetter(currentWord.word);
      }

      if (state.timeRemaining <= 0) {
        state.timeRemaining = 0;
        stopTimer();
        handleWordTimeUp();
      } else {
        broadcastState();
      }
    }, 1000);
  }

  function revealRandomLetter(word: string) {
    const unrevealedIndices: number[] = [];
    for (let i = 0; i < word.length; i++) {
      if (!state.revealedLetters.includes(i) && word[i] !== ' ' && word[i] !== '-') {
        unrevealedIndices.push(i);
      }
    }
    if (unrevealedIndices.length > 0) {
      const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
      state.revealedLetters.push(randomIndex);
    }
  }

  function handleQuizTimeUp() {
    state.quizPhase = 'ANSWER_REVEAL';
    const currentQ = state.questions[state.currentQuestionIndex];

    // For any player who didn't answer in time, mark as answered with 0 points
    Object.values(state.players).forEach(player => {
      if (!player.hasAnswered) {
        player.hasAnswered = true;
        player.streak = 0;
        player.lastAnswer = {
          choiceIndex: -1,
          timeMs: state.timeTotal * 1000,
          isCorrect: false,
          pointsAwarded: 0
        };
      }
    });

    broadcastState();
  }

  function handleWordTimeUp() {
    state.wordPhase = 'WORD_REVEAL';
    const currentWord = state.wordList[state.currentWordIndex];
    if (currentWord) {
      // Reveal all letters
      state.revealedLetters = Array.from({ length: currentWord.word.length }, (_, i) => i);
    }
    broadcastState();
  }

  function checkAllPlayersAnsweredQuiz() {
    const playerList = Object.values(state.players);
    if (playerList.length === 0) return false;
    const allDone = playerList.every(p => p.hasAnswered);
    if (allDone && state.quizPhase === 'QUESTION_ACTIVE') {
      stopTimer();
      handleQuizTimeUp();
      return true;
    }
    return false;
  }

  function checkAllPlayersGuessedWord() {
    const playerList = Object.values(state.players);
    if (playerList.length === 0) return false;
    const allGuessed = playerList.every(p => p.hasGuessedWord);
    if (allGuessed && state.wordPhase === 'WORD_ACTIVE') {
      stopTimer();
      handleWordTimeUp();
      return true;
    }
    return false;
  }

  // REST API Routes
  app.get('/api/network-info', (_req, res) => {
    res.json({
      ip: getLocalIpAddress(),
      port: PORT,
      url: `http://${getLocalIpAddress()}:${PORT}`
    });
  });

  app.get('/api/state', (_req, res) => {
    res.json(state);
  });

  // Socket.io Events
  io.on('connection', (socket: Socket) => {
    // Send immediate state to newly connected client
    socket.emit('state_update', state);

    // JOIN REQUEST
    socket.on('join', (data: { username: string; avatar?: string; playerId?: string }) => {
      const trimmed = (data.username || '').trim();

      // Check for Admin Secret: #*admin*#
      if (trimmed === '#*admin*#') {
        adminSocketId = socket.id;
        socket.emit('admin_authenticated', { success: true });
        socket.emit('state_update', state);
        return;
      }

      // Regular Player Join
      const username = trimmed || `Student ${Object.keys(state.players).length + 1}`;
      const avatar = data.avatar || 'astro-cat';

      // Check if player with same username or playerId existed (e.g. page refresh or reconnect)
      const existingPlayer = Object.values(state.players).find(
        p => (data.playerId && p.id === data.playerId) ||
             p.username.trim().toLowerCase() === username.toLowerCase() ||
             p.id === socket.id
      );

      const prevScore = existingPlayer ? Number(existingPlayer.score) || 0 : 0;
      const prevStreak = existingPlayer ? Number(existingPlayer.streak) || 0 : 0;
      const prevAnswer = existingPlayer ? existingPlayer.lastAnswer : null;
      const prevHasAnswered = existingPlayer ? Boolean(existingPlayer.hasAnswered) : false;

      // Clean up previous socket record if different
      if (existingPlayer && existingPlayer.id !== socket.id) {
        delete state.players[existingPlayer.id];
      }

      state.players[socket.id] = {
        id: socket.id,
        username,
        avatar: existingPlayer ? existingPlayer.avatar : avatar,
        score: prevScore,
        streak: prevStreak,
        isReady: true,
        hasAnswered: prevHasAnswered,
        lastAnswer: prevAnswer,
        hasGuessedWord: existingPlayer ? existingPlayer.hasGuessedWord : false,
        guessRank: existingPlayer ? existingPlayer.guessRank : undefined
      };

      socket.emit('player_joined', { player: state.players[socket.id] });
      broadcastState();
    });

    // Player Leave / Exit Event
    socket.on('player:leave', () => {
      delete state.players[socket.id];
      socket.emit('player_left', { success: true });
      broadcastState();
    });

    // ADMIN: Leave / Exit Host Mode
    socket.on('admin:leave', () => {
      if (socket.id === adminSocketId) {
        adminSocketId = null;
      }
      socket.emit('admin_left', { success: true });
      broadcastState();
    });

    // ADMIN: Verify admin credentials if reconnecting or toggling
    socket.on('admin:auth', (data: any) => {
      const code = typeof data === 'string' ? data : (data?.pass || data?.code || '');
      if (code === '#*admin*#') {
        adminSocketId = socket.id;
        socket.emit('admin_authenticated', { success: true });
        broadcastState();
      } else {
        socket.emit('admin_authenticated', { success: false, error: 'Code incorrect' });
      }
    });

    // ADMIN: Switch Game Mode ('briefing' | 'quiz' | 'word_guess')
    socket.on('admin:switch_mode', (mode: 'briefing' | 'quiz' | 'word_guess') => {
      stopTimer();
      state.mode = mode;
      if (mode === 'quiz') {
        state.quizPhase = 'LOBBY';
      } else if (mode === 'word_guess') {
        state.wordPhase = 'WORD_LOBBY';
      }
      broadcastState();
    });

    // ADMIN: Start Quiz
    socket.on('admin:start_quiz', () => {
      state.mode = 'quiz';
      state.currentQuestionIndex = 0;
      // Reset players scores and state
      Object.values(state.players).forEach(p => {
        p.score = 0;
        p.streak = 0;
        p.hasAnswered = false;
        p.lastAnswer = null;
      });

      const question = state.questions[state.currentQuestionIndex];
      const duration = question ? question.timeLimit : state.adminSettings.quizTimeLimit;

      state.quizPhase = 'QUESTION_ACTIVE';
      startQuizTimer(duration);
    });

    // ADMIN: Next Question
    socket.on('admin:next_question', () => {
      state.currentQuestionIndex += 1;
      if (state.currentQuestionIndex >= state.questions.length) {
        state.quizPhase = 'PODIUM';
        stopTimer();
        broadcastState();
        return;
      }

      // Reset players answers for new question
      Object.values(state.players).forEach(p => {
        p.hasAnswered = false;
        p.lastAnswer = null;
      });

      const question = state.questions[state.currentQuestionIndex];
      const duration = question ? question.timeLimit : state.adminSettings.quizTimeLimit;

      state.quizPhase = 'QUESTION_ACTIVE';
      startQuizTimer(duration);
    });

    // ADMIN: Show Scoreboard after answer reveal
    socket.on('admin:show_scoreboard', () => {
      state.quizPhase = 'SCOREBOARD';
      broadcastState();
    });

    // ADMIN: Show Podium directly
    socket.on('admin:show_podium', () => {
      state.quizPhase = 'PODIUM';
      stopTimer();
      broadcastState();
    });

    // ADMIN: Skip Timer (immediately reveal answer)
    socket.on('admin:skip_timer', () => {
      stopTimer();
      if (state.mode === 'quiz' && state.quizPhase === 'QUESTION_ACTIVE') {
        handleQuizTimeUp();
      } else if (state.mode === 'word_guess' && state.wordPhase === 'WORD_ACTIVE') {
        handleWordTimeUp();
      }
    });

    // ADMIN: Start Word Guess Round
    socket.on('admin:start_word_round', () => {
      state.mode = 'word_guess';
      state.currentWordIndex = 0;
      state.correctWordGuessesCount = 0;
      // Reset players guesses
      Object.values(state.players).forEach(p => {
        p.hasGuessedWord = false;
        p.guessRank = undefined;
      });

      const wordItem = state.wordList[state.currentWordIndex];
      state.revealedLetters = [...(wordItem ? wordItem.revealedLetters : [])];
      state.wordPhase = 'WORD_ACTIVE';
      const duration = wordItem ? wordItem.timeLimit : state.adminSettings.wordTimeLimit;
      startWordTimer(duration);
    });

    // ADMIN: Reveal single letter in Word Guess
    socket.on('admin:reveal_word_letter', () => {
      const currentWord = state.wordList[state.currentWordIndex];
      if (currentWord) {
        revealRandomLetter(currentWord.word);
        broadcastState();
      }
    });

    // ADMIN: Next Word
    socket.on('admin:next_word', () => {
      state.currentWordIndex += 1;
      if (state.currentWordIndex >= state.wordList.length) {
        state.wordPhase = 'WORD_PODIUM';
        stopTimer();
        broadcastState();
        return;
      }

      state.correctWordGuessesCount = 0;
      Object.values(state.players).forEach(p => {
        p.hasGuessedWord = false;
        p.guessRank = undefined;
      });

      const wordItem = state.wordList[state.currentWordIndex];
      state.revealedLetters = [...(wordItem ? wordItem.revealedLetters : [])];
      state.wordPhase = 'WORD_ACTIVE';
      const duration = wordItem ? wordItem.timeLimit : state.adminSettings.wordTimeLimit;
      startWordTimer(duration);
    });

    // ADMIN: Show Word Scoreboard
    socket.on('admin:show_word_scoreboard', () => {
      state.wordPhase = 'WORD_SCOREBOARD';
      broadcastState();
    });

    // ADMIN: Update Admin Settings
    socket.on('admin:update_settings', (settings: Partial<AdminSettings>) => {
      state.adminSettings = { ...state.adminSettings, ...settings };
      broadcastState();
    });

    // ADMIN: Update Questions List
    socket.on('admin:update_questions', (questions: QuizQuestion[]) => {
      state.questions = questions;
      broadcastState();
    });

    // ADMIN: Update Word List
    socket.on('admin:update_words', (words: WordGuessItem[]) => {
      state.wordList = words;
      broadcastState();
    });

    // ADMIN: Update Project Summary
    socket.on('admin:update_project_summary', (summary: Partial<ProjectSummary>) => {
      state.projectSummary = {
        ...state.projectSummary,
        ...summary,
        lastUpdated: Date.now()
      };
      broadcastState();
    });

    // PLAYER: Toggle Ready For Quiz (in briefing/study mode)
    socket.on('player:toggle_ready_quiz', (ready?: boolean) => {
      const player = state.players[socket.id];
      if (player) {
        player.isReadyForQuiz = ready !== undefined ? ready : !player.isReadyForQuiz;
        broadcastState();
      }
    });

    // ADMIN: Reset Entire Game
    socket.on('admin:reset_game', () => {
      stopTimer();
      state.currentQuestionIndex = 0;
      state.currentWordIndex = 0;
      state.quizPhase = 'LOBBY';
      state.wordPhase = 'WORD_LOBBY';
      state.revealedLetters = [];
      state.correctWordGuessesCount = 0;
      Object.values(state.players).forEach(p => {
        p.score = 0;
        p.streak = 0;
        p.hasAnswered = false;
        p.lastAnswer = null;
        p.hasGuessedWord = false;
        p.guessRank = undefined;
      });
      broadcastState();
    });

    // ADMIN: Kick Player
    socket.on('admin:kick_player', (playerId: string) => {
      if (state.players[playerId]) {
        delete state.players[playerId];
        broadcastState();
      }
    });

    // PLAYER: Submit Quiz Answer
    socket.on('player:submit_quiz_answer', (data: { choiceIndex: number; clientTimeLeft?: number; playerId?: string; username?: string }) => {
      // Find player by socket.id or playerId or username
      let player: Player | undefined = state.players[socket.id];
      if (!player && data.playerId && state.players[data.playerId]) {
        player = state.players[data.playerId];
      }
      if (!player && data.username) {
        player = Object.values(state.players).find(p => p.username.toLowerCase() === data.username!.toLowerCase());
      }
      if (!player) return;

      // Allow answer if in active question, OR if in answer reveal but player was timed-out (choiceIndex === -1)
      const isAllowedPhase = state.quizPhase === 'QUESTION_ACTIVE' ||
        (state.quizPhase === 'ANSWER_REVEAL' && player.lastAnswer && player.lastAnswer.choiceIndex === -1);
      if (!isAllowedPhase) return;

      // Prevent genuine double answers if already answered with a chosen option
      if (player.hasAnswered && player.lastAnswer && player.lastAnswer.choiceIndex >= 0) return;

      // Ensure socket mapping is current
      if (player.id !== socket.id) {
        delete state.players[player.id];
        player.id = socket.id;
        state.players[socket.id] = player;
      }

      const currentQ = state.questions[state.currentQuestionIndex];
      if (!currentQ) return;

      const choiceIdx = Number(data.choiceIndex);
      const correctIdx = Number(currentQ.correctIndex);
      const isCorrect = choiceIdx === correctIdx;

      const totalTime = Number(state.timeTotal) > 0 ? Number(state.timeTotal) : (Number(currentQ.timeLimit) > 0 ? Number(currentQ.timeLimit) : 20);
      const remaining = Math.max(0, Number(state.timeRemaining) >= 0 ? Number(state.timeRemaining) : (data.clientTimeLeft !== undefined ? Number(data.clientTimeLeft) : 10));
      const timeElapsedSec = Math.max(0, totalTime - remaining);
      const timeRatio = Math.max(0, Math.min(1, timeElapsedSec / totalTime));

      let pointsAwarded = 0;
      if (isCorrect) {
        // Base points + speed bonus
        const basePoints = Number(currentQ.points) > 0 ? Number(currentQ.points) : 1000;
        let speedMultiplier = 1;
        if (state.adminSettings.speedBonusEnabled) {
          speedMultiplier = Math.max(0.5, 1 - (timeRatio / 2));
        }
        if (!isFinite(speedMultiplier) || isNaN(speedMultiplier)) {
          speedMultiplier = 1;
        }

        pointsAwarded = Math.round(basePoints * speedMultiplier);
        // Guarantee at least 500 pts for any correct answer
        if (!isFinite(pointsAwarded) || isNaN(pointsAwarded) || pointsAwarded <= 0) {
          pointsAwarded = Math.round(basePoints * 0.5);
        }

        // Streak bonus (+100 for streak >= 1, +200 for streak >= 2, up to 500)
        const currentStreak = Number(player.streak) || 0;
        if (state.adminSettings.streakBonusEnabled && currentStreak >= 1) {
          const streakBonus = Math.min(500, currentStreak * 100);
          pointsAwarded += streakBonus;
        }

        player.streak = currentStreak + 1;
        player.score = (Number(player.score) || 0) + pointsAwarded;
      } else {
        player.streak = 0;
      }

      player.hasAnswered = true;
      player.lastAnswer = {
        choiceIndex: choiceIdx,
        timeMs: Math.round(timeElapsedSec * 1000),
        isCorrect,
        pointsAwarded
      };

      // Notify player immediately of their submission
      socket.emit('answer_received', {
        choiceIndex: choiceIdx,
        isCorrect,
        pointsAwarded,
        totalScore: player.score,
        streak: player.streak
      });

      broadcastState();

      // Check if all players have answered
      checkAllPlayersAnsweredQuiz();
    });

    // PLAYER: Submit Word Guess
    socket.on('player:submit_word_guess', (data: { guess: string }) => {
      const player = state.players[socket.id];
      if (!player) return;
      if (state.wordPhase !== 'WORD_ACTIVE') return;
      if (player.hasGuessedWord) return;

      const currentWordItem = state.wordList[state.currentWordIndex];
      if (!currentWordItem) return;

      const cleanInput = (data.guess || '').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const targetWord = currentWordItem.word.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (cleanInput === targetWord) {
        state.correctWordGuessesCount += 1;
        const rank = state.correctWordGuessesCount;
        player.hasGuessedWord = true;
        player.guessRank = rank;

        // Points based on speed and how few hints were revealed
        const basePoints = currentWordItem.points || 1000;
        const timeRatio = Math.max(0.4, state.timeRemaining / state.timeTotal);
        const hintPenalty = state.revealedLetters.length * 80;
        const rankBonus = rank === 1 ? 300 : rank === 2 ? 150 : 50;

        const pointsAwarded = Math.max(200, Math.round(basePoints * timeRatio - hintPenalty + rankBonus));
        player.score += pointsAwarded;

        socket.emit('word_guess_result', {
          correct: true,
          pointsAwarded,
          rank,
          word: currentWordItem.word
        });

        broadcastState();
        checkAllPlayersGuessedWord();
      } else {
        socket.emit('word_guess_result', {
          correct: false,
          attempt: data.guess
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.id === adminSocketId) {
        adminSocketId = null;
      }
      // Keep player state for 60s in case of page refresh, or remove if in lobby
      if (state.quizPhase === 'LOBBY' && state.wordPhase === 'WORD_LOBBY') {
        delete state.players[socket.id];
        broadcastState();
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`Ali & Rayan - Live Quiz & Study Server Started!`);
    console.log(`Local LAN IP: http://${hostIp}:${PORT}`);
    console.log(`Localhost:   http://localhost:${PORT}`);
    console.log(`Admin Code:  #*admin*# (enter as username)`);
    console.log(`=========================================`);
  });
}

startServer().catch(err => {
  console.error('Server startup failure:', err);
});
