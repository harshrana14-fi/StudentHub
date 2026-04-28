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
}

export interface GenerateResponse {
  success: boolean;
  data?: LabRecord;
  error?: string;
}
