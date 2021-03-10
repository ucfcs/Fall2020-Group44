type QuestionId = number;

interface QuestionAttributes {
	id: QuestionId;
	collectionId: CollectionId;
	question: string;
	timeToAnswer: string;
}

interface QuestionCreationAttributes {
	collectionId: CollectionId;
	question: string;
	timeToAnswer: string | null;
}
