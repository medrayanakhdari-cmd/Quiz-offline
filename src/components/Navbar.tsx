import React, { useState } from 'react';
import { GameMode, QuizPhase, WordPhase } from '../types';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Wifi, Settings, ShieldCheck, HelpCircle, LogOut } from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  gameMode: GameMode;
  quizPhase: QuizPhase;
  wordPhase: WordPhase;
  connected: boolean;
  playerCount: number;
  hostIp: string;
  hostPort: number;
  soundEnabled: boolean;
  currentPlayerName?: string;
  onToggleSound: () => void;
  onOpenSettings?: () => void;
  onOpenNetworkHelp: () => void;
  onSwitchMode?: (mode: GameMode) => void;
  onExitAdmin?: () => void;
  onExitUser?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  gameMode,
  connected,
  playerCount,
  hostIp,
  hostPort,
  soundEnabled,
  currentPlayerName,
  onToggleSound,
  onOpenSettings,
  onOpenNetworkHelp,
  onSwitchMode,
  onExitAdmin,
  onExitUser
}) => {
  const [confirmExitType, setConfirmExitType] = useState<'admin' | 'user' | null>(null);

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-white px-4 py-3 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Mode */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 font-black text-xl tracking-tight text-white">
            <img
              src="/logo.png"
              alt="Ali & Rayan Ceuta"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400/80 shadow-md flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col leading-none">
              <span className="tracking-tight font-extrabold bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent text-lg">
                Ali &amp; Rayan
              </span>
              <span className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase">
                Ceuta Quiz
              </span>
            </div>
          </div>

          {/* Mode Selector for Host */}
          {isAdmin && onSwitchMode ? (
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
              <button
                id="nav-switch-briefing"
                onClick={() => {
                  sound.playButtonPress();
                  onSwitchMode('briefing');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  gameMode === 'briefing'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📖</span>
                <span className="hidden sm:inline">Project Summary</span>
                <span className="sm:hidden">Summary</span>
              </button>

              <button
                id="nav-switch-quiz"
                onClick={() => {
                  sound.playButtonPress();
                  onSwitchMode('quiz');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  gameMode === 'quiz'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎯</span>
                <span>Live Quiz</span>
              </button>

              <button
                id="nav-switch-word"
                onClick={() => {
                  sound.playButtonPress();
                  onSwitchMode('word_guess');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  gameMode === 'word_guess'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🔤</span>
                <span className="hidden sm:inline">Word Guess</span>
                <span className="sm:hidden">Words</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              <span>
                {gameMode === 'briefing'
                  ? '📖 Project Summary'
                  : gameMode === 'quiz'
                  ? '🎯 Live Quiz'
                  : '🔤 Word Guess'}
              </span>
            </div>
          )}

          {isAdmin && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Host Screen
            </span>
          )}
        </div>

        {/* Right controls: Network IP, Sound, Settings, Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* LAN IP Info button */}
          <button
            id="nav-network-info-btn"
            onClick={() => {
              sound.playButtonPress();
              onOpenNetworkHelp();
            }}
            className="flex items-center gap-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition"
            title="Local Wi-Fi LAN / Hotspot IP Address"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline text-slate-400">Wi-Fi LAN:</span>
            <span className="font-mono text-emerald-300">{hostIp}:{hostPort}</span>
          </button>

          {/* Connected players counter */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span>{playerCount} {playerCount === 1 ? 'player' : 'players'}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle"
            onClick={onToggleSound}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Admin Settings Button */}
          {isAdmin && onOpenSettings && (
            <button
              id="nav-settings-btn"
              onClick={() => {
                sound.playButtonPress();
                onOpenSettings();
              }}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Configure Summary, Questions, and Timers"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          )}

          {/* Guide / Help */}
          <button
            id="nav-help-btn"
            onClick={() => {
              sound.playButtonPress();
              onOpenNetworkHelp();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            title="Wi-Fi Hotspot & Offline LAN Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Exit Admin */}
          {isAdmin && onExitAdmin && (
            <button
              id="nav-exit-admin-btn"
              type="button"
              onClick={() => {
                sound.playButtonPress();
                setConfirmExitType('admin');
              }}
              className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 px-2.5 py-1.5 rounded-xl border border-rose-800/80 transition font-semibold"
              title="Exit Host Mode"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Exit Host</span>
              <span className="sm:hidden">Exit</span>
            </button>
          )}

          {/* Exit User / Leave Session */}
          {!isAdmin && currentPlayerName && onExitUser && (
            <button
              id="nav-exit-user-btn"
              type="button"
              onClick={() => {
                sound.playButtonPress();
                setConfirmExitType('user');
              }}
              className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 px-2.5 py-1.5 rounded-xl border border-rose-800/80 transition font-semibold"
              title={`Leave session (${currentPlayerName})`}
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Leave</span>
            </button>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {confirmExitType && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {confirmExitType === 'admin' ? 'Exit Host Mode?' : 'Leave Game Session?'}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {confirmExitType === 'admin'
                  ? 'Are you sure you want to exit Host mode? You will return to the student entry screen.'
                  : `Are you sure you want to leave, ${currentPlayerName}? You will return to the avatar and name selection screen.`}
              </p>
            </div>
            <div className="flex gap-2.5 justify-center pt-2">
              <button
                type="button"
                onClick={() => setConfirmExitType(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = confirmExitType;
                  setConfirmExitType(null);
                  if (target === 'admin' && onExitAdmin) onExitAdmin();
                  if (target === 'user' && onExitUser) onExitUser();
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex-1"
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
