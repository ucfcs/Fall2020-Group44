export interface Question {
  title: string;
  question: string;
  type: string;
  questionOptions: QuestionOption[];
  folderId: number | null;
  average?: number;
  total?: number;
}

// this is poorly named, but it is done to match the backend
// a QuestionOption is an answer. isAnswer determines if the answer is
// correct.
export interface QuestionOption {
  text: string;
  isAnswer: boolean;
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
