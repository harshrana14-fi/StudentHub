export interface Subject {
  code: string;
  name: string;
  credits: number;
}

export interface SemesterSubjects {
  [semester: number]: Subject[];
}

export interface BranchSubjects {
  [branch: string]: SemesterSubjects;
}

export const SUBJECTS: BranchSubjects = {
  'Computer Science Engineering (CSE)': {
    1: [
      { code: 'AP101', name: 'APPLIED CHEMISTRY', credits: 3 },
      { code: 'AP102', name: 'APPLIED PHYSICS - II', credits: 3 },
      { code: 'ES101', name: 'ELECTRICAL SCIENCE', credits: 3 },
      { code: 'AM101', name: 'APPLIED MATHEMATICS -II', credits: 4 },
      { code: 'EM101', name: 'ENGINEERING MECHANICS', credits: 3 },
      { code: 'IC101', name: 'INDIAN CONSTITUTION', credits: 2 },
      { code: 'HV101', name: 'HUMAN VALUES AND ETHICS', credits: 1 },
      { code: 'PL101', name: 'PHYSICS-II LAB', credits: 1 },
      { code: 'CH101', name: 'APPLIED CHEMISTRY LAB', credits: 1 },
      { code: 'EG101', name: 'ENGINEERING GRAPHICS - II', credits: 1 },
      { code: 'EL101', name: 'ELECTRICAL SCIENCE LAB', credits: 1 },
      { code: 'WP101', name: 'WORKSHOP PRACTICE', credits: 2 },
    ],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
  },
  'Information Technology (IT)': {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
  },
  'Electronics Engineering (ECE)': {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
  },
  'Mechanical Engineering (ME)': {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
  },
  'Civil Engineering (CE)': {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
  },
  'Electrical Engineering (EE)': {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
  },
};

export const GRADE_POINTS: { [grade: string]: number } = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0,
};

export const GRADES = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];
