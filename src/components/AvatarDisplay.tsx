import React from 'react';

export interface AvatarItem {
  id: string;
  name: string;
  tag: string;
  color: string;
  gradient: string;
  borderColor: string;
}

export const AVATAR_LIST: AvatarItem[] = [
  {
    id: 'astro-cat',
    name: 'Astro Cat',
    tag: 'Cosmic',
    color: 'bg-indigo-600',
    gradient: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-400'
  },
  {
    id: 'cyber-fox',
    name: 'Cyber Fox',
    tag: 'Neon',
    color: 'bg-rose-600',
    gradient: 'from-rose-500 to-amber-500',
    borderColor: 'border-rose-400'
  },
  {
    id: 'robo-bot',
    name: 'Robo Bot',
    tag: 'Tech',
    color: 'bg-cyan-600',
    gradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-400'
  },
  {
    id: 'cosmic-panda',
    name: 'Cosmo Panda',
    tag: 'Galaxy',
    color: 'bg-violet-600',
    gradient: 'from-violet-500 to-fuchsia-600',
    borderColor: 'border-violet-400'
  },
  {
    id: 'lightning-dino',
    name: 'Volt Dino',
    tag: 'Electric',
    color: 'bg-emerald-600',
    gradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-400'
  },
  {
    id: 'wizard-owl',
    name: 'Wizard Owl',
    tag: 'Magic',
    color: 'bg-purple-600',
    gradient: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-400'
  },
  {
    id: 'turbo-bunny',
    name: 'Turbo Bunny',
    tag: 'Speed',
    color: 'bg-pink-600',
    gradient: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-400'
  },
  {
    id: 'party-penguin',
    name: 'DJ Penguin',
    tag: 'Music',
    color: 'bg-sky-600',
    gradient: 'from-sky-500 to-indigo-600',
    borderColor: 'border-sky-400'
  },
  {
    id: 'flame-dragon',
    name: 'Flame Dragon',
    tag: 'Fire',
    color: 'bg-orange-600',
    gradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-orange-400'
  },
  {
    id: 'star-alien',
    name: 'Star Alien',
    tag: 'Alien',
    color: 'bg-lime-600',
    gradient: 'from-lime-500 to-emerald-600',
    borderColor: 'border-lime-400'
  },
  {
    id: 'hero-bear',
    name: 'Hero Bear',
    tag: 'Valor',
    color: 'bg-amber-600',
    gradient: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-400'
  },
  {
    id: 'pixel-ghost',
    name: 'Pixel Ghost',
    tag: 'Arcade',
    color: 'bg-teal-600',
    gradient: 'from-teal-500 to-cyan-600',
    borderColor: 'border-teal-400'
  }
];

export const DEFAULT_AVATAR_ID = 'astro-cat';

export function getAvatarInfo(avatarId?: string): AvatarItem {
  const found = AVATAR_LIST.find((a) => a.id === avatarId);
  return (
    found || {
      id: avatarId || DEFAULT_AVATAR_ID,
      name: 'Challenger',
      tag: 'Player',
      color: 'bg-indigo-600',
      gradient: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-400'
    }
  );
}

interface AvatarDisplayProps {
  avatar: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animated?: boolean;
  className?: string;
  showBadge?: boolean;
}

const SIZE_MAP = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
  '2xl': 'w-28 h-28'
};

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatar,
  size = 'md',
  animated = true,
  className = '',
  showBadge = false
}) => {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const isAnimated = animated;

  // Fallback for legacy emoji avatars or plain strings
  const isCustomId = AVATAR_LIST.some((a) => a.id === avatar);

  if (!isCustomId) {
    // If it's an emoji like 🦊, render in a round container
    return (
      <div
        className={`inline-flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 select-none ${sizeClass} ${className}`}
      >
        <span className="text-center leading-none" style={{ fontSize: '65%' }}>
          {avatar || '🎮'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl select-none ${sizeClass} ${className}`}
      data-avatar-id={avatar}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad-astro" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="grad-cyber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="grad-robo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="grad-panda" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
          <linearGradient id="grad-dino" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
          <linearGradient id="grad-owl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="grad-bunny" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
          <linearGradient id="grad-penguin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="grad-dragon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="grad-alien" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="grad-bear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="grad-ghost" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Visor / Helmet Reflection */}
          <linearGradient id="visor-glare" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Golden Shield */}
          <linearGradient id="gold-shield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>

        {/* 1. ASTRO CAT */}
        {avatar === 'astro-cat' && (
          <g className={isAnimated ? 'animate-bounce-subtle' : ''}>
            {/* Background disc */}
            <circle cx="50" cy="50" r="46" fill="url(#grad-astro)" />
            {/* Orbiting star */}
            <circle cx="82" cy="22" r="3.5" fill="#FDE047" className={isAnimated ? 'animate-pulse' : ''} />
            <circle cx="18" cy="74" r="2" fill="#E0E7FF" />
            <circle cx="84" cy="68" r="2" fill="#E0E7FF" />
            {/* Cat Ears */}
            <polygon points="30,30 20,12 42,22" fill="#F472B6" />
            <polygon points="32,28 24,16 40,22" fill="#FBCFE8" />
            <polygon points="70,30 80,12 58,22" fill="#F472B6" />
            <polygon points="68,28 76,16 60,22" fill="#FBCFE8" />
            {/* Cat Head */}
            <circle cx="50" cy="52" r="30" fill="#FFFFFF" />
            {/* Space Helmet Dome Glass */}
            <circle cx="50" cy="52" r="32" stroke="#67E8F9" strokeWidth="3" fill="none" opacity="0.85" />
            <path d="M 24 50 A 28 28 0 0 1 76 50 Z" fill="url(#visor-glare)" />
            {/* Cat Whiskers */}
            <line x1="22" y1="54" x2="35" y2="52" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="59" x2="35" y2="57" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="78" y1="54" x2="65" y2="52" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="78" y1="59" x2="65" y2="57" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            {/* Eyes */}
            <ellipse cx="40" cy="48" rx="4" ry="5.5" fill="#1E1B4B" />
            <circle cx="38.5" cy="46.5" r="1.5" fill="#FFFFFF" />
            <ellipse cx="60" cy="48" rx="4" ry="5.5" fill="#1E1B4B" />
            <circle cx="58.5" cy="46.5" r="1.5" fill="#FFFFFF" />
            {/* Cute Nose & Mouth */}
            <polygon points="50,56 47,53 53,53" fill="#F472B6" />
            <path d="M 46 58 Q 50 62 54 58" stroke="#1E1B4B" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Helmet Collar */}
            <rect x="36" y="80" width="28" height="8" rx="4" fill="#67E8F9" />
          </g>
        )}

        {/* 2. CYBER FOX */}
        {avatar === 'cyber-fox' && (
          <g className={isAnimated ? 'animate-pulse-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-cyber)" />
            {/* Cyber grid lines */}
            <line x1="12" y1="40" x2="88" y2="40" stroke="#FFFFFF" strokeOpacity="0.15" strokeDasharray="3,3" />
            <line x1="12" y1="60" x2="88" y2="60" stroke="#FFFFFF" strokeOpacity="0.15" strokeDasharray="3,3" />
            {/* Fox Ears */}
            <polygon points="26,35 14,8 44,22" fill="#EA580C" />
            <polygon points="28,32 18,14 40,22" fill="#FFFFFF" />
            <polygon points="74,35 86,8 56,22" fill="#EA580C" />
            <polygon points="72,32 82,14 60,22" fill="#FFFFFF" />
            {/* Fox Face Contour */}
            <polygon points="50,78 20,40 80,40" fill="#FB923C" />
            <polygon points="50,78 32,46 50,46" fill="#FFFFFF" />
            <polygon points="50,78 68,46 50,46" fill="#FFFFFF" />
            {/* Cyber Visor */}
            <path d="M 24 38 L 76 38 L 68 52 L 32 52 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
            {/* Visor Glow Scanning Line */}
            <line x1="30" y1="45" x2="70" y2="45" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" className={isAnimated ? 'animate-pulse' : ''} />
            {/* Nose */}
            <circle cx="50" cy="74" r="3.5" fill="#0F172A" />
          </g>
        )}

        {/* 3. ROBO BOT */}
        {avatar === 'robo-bot' && (
          <g className={isAnimated ? 'animate-wiggle-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-robo)" />
            {/* Antenna with glowing beacon */}
            <line x1="50" y1="26" x2="50" y2="12" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="10" r="5" fill="#F43F5E" className={isAnimated ? 'animate-ping' : ''} />
            <circle cx="50" cy="10" r="4" fill="#FB7185" />
            {/* Robot Head Body */}
            <rect x="25" y="26" width="50" height="46" rx="12" fill="#E2E8F0" stroke="#0284C7" strokeWidth="3" />
            {/* Robot Ear Bolts */}
            <rect x="18" y="42" width="7" height="14" rx="3" fill="#64748B" />
            <rect x="75" y="42" width="7" height="14" rx="3" fill="#64748B" />
            {/* Screen Eye Visor */}
            <rect x="32" y="34" width="36" height="20" rx="6" fill="#0F172A" />
            {/* Cyan Pixel Eyes */}
            <rect x="38" y="40" width="8" height="8" rx="2" fill="#22D3EE" className={isAnimated ? 'animate-pulse' : ''} />
            <rect x="54" y="40" width="8" height="8" rx="2" fill="#22D3EE" className={isAnimated ? 'animate-pulse' : ''} />
            {/* Speaker / Grin Mouth */}
            <line x1="38" y1="62" x2="62" y2="62" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" strokeDasharray="3,3" />
            {/* Cheek blush LEDs */}
            <circle cx="32" cy="58" r="2" fill="#F43F5E" />
            <circle cx="68" cy="58" r="2" fill="#F43F5E" />
          </g>
        )}

        {/* 4. COSMIC PANDA */}
        {avatar === 'cosmic-panda' && (
          <g className={isAnimated ? 'animate-float-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-panda)" />
            {/* Planetary Ring across head */}
            <ellipse cx="50" cy="50" rx="46" ry="14" stroke="#FDE047" strokeWidth="2.5" fill="none" opacity="0.65" transform="rotate(-15 50 50)" />
            {/* Panda Ears */}
            <circle cx="28" cy="26" r="13" fill="#18181B" />
            <circle cx="72" cy="26" r="13" fill="#18181B" />
            {/* Panda Head */}
            <circle cx="50" cy="54" r="30" fill="#FFFFFF" />
            {/* Eye Patches */}
            <ellipse cx="38" cy="50" rx="9" ry="11" fill="#18181B" transform="rotate(-15 38 50)" />
            <ellipse cx="62" cy="50" rx="9" ry="11" fill="#18181B" transform="rotate(15 62 50)" />
            {/* Star Sparkle Pupils */}
            <circle cx="39" cy="49" r="3" fill="#C084FC" />
            <circle cx="61" cy="49" r="3" fill="#C084FC" />
            <circle cx="40" cy="48" r="1" fill="#FFFFFF" />
            <circle cx="62" cy="48" r="1" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <ellipse cx="50" cy="62" rx="4" ry="3" fill="#18181B" />
            <path d="M 46 66 Q 50 70 54 66" stroke="#18181B" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* 5. LIGHTNING DINO */}
        {avatar === 'lightning-dino' && (
          <g className={isAnimated ? 'animate-bounce-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-dino)" />
            {/* Dinosaur Spikes / Crest */}
            <polygon points="50,10 44,24 56,24" fill="#FDE047" />
            <polygon points="34,16 32,28 42,26" fill="#FDE047" />
            <polygon points="66,16 58,26 68,28" fill="#FDE047" />
            {/* Dino Head */}
            <rect x="24" y="24" width="52" height="48" rx="20" fill="#10B981" />
            {/* Snout */}
            <rect x="20" y="44" width="60" height="24" rx="12" fill="#34D399" />
            {/* Nostrils */}
            <circle cx="42" cy="50" r="2" fill="#065F46" />
            <circle cx="58" cy="50" r="2" fill="#065F46" />
            {/* Big Friendly Eyes */}
            <circle cx="36" cy="38" r="7" fill="#FFFFFF" />
            <circle cx="36" cy="38" r="4" fill="#064E3B" />
            <circle cx="38" cy="36" r="1.5" fill="#FFFFFF" />
            <circle cx="64" cy="38" r="7" fill="#FFFFFF" />
            <circle cx="64" cy="38" r="4" fill="#064E3B" />
            <circle cx="66" cy="36" r="1.5" fill="#FFFFFF" />
            {/* Cheerful Tooth */}
            <polygon points="46,62 50,68 54,62" fill="#FFFFFF" />
            {/* Lightning bolt badge on cheek */}
            <polygon points="74,52 70,58 73,58 69,66 76,59 73,59" fill="#FACC15" />
          </g>
        )}

        {/* 6. WIZARD OWL */}
        {avatar === 'wizard-owl' && (
          <g className={isAnimated ? 'animate-float-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-owl)" />
            {/* Wizard Hat */}
            <polygon points="50,4 32,32 68,32" fill="#4C1D95" />
            <ellipse cx="50" cy="32" rx="26" ry="6" fill="#6D28D9" />
            <circle cx="50" cy="6" r="3.5" fill="#FDE047" className={isAnimated ? 'animate-pulse' : ''} />
            <path d="M 45 20 Q 50 18 55 20" stroke="#FDE047" strokeWidth="1.5" fill="none" />
            {/* Owl Body / Head */}
            <circle cx="50" cy="58" r="26" fill="#8B5CF6" />
            <circle cx="50" cy="64" r="18" fill="#DDD6FE" />
            {/* Feather tufts */}
            <polygon points="26,42 20,34 32,38" fill="#7C3AED" />
            <polygon points="74,42 80,34 68,38" fill="#7C3AED" />
            {/* Huge Wise Owl Goggles/Eyes */}
            <circle cx="39" cy="54" r="10" fill="#FDE047" stroke="#312E81" strokeWidth="2" />
            <circle cx="39" cy="54" r="5" fill="#1E1B4B" />
            <circle cx="37" cy="52" r="1.5" fill="#FFFFFF" />
            <circle cx="61" cy="54" r="10" fill="#FDE047" stroke="#312E81" strokeWidth="2" />
            <circle cx="61" cy="54" r="5" fill="#1E1B4B" />
            <circle cx="59" cy="52" r="1.5" fill="#FFFFFF" />
            {/* Golden Beak */}
            <polygon points="50,60 46,67 54,67" fill="#F97316" />
          </g>
        )}

        {/* 7. TURBO BUNNY */}
        {avatar === 'turbo-bunny' && (
          <g className={isAnimated ? 'animate-wiggle-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-bunny)" />
            {/* Bunny Tall Ears */}
            <ellipse cx="36" cy="18" rx="8" ry="18" fill="#FDF2F8" />
            <ellipse cx="36" cy="18" rx="4" ry="12" fill="#F472B6" />
            <ellipse cx="64" cy="18" rx="8" ry="18" fill="#FDF2F8" />
            <ellipse cx="64" cy="18" rx="4" ry="12" fill="#F472B6" />
            {/* Bunny Head */}
            <circle cx="50" cy="54" r="28" fill="#FFFFFF" />
            {/* Aviator / Racer Goggles */}
            <rect x="26" y="42" width="48" height="16" rx="8" fill="#1E293B" />
            <circle cx="38" cy="50" r="6" fill="#38BDF8" opacity="0.8" />
            <circle cx="62" cy="50" r="6" fill="#38BDF8" opacity="0.8" />
            {/* Nose & Mouth */}
            <polygon points="50,64 47,61 53,61" fill="#F43F5E" />
            <path d="M 46 66 Q 50 70 54 66" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="22" y1="62" x2="34" y2="62" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="78" y1="62" x2="66" y2="62" stroke="#94A3B8" strokeWidth="1.5" />
          </g>
        )}

        {/* 8. DJ PENGUIN */}
        {avatar === 'party-penguin' && (
          <g className={isAnimated ? 'animate-bounce-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-penguin)" />
            {/* DJ Headphones Band */}
            <path d="M 22 46 A 28 28 0 0 1 78 46" stroke="#0F172A" strokeWidth="5" fill="none" />
            {/* Headphone Earcups */}
            <rect x="16" y="40" width="8" height="18" rx="4" fill="#F43F5E" stroke="#0F172A" strokeWidth="2" />
            <rect x="76" y="40" width="8" height="18" rx="4" fill="#F43F5E" stroke="#0F172A" strokeWidth="2" />
            {/* Penguin Head Body */}
            <ellipse cx="50" cy="56" rx="26" ry="28" fill="#0F172A" />
            {/* White Face Belly */}
            <ellipse cx="50" cy="62" rx="18" ry="20" fill="#FFFFFF" />
            {/* Cool Sunglasses */}
            <polygon points="32,48 48,48 45,58 35,58" fill="#0284C7" stroke="#0F172A" strokeWidth="1.5" />
            <polygon points="52,48 68,48 65,58 55,58" fill="#0284C7" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="48" y1="50" x2="52" y2="50" stroke="#0F172A" strokeWidth="2" />
            {/* Beak */}
            <polygon points="50,62 45,70 55,70" fill="#F59E0B" />
          </g>
        )}

        {/* 9. FLAME DRAGON */}
        {avatar === 'flame-dragon' && (
          <g className={isAnimated ? 'animate-pulse-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-dragon)" />
            {/* Golden Dragon Horns */}
            <path d="M 32 30 Q 24 14 16 16 Q 26 26 30 36 Z" fill="#FDE047" />
            <path d="M 68 30 Q 76 14 84 16 Q 74 26 70 36 Z" fill="#FDE047" />
            {/* Tiny Cute Wings */}
            <path d="M 22 55 Q 10 50 14 65 Q 20 62 24 60 Z" fill="#DC2626" />
            <path d="M 78 55 Q 90 50 86 65 Q 80 62 76 60 Z" fill="#DC2626" />
            {/* Dragon Head */}
            <circle cx="50" cy="52" r="26" fill="#EA580C" />
            {/* Golden scales chest */}
            <ellipse cx="50" cy="68" rx="14" ry="12" fill="#FDE047" />
            {/* Fiery Eyes */}
            <ellipse cx="38" cy="46" rx="5" ry="6" fill="#FEF08A" />
            <ellipse cx="38" cy="46" rx="2" ry="5" fill="#7F1D1D" />
            <ellipse cx="62" cy="46" rx="5" ry="6" fill="#FEF08A" />
            <ellipse cx="62" cy="46" rx="2" ry="5" fill="#7F1D1D" />
            {/* Cute Smoke Puff / Flame */}
            <circle cx="50" cy="74" r="3.5" fill="#EF4444" className={isAnimated ? 'animate-ping' : ''} />
            <circle cx="50" cy="74" r="2" fill="#FDE047" />
          </g>
        )}

        {/* 10. STAR ALIEN */}
        {avatar === 'star-alien' && (
          <g className={isAnimated ? 'animate-float-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-alien)" />
            {/* Alien Antennae */}
            <path d="M 50 26 Q 50 12 40 10" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="40" cy="10" r="4" fill="#A3E635" className={isAnimated ? 'animate-pulse' : ''} />
            <path d="M 50 26 Q 50 12 60 10" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="60" cy="10" r="4" fill="#A3E635" className={isAnimated ? 'animate-pulse' : ''} />
            {/* Alien Head */}
            <ellipse cx="50" cy="52" rx="30" ry="26" fill="#84CC16" />
            {/* 3 Eyes */}
            {/* Left eye */}
            <circle cx="34" cy="46" r="6.5" fill="#14532D" />
            <circle cx="35" cy="45" r="2.5" fill="#86EFAC" />
            {/* Middle Big eye */}
            <circle cx="50" cy="42" r="8" fill="#14532D" />
            <circle cx="51" cy="41" r="3" fill="#86EFAC" />
            {/* Right eye */}
            <circle cx="66" cy="46" r="6.5" fill="#14532D" />
            <circle cx="67" cy="45" r="2.5" fill="#86EFAC" />
            {/* Smiling mouth */}
            <path d="M 42 64 Q 50 72 58 64" stroke="#14532D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* 11. HERO BEAR */}
        {avatar === 'hero-bear' && (
          <g className={isAnimated ? 'animate-wiggle-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-bear)" />
            {/* Superhero Cape flutter */}
            <path d="M 24 50 L 12 76 L 30 70 Z" fill="#DC2626" />
            <path d="M 76 50 L 88 76 L 70 70 Z" fill="#DC2626" />
            {/* Round Bear Ears */}
            <circle cx="28" cy="26" r="11" fill="#78350F" />
            <circle cx="28" cy="26" r="6" fill="#FDE68A" />
            <circle cx="72" cy="26" r="11" fill="#78350F" />
            <circle cx="72" cy="26" r="6" fill="#FDE68A" />
            {/* Bear Head */}
            <circle cx="50" cy="52" r="28" fill="#92400E" />
            {/* Hero Domino Mask */}
            <path d="M 28 42 Q 50 36 72 42 Q 68 54 50 48 Q 32 54 28 42 Z" fill="#1E293B" />
            <circle cx="38" cy="45" r="3.5" fill="#FFFFFF" />
            <circle cx="62" cy="45" r="3.5" fill="#FFFFFF" />
            {/* Snout & Nose */}
            <ellipse cx="50" cy="62" rx="11" ry="8" fill="#FDE68A" />
            <ellipse cx="50" cy="59" rx="4.5" ry="3" fill="#1E293B" />
            <path d="M 47 64 Q 50 67 53 64" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* 12. PIXEL GHOST */}
        {avatar === 'pixel-ghost' && (
          <g className={isAnimated ? 'animate-float-subtle' : ''}>
            <circle cx="50" cy="50" r="46" fill="url(#grad-ghost)" />
            {/* Ghost Body (Retro wavy sheet) */}
            <path
              d="M 26 50 C 26 32 74 32 74 50 L 74 74 L 66 68 L 58 74 L 50 68 L 42 74 L 34 68 L 26 74 Z"
              fill="#FFFFFF"
              stroke="#0D9488"
              strokeWidth="2.5"
            />
            {/* Big Expressive Ghost Eyes */}
            <ellipse cx="40" cy="48" rx="6" ry="8" fill="#0F766E" />
            <circle cx="42" cy="46" r="2.5" fill="#CCFBF1" />
            <ellipse cx="60" cy="48" rx="6" ry="8" fill="#0F766E" />
            <circle cx="62" cy="46" r="2.5" fill="#CCFBF1" />
            {/* Rosy Pixel Blushing Cheeks */}
            <circle cx="32" cy="57" r="3.5" fill="#F472B6" opacity="0.8" />
            <circle cx="68" cy="57" r="3.5" fill="#F472B6" opacity="0.8" />
            {/* Open mouth */}
            <ellipse cx="50" cy="58" rx="3.5" ry="5" fill="#0F766E" />
          </g>
        )}
      </svg>

      {/* Optional Role / Level Badge */}
      {showBadge && (
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
      )}
    </div>
  );
};
