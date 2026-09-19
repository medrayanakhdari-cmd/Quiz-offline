import React, { useState } from 'react';
import { AdminSettings, QuizQuestion, WordGuessItem, ProjectSummary, SummaryPoint } from '../types';
import { sound } from '../utils/audio';
import { DEFAULT_QUESTIONS, DEFAULT_WORDS, DEFAULT_PROJECT_SUMMARY } from '../data/defaultData';
import {
  X,
  Plus,
  Trash2,
  RotateCcw,
  Sliders,
  Clock,
  Sparkles,
  Zap,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AdminSettings;
  questions: QuizQuestion[];
  words: WordGuessItem[];
  projectSummary: ProjectSummary;
  onUpdateSettings: (settings: Partial<AdminSettings>) => void;
  onUpdateQuestions: (questions: QuizQuestion[]) => void;
  onUpdateWords: (words: WordGuessItem[]) => void;
  onUpdateProjectSummary: (summary: Partial<ProjectSummary>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  questions,
  words,
  projectSummary,
  onUpdateSettings,
  onUpdateQuestions,
  onUpdateWords,
  onUpdateProjectSummary
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'params' | 'questions' | 'words'>('summary');

  // Question form state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCat, setNewQuestionCat] = useState('General');
  const [newQuestionClue, setNewQuestionClue] = useState('❓');
  const [newChoices, setNewChoices] = useState<[string, string, string, string]>(['', '', '', '']);
  const [newCorrectIndex, setNewCorrectIndex] = useState<number>(0);
  const [newExplanation, setNewExplanation] = useState('');

  // Word form state
  const [newWord, setNewWord] = useState('');
  const [newWordCat, setNewWordCat] = useState('General');
  const [newWordClues, setNewWordClues] = useState('');
  const [newWordExpl, setNewWordExpl] = useState('');

  // New Summary Point state
  const [newPointTitle, setNewPointTitle] = useState('');
  const [newPointDesc, setNewPointDesc] = useState('');
  const [newPointIcon, setNewPointIcon] = useState('📌');
  const [newPointCat, setNewPointCat] = useState('Key Concept');

  if (!isOpen) return null;

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || newChoices.some(c => !c.trim())) return;

    const newQ: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: newQuestionText.trim(),
      category: newQuestionCat.trim() || 'General',
      visualClue: newQuestionClue.trim() || '❓',
      timeLimit: settings.quizTimeLimit,
      points: 1000,
      choices: [newChoices[0].trim(), newChoices[1].trim(), newChoices[2].trim(), newChoices[3].trim()],
      correctIndex: newCorrectIndex,
      explanation: newExplanation.trim() || undefined
    };

    onUpdateQuestions([...questions, newQ]);
    sound.playButtonPress();

    // Reset form
    setNewQuestionText('');
    setNewChoices(['', '', '', '']);
    setNewExplanation('');
  };

  const handleDeleteQuestion = (id: string) => {
    onUpdateQuestions(questions.filter(q => q.id !== id));
    sound.playButtonPress();
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWord = newWord.trim().toUpperCase();
    if (!cleanWord) return;

    const clues = newWordClues
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const newW: WordGuessItem = {
      id: `w_${Date.now()}`,
      word: cleanWord,
      category: newWordCat.trim() || 'General',
      visualClues: clues.length > 0 ? clues : ['🔍', 'Mystery clue'],
      revealedLetters: [0],
      timeLimit: settings.wordTimeLimit,
      points: 1000,
      explanation: newWordExpl.trim() || undefined
    };

    onUpdateWords([...words, newW]);
    sound.playButtonPress();

    setNewWord('');
    setNewWordClues('');
    setNewWordExpl('');
  };

  const handleDeleteWord = (id: string) => {
    onUpdateWords(words.filter(w => w.id !== id));
    sound.playButtonPress();
  };

  const handleAddSummaryPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPointTitle.trim() || !newPointDesc.trim()) return;

    const newPoint: SummaryPoint = {
      id: `sp_${Date.now()}`,
      title: newPointTitle.trim(),
      description: newPointDesc.trim(),
      icon: newPointIcon.trim() || '📌',
      category: newPointCat.trim() || 'Key Concept'
    };

    onUpdateProjectSummary({
      keyPoints: [...projectSummary.keyPoints, newPoint]
    });
    sound.playButtonPress();

    setNewPointTitle('');
    setNewPointDesc('');
  };

  const handleDeleteSummaryPoint = (id: string) => {
    onUpdateProjectSummary({
      keyPoints: projectSummary.keyPoints.filter(p => p.id !== id)
    });
    sound.playButtonPress();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col text-white overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/30 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg">Session &amp; Project Settings</h2>
              <p className="text-xs text-slate-400">Edit project revision summary, questions, timers, and words</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 px-5 pt-3 gap-2 bg-slate-950/40 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'summary'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Project Revision Summary</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('params')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'params'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timers &amp; Scoring</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'questions'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>🎯</span>
            <span>Quiz Questions ({questions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('words')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'words'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>🔤</span>
            <span>Mystery Words ({words.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* TAB 1: PROJECT SUMMARY / REVISION BRIEFING */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white">Edit Revision &amp; Project Summary for Students</span>
                <button
                  type="button"
                  onClick={() => onUpdateProjectSummary({ ...DEFAULT_PROJECT_SUMMARY })}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Default Summary</span>
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Summary Title
                  </label>
                  <input
                    type="text"
                    value={projectSummary.title}
                    onChange={(e) => onUpdateProjectSummary({ title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Project Authors / Credits
                  </label>
                  <input
                    type="text"
                    value={projectSummary.author}
                    onChange={(e) => onUpdateProjectSummary({ author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Subtitle / Subject
                </label>
                <input
                  type="text"
                  value={projectSummary.subtitle}
                  onChange={(e) => onUpdateProjectSummary({ subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>

              {/* Overview text */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Executive Overview (Displayed prominently to all students)
                </label>
                <textarea
                  rows={3}
                  value={projectSummary.overview}
                  onChange={(e) => onUpdateProjectSummary({ overview: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm leading-relaxed"
                />
              </div>

              {/* Add Revision Point Form */}
              <form onSubmit={handleAddSummaryPoint} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  Add a Key Revision Point
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Icon (e.g. ⚡)"
                    value={newPointIcon}
                    onChange={(e) => setNewPointIcon(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs text-center"
                  />
                  <input
                    type="text"
                    placeholder="Point Title"
                    value={newPointTitle}
                    onChange={(e) => setNewPointTitle(e.target.value)}
                    className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Category tag"
                    value={newPointCat}
                    onChange={(e) => setNewPointCat(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Clear description of the concept or fact to revise..."
                    value={newPointDesc}
                    onChange={(e) => setNewPointDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newPointTitle.trim() || !newPointDesc.trim()}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition"
                >
                  Add Revision Point
                </button>
              </form>

              {/* Key Points List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 block">
                  Current Key Points ({projectSummary.keyPoints.length}):
                </span>
                {projectSummary.keyPoints.map((point) => (
                  <div
                    key={point.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl">{point.icon || '📌'}</span>
                      <div className="truncate">
                        <div className="font-bold text-white text-xs truncate">{point.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">{point.description}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSummaryPoint(point.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Notes & Tips */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                    Important Notes &amp; Highlights
                  </label>
                  <input
                    type="text"
                    value={projectSummary.importantNotes || ''}
                    onChange={(e) => onUpdateProjectSummary({ importantNotes: e.target.value })}
                    placeholder="Key note to highlight before starting the quiz..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                    Quiz Tips
                  </label>
                  <input
                    type="text"
                    value={projectSummary.quizTips || ''}
                    onChange={(e) => onUpdateProjectSummary({ quizTips: e.target.value })}
                    placeholder="Advice for students during the quiz..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-200 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARAMS */}
          {activeTab === 'params' && (
            <div className="space-y-6">
              {/* Reflection Time for Quiz */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-white">Quiz Question Reflection Time</span>
                  </div>
                  <span className="font-mono text-rose-400 font-black">{settings.quizTimeLimit}s</span>
                </div>
                <div className="flex gap-2">
                  {[10, 15, 20, 30, 45, 60].map(sec => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => onUpdateSettings({ quizTimeLimit: sec })}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs transition border ${
                        settings.quizTimeLimit === sec
                          ? 'bg-rose-600 text-white border-rose-500 shadow'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Reflection Time for Word Guess */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">Word Guess Round Time</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-black">{settings.wordTimeLimit}s</span>
                </div>
                <div className="flex gap-2">
                  {[20, 30, 45, 60, 90].map(sec => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => onUpdateSettings({ wordTimeLimit: sec })}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs transition border ${
                        settings.wordTimeLimit === sec
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Scoring Modifiers */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-4">
                <span className="font-bold text-white block">Scoring Engine &amp; Bonuses</span>

                {/* Speed bonus */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold text-slate-200 text-xs">Speed Bonus</div>
                      <div className="text-[11px] text-slate-400">Faster answers yield higher scores up to 1000 pts</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.speedBonusEnabled}
                    onChange={(e) => onUpdateSettings({ speedBonusEnabled: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600 rounded"
                  />
                </label>

                {/* Streak bonus */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <div>
                      <div className="font-semibold text-slate-200 text-xs">Streak Combo Bonus</div>
                      <div className="text-[11px] text-slate-400">Consecutive correct answers award multiplier points</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.streakBonusEnabled}
                    onChange={(e) => onUpdateSettings({ streakBonusEnabled: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: QUESTIONS QUIZ */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Add Question Form */}
              <form onSubmit={handleAddQuestion} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-rose-400" />
                  Add Custom Quiz Question
                </h3>

                <div>
                  <input
                    type="text"
                    placeholder="Question prompt..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium text-sm outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Category (e.g. Science)"
                    value={newQuestionCat}
                    onChange={(e) => setNewQuestionCat(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Emoji or Visual Clue (e.g. 🪐)"
                    value={newQuestionClue}
                    onChange={(e) => setNewQuestionClue(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>

                {/* 4 Choices */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">
                    The 4 Answer Choices (select the correct radio):
                  </span>
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctChoice"
                        checked={newCorrectIndex === idx}
                        onChange={() => setNewCorrectIndex(idx)}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                        title="Mark as correct choice"
                      />
                      <input
                        type="text"
                        placeholder={`Choice ${idx + 1}...`}
                        value={newChoices[idx]}
                        onChange={(e) => {
                          const updated = [...newChoices] as [string, string, string, string];
                          updated[idx] = e.target.value;
                          setNewChoices(updated);
                        }}
                        className={`flex-1 bg-slate-900 border rounded-xl px-3 py-1.5 text-xs text-white ${
                          newCorrectIndex === idx ? 'border-emerald-500/70' : 'border-slate-700'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Educational explanation / fun fact (optional)"
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newQuestionText.trim() || newChoices.some(c => !c.trim())}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow"
                >
                  Add Question to Live Quiz
                </button>
              </form>

              {/* Questions List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Questions in bank ({questions.length})</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuestions([...DEFAULT_QUESTIONS])}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Default Questions</span>
                  </button>
                </div>

                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-bold text-slate-500 text-xs">#{idx + 1}</span>
                      <span className="text-base">{q.visualClue || '❓'}</span>
                      <div className="truncate">
                        <div className="font-bold text-white text-xs truncate">{q.question}</div>
                        <div className="text-[11px] text-emerald-400 truncate">
                          Correct: {q.choices[q.correctIndex]}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WORDS */}
          {activeTab === 'words' && (
            <div className="space-y-6">
              {/* Add Word Form */}
              <form onSubmit={handleAddWord} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  Add Mystery Word
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Word to guess (e.g. DOLPHIN)"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value.toUpperCase())}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm uppercase outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. Ocean Life)"
                    value={newWordCat}
                    onChange={(e) => setNewWordCat(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Visual clues / emojis (comma separated, e.g. 🐬, Ocean, High Jump)"
                    value={newWordClues}
                    onChange={(e) => setNewWordClues(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Explanation / educational note (optional)"
                    value={newWordExpl}
                    onChange={(e) => setNewWordExpl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newWord.trim()}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow"
                >
                  Add Mystery Word
                </button>
              </form>

              {/* Words List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Registered Words ({words.length})</span>
                  <button
                    type="button"
                    onClick={() => onUpdateWords([...DEFAULT_WORDS])}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Default Words</span>
                  </button>
                </div>

                {words.map((w, idx) => (
                  <div
                    key={w.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-bold text-slate-500 text-xs">#{idx + 1}</span>
                      <div>
                        <span className="font-mono font-black text-emerald-400 text-sm tracking-wider">
                          {w.word}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-2">({w.word.length} letters - {w.category})</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteWord(w.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Done &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
