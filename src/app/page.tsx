'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// Easy to modify option arrays
const TRIBES = ['Spartans', 'Ninjas'];
const SCHOOLS = ['DE', 'SOE'];

export default function TemplateGenerator() {
  const [tribe, setTribe] = useState(TRIBES[0]);
  const [school, setSchool] = useState(SCHOOLS[0]);
  const [group, setGroup] = useState('');
  const [here, setHere] = useState('');
  const [total, setTotal] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleHereChange = (value: string) => {
    setHere(value);
    if (value && !total) {
      setTotal(value);
    }
  };

  const handleTotalChange = (value: string) => {
    setTotal(value);
    if (value && !here) {
      setHere(value);
    }
  };

  const generateTemplates = () => {
    const sections = [];
    const groupText = group ? ` ${group}` : '';
    
    // Section 1: Basic attendance templates
    const attendanceTemplates = [];
    attendanceTemplates.push(`${tribe} ${school}${groupText} ${here}/${total}`);
    attendanceTemplates.push(`UPDATED ${tribe} ${school}${groupText} ${here}/${total}`);
    sections.push(attendanceTemplates);
    
    // Section 2: Movement templates
    const movementTemplates = [];
    // Group-specific templates (only if group is specified)
    if (group) {
      movementTemplates.push(`${tribe} ${school} ${group} ready to move off`);
      movementTemplates.push(`${tribe} ${school} ${group} moved off`);
    }
    
    // School-specific location templates
    if (school === 'DE') {
      movementTemplates.push(`${tribe} DE reached DE Gallery L1`);
      movementTemplates.push(`${tribe} DE reached DE Studio L2`);
      movementTemplates.push(`${tribe} DE reached upper deck`);
    } else if (school === 'SOE') {
      movementTemplates.push(`${tribe} SOE reached aerospace hub`);
      movementTemplates.push(`${tribe} SOE reached cc inner hall`);
    }
    sections.push(movementTemplates);
    
    // Section 3: Special situation templates
    const specialTemplates = [];
    specialTemplates.push(`${tribe} ${school}${groupText} 1 camper unwell, NAME accompanying at LOCATION, need medical assistance`);
    specialTemplates.push(`${tribe} ${school}${groupText} 1 camper leaving early due to REASON, NAME bringing to LOCATION`);
    specialTemplates.push(`${tribe} ${school}${groupText} Camper left school, NAME returning to tribe`);
    sections.push(specialTemplates);
    
    return sections;
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sections = generateTemplates();
  let templateIndex = 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Template Generator</h1>
        
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          {/* Top Row - Tribe, School, Group */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tribe
              </label>
              <select
                value={tribe}
                onChange={(e) => setTribe(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TRIBES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School
              </label>
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCHOOLS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group
              </label>
              <input
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Bottom Row - Attendance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Here
              </label>
              <input
                type="number"
                value={here}
                onChange={(e) => handleHereChange(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total
              </label>
              <input
                type="number"
                value={total}
                onChange={(e) => handleTotalChange(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Templates Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Templates (Click to Copy)</h2>
          {sections.map((templates, sectionIndex) => (
            <div key={sectionIndex}>
              {sectionIndex > 0 && (
                <div className="border-t border-gray-300 my-4"></div>
              )}
              <div className="space-y-2">
                {templates.map((template) => {
                  const currentIndex = templateIndex++;
                  return (
                    <button
                      key={currentIndex}
                      onClick={() => copyToClipboard(template, currentIndex)}
                      className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-left transition-colors relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-800 flex-1 pr-8">{template}</span>
                        <div className="flex-shrink-0">
                          {copiedIndex === currentIndex ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                          )}
                        </div>
                      </div>
                      {copiedIndex === currentIndex && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Copied!
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}