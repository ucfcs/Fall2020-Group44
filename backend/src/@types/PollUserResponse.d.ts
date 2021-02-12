type PollUserResponseId = number;

interface PollUserResponseAttributes {
	id: PollUserResponseId;
	pollId: PollId;
	pollOptionId: PollOptionId;
}

interface PollUserResponseCreationAttributes {
	pollId: PollId;
	pollOptionId: PollOptionId;
}
