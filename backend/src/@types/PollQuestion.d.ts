type PollQuestionId = number;

interface PollQuestionAttributes {
	id: PollQuestionId;
	pollId: PollId;
	question: string;
	timeToAnswer: string;
}

interface PollQuestionCreationAttributes {
	pollId: PollId;
	question: string;
	timeToAnswer: string;
}
