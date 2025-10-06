"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Trophy, X } from 'lucide-react';

interface PointEntry {
  id: number;
  points: number;
  time: string;
}

interface TeamScores {
  [key: string]: PointEntry[];
}

type TeamName = 'Spartans' | 'Ninjas' | 'Apaches' | 'Vikings' | 'Centurions';

const teams: { name: TeamName; color: string; bgColor: string; hoverColor: string }[] = [
  { name: 'Spartans', color: 'text-gray-100', bgColor: 'bg-gray-600', hoverColor: 'hover:bg-gray-700' },
  { name: 'Ninjas', color: 'text-blue-100', bgColor: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
  { name: 'Apaches', color: 'text-red-100', bgColor: 'bg-red-600', hoverColor: 'hover:bg-red-700' },
  { name: 'Vikings', color: 'text-green-100', bgColor: 'bg-green-600', hoverColor: 'hover:bg-green-700' },
  { name: 'Centurions', color: 'text-yellow-100', bgColor: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600' },
];

export default function F1Stopwatch() {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [teamScores, setTeamScores] = useState<TeamScores>({
    Spartans: [],
    Ninjas: [],
    Apaches: [],
    Vikings: [],
    Centurions: [],
  });
  const [entryIdCounter, setEntryIdCounter] = useState<number>(0);
  const [doublePoints, setDoublePoints] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((t: number) => t + 10);
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

  const getPoints = (milliseconds: number): number => {
    const seconds = milliseconds / 1000;
    if (seconds < 1) return 25;
    if (seconds < 2) return 18;
    if (seconds < 4) return 15;
    if (seconds < 6) return 12;
    if (seconds < 8) return 10;
    if (seconds < 10) return 8;
    if (seconds < 12) return 6;
    if (seconds < 15) return 4;
    if (seconds < 18) return 2;
    if (seconds < 25) return 1;
    return 0;
  };

  const formatTime = (milliseconds: number): string => {
    const ms = Math.floor((milliseconds % 1000) / 10);
    const secs = Math.floor((milliseconds / 1000) % 60);
    const mins = Math.floor((milliseconds / 60000) % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStartPause = (): void => {
    setIsRunning(!isRunning);
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setTime(0);
    setDoublePoints(false);
  };

  const handleDiscard = (): void => {
    setIsRunning(false);
    setTime(0);
    setDoublePoints(false);
  };

  const handleAddToTeam = (teamName: TeamName): void => {
    const basePoints = getPoints(time);
    const points = doublePoints ? basePoints * 2 : basePoints;
    const timeStr = formatTime(time);
    const newEntry: PointEntry = {
      id: entryIdCounter,
      points,
      time: timeStr,
    };
    
    setTeamScores(prev => ({
      ...prev,
      [teamName]: [...prev[teamName], newEntry],
    }));
    
    setEntryIdCounter(prev => prev + 1);
    setIsRunning(false);
    setTime(0);
    setDoublePoints(false);
  };

  const handleRemoveEntry = (teamName: TeamName, entryId: number): void => {
    setTeamScores(prev => ({
      ...prev,
      [teamName]: prev[teamName].filter(entry => entry.id !== entryId),
    }));
  };

  const handleResetAll = (): void => {
    setTeamScores({
      Spartans: [],
      Ninjas: [],
      Apaches: [],
      Vikings: [],
      Centurions: [],
    });
  };

  const getTotalPoints = (teamName: TeamName): number => {
    return teamScores[teamName].reduce((sum, entry) => sum + entry.points, 0);
  };

  const getFastestTime = (): number | null => {
    let fastest: number | null = null;
    Object.values(teamScores).forEach(entries => {
      entries.forEach(entry => {
        const [mins, rest] = entry.time.split(':');
        const [secs, centisecs] = rest.split('.');
        const ms = (parseInt(mins) * 60000) + (parseInt(secs) * 1000) + (parseInt(centisecs) * 10);
        if (fastest === null || ms < fastest) {
          fastest = ms;
        }
      });
    });
    return fastest;
  };

  const isFastestEntry = (timeStr: string): boolean => {
    const fastest = getFastestTime();
    if (fastest === null) return false;
    
    const [mins, rest] = timeStr.split(':');
    const [secs, centisecs] = rest.split('.');
    const ms = (parseInt(mins) * 60000) + (parseInt(secs) * 1000) + (parseInt(centisecs) * 10);
    return ms === fastest;
  };

  const points = getPoints(time);
  const displayPoints = doublePoints ? points * 2 : points;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-black to-red-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Trophy className="w-10 h-10 text-red-500" />
          <h1 className="text-5xl font-black text-white tracking-wider">RACE TIMER</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stopwatch Section */}
          <div className="lg:col-span-1">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 border-4 border-red-600 shadow-2xl">
              <div className="bg-red-950/50 rounded-lg p-6 mb-4">
                <div className="text-center mb-4">
                  <div className="text-5xl font-mono font-black text-white mb-2 tracking-wider">
                    {formatTime(time)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <div className="text-sm text-red-400 font-bold tracking-wide">POINTS</div>
                    <button
                      onClick={() => setDoublePoints(!doublePoints)}
                      className={`px-3 py-1 rounded font-black text-xs transition-all ${
                        doublePoints 
                          ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50' 
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      x2
                    </button>
                  </div>
                  <div className="text-6xl font-black text-red-500">
                    {displayPoints}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleStartPause}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded transition-all shadow-lg"
                >
                  {isRunning ? <><Pause className="w-5 h-5" />PAUSE</> : <><Play className="w-5 h-5" />START</>}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-black px-6 py-3 rounded transition-all shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {/* Team Assignment Buttons */}
              <div className="space-y-2 mb-3">
                {teams.map(team => (
                  <button
                    key={team.name}
                    onClick={() => handleAddToTeam(team.name)}
                    disabled={time === 0}
                    className={`w-full ${team.bgColor} ${team.hoverColor} ${team.color} font-black py-2 rounded transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed tracking-wide`}
                  >
                    ADD TO {team.name.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={handleDiscard}
                disabled={time === 0}
                className="w-full bg-gray-900 hover:bg-black text-gray-300 font-black py-2 rounded transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed tracking-wide border border-gray-700"
              >
                DISCARD RESULT
              </button>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="lg:col-span-2">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 border-4 border-red-600 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-black text-white tracking-wider">LEADERBOARD</h2>
                <button
                  onClick={handleResetAll}
                  className="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2 rounded transition-all shadow-lg text-sm tracking-wide"
                >
                  RESET ALL
                </button>
              </div>

              <div className="space-y-4">
                {teams.map(team => {
                  const total = getTotalPoints(team.name);
                  const entries = teamScores[team.name];
                  
                  return (
                    <div key={team.name} className={`${team.bgColor} rounded-lg p-4 border-2 border-white/20`}>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className={`text-2xl font-black ${team.color} tracking-wide`}>
                          {team.name.toUpperCase()}
                        </h3>
                        <div className={`text-3xl font-black ${team.color}`}>
                          {total}
                        </div>
                      </div>
                      
                      {entries.length > 0 && (
                        <div className="space-y-1">
                          {entries.map(entry => (
                            <div
                              key={entry.id}
                              className="flex justify-between items-center bg-black/30 rounded px-3 py-2"
                            >
                              <span className={`font-mono ${team.color} text-sm flex items-center gap-2`}>
                                {entry.time}
                                {isFastestEntry(entry.time) && <span className="text-lg">⭐</span>}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className={`font-black ${team.color} text-lg`}>
                                  +{entry.points}
                                </span>
                                <button
                                  onClick={() => handleRemoveEntry(team.name, entry.id)}
                                  className="text-white/60 hover:text-white transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}