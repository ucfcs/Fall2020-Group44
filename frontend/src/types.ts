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
  responseCount?: number;
  isClosed?: boolean;
  progress?: number;
}

// this is poorly named, but it is done to match the backend
// a QuestionOption is an answer. isAnswer determines if the answer is
// correct.
export interface QuestionOption {
  id?: number;
  questionId?: number;
  text: string;
  isAnswer: boolean;
  responseCount?: number;
}

export interface BasicSessionInfo {
  id: number;
  name: string;
}

export interface Session extends BasicSessionInfo {
  average: number;
  total: number;
  date: string;
  questions: Question;
}

export interface QuestionInfo {
  text: string;
  answers: string[];
  correctIndex: number;
}

export interface FolderAndQuestionResponse {
  folders: Folder[];
  questions: Question[];
}

export interface CourseGradesResponse {
  students: StudentInfo[];
  sessions: BasicSessionInfo[];
}

export interface StudentInfo {
  name: string;
  canvasId: number;
  SessionGrades: SessionGrade[];
}

export interface SessionGrade {
  id: number;
  points: number;
  maxPoints: number;
}
