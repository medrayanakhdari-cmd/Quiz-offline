import React, { useState, useEffect } from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { NetworkInterfaceInfo } from '../types';
import { sound } from '../utils/audio';
import {
  X,
  Wifi,
  Radio,
  Laptop,
  Check,
  RotateCcw,
  Copy,
  ExternalLink,
  ShieldCheck,
  Users,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface NetworkConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHostIp: string;
  currentHostPort: number;
  detectedIps?: NetworkInterfaceInfo[];
  onUpdateNetwork: (hostIp: string, hostPort: number) => void;
}

export const NetworkConfigModal: React.FC<NetworkConfigModalProps> = ({
  isOpen,
  onClose,
  currentHostIp,
  currentHostPort,
  detectedIps = [],
  onUpdateNetwork
}) => {
  const [ipInput, setIpInput] = useState(currentHostIp);
  const [portInput, setPortInput] = useState(currentHostPort.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIpInput(currentHostIp);
      setPortInput(currentHostPort.toString());
      setSavedSuccess(false);
      setCopied(false);
    }
  }, [isOpen, currentHostIp, currentHostPort]);

  if (!isOpen) return null;

  const browserHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isBrowserIpUsable =
    browserHostname &&
    browserHostname !== 'localhost' &&
    browserHostname !== '127.0.0.1' &&
    browserHostname !== '0.0.0.0';

  const previewPort = parseInt(portInput, 10) || 3000;
  const previewIp = ipInput.trim() || '127.0.0.1';
  const previewUrl = `http://${previewIp}:${previewPort}`;

  const handleApply = (newIp: string, newPortStr?: string) => {
    const portNum = parseInt(newPortStr !== undefined ? newPortStr : portInput, 10) || 3000;
    const cleanIp = newIp.trim();
    if (!cleanIp) return;

    onUpdateNetwork(cleanIp, portNum);
    sound.playButtonPress();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      sound.playButtonPress();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-lg text-white flex items-center gap-2">
                <span>Configure Host IP &amp; QR Code</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase tracking-wider">
                  Real-time
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Adapt the QR code and join URL to your host PC's Wi-Fi hotspot or LAN address
              </p>
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

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Live Preview Card */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-inner">
            <div className="bg-white p-2.5 rounded-2xl shadow-xl shrink-0 flex flex-col items-center">
              <QRCodeDisplay text={previewUrl} size={135} />
              <span className="text-[10px] font-bold text-slate-800 mt-1">Live QR Preview</span>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0 w-full">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Joining Address:
              </span>
              <div className="font-mono text-lg sm:text-xl font-black text-emerald-400 break-all select-all bg-slate-900/90 px-3 py-2 rounded-xl border border-emerald-500/30">
                {previewUrl}
              </div>
              <p className="text-xs text-slate-300">
                Students connect to your PC's Wi-Fi hotspot and point their smartphone camera at the screen QR code.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy URL'}</span>
                </button>

                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Adapters Detected on Hosting PC */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-indigo-400" />
                <span>Detected Network Adapters on this PC ({detectedIps.length}):</span>
              </label>
              <span className="text-[11px] text-slate-400">Click to apply instantly</span>
            </div>

            {detectedIps.length === 0 ? (
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400">
                No external network interfaces detected yet. Use the manual fields below or click "Use Browser IP".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {detectedIps.map((iface) => {
                  const isCurrent = iface.address === ipInput.trim();
                  return (
                    <button
                      key={`${iface.name}-${iface.address}`}
                      type="button"
                      onClick={() => {
                        setIpInput(iface.address);
                        handleApply(iface.address);
                      }}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Wifi className={`w-3.5 h-3.5 ${iface.isHotspotOrWifi ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span className="font-bold text-xs text-white truncate">{iface.name}</span>
                          {iface.isHotspotOrWifi && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                              Wi-Fi/Hotspot
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs text-emerald-400 block mt-0.5 font-bold">
                          {iface.address}
                        </span>
                      </div>
                      {isCurrent && (
                        <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Use Browser Hostname Shortcut */}
          {isBrowserIpUsable && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-300">You are accessing this page via: </span>
                  <strong className="font-mono text-indigo-300 font-bold">{browserHostname}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIpInput(browserHostname);
                  handleApply(browserHostname);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition shrink-0"
              >
                Use This IP
              </button>
            </div>
          )}

          {/* Manual Input Section */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Manual Custom IP / Hostname &amp; Port:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  IPv4 Address or Hostname:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    placeholder="e.g. 192.168.43.1"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Port:
                </label>
                <input
                  type="number"
                  value={portInput}
                  onChange={(e) => setPortInput(e.target.value)}
                  placeholder="3000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIpInput('127.0.0.1');
                  setPortInput('3000');
                  handleApply('127.0.0.1', '3000');
                }}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Localhost</span>
              </button>

              <button
                type="button"
                onClick={() => handleApply(ipInput, portInput)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Applied to All Screens!</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save &amp; Update QR Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Concurrency & Hotspot Tips for 23 Players */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Users className="w-4 h-4 shrink-0" />
              <span>Hosting 23 Concurrent Players Seamlessly:</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>
                <strong className="text-slate-200">Mobile Hotspot (Smartphone or PC):</strong> Turn on the Hotspot and make sure all 23 player phones connect to that Wi-Fi name.
              </li>
              <li>
                <strong className="text-slate-200">Firewall Access:</strong> If Windows Defender asks to allow Node.js on Private/Public networks, check <em>"Allow access"</em> so phones can reach port 3000.
              </li>
              <li>
                <strong className="text-slate-200">Instant Access:</strong> Players do NOT need to install any app. They simply scan the QR code with their phone camera or open <code className="text-emerald-400 font-mono">{previewUrl}</code> in Chrome or Safari.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Changes update the Host screen lobby QR code in real-time.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
