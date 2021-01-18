import React, { useState, useEffect } from "react";
import './content-tree.scss'

const ContentTree = () => {
	return (
		<div className="content-tree">
			<div className="tree-options">
				<input
					type="text"
					tabIndex={0}
					className="input-box"
					placeholder="Search..."
				/>
				<button className="filter-button">Filter</button>
			</div>
			<div className="question-list">
				<div className="question-list-header">
					<span>Title</span>
					<span>Question Type</span>
				</div>
				<div className="question-list-body">
					{/* Programmatically list created questions */}
				</div>
			</div>
		</div>
	);
}

export default ContentTree