import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './question-preview.scss';
import { store } from '../../store';
import MultipleChoice from './question-types/multiple-choice';

const QuestionPreview = () => {
	const global = useContext(store) as any;
	const dispatch = global.dispatch;
	const state = global.state;

	const toggleShowResponse = () => {
		dispatch({ type: 'toggle-show-preview-response' });
	};

	const toggleShowCorrectResponse = () => {
		dispatch({ type: 'toggle-show-correct-preview-response' });
	};

	const toggleEditQuestion = () => {
		dispatch({ type: 'toggle-edit-preview-question' });
	};

	const editQuestion = (event: any) => {
		const newQuestions = state.questions.slice();
		newQuestions[state.preview[0]].questions[state.preview[1]].title =
			event.target.value;

		dispatch({ type: 'edit-preview-question', payload: newQuestions });
	};

	const deleteQuestion = () => {
		const newQuestions = state.questions.slice();
		newQuestions[state.preview[0]].questions.splice(state.preview[1], 1);
		if (newQuestions[state.preview[0]].questions.length < 1) {
			newQuestions.splice(state.preview[0], 1);
		}

		dispatch({ type: 'delete-preview-question', payload: newQuestions });
	};

	const previewQuestion =
		state.questions[state.preview[0]] &&
		state.questions[state.preview[0]].questions[state.preview[1]];

	return previewQuestion ? (
		<div className='question-preview'>
			{state.isEditingQuestion ? (
				<input
					type='text'
					className='question-title'
					onChange={editQuestion}
					value={previewQuestion.title}
				/>
			) : (
				<span className='question-title'>{previewQuestion.title}?</span>
			)}
			<div className='response-buttons'>
				<button
					className='show-correct-response'
					onClick={toggleShowCorrectResponse}
				>
					Show Correct Response <span>&#10003;</span>
				</button>
				<button className='see-responses' onClick={toggleShowResponse}>
					See Responses
				</button>
			</div>
			<div className='answer-choice-wrapper'>
				<MultipleChoice
					answers={previewQuestion.choices}
					correct={previewQuestion.correct}
					responses={['20%', '30%', '50%']}
				/>
			</div>
			<div className='option-buttons'>
				<button className='present-button'>
					<Link to='/poll/present'>&#9658; Present</Link>
				</button>
				<button className='edit-button' onClick={toggleEditQuestion}>
					{state.isEditingQuestion ? 'Done' : 'Edit'}
				</button>
				<button className='delete-button' onClick={deleteQuestion}>
					Delete
				</button>
			</div>
		</div>
	) : (
		<div></div>
	);
};

export default QuestionPreview;
