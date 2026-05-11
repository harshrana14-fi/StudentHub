export interface LabRecord {
  aim: string;
  theory: string;
  algorithm: string[];
  code: string;
  output: string;
  graphRequired: boolean;
  graphType?: string;
  graphData?: {
    xAxis: string;
    yAxis: string;
    points: { x: number; y: number }[];
  };
  hasVisualOutput?: boolean;
  visualOutputDescription?: string;
  learningOutcomes: string[];
  vivaQuestions: { question: string; answer: string }[];
}

export interface GenerateRequest {
  experimentTitle: string;
  subject: string;
  includeTheory?: boolean;
  includeAlgorithm?: boolean;
}

export interface GenerateResponse {
  success: boolean;
  data?: LabRecord;
  error?: string;
}

export interface SubjectGrade {
  code: string;
  name: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

export interface SemesterResult {
  semester: number;
  subjects: SubjectGrade[];
  sgpa: number;
  totalCredits: number;
}

export interface CGPAResult {
  cgpa: number;
  semesters: SemesterResult[];
  totalCreditsEarned: number;
  totalCreditsAttempted: number;
}
