import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css"; // why???

const nav = props => {
  return (
    <nav className="navbar fixed-top nav-secondary is-dark is-light-text">
      <div className="text-medium">Summary</div>
      <div className="navbar-nav ml-auto">
        <Dropdown
          className="pr-2 custom-dropdown"
          options={props.options}
          onChange={props.updateDashboard}
          value={props.selected}
          placeholder="Loading..."
        />
      </div>
    </nav>
  );
};

export default nav;
