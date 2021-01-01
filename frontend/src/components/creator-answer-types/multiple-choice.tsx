import React, { useState, useEffect } from "react";
import './multiple-choice.scss'

const MIN_QUESTIONS = 2

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
				<input	
					type="text"
					placeholder="Response..."
				/>
			</div>
			<div className="correct-checkbox">
				<input	
					type="checkbox"
					id="correct-answer"
				/>
				<label>Correct Answer</label>
			</div>
			<div className="delete-answer">
				<button>X</button>
			</div>
		</div>
	);
}

const MultipleChoice = ({answers}: Props) => {
	const [answerChoices, setAnswerChoices] = useState(["",""])

	useEffect(
		() => {
			console.log(answerChoices)
		}
	)

	useEffect(
		() => {
			console.log(answers.length)
			if(answers.length > 0){
				setAnswerChoices(answers)
			}
		}, [answers]
	)

	return (
		 <div className="answer-choices">
			 <span>Answers:</span>
				{answerChoices.map((answer, index) => 
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