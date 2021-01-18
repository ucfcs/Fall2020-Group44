import React, { useState, useEffect } from "react";
import './header.scss'

const Header = () => {
	return (
		<header>
			<h1 className="course-code">
				<a href="/">CAP1000</a>
			</h1>
			<nav>
				<ul>
					<li><a href="/">Questions</a></li>
					<li><a href="/gradebook">Gradebook</a></li>
				</ul>
			</nav>
			<button className="create-button">Create Question</button>
		</header>
	)
}

export default Header