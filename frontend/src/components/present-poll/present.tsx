import React, { useState, useEffect } from "react";
import PresentPreview from './present-preview'
import PresentFooter from './present-footer'
import './present.scss'

type Props = {
	//array of questions to be presented
}

const Present = () => {
	return (
		<div className='present'>
			<div className="present-header">
				<h1>{"CAP1000"}</h1>
				<button className="exit-button">EXIT</button>
			</div>
			<PresentPreview />
			<PresentFooter />
		</div>
	)
}

export default Present