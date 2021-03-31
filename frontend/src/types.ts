export interface Folder {
  Questions: Question[];
  name: string;
  id?: number;
}

export interface Question {
  title: string;
  question: string;
  type: string;
  QuestionOptions: QuestionOption[];
  folderId: number | null;
  average?: number;
  total?: number;
  id?: number;
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

export interface ServerResponse {
  folders: Folder[];
  questions: Question[];
}
