import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  text: string;
  size?: number;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ text, size = 180, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !text) return;
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff'
      }
    }, (error) => {
      if (error) console.error('Error generating QR Code', error);
    });
  }, [text, size]);

  return (
    <div className={`p-2 bg-white rounded-xl shadow-md border border-slate-200 inline-block ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
};
