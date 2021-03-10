import React, { ReactElement } from "react";
import { Link, NavLink } from "react-router-dom";

import "./home-header.scss";

const HomeHeader = (): ReactElement => {
  return (
    <header>
      <h1 className="course-code">
        <Link to="/">CAP1000</Link>
      </h1>
      <nav>
        <ul>
          <li>
            <NavLink exact to="/">
              Questions
            </NavLink>
          </li>
          <li>
            <NavLink to="/gradebook">Gradebook</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HomeHeader;
