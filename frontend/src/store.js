
import React, { useReducer } from 'react'

const init = {
	preview: [0, 0],
	questions: [
		{
			chapter: 'Chapter 1',
			questions: [
				{
					title: 'What’s my middle name',
					type: 'Mult Choice',
					choices: ["Joe", "Mama", "xXxDarkRevenge69xXx"],
					correct: 0
				},
				{
					title: 'Where is the capital of Florida',
					type: 'Mult Choice',
					choices: ["Washington DC", "Paris", "Egypt"],
					correct: 1
				},
				{
					title: 'Who was the first President',
					type: 'Mult Choice',
					choices: ["Joe Mama", "Abraham Lincoln", "George Washington", "Thomas Jefferson"],
					correct: 2
				}
			]
		},
	]
}
const store = React.createContext(init)
const { Provider } = store

const StateProvider = ( { children } ) => {
	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
      case 'update-preview-question':
				return {...state, preview: action.payload};
			default:
			  throw new Error('Base reducer: this action type was not defined')
		  }
	}, init)

	return <Provider value={{state, dispatch}}>{children}</Provider>
}

export { store, StateProvider }