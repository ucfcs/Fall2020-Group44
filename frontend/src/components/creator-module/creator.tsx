import React, { useState, useEffect } from "react";
import './creator.scss'
import CreatorEdit from "./creator-edit";
import CreatorPreview from "./creator-preview";

//todo: create question props

const Creator = () => {
	const [isPreview, setIsPreview] = useState(false)


	return (
		<div className="create-question-module">
			<div className="creator-header">
				<span className="header-title">Create Question</span>
				<div className="header-tabs">
					<button 
						className={`edit-tab ${isPreview ? '' : 'selected'}`}
						onClick={() => setIsPreview(false)}
					>
						Edit
					</button>
					<button 
						className={`preview-tab ${isPreview ? 'selected' : ''}`}
						onClick={() => setIsPreview(true)}
					>
						Preview
					</button>
				</div>
			</div>
			{ isPreview
			? <CreatorPreview />
			: <CreatorEdit />
			}
			
		</div>
	);
}

export default Creator