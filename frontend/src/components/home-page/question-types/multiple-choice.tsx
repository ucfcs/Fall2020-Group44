import React, { useState, useEffect } from "react";
import './multiple-choice.scss'

type Props = {
	answers: string[];
	correct: number;
	responses: string[];
}

type AnswerChoiceProps = {
	answer: string;
	letter: string;
	correct: boolean;
	response: string;
}

const AnswerChoice = ({answer, letter, correct, response}: AnswerChoiceProps) => {
	return (
		<div className={`answer-choice ${correct ? 'correct' : ''}`}>
			<div className="letter">
				<p>{letter}</p>
			</div>
			<div className="answer-text">
				<span>{answer}</span>
			</div>
			<div className="responses">{response}</div>
		</div>
	);
}

const MultipleChoice = ({answers, correct, responses}: Props) => {
	return (
		<div className="multiple-choice">
			{answers.map((answer, index) =>
				<AnswerChoice
					key={index}
					answer={answer}
					correct={correct === index}
					response={responses[index]}
					letter={String.fromCharCode(65+index)}
				/>
			)}
		</div>
	);
}

export default MultipleChoice
