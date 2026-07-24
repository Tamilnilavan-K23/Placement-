import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Video, 
  CheckCircle2, 
  Star, 
  Clock, 
  AlertTriangle, 
  Lightbulb, 
  Code2, 
  Calendar, 
  Play, 
  Pause, 
  Save
} from 'lucide-react';
import type { Problem } from '../../types/tracker';
import { useTrackerStore } from '../../store/useTrackerStore';
import { formatTimeSpent } from '../../utils/dateUtils';

interface ProblemDetailModalProps {
  problem: Problem | null;
  onClose: () => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({ problem, onClose }) => {
  const { 
    toggleProblemCompleted, 
    toggleProblemFavorite, 
    updateProblemNotes, 
    updateProblemStatus, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    isTimerRunning, 
    activeTimerProblemId, 
    timerSeconds
  } = useTrackerStore();

  if (!problem) return null;

  const [notesInput, setNotesInput] = useState(problem.notes || '');
  const [showHint, setShowHint] = useState(true);

  const handleSaveNotes = () => {
    updateProblemNotes(problem.id, notesInput);
  };

  const isTimerForThisProblem = activeTimerProblemId === problem.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="space-y-1 min-w-0 pr-4">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-xs font-bold text-brand-400">
                Day {problem.day} • LeetCode #{problem.leetcodeNumber || '—'}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                problem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-rose-500/20 text-rose-400'
              }`}>
                {problem.difficulty}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/20 text-purple-300">
                {problem.pattern}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-800 text-slate-300">
                {problem.topic}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight mt-1">
              {problem.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleProblemFavorite(problem.id)}
              className={`p-2 rounded-xl border transition-colors ${
                problem.favorite
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
              title="Toggle Favorite"
            >
              <Star className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="text-xs text-slate-400 font-medium">Companies:</span>
            {problem.companyTags.map((comp, idx) => (
              <span key={idx} className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/20">
                {comp}
              </span>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Status:</span>
              <select
                value={problem.status}
                onChange={(e) => updateProblemStatus(problem.id, e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="pending">Pending</option>
                <option value="started">Started</option>
                <option value="in_progress">In Progress</option>
                <option value="solved">Solved</option>
                <option value="need_revision">Need Revision</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                {isTimerForThisProblem ? formatTimeSpent(timerSeconds) : formatTimeSpent(problem.timeSpentSec || 0)}
              </span>

              {!isTimerForThisProblem ? (
                <button
                  onClick={() => startTimer(problem.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Timer</span>
                </button>
              ) : (
                <button
                  onClick={() => (isTimerRunning ? pauseTimer() : resumeTimer())}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                </button>
              )}
            </div>

            <button
              onClick={() => toggleProblemCompleted(problem.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                problem.completed
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{problem.completed ? 'Solved' : 'Mark as Solved'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-wide">Pattern Recognition Hint</span>
              </div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] text-amber-400 underline font-semibold"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>
            {showHint && (
              <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950/50 p-3 rounded-xl border border-amber-500/20">
                "{problem.recognitionHint}"
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold">Common Pitfalls</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {problem.commonMistakes?.map((m, i) => (
                  <li key={i}>{m}</li>
                )) || <li>Off-by-one index mistakes</li>}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2 text-purple-400">
                <Code2 className="w-4 h-4" />
                <span className="text-xs font-bold">Expected Complexity</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p><span className="text-slate-400">Time Complexity:</span> <code className="text-brand-300">{problem.timeComplexity || 'O(N)'}</code></p>
                <p><span className="text-slate-400">Space Complexity:</span> <code className="text-brand-300">{problem.spaceComplexity || 'O(1)'}</code></p>
              </div>
            </div>
          </div>

          {problem.revisionDates && problem.revisionDates.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold">Spaced Repetition Schedule</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Day 1', 'Day 7', 'Day 21'].map((label, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">{label}</span>
                    <span className="text-xs font-mono text-slate-200 block">{problem.revisionDates[idx] || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                Personal Markdown Notes & Code Snippets
              </label>
              <button
                onClick={handleSaveNotes}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Write your approach notes, key tricks, or code snippets here..."
              className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center space-x-2">
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md"
            >
              <span>Solve on LeetCode</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(problem.title + ' LeetCode DSA')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-semibold"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Watch Video Solution</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
