import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GameState, Player, GameMode, AdminSettings, QuizQuestion, WordGuessItem, ProjectSummary } from './types';
import { getSocket } from './utils/socket';
import { sound } from './utils/audio';
import { Navbar } from './components/Navbar';
import { JoinScreen } from './components/JoinScreen';
import { HostScreen } from './components/HostScreen';
import { PlayerScreen } from './components/PlayerScreen';
import { SettingsModal } from './components/SettingsModal';
import { NetworkHelpModal } from './components/NetworkHelpModal';
import { NetworkConfigModal } from './components/NetworkConfigModal';
import { DEFAULT_QUESTIONS, DEFAULT_WORDS, DEFAULT_PROJECT_SUMMARY } from './data/defaultData';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const currentPlayerRef = useRef<Player | null>(null);
  currentPlayerRef.current = currentPlayer;

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNetworkHelpOpen, setIsNetworkHelpOpen] = useState(false);
  const [isNetworkConfigOpen, setIsNetworkConfigOpen] = useState(false);

  // Default fallback state while socket connects
  const [gameState, setGameState] = useState<GameState>({
    mode: 'briefing',
    quizPhase: 'LOBBY',
    wordPhase: 'WORD_LOBBY',
    currentQuestionIndex: 0,
    currentWordIndex: 0,
    timeRemaining: 20,
    timeTotal: 20,
    players: {},
    questions: DEFAULT_QUESTIONS,
    wordList: DEFAULT_WORDS,
    projectSummary: DEFAULT_PROJECT_SUMMARY,
    adminSettings: {
      quizTimeLimit: 20,
      wordTimeLimit: 30,
      speedBonusEnabled: true,
      streakBonusEnabled: true,
      soundEnabled: true
    },
    revealedLetters: [],
    correctWordGuessesCount: 0,
    hostIp: '127.0.0.1',
    hostPort: 3000,
    questionStartTime: Date.now()
  });

  const prevTimeRef = useRef<number>(20);
  const prevPhaseRef = useRef<string>('LOBBY');

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      setConnected(true);
      // Automatically re-register player on reconnect
      if (currentPlayerRef.current) {
        socket.emit('join', {
          username: currentPlayerRef.current.username,
          avatar: currentPlayerRef.current.avatar,
          playerId: currentPlayerRef.current.id
        });
      }
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('state_update', (newState: GameState) => {
      setGameState(newState);

      // Keep currentPlayer in sync with server state
      setCurrentPlayer(prev => {
        if (!prev) return null;
        if (socket.id && newState.players[socket.id]) return newState.players[socket.id];
        if (prev.id && newState.players[prev.id]) return newState.players[prev.id];
        const matchByName = Object.values(newState.players).find(
          p => p.username.toLowerCase() === prev.username.toLowerCase()
        );
        return matchByName || prev;
      });

      // Audio effects based on state changes
      if (newState.timeRemaining !== prevTimeRef.current) {
        if (
          (newState.quizPhase === 'QUESTION_ACTIVE' || newState.wordPhase === 'WORD_ACTIVE') &&
          newState.timeRemaining > 0
        ) {
          if (newState.timeRemaining <= 5) {
            sound.playHurryTick();
          } else {
            sound.playTick();
          }
        }
        prevTimeRef.current = newState.timeRemaining;
      }

      // Trigger fanfare / sounds on phase change
      if (newState.quizPhase !== prevPhaseRef.current) {
        if (newState.quizPhase === 'ANSWER_REVEAL') {
          sound.playCorrect();
        } else if (newState.quizPhase === 'SCOREBOARD') {
          sound.playScoreWhoosh();
          setTimeout(() => sound.playFanfare(), 300);
        } else if (newState.quizPhase === 'PODIUM') {
          sound.playPodiumWinner();
          try {
            confetti({
              particleCount: 160,
              spread: 100,
              origin: { y: 0.5 }
            });
          } catch {}
        }
        prevPhaseRef.current = newState.quizPhase;
      }
    });

    socket.on('admin_authenticated', (data: { success: boolean }) => {
      if (data.success) {
        setIsAdmin(true);
        sound.playFanfare();
      }
    });

    socket.on('player_joined', (data: { player: Player }) => {
      setCurrentPlayer(data.player);
      sound.playButtonPress();
    });

    socket.on('answer_received', (data: { choiceIndex: number; isCorrect: boolean; pointsAwarded: number; totalScore: number; streak?: number }) => {
      if (data.isCorrect) {
        sound.playCorrect();
        if ((data.streak || 0) >= 2) {
          sound.playStreakFlame();
        }
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}
      } else {
        sound.playIncorrect();
      }

      setCurrentPlayer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          score: data.totalScore !== undefined ? data.totalScore : prev.score,
          streak: data.streak !== undefined ? data.streak : prev.streak,
          hasAnswered: true,
          lastAnswer: {
            choiceIndex: data.choiceIndex,
            timeMs: 0,
            isCorrect: data.isCorrect,
            pointsAwarded: data.pointsAwarded
          }
        };
      });
    });

    socket.on('word_guess_result', (data: { correct: boolean }) => {
      if (data.correct) {
        sound.playCorrect();
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 }
          });
        } catch {}
      } else {
        sound.playIncorrect();
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('state_update');
      socket.off('admin_authenticated');
      socket.off('player_joined');
      socket.off('answer_received');
      socket.off('word_guess_result');
    };
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  const handleJoin = (username: string, avatar: string) => {
    const socket = getSocket();
    socket.emit('join', { username, avatar });
  };

  // Admin Actions
  const handleSwitchMode = (mode: GameMode) => {
    const socket = getSocket();
    socket.emit('admin:switch_mode', mode);
  };

  const handleStartQuiz = () => {
    const socket = getSocket();
    socket.emit('admin:start_quiz');
  };

  const handleNextQuestion = () => {
    const socket = getSocket();
    socket.emit('admin:next_question');
  };

  const handleShowScoreboard = () => {
    const socket = getSocket();
    socket.emit('admin:show_scoreboard');
  };

  const handleShowPodium = () => {
    const socket = getSocket();
    socket.emit('admin:show_podium');
  };

  const handleSkipTimer = () => {
    const socket = getSocket();
    socket.emit('admin:skip_timer');
  };

  const handleStartWordRound = () => {
    const socket = getSocket();
    socket.emit('admin:start_word_round');
  };

  const handleRevealWordLetter = () => {
    const socket = getSocket();
    socket.emit('admin:reveal_word_letter');
  };

  const handleNextWord = () => {
    const socket = getSocket();
    socket.emit('admin:next_word');
  };

  const handleShowWordScoreboard = () => {
    const socket = getSocket();
    socket.emit('admin:show_word_scoreboard');
  };

  const handleResetGame = () => {
    const socket = getSocket();
    socket.emit('admin:reset_game');
  };

  const handleKickPlayer = (playerId: string) => {
    const socket = getSocket();
    socket.emit('admin:kick_player', playerId);
  };

  const handleUpdateSettings = (settings: Partial<AdminSettings>) => {
    const socket = getSocket();
    socket.emit('admin:update_settings', settings);
  };

  const handleUpdateQuestions = (questions: QuizQuestion[]) => {
    const socket = getSocket();
    socket.emit('admin:update_questions', questions);
  };

  const handleUpdateWords = (words: WordGuessItem[]) => {
    const socket = getSocket();
    socket.emit('admin:update_words', words);
  };

  const handleUpdateProjectSummary = (summary: Partial<ProjectSummary>) => {
    const socket = getSocket();
    socket.emit('admin:update_project_summary', summary);
  };

  const handleUpdateHostNetwork = (hostIp: string, hostPort: number) => {
    const socket = getSocket();
    socket.emit('admin:update_host_network', { hostIp, hostPort });
  };

  // Player Actions
  const handleSubmitQuizAnswer = (choiceIndex: number) => {
    const socket = getSocket();
    socket.emit('player:submit_quiz_answer', {
      choiceIndex,
      clientTimeLeft: gameState.timeRemaining,
      playerId: currentPlayer?.id,
      username: currentPlayer?.username
    });
  };

  const handleSubmitWordGuess = (guess: string) => {
    const socket = getSocket();
    socket.emit('player:submit_word_guess', { guess });
  };

  const handleToggleReadyQuiz = () => {
    const socket = getSocket();
    socket.emit('player:toggle_ready_quiz');
  };

  const handleExitAdmin = () => {
    const socket = getSocket();
    socket.emit('admin:leave');
    setIsAdmin(false);
    sound.playButtonPress();
  };

  const handleExitUser = () => {
    const socket = getSocket();
    socket.emit('player:leave');
    setCurrentPlayer(null);
    sound.playButtonPress();
  };

  const connectedPlayersList = Object.values(gameState.players);
  const activePlayer = (currentPlayer?.id && gameState.players[currentPlayer.id]) ||
    (getSocket().id && gameState.players[getSocket().id!]) ||
    (currentPlayer?.username && Object.values(gameState.players).find(p => p.username.toLowerCase() === currentPlayer.username.toLowerCase())) ||
    currentPlayer;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        isAdmin={isAdmin}
        gameMode={gameState.mode}
        quizPhase={gameState.quizPhase}
        wordPhase={gameState.wordPhase}
        connected={connected}
        playerCount={connectedPlayersList.length}
        hostIp={gameState.hostIp}
        hostPort={gameState.hostPort}
        soundEnabled={soundEnabled}
        currentPlayerName={currentPlayer?.username}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNetworkHelp={() => setIsNetworkHelpOpen(true)}
        onOpenNetworkConfig={() => setIsNetworkConfigOpen(true)}
        onSwitchMode={handleSwitchMode}
        onExitAdmin={handleExitAdmin}
        onExitUser={handleExitUser}
      />

      {/* Main App Content */}
      <main className="flex-1">
        {/* Case 1: Admin / Host Interface */}
        {isAdmin ? (
          <HostScreen
            gameState={gameState}
            onStartQuiz={handleStartQuiz}
            onNextQuestion={handleNextQuestion}
            onShowScoreboard={handleShowScoreboard}
            onShowPodium={handleShowPodium}
            onSkipTimer={handleSkipTimer}
            onStartWordRound={handleStartWordRound}
            onRevealWordLetter={handleRevealWordLetter}
            onNextWord={handleNextWord}
            onShowWordScoreboard={handleShowWordScoreboard}
            onResetGame={handleResetGame}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onKickPlayer={handleKickPlayer}
            onSwitchMode={handleSwitchMode}
            onExitAdmin={handleExitAdmin}
            onUpdateHostNetwork={handleUpdateHostNetwork}
          />
        ) : activePlayer ? (
          /* Case 2: Player Controller Interface (mobile/desktop student view) */
          <PlayerScreen
            gameState={gameState}
            player={activePlayer}
            onSubmitQuizAnswer={handleSubmitQuizAnswer}
            onSubmitWordGuess={handleSubmitWordGuess}
            onToggleReadyQuiz={handleToggleReadyQuiz}
            onExit={handleExitUser}
          />
        ) : (
          /* Case 3: Join Screen (Same screen for students & admin entering #*admin*#) */
          <JoinScreen
            onJoin={handleJoin}
            connectedPlayers={connectedPlayersList}
            hostIp={gameState.hostIp}
            hostPort={gameState.hostPort}
          />
        )}
      </main>

      {/* Admin Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={gameState.adminSettings}
        questions={gameState.questions}
        words={gameState.wordList}
        projectSummary={gameState.projectSummary}
        hostIp={gameState.hostIp}
        hostPort={gameState.hostPort}
        detectedIps={gameState.detectedIps}
        onUpdateSettings={handleUpdateSettings}
        onUpdateQuestions={handleUpdateQuestions}
        onUpdateWords={handleUpdateWords}
        onUpdateProjectSummary={handleUpdateProjectSummary}
        onUpdateHostNetwork={handleUpdateHostNetwork}
      />

      {/* Host Network & QR Code Quick Modal */}
      <NetworkConfigModal
        isOpen={isNetworkConfigOpen}
        onClose={() => setIsNetworkConfigOpen(false)}
        currentHostIp={gameState.hostIp}
        currentHostPort={gameState.hostPort}
        detectedIps={gameState.detectedIps}
        onUpdateNetwork={handleUpdateHostNetwork}
      />

      {/* Local Wi-Fi Hotspot & Network Guide Modal */}
      <NetworkHelpModal
        isOpen={isNetworkHelpOpen}
        onClose={() => setIsNetworkHelpOpen(false)}
        hostIp={gameState.hostIp}
        hostPort={gameState.hostPort}
      />
    </div>
  );
}
