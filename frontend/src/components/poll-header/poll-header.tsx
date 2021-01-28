import { Link } from "react-router-dom";

import "./poll-header.scss";

const PollHeader = () => {
  return (
    <div className="poll-header">
      <h1><Link to="/">CAP1000</Link></h1>
      <button className="exit-button">EXIT</button>
    </div>
  );
};

export default PollHeader;
