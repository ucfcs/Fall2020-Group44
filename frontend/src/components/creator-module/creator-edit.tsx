import React, { useState, useEffect } from "react";
import MultipleChoice from './creator-answer-types/multiple-choice'
import './creator-edit.scss'

//TODO: create question props

const CreatorEdit = () => {

	return (
		<div className="creator-body">
			<div className="question-details">
				<div className="question-details-header">
					<span>Question Details</span>
				</div>
				<div className="question-title">
					<span>Title:</span>
					<input
						type="text"
						tabIndex={0}
						className="question-title-input"
						placeholder="eg: Question 1 Title"
					/>
				</div>
				<div className="question-text">
					<span>Question:</span>
					<input
						type="text"
						tabIndex={1}
						className="question-text-input"
						placeholder="eg: Who was the first President of the United States?"
					/>
				</div>
				<div className="question-answers">
					<MultipleChoice answers={[]} />
				</div>
			</div>
			<div className="question-options">
				<div className="question-options-header">
					<p>Question Options</p>
				</div>
				<div className="options-grading">
					<div className="participation">
						<span>Participation Points:</span>
						<input
							type="number"
							tabIndex={2}
							className="participation-input"
							placeholder="0.5"
							step="0.1"
							min="0.0"
						/>
					</div>
					<div className="correctness">
						<span>Correctness Points:</span>
						<input
							type="number"
							tabIndex={2}
							className="correctness-input"
							placeholder="0.5"
							step="0.1"
							min="0.0"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreatorEdit