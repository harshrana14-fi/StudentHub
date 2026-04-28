'use client';

import { useState, useRef } from 'react';
import InputForm from '@/components/InputForm';
import LabRecordPreview from '@/components/LabRecordPreview';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import InstructionsModal from '@/components/InstructionsModal';
import { LabRecord } from '@/types';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import { FlaskConical, ArrowLeft, HelpCircle } from 'lucide-react';

export default function LandingPage() {
  const [labRecord, setLabRecord] = useState<LabRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [experimentTitle, setExperimentTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleGenerate = async (title: string, subj: string) => {
    setIsLoading(true);
    setError(null);
    setExperimentTitle(title);
    setSubject(subj);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experimentTitle: title,
          subject: subj,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate lab record');
      }

      setLabRecord(result.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!labRecord || !experimentTitle) return;

    try {
      let graphImageBuffer: ArrayBuffer | null = null;
      let visualOutputImageBuffer: ArrayBuffer | null = null;

      // Capture graph as image if it exists
      if (labRecord.graphRequired) {
        const graphElement = document.getElementById('graph-capture-container');
        if (graphElement) {
          const canvas = await html2canvas(graphElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
          });
          
          // Convert canvas to blob then to array buffer
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), 'image/png')
          );
          graphImageBuffer = await blob.arrayBuffer();
        }
      }

      // Capture visual output as image if it exists
      if (labRecord.hasVisualOutput) {
        const visualElement = document.getElementById('visual-output-capture-container');
        if (visualElement) {
          const canvas = await html2canvas(visualElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
          });
          
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), 'image/png')
          );
          visualOutputImageBuffer = await blob.arrayBuffer();
        }
      }

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          labRecord,
          experimentTitle,
          graphImageBuffer: graphImageBuffer ? Array.from(new Uint8Array(graphImageBuffer)) : null,
          visualOutputImageBuffer: visualOutputImageBuffer ? Array.from(new Uint8Array(visualOutputImageBuffer)) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${experimentTitle
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()}-lab-record.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to download document');
      }
    }
  };

  const handleRegenerate = () => {
    if (experimentTitle && subject) {
      handleGenerate(experimentTitle, subject);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4">
      {/* Back to Home Link */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-700 mb-3 flex items-center justify-center gap-3">
            <FlaskConical className="w-10 h-10" /> Auto Lab Record Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate complete lab records for your experiments using AI
          </p>
          <button
            onClick={() => setShowInstructions(true)}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-amber-300 text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <HelpCircle className="w-5 h-5" /> How to Use - Instructions
          </button>
        </div>

        {/* Input Form */}
        <div className="mb-8">
          <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && (
          <div className="mb-8">
            <ErrorMessage
              message={error}
              onRetry={isLoading ? undefined : handleRegenerate}
            />
          </div>
        )}

        {/* Lab Record Preview */}
        {labRecord && !isLoading && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button onClick={handleDownload} className="btn-primary">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download DOCX
                </span>
              </button>
              <button onClick={handleRegenerate} className="btn-secondary">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Regenerate
                </span>
              </button>
            </div>

            {/* Preview */}
            <LabRecordPreview
              labRecord={labRecord}
              onChange={setLabRecord}
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            Built with Next.js, Tailwind CSS, and Groq AI
          </p>
        </div>
      </div>

      {/* Instructions Modal */}
      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
    </main>
  );
}
