import React, { useState, useEffect, useContext } from 'react';
import { store } from '../../../store';
import './multiple-choice.scss';

type Props = {
	answers: string[];
	correct: number;
	responses: string[];
};

type AnswerChoiceProps = {
	answer: string;
	letter: string;
	correct: boolean;
	response: string;
	index: number;
};

const AnswerChoice = ({
	answer,
	letter,
	correct,
	response,
	index,
}: AnswerChoiceProps) => {
	const global = useContext(store) as any;
	const dispatch = global.dispatch;
	const state = global.state;

	const editQuestion = (event: any, index: number) => {
		const newQuestions = state.questions.slice();
		newQuestions[state.preview[0]].questions[state.preview[1]].choices[index] =
			event.target.value;

		dispatch({ type: 'edit-preview-question', payload: newQuestions });
	};

	return (
		<div
			className={`answer-choice ${
				state.showCorrectPreviewResponse
					? correct
						? 'correct'
						: 'incorrect'
					: ''
			}`}
		>
			<div
				className='response-bar'
				style={{
					width: state.showPreviewResponse
						? response
						: state.showCorrectPreviewResponse
						? '100%'
						: '',
				}}
			></div>
			<div className='answer-info'>
				<div className='letter'>
					<p>{letter}</p>
				</div>
				{state.isEditingQuestion ? (
					<input
						type='text'
						className='answer-text-input'
						onChange={(e) => editQuestion(e, index)}
						value={answer}
					/>
				) : (
					<div className='answer-text'>
						<span>{answer}</span>
					</div>
				)}
				<div className='responses'>
					{state.showPreviewResponse ? response : ''}
				</div>
			</div>
		</div>
	);
};

const MultipleChoice = ({ answers, correct, responses }: Props) => {
	return (
		<div className='multiple-choice'>
			{answers.map((answer, index) => (
				<AnswerChoice
					key={index}
					index={index}
					answer={answer}
					correct={correct === index}
					response={responses[index]}
					letter={String.fromCharCode(65 + index)}
				/>
			))}
		</div>
	);
};

export default MultipleChoice;
