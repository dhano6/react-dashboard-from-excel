import React from "react";

const card = props => {
  const determineStoreIconClass = () => {
    if (props.store === "AM") {
      return "fab fa-amazon text-large";
    } else if (props.store === "EB") {
      return "fab fa-ebay text-x-large logo-adjust";
    } else if (props.store === "ET") {
      return "fab fa-etsy text-medium";
    } else {
      return null;
    }
  };

  return (
    <div className="col-lg-3 col-sm-6 is-light-text mb-4">
      <div className="card grid-card is-card-dark">
        <div className="card-heading">
          <div className="is-dark-text-light letter-spacing text-small">
            {props.heading}
          </div>
          {props.store ? (
            <div className="card-heading-brand">
              <i className={determineStoreIconClass()} />
            </div>
          ) : null}
        </div>

        <div className="card-value pt-4 text-x-large">
          {props.revenue ? <span className="text-large pr-1">$</span> : null}
          {props.value}
          {!props.revenue ? (
            <span className="text-medium pl-2 is-dark-text-light">views</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default card;
