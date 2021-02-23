import React, { ReactElement, useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import { store } from "../../store";

import "./home-header.scss";

const HomeHeader = (): ReactElement => {
  const global = useContext(store) as any;
  const dispatch = global.dispatch;

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
      <button
        className="create-button"
        onClick={() => dispatch({ type: "open-creator" })}
      >
        Create Question
      </button>
    </header>
  );
};

export default HomeHeader;
