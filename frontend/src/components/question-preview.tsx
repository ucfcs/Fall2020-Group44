import React, { useState, useEffect } from "react";
import './question-preview.scss'
import MultipleChoice from "./question-types/multiple-choice";

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
					Show Correct Response
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
		</div>
	);
}

export default QuestionPreview