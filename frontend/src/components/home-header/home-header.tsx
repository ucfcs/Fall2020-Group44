import { Link } from "react-router-dom";

import './home-header.scss'

const HomeHeader = () => {
	return (
		<header>
			<h1 className="course-code">
				<Link to="/">CAP1000</Link>
			</h1>
			<nav>
				<ul>
					<li><Link to="/">Questions</Link></li>
					<li><Link to="/gradebook">Gradebook</Link></li>
				</ul>
			</nav>
			<button className="create-button">Create Question</button>
		</header>
	)
}

export default HomeHeader
