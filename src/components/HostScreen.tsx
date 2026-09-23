import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, QuizQuestion, WordGuessItem } from '../types';
import { sound } from '../utils/audio';
import { QRCodeDisplay } from './QRCodeDisplay';
import { ProjectSummaryView } from './ProjectSummaryView';
import { AvatarDisplay } from './AvatarDisplay';
import { NetworkConfigModal } from './NetworkConfigModal';
import {
  Play,
  SkipForward,
  Trophy,
  Users,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  Settings as SettingsIcon,
  ChevronRight,
  Wifi,
  BookOpen,
  LogOut,
  Crown,
  Medal,
  Award,
  Edit3,
  Radio
} from 'lucide-react';

interface HostScreenProps {
  gameState: GameState;
  onStartQuiz: () => void;
  onNextQuestion: () => void;
  onShowScoreboard: () => void;
  onShowPodium: () => void;
  onSkipTimer: () => void;
  onStartWordRound: () => void;
  onRevealWordLetter: () => void;
  onNextWord: () => void;
  onShowWordScoreboard: () => void;
  onResetGame: () => void;
  onOpenSettings: () => void;
  onKickPlayer: (playerId: string) => void;
  onSwitchMode?: (mode: 'briefing' | 'quiz' | 'word_guess') => void;
  onExitAdmin?: () => void;
  onUpdateHostNetwork?: (hostIp: string, hostPort: number) => void;
}

const SHAPES = [
  { symbol: '▲', color: 'bg-rose-600', borderColor: 'border-rose-500', label: 'Red' },
  { symbol: '◆', color: 'bg-blue-600', borderColor: 'border-blue-500', label: 'Blue' },
  { symbol: '●', color: 'bg-amber-500', borderColor: 'border-amber-400', label: 'Yellow' },
  { symbol: '■', color: 'bg-emerald-600', borderColor: 'border-emerald-500', label: 'Green' },
];

export const HostScreen: React.FC<HostScreenProps> = ({
  gameState,
  onStartQuiz,
  onNextQuestion,
  onShowScoreboard,
  onShowPodium,
  onSkipTimer,
  onStartWordRound,
  onRevealWordLetter,
  onNextWord,
  onResetGame,
  onOpenSettings,
  onKickPlayer,
  onSwitchMode,
  onExitAdmin,
  onUpdateHostNetwork
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isNetworkConfigOpen, setIsNetworkConfigOpen] = useState(false);
  const playersList = Object.values(gameState.players);
  const totalPlayers = playersList.length;
  const answeredCount = playersList.filter(p => p.hasAnswered).length;
  const currentQ = gameState.questions[gameState.currentQuestionIndex];
  const currentWord = gameState.wordList[gameState.currentWordIndex];

  // Ranked players
  const rankedPlayers = [...playersList].sort((a, b) => b.score - a.score);

  // Distribution of answers for current question
  const choiceCounts = [0, 0, 0, 0];
  playersList.forEach(p => {
    if (p.lastAnswer && p.lastAnswer.choiceIndex !== undefined && p.lastAnswer.choiceIndex >= 0 && p.lastAnswer.choiceIndex <= 3) {
      choiceCounts[p.lastAnswer.choiceIndex]++;
    }
  });

  const hostUrl = `http://${gameState.hostIp}:${gameState.hostPort}`;

  // ==========================================
  // MODE: PROJECT SUMMARY / STUDY BRIEFING
  // ==========================================
  if (gameState.mode === 'briefing') {
    return (
      <>
        <ProjectSummaryView
          summary={gameState.projectSummary}
          isAdmin={true}
          players={playersList}
          onStartQuiz={() => {
            if (onSwitchMode) onSwitchMode('quiz');
            onStartQuiz();
          }}
          onOpenEditSummary={onOpenSettings}
        />
        <NetworkConfigModal
          isOpen={isNetworkConfigOpen}
          onClose={() => setIsNetworkConfigOpen(false)}
          currentHostIp={gameState.hostIp}
          currentHostPort={gameState.hostPort}
          detectedIps={gameState.detectedIps}
          onUpdateNetwork={(ip, port) => {
            if (onUpdateHostNetwork) onUpdateHostNetwork(ip, port);
          }}
        />
      </>
    );
  }

  // ==========================================
  // MODE: LIVE QUIZ
  // ==========================================
  if (gameState.mode === 'quiz') {
    // 1. LOBBY
    if (gameState.quizPhase === 'LOBBY') {
      return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
          {/* Top Banner with PIN & Local Hotspot IP */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left z-10 flex flex-col md:flex-row items-center md:items-start gap-4">
              <img
                src="/logo.png"
                alt="Ali & Rayan - Ceuta"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-amber-400/70 shadow-2xl flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold border border-rose-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ali &amp; Rayan • Ceuta Project Quiz</span>
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Join with your smartphone!
                </h1>
                <p className="text-slate-300 text-sm sm:text-base">
                  Connect to the host PC Wi-Fi and open the URL below in your browser:
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 bg-slate-950/80 border border-indigo-500/40 px-4 py-2 rounded-xl text-emerald-400 font-mono font-black text-xl sm:text-2xl shadow-inner">
                    <Wifi className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <span>{hostUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playButtonPress();
                      setIsNetworkConfigOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow border border-indigo-400/40 transition hover:scale-105 active:scale-95"
                    title="Change IP or adapter for QR Code"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit IP / QR</span>
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code in Lobby */}
            <div className="bg-white p-3.5 rounded-2xl shadow-2xl z-10 flex flex-col items-center">
              <QRCodeDisplay text={hostUrl} size={160} />
              <span className="text-[11px] font-bold text-slate-800 mt-1">Scan to join now</span>
              <button
                type="button"
                onClick={() => {
                  sound.playButtonPress();
                  setIsNetworkConfigOpen(true);
                }}
                className="mt-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline"
              >
                <Edit3 className="w-3 h-3" />
                <span>Modify IP</span>
              </button>
            </div>
          </div>

          {/* Connected Players Grid */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">
                  Connected Students ({totalPlayers})
                </h2>
              </div>
              <div className="text-xs text-slate-400">
                {gameState.questions.length} questions prepared
              </div>
            </div>

            {totalPlayers === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Users className="w-10 h-10 mx-auto opacity-40 animate-pulse" />
                <p className="font-semibold text-sm">Waiting for students to join...</p>
                <p className="text-xs text-slate-600">
                  Open another tab or connect a smartphone to test in real-time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {playersList.map((player) => (
                  <div
                    key={player.id}
                    className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-2.5 flex items-center gap-2.5 shadow hover:border-slate-600 transition group relative"
                  >
                    <AvatarDisplay avatar={player.avatar} size="sm" animated />
                    <span className="font-bold text-sm text-slate-200 truncate flex-1">
                      {player.username}
                    </span>
                    <button
                      type="button"
                      onClick={() => onKickPlayer(player.id)}
                      title="Kick player"
                      className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-200 p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Launch Quiz & Navigation Controls */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {onSwitchMode && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playButtonPress();
                      onSwitchMode('briefing');
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-sm font-semibold transition flex items-center gap-2 border border-indigo-500/30"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Project Revision Briefing</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition flex items-center gap-2 border border-slate-700"
                >
                  <SettingsIcon className="w-4 h-4 text-indigo-400" />
                  <span>Configure Questions &amp; Timers</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playButtonPress();
                    setIsNetworkConfigOpen(true);
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-sm font-semibold transition flex items-center gap-2 border border-emerald-500/30"
                >
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span>Wi-Fi IP &amp; QR Settings</span>
                </button>
              </div>

              <button
                id="admin-start-quiz-btn"
                type="button"
                onClick={() => {
                  sound.playButtonPress();
                  onStartQuiz();
                }}
                className="px-8 py-3.5 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-base font-black rounded-xl shadow-xl shadow-rose-600/30 transition transform active:scale-95 flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Live Quiz Now</span>
              </button>
            </div>
          </div>

          {/* Network Config Modal */}
          <NetworkConfigModal
            isOpen={isNetworkConfigOpen}
            onClose={() => setIsNetworkConfigOpen(false)}
            currentHostIp={gameState.hostIp}
            currentHostPort={gameState.hostPort}
            detectedIps={gameState.detectedIps}
            onUpdateNetwork={(ip, port) => {
              if (onUpdateHostNetwork) onUpdateHostNetwork(ip, port);
            }}
          />
        </div>
      );
    }

    // 2. QUESTION ACTIVE (Main Screen displays question and 4 choices with full text)
    if (gameState.quizPhase === 'QUESTION_ACTIVE' && currentQ) {
      const progressPercent = Math.max(0, Math.min(100, (gameState.timeRemaining / gameState.timeTotal) * 100));

      return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col justify-between min-h-[calc(100vh-100px)] space-y-4">
          {/* Top Bar: Question Index, Category, Timer, Answer Counter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-rose-600 text-white font-black text-xs uppercase rounded-lg tracking-wider">
                Question {gameState.currentQuestionIndex + 1} / {gameState.questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                {currentQ.category}
              </span>
            </div>

            {/* Answer count progress */}
            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300">
                <strong className="text-white">{answeredCount}</strong> / {totalPlayers} answered
              </span>
            </div>

            {/* Skip Timer Button */}
            <button
              type="button"
              onClick={() => {
                sound.playButtonPress();
                onSkipTimer();
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip / Reveal</span>
            </button>
          </div>

          {/* Question Text & Visual Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl text-center space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-center gap-4">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-3xl sm:text-4xl shadow-inner border transition-all ${
                gameState.timeRemaining <= 5
                  ? 'bg-rose-950 text-rose-400 border-rose-600 animate-bounce'
                  : 'bg-indigo-950 text-indigo-300 border-indigo-700'
              }`}>
                {gameState.timeRemaining}
              </div>
              {currentQ.visualClue && (
                <div className="text-4xl sm:text-5xl p-2 bg-slate-950 rounded-2xl border border-slate-800 shadow">
                  {currentQ.visualClue}
                </div>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug max-w-4xl mx-auto">
              {currentQ.question}
            </h2>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 max-w-xl mx-auto">
              <div
                className={`h-full transition-all duration-1000 ${
                  gameState.timeRemaining <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-rose-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 4 Choices on Host Screen (with shapes AND full text) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {currentQ.choices.map((choiceText, idx) => {
              const shape = SHAPES[idx];
              return (
                <div
                  key={idx}
                  className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border-2 flex items-center gap-4 sm:gap-5 text-white transition ${shape.color} ${shape.borderColor}`}
                >
                  <span className="text-4xl sm:text-5xl font-black drop-shadow-md">
                    {shape.symbol}
                  </span>
                  <span className="text-lg sm:text-2xl font-bold tracking-tight leading-tight flex-1">
                    {choiceText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 3. ANSWER REVEAL PHASE
    if (gameState.quizPhase === 'ANSWER_REVEAL' && currentQ) {
      return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question {gameState.currentQuestionIndex + 1} / {gameState.questions.length} - Results
            </span>
            <button
              id="admin-see-scoreboard-btn"
              type="button"
              onClick={() => {
                sound.playButtonPress();
                onShowScoreboard();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <span>View Leaderboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Question Recap */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-black text-white">
              {currentQ.question}
            </h2>
            {currentQ.explanation && (
              <p className="text-sm text-slate-300 max-w-2xl mx-auto pt-2 text-indigo-300 italic">
                💡 {currentQ.explanation}
              </p>
            )}
          </div>

          {/* Choices with correctness & player counts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.choices.map((choiceText, idx) => {
              const shape = SHAPES[idx];
              const isCorrect = idx === currentQ.correctIndex;
              const count = choiceCounts[idx];
              const percent = totalPlayers > 0 ? Math.round((count / totalPlayers) * 100) : 0;

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    isCorrect
                      ? 'bg-emerald-950/90 border-emerald-500 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black text-white ${shape.color}`}>
                      {shape.symbol}
                    </span>
                    <div>
                      <span className={`text-base sm:text-lg font-bold ${isCorrect ? 'text-emerald-300' : 'text-slate-300'}`}>
                        {choiceText}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400">
                      {count} ({percent}%)
                    </span>
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 4. SCOREBOARD PHASE (Live ranking with cumulative scores)
    if (gameState.quizPhase === 'SCOREBOARD') {
      const isLastQuestion = gameState.currentQuestionIndex >= gameState.questions.length - 1;

      return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-indigo-500/30 p-5 rounded-3xl shadow-2xl gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Round {gameState.currentQuestionIndex + 1} of {gameState.questions.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    {rankedPlayers.length} Competitors
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  Live Quiz Leaderboard
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                id="admin-next-question-btn"
                type="button"
                onClick={() => {
                  sound.playButtonPress();
                  if (isLastQuestion) {
                    onShowPodium();
                  } else {
                    onNextQuestion();
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-600/20 transition flex items-center gap-2 active:scale-95"
              >
                <span>{isLastQuestion ? 'Reveal Final Podium 🏆' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Leaderboard Table with Framer Motion Entrance & Layout Animations */}
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {rankedPlayers.length === 0 ? (
              <p className="text-center text-slate-500 py-12 text-sm font-semibold">No players registered yet</p>
            ) : (
              <AnimatePresence mode="popLayout">
                {rankedPlayers.map((player, idx) => {
                  const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                  const pointsGained = player.lastAnswer?.pointsAwarded || 0;
                  const maxScore = Math.max(...rankedPlayers.map(p => p.score), 1);
                  const scorePercent = Math.max(8, Math.round((player.score / maxScore) * 100));

                  return (
                    <motion.div
                      key={player.id}
                      layout
                      initial={{ opacity: 0, y: 24, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 26,
                        delay: idx * 0.05,
                        layout: { type: 'spring', stiffness: 320, damping: 28 }
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                        idx === 0
                          ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-900/90 border-amber-400/60 text-white shadow-xl shadow-amber-500/10'
                          : idx === 1
                          ? 'bg-gradient-to-r from-slate-700/40 via-slate-800/60 to-slate-900/90 border-slate-400/50 text-white shadow-lg'
                          : idx === 2
                          ? 'bg-gradient-to-r from-amber-900/30 via-amber-950/40 to-slate-900/90 border-amber-700/50 text-white shadow-md'
                          : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          {/* Rank Icon / Number */}
                          <div className="flex-shrink-0 w-9 text-center">
                            {idx === 0 ? (
                              <div className="flex flex-col items-center">
                                <Crown className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow" />
                                <span className="text-xs font-black text-amber-300">#1</span>
                              </div>
                            ) : idx === 1 ? (
                              <span className="text-2xl drop-shadow">🥈</span>
                            ) : idx === 2 ? (
                              <span className="text-2xl drop-shadow">🥉</span>
                            ) : (
                              <span className="font-black text-base text-slate-400">
                                #{idx + 1}
                              </span>
                            )}
                          </div>

                          {/* Avatar with Ring */}
                          <AvatarDisplay
                            avatar={player.avatar}
                            size="lg"
                            animated={idx < 5}
                            className={
                              idx === 0
                                ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-400/30'
                                : idx === 1
                                ? 'ring-2 ring-slate-300 shadow-md'
                                : idx === 2
                                ? 'ring-2 ring-amber-700 shadow-md'
                                : 'shadow'
                            }
                          />

                          {/* Player Identity & Subtitle */}
                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-base flex items-center gap-2 truncate">
                              <span className="text-white truncate">{player.username}</span>
                              {player.streak > 1 && (
                                <motion.span
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  className="inline-flex items-center gap-1 text-[11px] text-orange-300 font-extrabold bg-gradient-to-r from-orange-950 to-amber-950 px-2.5 py-0.5 rounded-full border border-orange-500/40 shadow-sm flex-shrink-0"
                                >
                                  <Flame className="w-3 h-3 fill-orange-400 text-orange-400" />
                                  <span>{player.streak} Streak</span>
                                </motion.span>
                              )}
                            </div>

                            {/* Mini Score Bar Relative to Leader */}
                            <div className="flex items-center gap-2 mt-1.5 max-w-xs">
                              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${
                                    idx === 0
                                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                                      : idx === 1
                                      ? 'bg-gradient-to-r from-slate-300 to-slate-400'
                                      : idx === 2
                                      ? 'bg-gradient-to-r from-amber-600 to-amber-500'
                                      : 'bg-indigo-500'
                                  }`}
                                  style={{ width: `${scorePercent}%` }}
                                />
                              </div>
                              {pointsGained > 0 && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="text-[10px] text-emerald-400 font-extrabold flex-shrink-0"
                                >
                                  +{pointsGained}
                                </motion.span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Total Score Display */}
                        <div className="text-right flex-shrink-0 pl-2">
                          <motion.div
                            key={player.score}
                            initial={{ scale: 1.15 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            className="font-black text-xl sm:text-2xl text-white tracking-tight"
                          >
                            {player.score}{' '}
                            <span className="text-xs font-normal text-slate-400">pts</span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      );
    }

    // 5. PODIUM FINAL
    if (gameState.quizPhase === 'PODIUM') {
      const top1 = rankedPlayers[0];
      const top2 = rankedPlayers[1];
      const top3 = rankedPlayers[2];

      return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8 text-center animate-in fade-in duration-300">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 font-black text-xs uppercase tracking-wider rounded-full border border-amber-500/40 shadow">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Grand Championship Results</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              Quiz Champion Podium! 🏆
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Celebration of excellence in Ceuta &amp; Moroccan heritage revision!
            </p>
          </div>

          {/* Podium 3D Stadium Pedestals */}
          <div className="flex items-end justify-center gap-3 sm:gap-6 pt-8 pb-4">
            {/* 2nd Place */}
            {top2 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
                className="flex flex-col items-center w-28 sm:w-36"
              >
                <AvatarDisplay
                  avatar={top2.avatar}
                  size="xl"
                  animated
                  className="mb-2 ring-3 ring-slate-300 shadow-2xl"
                />
                <div className="text-xs sm:text-sm font-black text-slate-200 truncate w-full mb-2">
                  {top2.username}
                </div>
                <div className="w-full h-36 bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-400 rounded-t-3xl flex flex-col items-center justify-center p-2 shadow-2xl relative overflow-hidden">
                  <span className="text-3xl">🥈</span>
                  <span className="text-xs text-slate-300 font-extrabold mt-0.5">2nd Place</span>
                  <span className="font-black text-sm text-white mt-1">{top2.score} pts</span>
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {top1 && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 280 }}
                className="flex flex-col items-center w-36 sm:w-48 -mt-10"
              >
                <div className="relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
                    👑
                  </div>
                  <AvatarDisplay
                    avatar={top1.avatar}
                    size="2xl"
                    animated
                    className="mb-2 ring-4 ring-amber-400 shadow-2xl shadow-amber-400/40"
                  />
                </div>
                <div className="text-sm sm:text-base font-black text-amber-300 truncate w-full mb-2">
                  {top1.username}
                </div>
                <div className="w-full h-52 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 border-3 border-amber-300 rounded-t-3xl flex flex-col items-center justify-center p-3 shadow-2xl relative overflow-hidden">
                  <div className="text-3xl">🥇</div>
                  <span className="text-xs text-amber-950 font-black uppercase tracking-wider mt-0.5 bg-amber-300 px-2 py-0.5 rounded-full">
                    Champion
                  </span>
                  <span className="font-black text-xl text-white mt-1">{top1.score} pts</span>
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {top3 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 260 }}
                className="flex flex-col items-center w-28 sm:w-36"
              >
                <AvatarDisplay
                  avatar={top3.avatar}
                  size="xl"
                  animated
                  className="mb-2 ring-3 ring-amber-700 shadow-2xl"
                />
                <div className="text-xs sm:text-sm font-black text-amber-200 truncate w-full mb-2">
                  {top3.username}
                </div>
                <div className="w-full h-28 bg-gradient-to-b from-amber-800 to-slate-900 border-2 border-amber-700 rounded-t-3xl flex flex-col items-center justify-center p-2 shadow-2xl relative overflow-hidden">
                  <span className="text-3xl">🥉</span>
                  <span className="text-xs text-amber-300 font-extrabold mt-0.5">3rd Place</span>
                  <span className="font-black text-sm text-white mt-1">{top3.score} pts</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Replay & Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                sound.playButtonPress();
                onStartQuiz();
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-600/30 transition flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Quiz Again</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playButtonPress();
                onResetGame();
              }}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-sm rounded-2xl border border-slate-700 transition"
            >
              Reset Scores
            </button>
          </div>
        </div>
      );
    }
  }

  // ==========================================
  // MODE: WORD GUESS
  // ==========================================
  if (gameState.wordPhase === 'WORD_LOBBY') {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
            🔤 Mystery Word Game
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Word Guess Challenge!
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Students see visual clues and letter slots on their phones and race to guess the mystery word in real-time!
          </p>

          <div className="pt-4 flex justify-center">
            <button
              id="admin-start-word-btn"
              type="button"
              onClick={() => {
                sound.playButtonPress();
                onStartWordRound();
              }}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-base font-black rounded-xl shadow-xl shadow-emerald-600/30 transition transform active:scale-95 flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Word Round</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.wordPhase === 'WORD_ACTIVE' && currentWord) {
    const wordLength = currentWord.word.length;
    const progressPercent = Math.max(0, Math.min(100, (gameState.timeRemaining / gameState.timeTotal) * 100));

    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-600 text-white font-black text-xs uppercase rounded-lg">
              Word {gameState.currentWordIndex + 1} / {gameState.wordList.length}
            </span>
            <span className="text-xs font-semibold text-emerald-300">
              {currentWord.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playButtonPress();
                onRevealWordLetter();
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal a Letter</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playButtonPress();
                onSkipTimer();
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition"
            >
              Reveal Word
            </button>
          </div>
        </div>

        {/* Secret Word Display for Admin and Clues */}
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl text-center space-y-6 shadow-2xl">
          {/* Countdown timer */}
          <div className="flex items-center justify-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl shadow-inner border ${
              gameState.timeRemaining <= 5
                ? 'bg-rose-950 text-rose-400 border-rose-600 animate-bounce'
                : 'bg-emerald-950 text-emerald-300 border-emerald-700'
            }`}>
              {gameState.timeRemaining}
            </div>
            {/* Host Secret Peek */}
            <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-left">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Secret Word (Host View):</span>
              <span className="text-emerald-400 font-mono font-black text-lg tracking-wider">
                {currentWord.word}
              </span>
            </div>
          </div>

          {/* Visual Clues */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Visual Clues &amp; Hints:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {currentWord.visualClues.map((clue, idx) => (
                <span
                  key={idx}
                  className="bg-slate-950 border border-slate-800 text-white font-bold text-sm sm:text-base px-4 py-2 rounded-2xl shadow"
                >
                  {clue}
                </span>
              ))}
            </div>
          </div>

          {/* Word Letter Slots (as seen publicly) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-4">
            {Array.from({ length: wordLength }).map((_, index) => {
              const isRevealed = gameState.revealedLetters.includes(index);
              const char = currentWord.word[index];
              return (
                <div
                  key={index}
                  className={`w-12 h-14 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-4xl shadow-xl border-2 transition ${
                    isRevealed
                      ? 'bg-emerald-600 text-white border-emerald-400 scale-105'
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  {isRevealed ? char : '_'}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 max-w-xl mx-auto">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Real-time Guesses Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
            Players who solved the word ({gameState.correctWordGuessesCount} / {totalPlayers}):
          </h3>
          <div className="flex flex-wrap gap-2">
            {playersList
              .filter(p => p.hasGuessedWord)
              .sort((a, b) => (a.guessRank || 99) - (b.guessRank || 99))
              .map(player => (
                <span
                  key={player.id}
                  className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold text-xs px-3 py-1.5 rounded-full shadow"
                >
                  <span>#{player.guessRank}</span>
                  <AvatarDisplay avatar={player.avatar} size="xs" animated />
                  <span>{player.username}</span>
                </span>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // Word Reveal & Leaderboard
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-center">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
          Round Completed!
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white">
          The word was: <span className="text-emerald-400 font-mono">{currentWord?.word}</span>
        </h2>
        {currentWord?.explanation && (
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            {currentWord.explanation}
          </p>
        )}

        <div className="pt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playButtonPress();
              onNextWord();
            }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <span>Next Word</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
