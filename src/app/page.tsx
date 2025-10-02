"use client";

import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export default function StopwatchPoints() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(t => t + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const getPoints = (milliseconds) => {
    const seconds = milliseconds / 1000;
    if (seconds < 1) return 25;
    if (seconds < 2) return 18;
    if (seconds < 3) return 15;
    if (seconds < 4) return 12;
    if (seconds < 5) return 10;
    if (seconds < 6) return 8;
    if (seconds < 7) return 6;
    if (seconds < 8) return 4;
    if (seconds < 9) return 2;
    if (seconds < 10) return 1;
    return 0;
  };

  const formatTime = (milliseconds) => {
    const ms = Math.floor((milliseconds % 1000) / 10);
    const secs = Math.floor((milliseconds / 1000) % 60);
    const mins = Math.floor((milliseconds / 60000) % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const points = getPoints(time);
  const getPointsColor = () => {
    if (points >= 18) return 'text-green-500';
    if (points >= 10) return 'text-yellow-500';
    if (points >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Timer className="w-8 h-8 text-purple-300" />
          <h1 className="text-3xl font-bold text-white">Stopwatch</h1>
        </div>

        <div className="bg-black/30 rounded-2xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-mono font-bold text-white mb-2">
              {formatTime(time)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-purple-300 mb-1">Points</div>
            <div className={`text-7xl font-bold ${getPointsColor()} transition-colors duration-300`}>
              {points}
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStartPause}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        <div className="mt-6 bg-black/20 rounded-xl p-4">
          <div className="text-xs text-purple-200 font-semibold mb-2">Points Table:</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
            <div>&lt;1s: 25pt</div>
            <div>1-2s: 18pt</div>
            <div>2-3s: 15pt</div>
            <div>3-4s: 12pt</div>
            <div>4-5s: 10pt</div>
            <div>5-6s: 8pt</div>
            <div>6-7s: 6pt</div>
            <div>7-8s: 4pt</div>
            <div>8-9s: 2pt</div>
            <div>9-10s: 1pt</div>
            <div className="col-span-2">&gt;10s: 0pt</div>
          </div>
        </div>
      </div>
    </div>
  );
}