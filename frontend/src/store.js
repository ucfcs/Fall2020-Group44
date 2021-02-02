import React, { useReducer } from 'react';

const init = {
	previewFolder: 0,
	previewQuestion: 0,
	questions: [
		{
			folder: 'Chapter 1',
			questions: [
				{
					title: 'What’s my middle name',
					type: 'Mult Choice',
					choices: ['Joe', 'Mama', 'xXxDarkRevenge69xXx'],
					correct: 0,
				},
				{
					title: 'Where is the capital of Florida',
					type: 'Mult Choice',
					choices: ['Washington DC', 'Paris', 'Egypt'],
					correct: 1,
				},
			],
		},
		{
			folder: 'Chapter 2',
			questions: [
				{
					title: 'Where is the capital of Florida',
					type: 'Mult Choice',
					choices: ['Washington DC', 'Paris', 'Egypt'],
					correct: 1,
				},
				{
					title: 'Who was the first President',
					type: 'Mult Choice',
					choices: [
						'Joe Mama',
						'Abraham Lincoln',
						'George Washington',
						'Thomas Jefferson',
					],
					correct: 2,
				},
			],
		},
	],
	poll: 1,
	isEditingQuestion: false,
};
const store = React.createContext(init);
const { Provider } = store;

const StateProvider = ({ children }) => {
	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case 'update-preview-folder':
				return { ...state, previewFolder: action.payload };
			case 'update-preview-question':
				return { ...state, previewQuestion: action.payload };
			case 'toggle-edit-preview-question':
				return { ...state, isEditingQuestion: !state.isEditingQuestion };
			case 'update-session-questions':
				return { ...state, poll: action.payload };
			default:
				throw new Error('Base reducer: this action type was not defined');
		}
	}, init);

	return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
