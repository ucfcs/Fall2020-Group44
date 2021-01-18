import React, { useState, useEffect } from "react";
import './question-preview.scss'
import MultipleChoice from "../question-types/multiple-choice";

type Props = {
	title: string;
	answers: string[];
}

const QuestionPreview = ({title, answers}: Props) => {
	return (
		<div className="question-preview">
			<span className="question-title">{title}?</span>
			<div className="response-buttons">
				<button className="show-correct-response">
					Show Correct Response <span>&#10003;</span>
				</button>
				<button className="see-responses">
					See Responses
				</button>
			</div>
			<div className="answer-choice-wrapper">
				<MultipleChoice	
					answers={answers}
				/>
			</div>
			<div className="option-buttons">
				<button className="present-button">&#9658; Present</button>
				<button className="edit-button">Edit</button>
				<button className="delete-button">Delete</button>
			</div>
		</div>
	);
}

export default QuestionPreview