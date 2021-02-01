export interface Session {
	name: string;
	average: number;
	total: number;
	date: string;
}

export interface StudentInfo {
	name: string;
	total: number;
	sessions: number[];
}

export interface QuestionInfo {
	text: string;
	answers: string[];
}
