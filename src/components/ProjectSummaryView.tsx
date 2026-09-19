import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ProjectSummary, Player } from '../types';
import { sound } from '../utils/audio';
import { AvatarDisplay } from './AvatarDisplay';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  Play,
  Edit3,
  Users,
  Lightbulb,
  AlertCircle,
  ArrowRight,
  Check,
  Layers,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Flame,
  GraduationCap,
  Award
} from 'lucide-react';

interface ProjectSummaryViewProps {
  summary: ProjectSummary;
  isAdmin: boolean;
  players: Player[];
  currentPlayer?: Player | null;
  onStartQuiz: () => void;
  onOpenEditSummary?: () => void;
  onToggleStudentReady?: () => void;
}

export const ProjectSummaryView: React.FC<ProjectSummaryViewProps> = ({
  summary,
  isAdmin,
  players,
  currentPlayer,
  onStartQuiz,
  onOpenEditSummary,
  onToggleStudentReady
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'flashcards'>('grid');
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [masteredPointIds, setMasteredPointIds] = useState<Record<string, boolean>>({});

  const readyPlayersCount = players.filter(p => p.isReadyForQuiz).length;
  const isCurrentPlayerReady = currentPlayer?.isReadyForQuiz;

  const categories = ['all', ...Array.from(new Set(summary.keyPoints.map(p => p.category).filter(Boolean)))];

  const filteredPoints = activeCategory === 'all'
    ? summary.keyPoints
    : summary.keyPoints.filter(p => p.category === activeCategory);

  const totalPoints = summary.keyPoints.length;
  const masteredCount = Object.keys(masteredPointIds).filter(id => masteredPointIds[id]).length;
  const progressPercent = totalPoints > 0 ? Math.round((masteredCount / totalPoints) * 100) : 0;

  const handleToggleMastered = (id: string) => {
    const next = !masteredPointIds[id];
    const updated = { ...masteredPointIds, [id]: next };
    setMasteredPointIds(updated);

    if (next) {
      sound.playCorrect();
      const currentMasteredCount = Object.values(updated).filter(Boolean).length;
      if (currentMasteredCount === totalPoints && totalPoints > 0) {
        sound.playFanfare();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    } else {
      sound.playButtonPress();
    }
  };

  const handleFlipCard = () => {
    sound.playCardFlip();
    setIsCardFlipped(!isCardFlipped);
  };

  const handleNextCard = () => {
    sound.playButtonPress();
    setIsCardFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredPoints.length);
  };

  const handlePrevCard = () => {
    sound.playButtonPress();
    setIsCardFlipped(false);
    setCardIndex((prev) => (prev - 1 + filteredPoints.length) % filteredPoints.length);
  };

  const currentFlashcard = filteredPoints[cardIndex] || filteredPoints[0];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Deluxe Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 border-2 border-indigo-500/40 p-6 sm:p-8 text-white shadow-2xl shadow-indigo-950/40">
        {/* Subtle Decorative Golden & Sapphire Grid Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Ali & Rayan Ceuta"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shadow-lg shadow-amber-400/20"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 rounded-full text-xs font-black border border-amber-500/30 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Revision Masterclass</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-slate-800">
                    By {summary.author || 'Ali & Rayan'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Official Class Briefing &amp; Interactive Knowledge Base
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Study Mode */}
              <div className="bg-slate-950/80 border border-slate-800 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    sound.playButtonPress();
                    setViewMode('grid');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    viewMode === 'grid'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Bento Overview</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playButtonPress();
                    setViewMode('flashcards');
                    setCardIndex(0);
                    setIsCardFlipped(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    viewMode === 'flashcards'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>3D Flashcards</span>
                </button>
              </div>

              {isAdmin && onOpenEditSummary && (
                <button
                  id="edit-summary-btn"
                  type="button"
                  onClick={() => {
                    sound.playButtonPress();
                    onOpenEditSummary();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-indigo-300 rounded-2xl text-xs font-bold border border-indigo-500/40 transition shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit Content</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
              {summary.title}
            </h1>
            <p className="text-indigo-200/90 text-sm sm:text-base max-w-3xl font-medium leading-relaxed mt-1">
              {summary.subtitle}
            </p>
          </div>

          {/* Interactive Mastery Progress Bar */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Your Revision Readiness:</span>
                <span className="text-amber-400 font-extrabold">{masteredCount}/{totalPoints} Concepts Mastered</span>
              </span>
              <span className="font-black text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {progressPercent}% Prepared
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Executive Summary Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span>Executive Briefing &amp; Background</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Core Curriculum
              </span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {summary.overview}
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Filter Topics:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                sound.playButtonPress();
                setActiveCategory(cat as string);
                setCardIndex(0);
                setIsCardFlipped(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize border ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Key Points' : cat}
            </button>
          ))}
        </div>
      )}

      {/* MODE 1: BENTO GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Essential Revision Concepts ({filteredPoints.length})</span>
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Click the checkmark on any card once you've memorized it!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPoints.map((point, idx) => {
              const isMastered = Boolean(masteredPointIds[point.id]);
              return (
                <motion.div
                  key={point.id || idx}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className={`border rounded-2xl p-5 shadow-lg transition flex flex-col justify-between relative overflow-hidden ${
                    isMastered
                      ? 'bg-gradient-to-br from-slate-900 to-emerald-950/40 border-emerald-500/40 shadow-emerald-950/20'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-2xl shadow-inner border border-slate-800">
                          {point.icon || '📌'}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-white text-sm sm:text-base">
                            {point.title}
                          </h3>
                          {point.category && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                              {point.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mastered Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleMastered(point.id)}
                        className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
                          isMastered
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                        }`}
                        title={isMastered ? 'Mastered!' : 'Mark as mastered'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">{isMastered ? 'Mastered' : 'Check'}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                      {point.description}
                    </p>
                  </div>

                  {isMastered && (
                    <div className="mt-3 pt-2 border-t border-emerald-500/20 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      <span>Ready for live quiz questions on this topic</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: 3D INTERACTIVE FLASHCARDS */}
      {viewMode === 'flashcards' && currentFlashcard && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-amber-400" />
              <span>Interactive Flashcard Deck ({cardIndex + 1} of {filteredPoints.length})</span>
            </h2>
            <span className="text-xs text-slate-400">
              Tap card to flip between Question &amp; Answer
            </span>
          </div>

          {/* Flashcard Component */}
          <div
            onClick={handleFlipCard}
            className="cursor-pointer select-none perspective-1000 min-h-[260px] sm:min-h-[300px] flex items-center justify-center"
          >
            <motion.div
              key={currentFlashcard.id + (isCardFlipped ? '-back' : '-front')}
              initial={{ rotateY: isCardFlipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.28 }}
              className={`w-full max-w-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border-2 flex flex-col justify-between transition-colors min-h-[260px] sm:min-h-[300px] ${
                isCardFlipped
                  ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border-indigo-500/60 text-white'
                  : 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-amber-500/40 text-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 pb-3">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{currentFlashcard.icon || '💡'}</span>
                  <span className="text-amber-300 font-extrabold">{currentFlashcard.category || 'Concept'}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[11px]">
                  {isCardFlipped ? 'Answer & Explanation' : 'Concept Clue • Tap to Reveal'}
                </span>
              </div>

              <div className="my-6 text-center space-y-3">
                {!isCardFlipped ? (
                  <>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {currentFlashcard.title}
                    </div>
                    <p className="text-sm text-slate-400 font-medium max-w-md mx-auto">
                      Do you know what makes this point crucial for the quiz? Tap anywhere to flip!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Key Takeaway
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-indigo-100 leading-relaxed max-w-xl mx-auto">
                      {currentFlashcard.description}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleMastered(currentFlashcard.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 ${
                    masteredPointIds[currentFlashcard.id]
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                      : 'bg-slate-950 text-slate-300 border-slate-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{masteredPointIds[currentFlashcard.id] ? 'Concept Mastered ✓' : 'Mark as Mastered'}</span>
                </button>
                <span className="text-slate-400">
                  Card {cardIndex + 1} of {filteredPoints.length}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Flashcard Navigation */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrevCard}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl border border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              onClick={handleFlipCard}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/20 active:scale-95 transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip Card</span>
            </button>
            <button
              type="button"
              onClick={handleNextCard}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl border border-slate-700 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Important Tips & Takeaways Notice */}
      {(summary.importantNotes || summary.quizTips) && (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start gap-4 text-amber-200">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm">
            {summary.importantNotes && (
              <p className="font-bold text-amber-100 leading-relaxed">
                <span className="text-amber-400 font-black uppercase tracking-wider mr-1">Crucial Insight:</span>
                {summary.importantNotes}
              </p>
            )}
            {summary.quizTips && (
              <p className="text-amber-300/90 text-xs flex items-center gap-1.5 font-medium">
                <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span><em>Pro Tip for Speed Points:</em> {summary.quizTips}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Bottom Action Card: Host Launch vs Student Ready */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-2 border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Readiness Roster */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Student Quiz Readiness
            </div>
            <div className="text-base font-extrabold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-black text-lg">{readyPlayersCount}</span> of{' '}
              <span>{players.length} students</span> marked ready
            </div>
          </div>

          {/* Floating Ready Avatars */}
          {players.filter(p => p.isReadyForQuiz).length > 0 && (
            <div className="hidden lg:flex items-center -space-x-2 ml-3 pl-4 border-l border-slate-800">
              {players
                .filter(p => p.isReadyForQuiz)
                .slice(0, 6)
                .map(p => (
                  <div key={p.id} title={`${p.username} is ready!`} className="relative">
                    <AvatarDisplay
                      avatar={p.avatar}
                      size="sm"
                      animated={false}
                      className="border-2 border-slate-900 shadow-md ring-1 ring-emerald-500"
                    />
                  </div>
                ))}
              {readyPlayersCount > 6 && (
                <span className="w-8 h-8 rounded-2xl bg-slate-800 text-[10px] font-bold text-slate-300 border-2 border-slate-900 flex items-center justify-center">
                  +{readyPlayersCount - 6}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isAdmin ? (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="summary-start-quiz-btn"
              type="button"
              onClick={() => {
                sound.playButtonPress();
                onStartQuiz();
              }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-600/30 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Live Quiz Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full sm:w-auto">
            {onToggleStudentReady && (
              <button
                id="student-ready-btn"
                type="button"
                onClick={() => {
                  if (!isCurrentPlayerReady) {
                    sound.playFanfare();
                    try {
                      confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.8 }
                      });
                    } catch {}
                  } else {
                    sound.playButtonPress();
                  }
                  onToggleStudentReady();
                }}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-xl ${
                  isCurrentPlayerReady
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/30 border-2 border-emerald-400'
                    : 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white border-2 border-slate-600'
                }`}
              >
                {isCurrentPlayerReady ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>I'm Ready for the Live Quiz!</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Mark as Reviewed &amp; Ready</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
