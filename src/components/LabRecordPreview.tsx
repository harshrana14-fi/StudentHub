'use client';

import { useState } from 'react';
import { LabRecord } from '@/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LabRecordPreviewProps {
  labRecord: LabRecord;
  onChange: (updatedRecord: LabRecord) => void;
}

export default function LabRecordPreview({
  labRecord,
  onChange,
}: LabRecordPreviewProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const updateField = (field: keyof LabRecord, value: any) => {
    onChange({ ...labRecord, [field]: value });
  };

  const updateArrayItem = (
    field: keyof LabRecord,
    index: number,
    value: string
  ) => {
    const newArray = [...(labRecord[field] as string[])];
    newArray[index] = value;
    onChange({ ...labRecord, [field]: newArray });
  };

  const updateVivaQuestion = (
    index: number,
    field: 'question' | 'answer',
    value: string
  ) => {
    const newQuestions = [...labRecord.vivaQuestions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    onChange({ ...labRecord, vivaQuestions: newQuestions });
  };

  const renderEditableText = (
    section: string,
    value: string,
    multiline = true
  ) => {
    const isEditing = editingSection === section;

    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() =>
              isEditing
                ? setEditingSection(null)
                : setEditingSection(section)
            }
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
        {isEditing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(e) => updateField(section as keyof LabRecord, e.target.value)}
              className="input-field min-h-[120px] font-mono text-sm"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => updateField(section as keyof LabRecord, e.target.value)}
              className="input-field"
              autoFocus
            />
          )
        ) : (
          <div className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-4 rounded-lg">
            {value}
          </div>
        )}
      </div>
    );
  };

  const renderEditableList = (
    section: string,
    items: string[],
    field: keyof LabRecord
  ) => {
    const isEditing = editingSection === section;

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() =>
              isEditing
                ? setEditingSection(null)
                : setEditingSection(section)
            }
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-primary-600 font-semibold mt-1">
                {index + 1}.
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    updateArrayItem(field, index, e.target.value)
                  }
                  className="input-field flex-1"
                />
              ) : (
                <div className="flex-1 bg-gray-50 p-3 rounded-lg text-gray-800">
                  {item}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGraph = () => {
    if (!labRecord.graphRequired || !labRecord.graphData) return null;

    const { graphType, graphData } = labRecord;
    const colors = ['#6b7280', '#92400e', '#78716c', '#854d0e', '#57534e', '#713f12'];

    const renderChart = () => {
      switch (graphType) {
        case 'line':
          return (
            <LineChart data={graphData.points}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" label={{ value: graphData.xAxis, position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: graphData.yAxis, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="#6b7280" strokeWidth={2} dot={{ fill: '#6b7280' }} />
            </LineChart>
          );
        case 'bar':
          return (
            <BarChart data={graphData.points}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" label={{ value: graphData.xAxis, position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: graphData.yAxis, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="y" fill="#6b7280" />
            </BarChart>
          );
        case 'scatter':
          return (
            <ScatterChart data={graphData.points}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" label={{ value: graphData.xAxis, position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="y" label={{ value: graphData.yAxis, angle: -90, position: 'insideLeft' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Data Points" data={graphData.points} fill="#6b7280" />
            </ScatterChart>
          );
        case 'pie':
          return (
            <PieChart>
              <Pie
                data={graphData.points}
                dataKey="y"
                nameKey="x"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {graphData.points.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          );
        default:
          return (
            <LineChart data={graphData.points}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" label={{ value: graphData.xAxis, position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: graphData.yAxis, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="#6b7280" strokeWidth={2} />
            </LineChart>
          );
      }
    };

    return (
      <div className="border-b-2 border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-gray-600 rounded"></span>
          Graph: {graphData.xAxis} vs {graphData.yAxis}
        </h2>
        <div className="ml-4 bg-white p-6 rounded-lg border-2 border-gray-200">
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-300">
      {/* Document Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Lab Record</h1>
        <p className="text-center text-gray-300 text-lg">Experiment Documentation</p>
      </div>

      {/* Document Content */}
      <div className="p-8 space-y-8">
        {/* Aim */}
        <div className="border-b-2 border-gray-200 pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-gray-600 rounded"></span>
            Aim
          </h2>
          <div className="ml-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{labRecord.aim}</p>
          </div>
        </div>

        {/* Theory */}
        <div className="border-b-2 border-gray-200 pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-gray-600 rounded"></span>
            Theory
          </h2>
          <div className="ml-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{labRecord.theory}</p>
          </div>
        </div>

        {/* Algorithm */}
        {labRecord.algorithm && labRecord.algorithm.length > 0 && (
          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-gray-600 rounded"></span>
              Algorithm
            </h2>
            <div className="ml-4 space-y-2">
              {labRecord.algorithm.map((step, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <p className="text-gray-800 flex-1 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code */}
        <div className="border-b-2 border-gray-200 pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-gray-600 rounded"></span>
            Code
          </h2>
          <div className="ml-4">
            <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto shadow-inner">
              <code className="text-sm font-mono whitespace-pre">{labRecord.code}</code>
            </pre>
          </div>
        </div>

        {/* Output */}
        <div className="border-b-2 border-gray-200 pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-gray-600 rounded"></span>
            Output
          </h2>
          <div className="ml-4">
            <pre className="bg-gray-100 border-2 border-gray-300 p-4 rounded-lg font-mono text-sm">
              <code className="text-gray-800 whitespace-pre-wrap">{labRecord.output}</code>
            </pre>
          </div>
        </div>

        {/* Graph */}
        {renderGraph()}

        {/* Visual Output (for GUI/Applet/Graphics experiments) */}
        {labRecord.hasVisualOutput && (
          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-gray-600 rounded"></span>
              Visual Output
            </h2>
            <div className="ml-4 bg-white p-6 rounded-lg border-2 border-gray-200">
              <div id="visual-output-container" className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {labRecord.visualOutputDescription || 'Visual Output'}
                </p>
                <p className="text-sm text-gray-600 text-center mb-4">
                  (Run the code to see the actual visual output)
                </p>
                <div className="bg-white border-2 border-gray-400 rounded-lg px-6 py-3 shadow-inner">
                  <p className="text-xs text-gray-500 font-mono">
                    Output: {labRecord.output.substring(0, 100)}{labRecord.output.length > 100 ? '...' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden graph container for capture */}
        {labRecord.graphRequired && (
          <div id="graph-capture-container" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <div style={{ width: '800px', padding: '20px', backgroundColor: 'white' }}>
              {renderGraph()}
            </div>
          </div>
        )}

        {/* Hidden visual output container for capture */}
        {labRecord.hasVisualOutput && (
          <div id="visual-output-capture-container" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <div style={{ width: '800px', padding: '20px', backgroundColor: 'white' }}>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {labRecord.visualOutputDescription || 'Visual Output'}
                </p>
                <p className="text-sm text-gray-600 text-center mb-4">
                  (Run the code to see the actual visual output)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Learning Outcomes */}
        <div className="border-b-2 border-gray-200 pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-gray-600 rounded"></span>
            Learning Outcomes
          </h2>
          <div className="ml-4 space-y-3">
            {labRecord.learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex gap-3 items-start">
                <span className="flex-shrink-0 text-gray-600 text-xl mt-0.5">✓</span>
                <p className="text-gray-800 flex-1 leading-relaxed">{outcome}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Viva Questions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-gray-600 rounded"></span>
            Viva Questions
          </h2>
          <div className="ml-4 space-y-4">
            {labRecord.vivaQuestions.map((qa, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-lg border-l-4 border-gray-500 shadow-sm">
                <p className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="text-gray-600 flex-shrink-0">Q{index + 1}:</span>
                  <span>{qa.question}</span>
                </p>
                <p className="text-gray-700 ml-6 flex items-start gap-2">
                  <span className="text-emerald-600 font-semibold flex-shrink-0">A:</span>
                  <span>{qa.answer}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
