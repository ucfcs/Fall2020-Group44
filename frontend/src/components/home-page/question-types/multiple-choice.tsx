import React, { useState, useEffect } from "react";
import './multiple-choice.scss'

type Props = {
	answers: string[];
}

type AnswerChoiceProps = {
	answer: string;
	letter: string;
}

const AnswerChoice = ({answer, letter}: AnswerChoiceProps) => {
	return (
		<div className="answer-choice">
			<div className="letter">
				<p>{letter}</p>
			</div>
			<div className="answer-text">
				<span>{answer}</span>
			</div>
		</div>
	);
}

const MultipleChoice = ({answers}: Props) => {
	return (
		<div className="multiple-choice">
			{answers.map((answer, index) => 
				<AnswerChoice
					key={index}
					answer={answer}
					letter={String.fromCharCode(65+index)}
				/>
			)}
		</div>
	);
}

export default MultipleChoice
