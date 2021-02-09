type PollOptionId = number;

interface PollOptionAttributes {
	id: PollOptionId;
	pollId: PollId;
	text: string;
	isAnswer: boolean;
}

interface PollOptionCreationAttributes {
	pollId: PollId;
	text: string;
	isAnswer: boolean;
}
