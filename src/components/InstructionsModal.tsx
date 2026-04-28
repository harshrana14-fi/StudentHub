'use client';

import { useState } from 'react';
import { Lightbulb, X, FileText, Code, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-300 to-amber-400 border-b-4 border-black p-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8" />
            <h2 className="text-3xl font-black text-black">How to Use Lab Record Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Getting Started */}
          <div>
            <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" /> Getting Started
            </h3>
            <div className="bg-amber-50 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold text-lg">1.</span>
                  <span className="text-gray-800 font-medium">Enter your <strong>Experiment Title</strong> (e.g., "Develop an analog clock using applet")</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold text-lg">2.</span>
                  <span className="text-gray-800 font-medium">Select your <strong>Subject</strong> from the dropdown (e.g., Java Programming, Python, C++, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold text-lg">3.</span>
                  <span className="text-gray-800 font-medium">Click <strong>"Generate Lab Record"</strong> and wait for AI to create your complete lab record</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pro Tips */}
          <div>
            <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" /> Pro Tips for Better Results
            </h3>
            <div className="space-y-4">
              {/* Tip 1 */}
              <div className="bg-blue-50 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="text-lg font-black text-black mb-3">💻 Specify Programming Language</h4>
                <p className="text-gray-800 font-medium mb-2">
                  Include the programming language in your experiment title for accurate code generation:
                </p>
                <div className="bg-white border-2 border-black p-4 rounded">
                  <p className="text-sm font-mono text-gray-700">
                    ✅ "Implement stack operations using C++"<br/>
                    ✅ "Create a binary search tree in Python"<br/>
                    ✅ "Develop sorting algorithms in Java"<br/>
                    ✅ "Write a database program in SCILAB for matrix operations"
                  </p>
                </div>
              </div>

              {/* Tip 2 */}
              <div className="bg-green-50 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="text-lg font-black text-black mb-3">📝 Customize Content Requirements</h4>
                <p className="text-gray-800 font-medium mb-2">
                  Add specific instructions in the experiment title to customize your lab record:
                </p>
                <div className="bg-white border-2 border-black p-4 rounded space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Examples:</strong>
                  </p>
                  <p className="text-sm font-mono text-gray-700">
                    ✅ "Theory only - No algorithm needed"<br/>
                    ✅ "Generate AI code with detailed comments"<br/>
                    ✅ "Include learning outcomes and viva voce only"<br/>
                    ✅ "Full lab record with graph visualization"<br/>
                    ✅ "Code and output only, skip theory"
                  </p>
                </div>
              </div>

              {/* Tip 3 */}
              <div className="bg-purple-50 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="text-lg font-black text-black mb-3">🎯 Be Specific About Topics</h4>
                <p className="text-gray-800 font-medium mb-2">
                  More specific titles generate better results:
                </p>
                <div className="bg-white border-2 border-black p-4 rounded">
                  <p className="text-sm font-mono text-gray-700">
                    ❌ "Sorting program"<br/>
                    ✅ "Implement bubble sort and merge sort with time complexity analysis in C"<br/><br/>
                    ❌ "Database experiment"<br/>
                    ✅ "Create student database with CRUD operations using SQL in SCILAB"
                  </p>
                </div>
              </div>

              {/* Tip 4 */}
              <div className="bg-orange-50 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="text-lg font-black text-black mb-3">📊 Graph & Visual Output</h4>
                <p className="text-gray-800 font-medium">
                  The AI automatically detects if your experiment needs graphs or generates visual output (like GUI applications, applets, or graphics). For experiments like "analog clock using applet", it will mark it as having visual output.
                </p>
              </div>
            </div>
          </div>

          {/* What You Get */}
          <div>
            <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" /> What You'll Receive
            </h3>
            <div className="bg-emerald-50 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-black p-4">
                  <h4 className="font-bold text-black mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Content
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Aim of the experiment</li>
                    <li>• Detailed theory explanation</li>
                    <li>• Step-by-step algorithm</li>
                    <li>• Complete source code</li>
                    <li>• Expected output</li>
                  </ul>
                </div>
                <div className="bg-white border-2 border-black p-4">
                  <h4 className="font-bold text-black mb-2 flex items-center gap-2">
                    <Code className="w-5 h-5" /> Additional Features
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Graph visualization (if applicable)</li>
                    <li>• Visual output display (for GUI/Graphics)</li>
                    <li>• 5+ Learning outcomes</li>
                    <li>• 5+ Viva questions with answers</li>
                    <li>• Downloadable DOCX file</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div>
            <h3 className="text-2xl font-black text-black mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" /> Important Notes
            </h3>
            <div className="bg-red-50 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">⚠️</span>
                  <span className="text-gray-800 font-medium">Always review and verify the generated content before submitting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">⚠️</span>
                  <span className="text-gray-800 font-medium">You can edit any section by clicking the "Edit" button in the preview</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">⚠️</span>
                  <span className="text-gray-800 font-medium">Use "Regenerate" if you're not satisfied with the results</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">⚠️</span>
                  <span className="text-gray-800 font-medium">Run the code yourself to verify it works as expected</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black bg-gradient-to-r from-amber-200 to-amber-300 p-6 flex justify-end sticky bottom-0">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-black text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-lg"
          >
            GOT IT, LET'S START! →
          </button>
        </div>
      </div>
    </div>
  );
}
