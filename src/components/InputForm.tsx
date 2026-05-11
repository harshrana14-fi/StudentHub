'use client';

import { useState } from 'react';

interface InputFormProps {
  onGenerate: (experimentTitle: string, subject: string, includeTheory: boolean, includeAlgorithm: boolean) => void;
  isLoading: boolean;
}

const SUBJECTS = {
  '2nd Sem': ['Programming in C'],
  '3rd Sem': [
    'Object Oriented Programming with C++ (OOP\'s with c++)',
    'Data Structures',
    'Computational methods'
  ],
  '4th Sem': [
    'Database management system(DBMS)',
    'Programming in Java',
    'Probability Statistics and Linear Programming'
  ]
};

export default function InputForm({ onGenerate, isLoading }: InputFormProps) {
  const [experimentTitle, setExperimentTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [includeTheory, setIncludeTheory] = useState(true);
  const [includeAlgorithm, setIncludeAlgorithm] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (experimentTitle.trim() && subject) {
      onGenerate(experimentTitle.trim(), subject, includeTheory, includeAlgorithm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div>
        <label
          htmlFor="experimentTitle"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Experiment Title
        </label>
        <input
          id="experimentTitle"
          type="text"
          value={experimentTitle}
          onChange={(e) => setExperimentTitle(e.target.value)}
          placeholder="e.g., Implementation of Binary Search Tree"
          className="input-field"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Subject
        </label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="select-field"
          disabled={isLoading}
          required
        >
          <option value="" disabled>Select a subject</option>
          {Object.entries(SUBJECTS).map(([semester, subjects]) => (
            <optgroup key={semester} label={semester}>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Include Options
        </label>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="includeTheory"
            checked={includeTheory}
            onChange={(e) => setIncludeTheory(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            disabled={isLoading}
          />
          <label htmlFor="includeTheory" className="text-sm font-medium text-gray-700">
            Include Detailed Theory
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="includeAlgorithm"
            checked={includeAlgorithm}
            onChange={(e) => setIncludeAlgorithm(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            disabled={isLoading}
          />
          <label htmlFor="includeAlgorithm" className="text-sm font-medium text-gray-700">
            Include Algorithm
          </label>
        </div>
      </div>

      <button type="submit" className="btn-primary w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin-custom h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </span>
        ) : (
          'Generate Lab Record'
        )}
      </button>
    </form>
  );
}
