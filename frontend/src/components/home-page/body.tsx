import React, { useState, useEffect } from "react";
import ContentTree from "./content-tree"
import QuestionPreview from "./question-preview"
import './body.scss'

const Body = () => {
	return (
		<div className="body">
			<ContentTree />
			<QuestionPreview 
				title={"Who was the First President"}
				answers={["Abraham Lincoln", "George Washington", "Thomas Jefferson"]}
			/>
		</div>
	)
}

export default Body