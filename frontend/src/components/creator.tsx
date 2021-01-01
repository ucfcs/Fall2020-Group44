import React, { useState, useEffect } from "react";
import './creator.scss'
import MultipleChoice from './creator-answer-types/multiple-choice'

const Creator = () => {
	return (
		<div className="create-question-module">
			<div className="creator-header">
				<span className="header-title">Create Question</span>
				<div className="header-tabs">
					<button className="edit-tab">Edit</button>
					<button className="preview-tab">Preview</button>
				</div>
			</div>
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
							tabIndex={0}
							className="question-text-input"
							placeholder="eg: Who was the first President of the United States?"
						/>
					</div>
					<div className="question-answers">
						<MultipleChoice answers={[]} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Creator