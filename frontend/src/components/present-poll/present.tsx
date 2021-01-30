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
			<PresentPreview />
			<PresentFooter />
		</div>
	)
}

export default Present
