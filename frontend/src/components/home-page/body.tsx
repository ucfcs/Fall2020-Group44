import React, { useContext } from "react";
import ContentTree from "./content-tree";
import QuestionPreview from "./question-preview";
import { store } from '../../store'
import './body.scss'

const Body = () => {
	const global = useContext(store) as any;
	const dispatch = global.dispatch;
	const state = global.state;

	const previewQuestion = state.questions[state.preview[0]].questions[state.preview[1]];
	console.log('previewQuestion', previewQuestion)

	return (
		<div className="body">
			<ContentTree />
			<QuestionPreview
				title={previewQuestion.title}
				answers={previewQuestion.choices}
				correct={previewQuestion.correct}
			/>
		</div>
	)
}

export default Body
