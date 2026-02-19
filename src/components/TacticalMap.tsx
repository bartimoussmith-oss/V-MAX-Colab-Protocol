
import React, { useEffect, useRef } from 'react';
import { ArrestRecord } from '../types';

interface TacticalMapProps {
  records: ArrestRecord[];
  onSelect: (record: ArrestRecord) => void;
}

const TacticalMap: React.FC<TacticalMapProps> = ({ records, onSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { clientWidth, clientHeight } = mapRef.current;
      canvas.width = clientWidth;
      canvas.height = clientHeight;

      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(canvas);

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00ff4120';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      records.forEach((record) => {
        const x = (record.lon + 180) / 360 * canvas.width;
        const y = (90 - record.lat) / 180 * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, record.visualMass * 3 + 2, 0, Math.PI * 2);
        ctx.fillStyle = record.threatLevel === 'CRITICAL' ? 'red' : '#00ff41';
        ctx.shadowColor = record.threatLevel === 'CRITICAL' ? 'red' : '#00ff41';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }
  }, [records]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <div
        ref={mapRef}
        className="absolute inset-0 z-0"
      ></div>
      <div className="absolute top-4 left-4 z-10 p-2 bg-gray-900/80 rounded text-xs text-[#00ff41]">
        <span className="font-bold">TACTICAL OVERLAY</span>
        <p className="mt-1 text-gray-500">Simulation Mode // Data Points: {records.length}</p>
      </div>
    </div>
  );
};

export default TacticalMap;
