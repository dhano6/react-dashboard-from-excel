import React, { useState, useEffect } from "react";
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
  const [dropdownOptions, setDropdownOptions] = useState(null);
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
    axios.get(url).then(response => {
      let batchRows = response.data.valueRanges[0].values;
      const rows = [];
      const header = batchRows[0];

      // remove header from array
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

      let options = [];
      for (const row of rows) {
        options.push(row.month);
      }

      // remove duplicates and sort
      options = Array.from(new Set(options)).reverse();
      setItems(rows);
      setDropdownOptions(options);
      setDropdownSelected(options[0]);
    });
  }, []);

  useEffect(() => {
    if (dropdownSelected) {
      refreshData(dropdownSelected);
    }
  }, [dropdownSelected]);

  const refreshData = month => {
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
      if (row.month === month) {
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
  };

  const updateDashboard = event => {
    // refreshData(event.value); // no need since there is useEffect
    setDropdownSelected(event.value);
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
