interface Question {
  title: string[];
  average: number[];
  total: number[];
}

export interface Session {
  name: string;
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
}
