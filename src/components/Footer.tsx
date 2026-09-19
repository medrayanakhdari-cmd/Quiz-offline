import React from 'react';
import { Mail, Sparkles, Heart, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="app-main-footer" className="w-full bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-md text-slate-400 text-xs py-4 px-4 sm:px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-slate-300 font-medium">Developed by </span>
            <strong className="text-white font-bold hover:text-indigo-300 transition">
              Med Rayan Akhdari
            </strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:rayanakhdari2009@gmail.com"
            id="footer-email-link"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/70 hover:border-indigo-500/60 hover:text-indigo-300 transition shadow-sm group"
            title="Send email to the developer"
          >
            <Mail className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-[11px] text-slate-300">rayanakhdari2009@gmail.com</span>
          </a>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-400/80" />
            <span>Ali &amp; Rayan Project v2.2</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500/80 inline" />
            <span>for Interactive Learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
