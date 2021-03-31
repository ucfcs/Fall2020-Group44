export interface QuestionType {
  id: number;
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
  id: number;
  questionId: number;
  text: string;
  isAnswer: boolean;
}

export interface Session {
  name: string;
  id: number;
  average: number;
  total: number;
  date: string;
  questions: QuestionType;
}

export interface StudentInfo {
  name: string;
  total: number;
  sessions: number[];
  questions: number[][];
}
