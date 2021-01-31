import React, { useState, useEffect, useContext } from "react";
import { store } from '../../store'
import './content-tree.scss'

interface Folder {
	chapter: string;
	questions: Question[];
}

interface Question {
	title: string;
	type: string;
}

const ContentTree = () => {
	const global = useContext(store) as any;
	const dispatch = global.dispatch;
	const state = global.state;

	const [selectedQuestion, setSelectedQuestion] = useState([0, 0]);
	const [questions, setQuestions] = useState(state.questions);
	const [folderCollapse, setFolderCollapse] = useState(new Array(questions.length).fill(false));

	const handleUpdatePreviewQuestion = (folder: number, question: number) => {
		setSelectedQuestion([folder, question]);
		dispatch({type: 'update-preview-question', payload: [folder, question]})
	}

	const handleFolderCollapse = (folder: number) => {
		const newFolderCollapse= folderCollapse.slice();
		newFolderCollapse[folder] = !newFolderCollapse[folder];
		setFolderCollapse(newFolderCollapse);
	}

	const searchQuestions = (event: any) => {
		const newFolders: Folder[] = [];
		state.questions.forEach((folder: Folder) => {
			let newQuestions: Question[] = [];
			folder.questions.forEach(question => {
				if (question.title.toLowerCase().includes(event.target.value.toLowerCase())) {
					newQuestions.push(question);
				}
			});
			if (newQuestions.length) {
				newFolders.push({chapter: folder.chapter, questions: newQuestions})
			}
		})
		setQuestions(newFolders);
	}

	return (
		<div className="content-tree">
			<div className="tree-options">
				<input
					type="text"
					tabIndex={0}
					className="input-box"
					placeholder="Search..."
					onChange={searchQuestions}
				/>
				<button className="filter-button">Filter</button>
			</div>
			<div className="question-list">
				<div className="question-list-header">
					<span>Title</span>
					<span>Question Type</span>
				</div>
				<div className="question-list-body">
					{questions.map((folder: Folder, fIndex: number) => <div
						key={fIndex}
					>
						<div
							className={`folder ${folderCollapse[fIndex] ? 'collapsed' : ''}`}
							onClick={() => handleFolderCollapse(fIndex)}>{folder.chapter}</div>
						{!folderCollapse[fIndex] && folder.questions.map((question, qIndex) => <div
							key={fIndex + '-' + qIndex}
							className={`preview-question ${selectedQuestion[0] === fIndex && selectedQuestion[1] === qIndex ? 'selected' : ''}`}
							onClick={() => handleUpdatePreviewQuestion(fIndex, qIndex)}
						>
							<div className="title">{question.title}</div>
							<div></div>
							<div className="type">{question.type}</div>
						</div>)}
					</div>)}
				</div>
			</div>
		</div>
	);
}

export default ContentTree