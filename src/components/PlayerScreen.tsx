import React, { useState, useEffect } from 'react';
import { GameState, Player } from '../types';
import { sound } from '../utils/audio';
import { ProjectSummaryView } from './ProjectSummaryView';
import { AvatarDisplay } from './AvatarDisplay';
import { CheckCircle2, XCircle, Flame, Trophy, Clock, Sparkles, Send, LogOut, Crown, Medal, Award, ChevronRight } from 'lucide-react';

interface PlayerScreenProps {
  gameState: GameState;
  player: Player;
  onSubmitQuizAnswer: (choiceIndex: number) => void;
  onSubmitWordGuess: (guess: string) => void;
  onToggleReadyQuiz?: () => void;
  onExit?: () => void;
}

const SHAPES = [
  { symbol: '▲', name: 'Triangle', colorClass: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-rose-600/30' },
  { symbol: '◆', name: 'Diamond', colorClass: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-blue-600/30' },
  { symbol: '●', name: 'Circle', colorClass: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white shadow-amber-500/30' },
  { symbol: '■', name: 'Square', colorClass: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-600/30' },
];

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  gameState,
  player,
  onSubmitQuizAnswer,
  onSubmitWordGuess,
  onToggleReadyQuiz,
  onExit
}) => {
  const [wordInput, setWordInput] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  // Sync selectedChoice with player state
  useEffect(() => {
    if (player.hasAnswered && player.lastAnswer && player.lastAnswer.choiceIndex !== undefined) {
      setSelectedChoice(player.lastAnswer.choiceIndex);
    } else if (!player.hasAnswered) {
      setSelectedChoice(null);
    }
  }, [player.hasAnswered, player.lastAnswer]);

  const handleSelectAnswer = (index: number) => {
    if (player.hasAnswered || gameState.quizPhase !== 'QUESTION_ACTIVE') return;
    sound.playButtonPress();
    setSelectedChoice(index);
    onSubmitQuizAnswer(index);
  };

  const handleWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = wordInput.trim();
    if (!trimmed || player.hasGuessedWord) return;
    sound.playButtonPress();
    onSubmitWordGuess(trimmed);
    setWordInput('');
  };

  // Rank calculation
  const allPlayers = Object.values(gameState.players).sort((a, b) => b.score - a.score);
  const playerRank = allPlayers.findIndex(p => p.id === player.id) + 1;

  // ==========================================
  // MODE: PROJECT SUMMARY / STUDY BRIEFING
  // ==========================================
  if (gameState.mode === 'briefing') {
    return (
      <div className="min-h-[calc(100vh-65px)] bg-slate-950 py-4">
        <ProjectSummaryView
          summary={gameState.projectSummary}
          isAdmin={false}
          players={allPlayers}
          currentPlayer={player}
          onStartQuiz={() => {}}
          onToggleStudentReady={onToggleReadyQuiz}
        />
      </div>
    );
  }

  // ==========================================
  // MODE: LIVE QUIZ
  // ==========================================
  if (gameState.mode === 'quiz') {
    // 1. LOBBY PHASE
    if (gameState.quizPhase === 'LOBBY') {
      return (
        <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
          <AvatarDisplay
            avatar={player.avatar}
            size="2xl"
            animated
            className="shadow-2xl mb-6 ring-4 ring-rose-500/30"
          />
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            You're in, <span className="text-rose-400">{player.username}</span>!
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-sm">
            Keep your eyes on the host projector screen. The live quiz will begin shortly!
          </p>

          <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-full">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span>Waiting for the host to start...</span>
          </div>

          {onExit && (
            <button
              type="button"
              onClick={() => {
                sound.playButtonPress();
                onExit();
              }}
              className="mt-6 inline-flex items-center gap-2 text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 px-4 py-2 rounded-xl transition"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Leave Session</span>
            </button>
          )}
        </div>
      );
    }

    // 2. ACTIVE QUESTION (Students only see the 4 colored buzzer shape buttons)
    if (gameState.quizPhase === 'QUESTION_ACTIVE') {
      if (player.hasAnswered) {
        const choice = selectedChoice !== null ? SHAPES[selectedChoice] : null;
        return (
          <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
            <div className="w-24 h-24 rounded-3xl bg-slate-900 border-2 border-indigo-500/50 flex items-center justify-center text-4xl shadow-2xl mb-6 animate-pulse">
              {choice ? <span className="text-5xl">{choice.symbol}</span> : '⏳'}
            </div>
            <h2 className="text-2xl font-black text-white">
              Answer Recorded!
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Watch the host screen for the reveal and explanation...
            </p>
            <div className="mt-6 flex items-center gap-2 text-amber-400 text-sm font-bold bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Time remaining: {gameState.timeRemaining}s</span>
            </div>
          </div>
        );
      }

      const currentQ = gameState.questions[gameState.currentQuestionIndex];

      return (
        <div className="min-h-[calc(100vh-65px)] flex flex-col bg-slate-950 p-3 sm:p-4 justify-between">
          {/* Top header on student device */}
          <div className="flex items-center justify-between py-2 px-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 shadow">
            <span className="flex items-center gap-2">
              <AvatarDisplay avatar={player.avatar} size="xs" animated={false} />
              <span className="truncate max-w-[120px] text-white">{player.username}</span>
            </span>
            <span className="bg-indigo-600/30 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{gameState.timeRemaining}s</span>
            </span>
            <span className="text-amber-400 font-extrabold">{player.score} pts</span>
          </div>

          {/* Question Banner on Student Screen so they don't have to strain or look elsewhere */}
          {currentQ && (
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 my-2 text-center shadow-lg">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
                <span>{currentQ.visualClue || '❓'}</span>
                <span>{currentQ.category || 'Live Quiz'}</span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-black text-white leading-snug">
                {currentQ.question}
              </h3>
            </div>
          )}

          {/* The 4 Geometric Shape Buttons WITH Choice Text! */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 flex-1 my-1">
            {SHAPES.map((shape, idx) => {
              const choiceText = currentQ?.choices?.[idx] || shape.name;
              return (
                <button
                  key={shape.name}
                  id={`player-choice-btn-${idx}`}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`flex items-center sm:flex-col justify-start sm:justify-center p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl transition transform active:scale-95 border-b-4 border-black/30 gap-3 sm:gap-2 ${shape.colorClass}`}
                >
                  <span className="text-4xl sm:text-5xl font-black drop-shadow-md flex-shrink-0">
                    {shape.symbol}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white text-left sm:text-center flex-1 leading-snug">
                    {choiceText}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-slate-500 py-1">
            Question {gameState.currentQuestionIndex + 1} of {gameState.questions.length}
          </div>
        </div>
      );
    }

    // 3. ANSWER REVEAL PHASE
    if (gameState.quizPhase === 'ANSWER_REVEAL') {
      const currentQ = gameState.questions[gameState.currentQuestionIndex];
      // Compute correctness: check player.lastAnswer first, or compare selectedChoice with correctIndex
      const isCorrect = player.lastAnswer?.isCorrect ?? (
        selectedChoice !== null && currentQ !== undefined && Number(selectedChoice) === Number(currentQ.correctIndex)
      );

      // Guarantee points calculation: if answer is correct, ensure points awarded is at least 500 (or pointsAwarded)
      const rawPoints = player.lastAnswer?.pointsAwarded;
      const points = isCorrect
        ? (rawPoints !== undefined && Number(rawPoints) > 0 ? Number(rawPoints) : 1000)
        : 0;

      // Safe total score display: Ensure if player got correct, their score reflects it
      const displayTotalScore = Math.max(Number(player.score) || 0, isCorrect ? points : 0);

      return (
        <div className={`min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-6 text-center transition-colors duration-500 ${
          isCorrect
            ? 'bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950 text-white'
            : 'bg-gradient-to-b from-rose-950 via-slate-950 to-rose-950 text-white'
        }`}>
          <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-6xl shadow-2xl mb-5 border-2 transform animate-in zoom-in-75 duration-300 ${
            isCorrect
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/40'
              : 'bg-rose-600 border-rose-400 text-white shadow-rose-600/40'
          }`}>
            {isCorrect ? <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16" /> : <XCircle className="w-14 h-14 sm:w-16 sm:h-16" />}
          </div>

          <span className={`text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-2 border backdrop-blur-md ${
            isCorrect
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}>
            {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
          </span>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
            {isCorrect ? 'Awesome job!' : 'Nice try, get ready for the next!'}
          </h2>

          <div className="mt-5 bg-slate-900/90 backdrop-blur-md px-6 py-5 rounded-3xl border-2 border-white/10 max-w-sm w-full space-y-3 shadow-2xl">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300 font-semibold">Points Earned:</span>
              <span className={`font-black text-xl ${isCorrect ? 'text-amber-400' : 'text-slate-400'}`}>
                {isCorrect ? `+${points}` : '0 pts'}
              </span>
            </div>

            {player.streak > 1 && (
              <div className="flex justify-between items-center text-sm text-orange-300 font-bold bg-orange-950/50 p-2.5 rounded-2xl border border-orange-500/30">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-orange-400 text-orange-400 animate-pulse" />
                  <span>Streak Active:</span>
                </span>
                <span className="font-black text-orange-200">{player.streak} in a row!</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
              <span className="text-slate-400 font-semibold">Total Score:</span>
              <span className="font-black text-2xl text-white tracking-tight">{displayTotalScore} pts</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-400 max-w-xs">
            Look up at the main screen for detailed explanations &amp; standings!
          </p>
        </div>
      );
    }

    // 4. SCOREBOARD & PODIUM
    const topPlayers = Object.values(gameState.players)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return (
      <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 text-white">
        <div className="relative mb-3">
          <AvatarDisplay
            avatar={player.avatar}
            size="xl"
            animated
            className={`ring-4 shadow-2xl ${
              playerRank === 1
                ? 'ring-amber-400 shadow-amber-400/30'
                : playerRank === 2
                ? 'ring-slate-300'
                : playerRank === 3
                ? 'ring-amber-700'
                : 'ring-indigo-500/40'
            }`}
          />
          {playerRank <= 3 && (
            <span className="absolute -top-3 -right-3 text-2xl animate-bounce">
              {playerRank === 1 ? '👑' : playerRank === 2 ? '🥈' : '🥉'}
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white">
          {gameState.quizPhase === 'PODIUM' ? 'Final Standings 🏆' : 'Live Scoreboard'}
        </h2>

        {/* Player's personal rank badge */}
        <div className="mt-4 bg-slate-900/90 border-2 border-slate-800 p-6 rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Your Position</div>
          <div className="flex items-center justify-center gap-2 my-2">
            <span className={`text-5xl sm:text-6xl font-black tracking-tight ${
              playerRank === 1
                ? 'text-amber-400'
                : playerRank === 2
                ? 'text-slate-200'
                : playerRank === 3
                ? 'text-amber-600'
                : 'text-indigo-400'
            }`}>
              #{playerRank}
            </span>
          </div>

          <div className="text-white font-extrabold text-xl">
            {player.score} <span className="text-sm font-normal text-slate-400">pts</span>
          </div>

          {playerRank === 1 ? (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-black border border-amber-500/40 shadow">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Leading the Class!</span>
            </div>
          ) : playerRank <= 3 ? (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Podium Contender!</span>
            </div>
          ) : (
            <div className="mt-3 text-xs text-slate-400 font-medium">
              Keep pushing, points add up quickly!
            </div>
          )}

          {/* Mini Class Leaderboard */}
          {topPlayers.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-800 text-left space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Top Leaders:
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {topPlayers.map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold ${
                      p.id === player.id
                        ? 'bg-indigo-600/30 border border-indigo-500/40 text-white font-bold'
                        : 'bg-slate-950/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-center font-bold text-amber-400">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                      </span>
                      <AvatarDisplay avatar={p.avatar} size="xs" animated={false} />
                      <span className="truncate max-w-[120px]">{p.username}</span>
                      {p.id === player.id && (
                        <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-black">YOU</span>
                      )}
                    </div>
                    <span className="font-black text-slate-200">{p.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="mt-5 text-xs text-slate-400">
          Look at the main projector screen for detailed visual animations!
        </p>
      </div>
    );
  }

  // ==========================================
  // MODE: WORD GUESS
  // ==========================================
  const currentWord = gameState.wordList[gameState.currentWordIndex];

  if (gameState.wordPhase === 'WORD_LOBBY') {
    return (
      <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
        <AvatarDisplay
          avatar={player.avatar}
          size="xl"
          animated
          className="mb-4 ring-2 ring-emerald-500/40 shadow-xl"
        />
        <h2 className="text-2xl font-black text-white sm:text-3xl">
          <span className="text-emerald-400">Word Guess</span> Mode
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-sm">
          Solve mystery words using visual clues and letter counts! Waiting for the host to start...
        </p>

        {onExit && (
          <button
            type="button"
            onClick={() => {
              sound.playButtonPress();
              onExit();
            }}
            className="mt-6 inline-flex items-center gap-2 text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 px-4 py-2 rounded-xl transition"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Leave Session</span>
          </button>
        )}
      </div>
    );
  }

  if (gameState.wordPhase === 'WORD_ACTIVE') {
    const wordLength = currentWord ? currentWord.word.length : 0;
    const targetWord = currentWord ? currentWord.word : '';

    return (
      <div className="min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 bg-slate-950 text-white max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between py-2 px-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold text-slate-300">
          <span className="flex items-center gap-2">
            <AvatarDisplay avatar={player.avatar} size="xs" animated={false} />
            <span className="truncate max-w-[120px]">{player.username}</span>
          </span>
          <span className="bg-emerald-600/30 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{gameState.timeRemaining}s</span>
          </span>
          <span className="text-amber-400">{player.score} pts</span>
        </div>

        {/* Word Info & Visual Clues */}
        <div className="my-4 text-center">
          <div className="inline-block bg-slate-900 text-emerald-400 border border-slate-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Category: {currentWord?.category}
          </div>

          {/* Visual Clues */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {currentWord?.visualClues.map((clue, idx) => (
              <span
                key={idx}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl shadow"
              >
                {clue}
              </span>
            ))}
          </div>

          {/* Letter Slots */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 my-4">
            {Array.from({ length: wordLength }).map((_, index) => {
              const isRevealed = gameState.revealedLetters.includes(index);
              const char = targetWord[index];
              return (
                <div
                  key={index}
                  className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl flex items-center justify-center font-black text-xl sm:text-2xl shadow-md border ${
                    isRevealed
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  {isRevealed ? char : '_'}
                </div>
              );
            })}
          </div>

          <div className="text-xs text-slate-400">
            {wordLength} letters to guess
          </div>
        </div>

        {/* Input or Success Status */}
        <div className="mb-4">
          {player.hasGuessedWord ? (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-center space-y-2">
              <div className="inline-flex p-2 bg-emerald-600 rounded-full text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-emerald-300">
                You Solved It!
              </h3>
              <p className="text-xs text-emerald-400">
                You guessed the word at Rank #{player.guessRank || 1}! Bonus points added to your score.
              </p>
            </div>
          ) : (
            <form onSubmit={handleWordSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  id="player-word-guess-input"
                  type="text"
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value.toUpperCase())}
                  placeholder="Type your guess..."
                  maxLength={wordLength + 4}
                  autoFocus
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-lg font-black text-white uppercase placeholder:text-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
                />
                <button
                  id="player-submit-word-btn"
                  type="submit"
                  disabled={!wordInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 text-white font-black px-5 py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[11px] text-center text-slate-400">
                Enter the complete word based on the clues and revealed letters!
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Word Reveal & Round End
  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
      <div className="w-20 h-20 rounded-2xl bg-emerald-600 flex items-center justify-center text-4xl shadow-2xl mb-4">
        🏆
      </div>
      <h2 className="text-2xl font-black text-white">
        Word Round Ended!
      </h2>
      <div className="mt-3 text-lg font-mono font-black text-emerald-400 bg-slate-900 px-6 py-2 rounded-xl border border-slate-800">
        The word was: {currentWord?.word}
      </div>
      <p className="text-xs text-slate-400 mt-4">
        Your cumulative score: <span className="text-amber-400 font-bold">{player.score} pts</span> (Rank #{playerRank})
      </p>
    </div>
  );
};
