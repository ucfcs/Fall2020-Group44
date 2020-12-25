import React, { useState, useEffect } from "react";
import QuestionList from "./question-list"
import './body.scss'

const Body = () => {
	return (
		<div className="body">
			<QuestionList />
		</div>
	)
}

export default Body