import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TopNav from "./components/topNav";
import Nav from "./components/nav";
import Dashboard from "./containers/Dashboard";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";

import config from "./config/config";
import formatNumber from "./utility/formatNumber";

import "./config/chartsTheme";
import "bootstrap/dist/css/bootstrap.css";

ReactFC.fcRoot(FusionCharts, Charts);

const url = `https://sheets.googleapis.com/v4/spreadsheets/${
  config.spreadsheetId
}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;

const App = props => {
  const [items, setItems] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownSelected, setDropdownSelected] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [amRevenue, setAmRevenue] = useState(null);
  const [ebRevenue, setEbRevenue] = useState(null);
  const [etRevenue, setEtRevenue] = useState(null);
  const [productViews, setProductViews] = useState(null);
  const [purchaseRate, setPurchaseRate] = useState(null);
  const [checkoutRate, setCheckoutRate] = useState(null);
  const [abandonedRate, setAbandonedRate] = useState(null);
  const [ordersTrendStore, setOrdersTrendStore] = useState(null);

  useEffect(() => {
    // Fetch data from excel and store it in state
    axios.get(url).then(response => {
      let batchRows = response.data.valueRanges[0].values;
      const rows = [];
      const header = batchRows[0];

      // Remove header from array
      batchRows.splice(0, 1);

      // Transform Array of Arrays to Array of Objects
      for (const rowArray of batchRows) {
        const rowObject = {};
        let i = 0;
        for (const rowArrayValue of rowArray) {
          rowObject[header[i]] = rowArrayValue;
          i++;
        }
        rows.push(rowObject);
      }

      // Create options for dropdown from months
      let options = [];
      for (const row of rows) {
        options.push(row.month);
      }
      // Remove duplicate months and sort
      options = Array.from(new Set(options)).reverse();

      setItems(rows);
      setDropdownOptions(options);
      setDropdownSelected(options[0]);
    });
  }, []);

  // 2 approaches:
  // 1. change of dropdown triggers updateDashboard callback and that triggers refreshData
  // with direct passing month parameter to it
  // in this case we dont need useCallback hook and also dont watch dropdownSelected state variable
  // updating state in this function causes rerender
  // 2. if I want to display data after fetching from API on application start I need to use
  // another useEffect that monitors dropdownSelected state variable and when this variable
  // changes I update screen, so I need to include refreshData as dependency for this useEffect
  // and if I dont want to run this useEffect on every render I need to encapsulate this in
  // useCallback so that this function is the same bewteen renders as long as dependecies of
  // this useCallback doesnt change [dropdownSelected, items]
  // Another possible Approach 2 solution would be to move refreshData into useEffect, in this case we
  // dont need useCallback anymore and dont have refreshData dependency

  // without useCallback refreshData would appear new on every render and would trigger
  // Approach 2 useEffect on every render
  const refreshData = useCallback(() => {
    if (!dropdownSelected || !items) return;
    console.log("refreshData called");
    let totalR = 0;
    let amR = 0;
    let ebR = 0;
    let etR = 0;
    let prodViews = 0;
    let purRate = 0;
    let checkRate = 0;
    let abanRate = 0;
    let ordTrendStore = [];
    for (const row of items) {
      if (row.month === dropdownSelected) {
        // console.log(`${row.month}: ${row.source} : ${row.revenue}`)
        if (row.source === "AM") {
          amR += parseInt(row.revenue, 10);
          ordTrendStore.push({
            label: "Amazon",
            value: row.orders,
            displayValue: `${row.orders} orders`
          });
        } else if (row.source === "EB") {
          ebR += parseInt(row.revenue, 10);
          ordTrendStore.push({
            label: "Ebay",
            value: row.orders,
            displayValue: `${row.orders} orders`
          });
        } else if (row.source === "ET") {
          etR += parseInt(row.revenue, 10);
          ordTrendStore.push({
            label: "Etsy",
            value: row.orders,
            displayValue: `${row.orders} orders`
          });
        }
        totalR += parseInt(row.revenue, 10);
        prodViews += parseInt(row.product_views, 10);
        // rates divided by 3 means aritmeticky priemer
        purRate += parseInt(row.purchase_rate / 3, 10);
        checkRate += parseInt(row.checkout_rate / 3, 10);
        abanRate += parseInt(row.abandoned_rate / 3, 10);
      }
    }
    setTotalRevenue(formatNumber(totalR));
    setAmRevenue(formatNumber(amR));
    setEbRevenue(formatNumber(ebR));
    setEtRevenue(formatNumber(etR));
    setProductViews(formatNumber(prodViews));
    setCheckoutRate(checkRate);
    setAbandonedRate(abanRate);
    setPurchaseRate(purRate);
    setOrdersTrendStore(ordTrendStore);
  }, [dropdownSelected, items]); // if deps change new version of callback will be prepared
  // to be used with pointing to new variables

  // Approach 2 but dependecy check for refreshData fails
  // useEffect(() => {
  //   if (dropdownSelected) {
  //     refreshData(dropdownSelected);
  //   }
  // }, [dropdownSelected]);

  // Approach 2 dependecy check for refreshData OK but useCallback has to be used to have sense
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateDashboard = event => {
    // refreshData(event.value); // Approach 1, no need since there is Approach 2 useEffect
    setDropdownSelected(event.value); // Approach 2
  };

  return (
    <React.Fragment>
      <TopNav />
      <Nav
        selected={dropdownSelected}
        options={dropdownOptions}
        updateDashboard={updateDashboard}
      />
      <Dashboard
        totalR={totalRevenue}
        amR={amRevenue}
        etR={etRevenue}
        ebR={ebRevenue}
        prodViews={productViews}
        checkRate={checkoutRate}
        abanRate={abandonedRate}
        purRate={purchaseRate}
        ordTrendStore={ordersTrendStore}
      />
    </React.Fragment>
  );
};

export default App;
