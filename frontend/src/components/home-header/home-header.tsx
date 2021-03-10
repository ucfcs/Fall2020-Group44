import React, { ReactElement } from "react";
import { Link, NavLink } from "react-router-dom";

import "./home-header.scss";

const HomeHeader = (): ReactElement => {
  return (
    <header>
      <Link to="/">
        <img
          alt="UCF React Logo"
          className="logo"
          src="/img/UCFReactLogoBlackBackground.png"
        />
      </Link>
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
