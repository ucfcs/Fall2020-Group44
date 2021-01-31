import React, { useState } from "react";
import { Link } from "react-router-dom";
import './question-preview.scss'
import MultipleChoice from "./question-types/multiple-choice";

type Props = {
	title: string;
	answers: string[];
	correct: number;
}

const QuestionPreview = ({title, answers, correct}: Props) => {
	const [showCorrectResponse, setShowCorrectResponse] = useState(false);
	const [showResponse, setShowResponse] = useState(false);


	return (
		<div className="question-preview">
			<span className="question-title">{title}?</span>
			<div className="response-buttons">
				<button className="show-correct-response" onClick={() => setShowCorrectResponse(!showCorrectResponse)}>
					Show Correct Response <span>&#10003;</span>
				</button>
				<button className="see-responses" onClick={() => setShowResponse(!showResponse)}>
					See Responses
				</button>
			</div>
			<div className="answer-choice-wrapper">
				<MultipleChoice
					answers={answers}
					correct={showCorrectResponse ? correct : -1}
					responses={showResponse ? ['20%','30%','50%'] : []}
				/>
			</div>
			<div className="option-buttons">
				<button className="present-button"><Link to="/poll/present">&#9658; Present</Link></button>
				<button className="edit-button">Edit</button>
				<button className="delete-button">Delete</button>
			</div>
		</div>
	);
}

export default QuestionPreview
