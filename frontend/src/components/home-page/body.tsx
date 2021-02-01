import React, { useContext } from 'react';
import ContentTree from './content-tree';
import QuestionPreview from './question-preview';
import './body.scss';

const Body = () => {
	return (
		<div className='body'>
			<ContentTree />
			<QuestionPreview />
		</div>
	);
};

export default Body;
