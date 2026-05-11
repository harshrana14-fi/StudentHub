'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Upload, Trash2 } from 'lucide-react';
import { recognize } from 'tesseract.js';
import { SUBJECTS } from '@/data/subjects';
import { SubjectGrade, SemesterResult, CGPAResult } from '@/types';

export default function CGPACalculatorPage() {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState<SubjectGrade[]>([]);
  const [semesters, setSemesters] = useState<SemesterResult[]>([]);
  const [cgpaResult, setCgpaResult] = useState<CGPAResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMode, setInputMode] = useState<'manual' | 'upload'>('manual');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<SubjectGrade[] | null>(null);

  // Convert marks to grade points (GGSIPU Official Scale)
  const marksToGradePoint = (marks: number): number => {
    if (marks >= 90) return 10;  // O - Outstanding
    if (marks >= 75) return 9;   // A+ - Excellent
    if (marks >= 65) return 8;   // A - Very Good
    if (marks >= 55) return 7;   // B+ - Good
    if (marks >= 50) return 6;   // B - Above Average
    if (marks >= 45) return 5;   // C - Average
    if (marks >= 40) return 4;   // P - Pass
    return 0;                     // F - Fail
  };

  const marksToGrade = (marks: number): string => {
    if (marks >= 90) return 'O';
    if (marks >= 75) return 'A+';
    if (marks >= 65) return 'A';
    if (marks >= 55) return 'B+';
    if (marks >= 50) return 'B';
    if (marks >= 45) return 'C';
    if (marks >= 40) return 'P';
    return 'F';
  };

  const handleBranchChange = (selectedBranch: string) => {
    setBranch(selectedBranch);
    setSemester(1);
    setSubjects([]);
    setSemesters([]);
    setCgpaResult(null);
  };

  const handleSemesterChange = (selectedSemester: number) => {
    setSemester(selectedSemester);
    const branchSubjects = SUBJECTS[branch]?.[selectedSemester] || [];
    const newSubjects: SubjectGrade[] = branchSubjects.map((subj) => ({
      ...subj,
      grade: '',
      gradePoint: 0,
    }));
    setSubjects(newSubjects);
  };

  const calculateSGPA = useCallback((): number => {
    if (subjects.length === 0) return 0;

    let totalCredits = 0;
    let totalPoints = 0;

    // GGSIPU Formula: SGPA = Σ(Credits × Grade Points) / Σ Credits
    subjects.forEach((subject) => {
      if (subject.gradePoint > 0) {
        totalCredits += subject.credits;
        totalPoints += subject.credits * subject.gradePoint;
        console.log(`${subject.name}: ${subject.credits} credits × ${subject.gradePoint} points = ${subject.credits * subject.gradePoint}`);
      }
    });

    console.log(`Total Credits: ${totalCredits}, Total Points: ${totalPoints}`);
    const sgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    console.log(`SGPA: ${sgpa} (rounded: ${Math.round(sgpa * 100) / 100})`);
    
    return sgpa;
  }, [subjects]);

  const saveSemester = () => {
    // Check if all subjects have been processed (have a grade assigned)
    const unprocessedSubjects = subjects.filter((s) => !s.grade);
    if (unprocessedSubjects.length > 0) {
      alert('Please upload your result card first or ensure all subjects have marks');
      return;
    }

    const sgpa = calculateSGPA();
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

    const semesterResult: SemesterResult = {
      semester,
      subjects,
      sgpa: Math.round(sgpa * 100) / 100,
      totalCredits,
    };

    console.log('Saving semester:', semesterResult);

    const existingIndex = semesters.findIndex((s) => s.semester === semester);
    let updatedSemesters;
    if (existingIndex >= 0) {
      updatedSemesters = [...semesters];
      updatedSemesters[existingIndex] = semesterResult;
    } else {
      updatedSemesters = [...semesters, semesterResult];
    }

    setSemesters(updatedSemesters);
    calculateCGPA(updatedSemesters);
    setSubjects([]);
  };

  const calculateCGPA = (semList: SemesterResult[]) => {
    let totalCredits = 0;
    let totalPoints = 0;

    // GGSIPU Formula: CGPA = Σ(Cni × Gni) / Σ Cni
    semList.forEach((sem) => {
      sem.subjects.forEach((subject) => {
        if (subject.gradePoint > 0) {
          totalCredits += subject.credits;
          totalPoints += subject.credits * subject.gradePoint;
          console.log(`${subject.name}: ${subject.credits} credits × ${subject.gradePoint} points = ${subject.credits * subject.gradePoint}`);
        }
      });
    });

    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    console.log(`CGPA Calculation - Total Credits: ${totalCredits}, Total Points: ${totalPoints}, CGPA: ${cgpa}`);
    
    const totalCreditsAttempted = semList.reduce(
      (sum, sem) => sum + sem.subjects.reduce((s, sub) => s + sub.credits, 0),
      0
    );
    const totalCreditsEarned = semList.reduce(
      (sum, sem) =>
        sum +
        sem.subjects.reduce(
          (s, sub) => s + (sub.gradePoint > 0 ? sub.credits : 0),
          0
        ),
      0
    );

    setCgpaResult({
      cgpa: Math.round(cgpa * 100) / 100,
      semesters: semList,
      totalCreditsEarned,
      totalCreditsAttempted,
    });
  };

  const removeSemester = (semNumber: number) => {
    const updatedSemesters = semesters.filter((s) => s.semester !== semNumber);
    setSemesters(updatedSemesters);
    if (updatedSemesters.length > 0) {
      calculateCGPA(updatedSemesters);
    } else {
      setCgpaResult(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setOcrProgress(0);
    setUploadedImage(null);
    setExtractedData(null);

    try {
      let imageData: string = '';

      if (file.type === 'application/pdf') {
        // Handle PDF
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1); // Process the first page
        
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          imageData = canvas.toDataURL('image/png');
        } else {
          throw new Error('Could not create canvas context');
        }
      } else {
        // Handle Image
        imageData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      setUploadedImage(imageData);

      // Perform OCR using Tesseract.js
      const result = await recognize(imageData, 'eng', {
        logger: (m: { progress?: number; status?: string }) => {
          if (m.progress) {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });

      const extractedText = result.data.text;
      console.log('Extracted text:', extractedText);

      // Parse the extracted text to find subjects and grades
      const parsedSubjects = parseResultText(extractedText);
      
      if (parsedSubjects.length > 0) {
        setExtractedData(parsedSubjects);
        setSubjects(parsedSubjects);
        alert(`Successfully extracted ${parsedSubjects.length} subjects! Please verify and edit if needed.`);
      } else {
        console.log('Full extracted text for debugging:', extractedText);
        alert(`Could not automatically extract subjects.\n\nExtracted text (first 200 chars):\n${extractedText.substring(0, 200)}...\n\nPlease enter them manually or try a clearer image.`);
      }
    } catch (error) {
      console.error('File Processing Error:', error);
      alert('Processing failed. Please try again or enter grades manually.');
    } finally {
      setIsProcessing(false);
      setOcrProgress(0);
    }
  };

  // Function to parse result card text and extract subjects/marks
  const parseResultText = (text: string): SubjectGrade[] => {
    const subjects: SubjectGrade[] = [];
    const lines = text.split('\n').filter(line => line.trim());

    console.log('Parsing text, total lines:', lines.length);
    console.log('Full text:', text);

    // Pattern for: SUBJECT NAME (credits) int | ext total (grade)
    // ONLY use specific patterns to avoid wrong number extraction
    const patterns = [
      // Pattern 1: SUBJECT (credits) int | ext total (grade) - EXACT FORMAT
      /([A-Z\s&(),.-]+?)\s*\((\d+)\)\s+(\d+)\s*\|\s*(\d+)\s+(\d+)\s*\([OABCP][+]?\)/i,
    ];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip header/footer lines
      if (trimmedLine.match(/^(semester|result|grade|cgpa|sgpa|university|college|institute|subject|int|ext|marks)/i)) {
        continue;
      }

      // Skip if line is too short
      if (trimmedLine.length < 10) {
        continue;
      }

      // Try each pattern
      for (const pattern of patterns) {
        const match = trimmedLine.match(pattern);
        
        if (match) {
          const [, name, credits, intMarks, extMarks, totalMarks] = match;
          
          // Clean up subject name
          let cleanName = name.trim().replace(/\s+/g, ' ');
          const creditsNum = parseInt(credits);
          const marks = parseInt(totalMarks);
          
          console.log(`Matched: "${cleanName}" | Credits: ${creditsNum} | Int: ${intMarks} | Ext: ${extMarks} | Total: ${marks}`);
          
          // Validate marks range
          if (marks < 0 || marks > 100) {
            console.log(`  ❌ Invalid marks: ${marks}, skipping`);
            continue;
          }
          
          // Convert marks to grade and grade point
          const grade = marksToGrade(marks);
          const gradePoint = marksToGradePoint(marks);
          
          console.log(`  ✓ Marks: ${marks} -> Grade: ${grade} -> Points: ${gradePoint}`);
          
          // Find matching subject code from predefined subjects
          const branchSubjects = SUBJECTS[branch]?.[semester] || [];
          const matchedSubject = branchSubjects.find(s => 
            s.name.toLowerCase() === cleanName.toLowerCase() ||
            s.name.toLowerCase().includes(cleanName.toLowerCase()) ||
            cleanName.toLowerCase().includes(s.name.toLowerCase())
          );
          
          const code = matchedSubject?.code || `${cleanName.split(' ').slice(0, 2).map(w => w[0]).join('')}${creditsNum}`;
          
          // Check if we already have this subject
          const exists = subjects.find(s => s.code === code || s.name.toLowerCase() === cleanName.toLowerCase());
          if (!exists) {
            subjects.push({
              code,
              name: cleanName,
              credits: creditsNum || 3,
              grade,
              gradePoint,
            });
            
            console.log(`  ✓✓ Added: ${code} - ${cleanName}`);
          }
          
          break; // Move to next line
        }
      }
    }

    console.log('\n========== EXTRACTION SUMMARY ==========');
    console.log(`Total subjects extracted: ${subjects.length}`);
    console.log(`Expected: ${SUBJECTS[branch]?.[semester]?.length || 0}\n`);
    
    let totalCredits = 0;
    let totalPoints = 0;
    
    subjects.forEach((s, i) => {
      const points = s.credits * s.gradePoint;
      totalCredits += s.credits;
      totalPoints += points;
      console.log(`${i+1}. ${s.name.padEnd(30)} | ${s.credits}cr × ${s.gradePoint}pt = ${points}`);
    });
    
    console.log('\n----------------------------------------');
    console.log(`TOTAL: ${totalCredits} credits, ${totalPoints} points`);
    console.log(`SGPA = ${totalPoints} ÷ ${totalCredits} = ${totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0}`);
    console.log('========================================\n');
    
    return subjects;
  };

  const resetAll = () => {
    setBranch('');
    setSemester(1);
    setSubjects([]);
    setSemesters([]);
    setCgpaResult(null);
    setUploadedImage(null);
  };

  const getCGPAClass = (cgpa: number): string => {
    if (cgpa >= 9) return 'text-green-600';
    if (cgpa >= 8) return 'text-blue-600';
    if (cgpa >= 7) return 'text-yellow-600';
    if (cgpa >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCGPAGrade = (cgpa: number): string => {
    if (cgpa >= 9) return 'Outstanding';
    if (cgpa >= 7.5) return 'Excellent';
    if (cgpa >= 6.5) return 'Very Good';
    if (cgpa >= 5.5) return 'Good';
    if (cgpa >= 5) return 'Above Average';
    if (cgpa >= 4.5) return 'Average';
    if (cgpa >= 4) return 'Pass';
    return 'Fail';
  };

  const getDivision = (cgpa: number): string => {
    if (cgpa === 10) return '🌟 Exemplary Performance';
    if (cgpa >= 6.5) return '🥇 First Division';
    if (cgpa >= 5) return '🥈 Second Division';
    if (cgpa >= 4) return '🥉 Third Division';
    return '❌ Fail';
  };

  return (
    <main className="min-h-screen py-12 px-4">
      {/* Back to Home Link */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-700 mb-3 flex items-center justify-center gap-3">
            <Calculator className="w-10 h-10" /> CGPA Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate your Cumulative Grade Point Average easily
          </p>
        </div>

        {/* Branch and Semester Selection */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Branch
              </label>
              <select
                value={branch}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="select-field"
              >
                <option value="">Select Branch</option>
                {Object.keys(SUBJECTS).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => handleSemesterChange(parseInt(e.target.value))}
                className="select-field"
                disabled={!branch}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* OCR Upload Section */}
        {branch && (
          <div className="card mb-8">
            <div className="text-center py-8">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Upload Your Result Card
              </h3>
              <p className="text-gray-600 mb-6">
                Upload a screenshot or PDF of your semester result to automatically extract marks
              </p>
              <label className="inline-block px-6 py-3 bg-primary-600 text-white font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer">
                <Upload className="w-5 h-5 inline mr-2" />
                Upload Image or PDF
                <input
                   type="file"
                   accept="image/*,application/pdf"
                   onChange={handleFileUpload}
                   className="hidden"
                   disabled={isProcessing}
                />
              </label>
                
                {/* Processing Progress */}
                {isProcessing && (
                  <div className="mt-6 max-w-md mx-auto">
                    <div className="bg-white border-4 border-black p-6 rounded-lg">
                      <p className="text-lg font-bold mb-3">Processing with OCR...</p>
                      <div className="w-full bg-gray-200 rounded-full h-4 border-2 border-black">
                        <div
                          className="bg-primary-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${ocrProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm mt-2 font-bold">{ocrProgress}%</p>
                    </div>
                  </div>
                )}

                {/* Uploaded Image Preview */}
                {uploadedImage && !isProcessing && (
                  <div className="mt-6">
                    <p className="text-green-600 font-bold mb-2">✓ File uploaded successfully</p>
                    {uploadedImage.startsWith('data:image') && (
                      <img src={uploadedImage} alt="Uploaded result" className="max-w-md mx-auto rounded-lg border-2 border-gray-300" />
                    )}
                  </div>
                )}

                {/* Extracted Data Preview */}
                {extractedData && extractedData.length > 0 && !isProcessing && (
                  <div className="mt-6 max-w-5xl mx-auto">
                    <div className="bg-yellow-50 border-4 border-yellow-400 p-6 rounded-lg">
                      <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className="text-2xl">✓</span>
                        Extracted {extractedData.length} of {SUBJECTS[branch]?.[semester]?.length || 0} Subjects
                      </h4>
                      
                      {/* Warning if subjects missing */}
                      {extractedData.length < (SUBJECTS[branch]?.[semester]?.length || 0) && (
                        <div className="bg-red-50 border-2 border-red-400 p-3 rounded mb-4">
                          <p className="text-red-700 font-bold">
                            ⚠️ Warning: {(SUBJECTS[branch]?.[semester]?.length || 0) - extractedData.length} subject(s) missing!
                          </p>
                          <p className="text-sm text-red-600 mt-1">
                            OCR may have missed some subjects. Please re-upload a clearer screenshot.
                          </p>
                        </div>
                      )}

                      <p className="text-sm text-gray-700 mb-4">
                        Verify all marks are correct before saving. Click on any subject to see details.
                      </p>
                      
                      {/* Subject List with Marks - Detailed */}
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 max-h-96 overflow-y-auto">
                        <div className="space-y-2">
                          {subjects.map((subject, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border hover:bg-blue-50 transition">
                              <div className="flex-1">
                                <p className="font-bold text-sm">{subject.name}</p>
                                <p className="text-xs text-gray-600">Code: {subject.code} | {subject.credits} Credits</p>
                              </div>
                              <div className="text-right flex items-center gap-4">
                                <div>
                                  <p className="text-xs text-gray-600">Marks</p>
                                  <p className="text-lg font-bold text-gray-800">
                                    {subject.grade === 'O' ? '90-100' : 
                                     subject.grade === 'A+' ? '75-89' : 
                                     subject.grade === 'A' ? '65-74' : 
                                     subject.grade === 'B+' ? '55-64' : 
                                     subject.grade === 'B' ? '50-54' : 
                                     subject.grade === 'C' ? '45-49' : 
                                     subject.grade === 'P' ? '40-44' : '<40'}
                                  </p>
                                </div>
                                <div className="w-px h-10 bg-gray-300"></div>
                                <div>
                                  <p className="text-xs text-gray-600">Grade</p>
                                  <p className="text-lg font-bold text-primary-600">{subject.grade}</p>
                                </div>
                                <div className="w-px h-10 bg-gray-300"></div>
                                <div>
                                  <p className="text-xs text-gray-600">Points</p>
                                  <p className="text-lg font-bold text-green-600">{subject.gradePoint}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            alert(`Tip: For best OCR results:\n1. Use screenshots (not photos)\n2. Ensure high resolution\n3. Crop to show only marks table\n4. Make sure all text is clear and readable\n\nCurrent: ${subjects.length} subjects extracted\nExpected: ${SUBJECTS[branch]?.[semester]?.length || 0} subjects`);
                          }}
                          className="px-4 py-2 bg-gray-600 text-white font-bold border-2 border-black hover:bg-gray-700"
                        >
                          💡 OCR Tips
                        </button>
                        <button
                          onClick={saveSemester}
                          className="px-4 py-2 bg-primary-600 text-white font-bold border-2 border-black hover:bg-primary-700 flex-1"
                        >
                          ✓ All Correct - Save Semester
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          </div>
        )}

        {/* Saved Semesters */}
        {semesters.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Saved Semesters
            </h2>
            <div className="space-y-4">
              {semesters.map((sem) => (
                <div key={sem.semester} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      Semester {sem.semester}
                    </h3>
                    <button
                      onClick={() => removeSemester(sem.semester)}
                      className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">SGPA</p>
                      <p className="text-2xl font-bold text-primary-600">{sem.sgpa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Credits</p>
                      <p className="text-2xl font-bold text-gray-800">{sem.totalCredits}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CGPA Result */}
        {cgpaResult && (
          <div className="card bg-gradient-to-br from-primary-50 to-blue-50 border-4 border-primary-600">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Your CGPA Result (GGSIPU)
            </h2>
            
            {/* Main CGPA Display */}
            <div className="text-center mb-8">
              <div className={`text-6xl font-black mb-2 ${getCGPAClass(cgpaResult.cgpa)}`}>
                {cgpaResult.cgpa.toFixed(2)}
              </div>
              <p className="text-xl font-bold text-gray-700 mb-2">
                {getCGPAGrade(cgpaResult.cgpa)}
              </p>
              <div className="inline-block bg-white px-6 py-3 rounded-lg border-2 border-gray-300">
                <p className="text-2xl font-bold text-primary-600">
                  {getDivision(cgpaResult.cgpa)}
                </p>
              </div>
            </div>

            {/* Percentage Conversion */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Equivalent Percentage (CGPA × 10)</p>
              <p className="text-4xl font-black text-gray-800">
                {(cgpaResult.cgpa * 10).toFixed(2)}%
              </p>
            </div>

            {/* Credits Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Credits Earned</p>
                <p className="text-3xl font-bold text-gray-800">{cgpaResult.totalCreditsEarned}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Credits Attempted</p>
                <p className="text-3xl font-bold text-gray-800">{cgpaResult.totalCreditsAttempted}</p>
              </div>
            </div>

            {/* Detailed Calculation Breakdown */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
              <h3 className="font-bold text-gray-800 mb-3">📊 Detailed Calculation</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cgpaResult.semesters.map((sem) => (
                  <div key={sem.semester} className="border-b pb-2">
                    <p className="font-bold text-sm text-primary-600">Semester {sem.semester} (SGPA: {sem.sgpa})</p>
                    {sem.subjects.map((sub, idx) => (
                      <div key={idx} className="flex justify-between text-xs ml-4 py-1">
                        <span>{sub.name}</span>
                        <span className="font-mono">{sub.credits}cr × {sub.gradePoint}pt = {sub.credits * sub.gradePoint}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Formula Explanation */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <p className="text-sm font-bold text-gray-700 mb-2">GGSIPU Formula:</p>
              <p className="text-sm text-gray-600 font-mono">
                CGPA = Σ(Cni × Gni) / Σ Cni
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Where Cni = Credits of ith course, Gni = Grade points earned
              </p>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {(branch || semesters.length > 0) && (
          <div className="text-center mt-8">
            <button onClick={resetAll} className="btn-secondary">
              <Trash2 className="w-5 h-5 inline mr-2" />
              Reset All
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
