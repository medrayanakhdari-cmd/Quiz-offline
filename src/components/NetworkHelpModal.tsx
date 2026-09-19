import React from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { sound } from '../utils/audio';
import { X, Wifi, Laptop, Copy, AlertCircle } from 'lucide-react';

interface NetworkHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostIp: string;
  hostPort: number;
}

export const NetworkHelpModal: React.FC<NetworkHelpModalProps> = ({
  isOpen,
  onClose,
  hostIp,
  hostPort
}) => {
  if (!isOpen) return null;

  const hostUrl = `http://${hostIp}:${hostPort}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hostUrl);
      sound.playButtonPress();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600/30 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg">Local Wi-Fi Hotspot &amp; Offline Connection</h2>
              <p className="text-xs text-slate-400">100% offline standalone usage without internet access</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Main Host Address Card */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
            <QRCodeDisplay text={hostUrl} size={140} />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Address to open on phones/tablets:
              </span>
              <div className="font-mono text-xl sm:text-2xl font-black text-emerald-400 select-all">
                {hostUrl}
              </div>
              <p className="text-xs text-slate-400">
                Students can simply scan this QR code with their camera while connected to the PC hotspot!
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL Address</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="space-y-4">
            <h3 className="font-black text-white text-base flex items-center gap-2">
              <Laptop className="w-4 h-4 text-indigo-400" />
              <span>How to setup the offline Wi-Fi hotspot on your PC:</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-white text-xs">Enable the Mobile Hotspot on PC</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    On Windows: toggle on <em>"Mobile Hotspot"</em> in Windows Network Settings. Alternatively, connect a pocket Wi-Fi router (no internet WAN cable needed).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-white text-xs">Connect Student Phones to the Wi-Fi</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Have students join your Wi-Fi hotspot network. No internet connection is required because the backend runs locally on your PC.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-white text-xs">Open the Browser</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    In Safari, Chrome, or Firefox, navigate to <code className="text-emerald-400 font-mono">{hostUrl}</code> or scan the QR code.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin tip */}
          <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center gap-3 text-xs text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              To open the host screen on your main display, enter <strong className="font-mono text-amber-300">#*admin*#</strong> in the username field!
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
