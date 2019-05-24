import React from "react";
import Card from "../components/card";
import RatesCard from "../components/ratesCard";
import StoresTrendCard from "../components/storesTrendCard";
import Spinner from "../components/spinner";

const Dashboard = props => {
  if (!props.totalR && !props.prodViews) {
    return (
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          height: "80vh"
        }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container-fluid pr-5 pl-5 pt-5 pb-5">
      {/* row 1 - revenue */}
      <div className="row">
        <Card heading={"Total Revenue"} value={props.totalR} revenue />
        <Card
          heading={"Revenue from Amazon"}
          value={props.amR}
          store={"AM"}
          revenue
        />
        <Card
          heading={"Revenue from Ebay"}
          value={props.ebR}
          store={"EB"}
          revenue
        />
        <Card
          heading={"Revenue from Etsy"}
          value={props.etR}
          store={"ET"}
          revenue
        />
      </div>

      {/* row 2 - rates */}
      <div className="row">
        <Card heading={"Product Views"} value={props.prodViews} />
        {props.purRate && props.checkRate && props.abanRate ? (
          <RatesCard
            purchaseRate={props.purRate}
            checkoutRate={props.checkRate}
            abandonedRate={props.abanRate}
          />
        ) : null}
      </div>

      {/* row 3 - orders trend */}
      <div
        className="row"
        style={{
          minHeight: "400px",
          display: "flex",
          justifyContent: "center"
        }}
      >
        {props.ordTrendStore ? (
          <StoresTrendCard ordersTrendStore={props.ordTrendStore} />
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
