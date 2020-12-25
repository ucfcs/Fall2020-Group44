import React, { useState, useEffect } from "react";
import './question-list.scss'

const QuestionList = () => {
	return (
		<div className="question-list">
			<input
				type="text"
				tabIndex={0}
				className="search-box"
				placeholder="Search..."
			/>
			<button className="search-filter">Filter</button>

		</div>
	);
}

export default QuestionList