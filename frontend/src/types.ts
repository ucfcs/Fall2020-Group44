export interface Question {
  title: string;
  question: string;
  type: string;
  choices: string[];
  correct: number;
  folderId: number | null;
  average?: number;
  total?: number;
}

export interface Session {
  name: string;
  id: number;
  average: number;
  total: number;
  date: string;
  questions: Question;
}

export interface StudentInfo {
  name: string;
  total: number;
  sessions: number[];
  questions: number[][];
}

export interface QuestionInfo {
  text: string;
  answers: string[];
  correctIndex: number;
}
