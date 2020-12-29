import React, { useState, useEffect } from "react";
import ContentTree from "./content-tree"
import './body.scss'

const Body = () => {
	return (
		<div className="body">
			<ContentTree />
		</div>
	)
}

export default Body