'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ToastState } from '../SettingsManager';

interface Props {
  setToast: (toast: ToastState) => void;
}

export function AppearanceTab({ setToast }: Props) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [accentColor, setAccentColor] = useState('indigo');

  const colors = [
    { id: 'indigo', hex: '#4f46e5', name: 'Indigo' },
    { id: 'rose', hex: '#e11d48', name: 'Rose' },
    { id: 'emerald', hex: '#059669', name: 'Emerald' },
    { id: 'violet', hex: '#7c3aed', name: 'Violet' },
    { id: 'amber', hex: '#d97706', name: 'Amber' },
    { id: 'sky', hex: '#0284c7', name: 'Sky Blue' },
  ];

  useEffect(() => {
    setAnimationsEnabled(localStorage.getItem('apx_pref_animations') !== 'false');
    setCompactMode(localStorage.getItem('apx_pref_compact') === 'true');
    setAccentColor(localStorage.getItem('apx_pref_accent') || 'indigo');
  }, []);

  const savePreferences = () => {
    localStorage.setItem('apx_pref_animations', animationsEnabled.toString());
    localStorage.setItem('apx_pref_compact', compactMode.toString());
    localStorage.setItem('apx_pref_accent', accentColor);
    setToast({ message: 'Appearance preferences saved successfully', type: 'success' });
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Appearance & Theming</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Customize the look and feel of your admin dashboard.
        </p>
      </div>

      <div className="p-6 space-y-8 min-h-[400px]">
        {/* Accent Color Picker */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Accent Color</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setAccentColor(color.id)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform ${accentColor === color.id ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110' : 'hover:scale-110'}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {accentColor === color.id && <CheckCircle2 size={16} className="text-white" />}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Choose the primary color for buttons and active states.
          </p>
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Enable UI Animations
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Allows micro-interactions and transitions to play smoothly across the dashboard.
            </p>
          </div>
          <div className="relative flex items-center shrink-0">
            <input
              type="checkbox"
              id="pref_anim"
              checked={animationsEnabled}
              onChange={(e) => setAnimationsEnabled(e.target.checked)}
              className="peer sr-only"
            />
            <label
              htmlFor="pref_anim"
              className="w-11 h-6 min-h-[24px] bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 cursor-pointer flex items-center"
            ></label>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Compact Mode UI
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Reduces padding and spacing in data tables to show more information on screen.
            </p>
          </div>
          <div className="relative flex items-center shrink-0">
            <input
              type="checkbox"
              id="pref_comp"
              checked={compactMode}
              onChange={(e) => setCompactMode(e.target.checked)}
              className="peer sr-only"
            />
            <label
              htmlFor="pref_comp"
              className="w-11 h-6 min-h-[24px] bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 cursor-pointer flex items-center"
            ></label>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={savePreferences}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 min-h-[48px] flex items-center justify-center rounded-xl text-sm font-bold shadow-md transition-colors"
          >
            Save Appearance
          </button>
        </div>
      </div>
    </div>
  );
}
