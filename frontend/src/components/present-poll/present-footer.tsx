import React, { useState, useEffect } from "react";
import './present-footer.scss'

type QuestionProps = {
	question: string;
}

const FooterQuestion = ({question}: QuestionProps) => {
	return (
		<div className="footer-question">
			<img src="/img/logo.svg"/>
			<p>{question}</p>
			<button className="delete">X</button>
		</div>
	)
}

const PresentFooter = () => {
	const questions = ["Q1", "Q2", "Q3"]

	return (
		<div className="present-footer">
			{questions.map((question, index) =>
				<FooterQuestion
					key={index}
					question={question}
				/>
			)}
		</div>
	)
}

export default PresentFooter