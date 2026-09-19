import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Player } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { AVATAR_LIST, DEFAULT_AVATAR_ID, getAvatarInfo, AvatarDisplay } from './AvatarDisplay';
import { Users, KeyRound, ArrowRight, Smartphone, Shield, Sparkles, Shuffle, Check } from 'lucide-react';

interface JoinScreenProps {
  onJoin: (username: string, avatar: string) => void;
  connectedPlayers: Player[];
  hostIp: string;
  hostPort: number;
}

export const JoinScreen: React.FC<JoinScreenProps> = ({
  onJoin,
  connectedPlayers,
  hostIp,
  hostPort
}) => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR_ID);
  const [showQr, setShowQr] = useState(false);

  const currentAvatarInfo = getAvatarInfo(selectedAvatar);

  const handleRandomizeAvatar = () => {
    sound.playButtonPress();
    const otherAvatars = AVATAR_LIST.filter(a => a.id !== selectedAvatar);
    const randomPick = otherAvatars[Math.floor(Math.random() * otherAvatars.length)];
    if (randomPick) {
      setSelectedAvatar(randomPick.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    sound.playButtonPress();
    onJoin(trimmed, selectedAvatar);
  };

  const isSecretAdminCode = username.trim() === '#*admin*#';
  const hostUrl = `http://${hostIp}:${hostPort}`;

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white">
      <div className="w-full max-w-lg">
        {/* Top Header Brand */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <img
              src="/logo.png"
              alt="Ali & Rayan Ceuta"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-2xl ring-4 ring-amber-400/80 mx-auto transition-transform duration-300 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg border border-white/20">
              Ceuta
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Ali &amp; <span className="text-amber-400">Rayan</span>
          </h1>
          <p className="text-slate-300 text-sm mt-1 font-medium">
            Ceuta Project • Live Quiz &amp; Interactive Revision
          </p>
        </div>

        {/* Main Join Card */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 sm:p-7 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Username Input */}
            <div>
              <label htmlFor="username-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Student Nickname / Username
              </label>
              <div className="relative">
                <input
                  id="username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name (e.g., Alex, Sarah)..."
                  maxLength={24}
                  autoFocus
                  className={`w-full bg-slate-950/80 border text-white font-bold text-lg rounded-2xl px-4 py-3 outline-none transition shadow-inner placeholder:text-slate-600 ${
                    isSecretAdminCode
                      ? 'border-amber-500 ring-2 ring-amber-500/30 text-amber-300'
                      : 'border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  }`}
                />
                {isSecretAdminCode && (
                  <div className="absolute right-3 top-3.5 flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-500/40 animate-pulse">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Host Mode Detected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Curated Animated SVG Avatar Selector (only for regular players) */}
            {!isSecretAdminCode && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>Pick Your Animated Avatar</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomizeAvatar}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/60 transition"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Shuffle</span>
                  </button>
                </div>

                {/* Selected Avatar Spotlight Card */}
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-inner">
                  <AvatarDisplay
                    avatar={selectedAvatar}
                    size="xl"
                    animated
                    className="ring-4 ring-rose-500/30 shadow-xl"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg text-white truncate">
                        {currentAvatarInfo.name}
                      </span>
                      <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
                        {currentAvatarInfo.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {username.trim() ? (
                        <span>Playing as <strong className="text-white">{username.trim()}</strong></span>
                      ) : (
                        <span>Ready to compete on the live scoreboard</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Curated Avatars Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {AVATAR_LIST.map((av) => {
                    const isSelected = selectedAvatar === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          sound.playButtonPress();
                          setSelectedAvatar(av.id);
                        }}
                        className={`group relative p-2 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 transform active:scale-95 ${
                          isSelected
                            ? 'bg-rose-950/60 border-2 border-rose-500 shadow-lg shadow-rose-500/25 scale-105'
                            : 'bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                        }`}
                        title={av.name}
                      >
                        <AvatarDisplay
                          avatar={av.id}
                          size="md"
                          animated={isSelected}
                        />
                        <span className="text-[10px] font-bold text-slate-300 group-hover:text-white mt-1.5 truncate max-w-full">
                          {av.name.split(' ')[0]}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-black shadow">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="join-submit-btn"
              type="submit"
              disabled={!username.trim()}
              className={`w-full font-extrabold text-base py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSecretAdminCode
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-rose-500/25'
              }`}
            >
              <span>{isSecretAdminCode ? 'Open Host Screen (Admin)' : 'Join Session'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Admin Hint Helper */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => setUsername('#*admin*#')}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition"
              title="Click to fill admin code"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Organizer Access: </span>
              <code className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-bold">#*admin*#</code>
            </button>
          </div>
        </div>

        {/* Hotspot LAN Info and QR Code */}
        <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-4 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-white">Connect other devices:</span>
            </div>
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
            >
              {showQr ? 'Hide QR Code' : 'Show QR Code'}
            </button>
          </div>

          <p className="mt-1.5 text-slate-400 leading-relaxed">
            Connect phones or tablets to the host PC Wi-Fi hotspot, then open:
          </p>
          <div className="mt-2 flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <code className="font-mono text-emerald-400 font-bold text-sm select-all">
              {hostUrl}
            </code>
            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(hostUrl);
                  sound.playButtonPress();
                }
              }}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-200 transition font-medium"
            >
              Copy
            </button>
          </div>

          {showQr && (
            <div className="mt-3 flex flex-col items-center p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
              <QRCodeDisplay text={hostUrl} size={150} />
              <span className="text-[11px] text-slate-400 mt-2">
                Scan with phone camera while connected to the same Wi-Fi
              </span>
            </div>
          )}
        </div>

        {/* Active Connected Players List */}
        {connectedPlayers.length > 0 && (
          <div className="mt-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2.5">
              <Users className="w-4 h-4 text-rose-400" />
              <span>Players in lobby ({connectedPlayers.length}):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {connectedPlayers.map((player) => (
                <span
                  key={player.id}
                  className="inline-flex items-center gap-2 text-xs font-bold bg-slate-800/90 text-slate-200 px-3 py-1.5 rounded-full border border-slate-700 shadow-sm"
                >
                  <AvatarDisplay avatar={player.avatar} size="xs" animated={false} />
                  <span>{player.username}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
