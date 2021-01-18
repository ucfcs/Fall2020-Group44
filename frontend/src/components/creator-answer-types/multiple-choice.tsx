import React, { useState, useEffect } from "react";
import './multiple-choice.scss'

const MIN_QUESTIONS = 2

type Props = {
	answers: string[];
}

type SingleAnswerChoiceProps = {
	answer: string;
	letter: string;
}

const AnswerChoice = ({answer, letter}: SingleAnswerChoiceProps) => {
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

	const onAddAnswer = () => {
		setAnswerChoices(oldAnswerChoices => [...oldAnswerChoices, ""])
	}

	return (
		 <div className="answer-choices">
			 <span className="answer-choice-header">Answers:</span>
				{answerChoices.map((answer, index) => 
						<AnswerChoice
							key={index}
							answer={answer}
							letter={String.fromCharCode(65+index)}
						/>
				)}
				<div className="add-answer">
					<button 
						className="add-answer-button"
						onClick={onAddAnswer}
					>
						<span className="add-answer-icon">&#8853;</span>
						<span>Add Answer Choice</span>
					</button>
				</div>
		 </div>
		 
	);
}

export default MultipleChoice