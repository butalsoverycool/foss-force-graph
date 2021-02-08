import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ForceGraph3D from "react-force-graph-3d";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

/* const myData = {
  nodes: [
    {
      id: "id1",
      name: "name1",
      val: 1,
    },
    {
      id: "id2",
      name: "name2",
      val: 10,
    },
  ],
  links: [
    {
      source: "id1",
      target: "id2",
    },
  ],
}; */

/* ReactDOM.render(
  <ForceGraph3D graphData={myData} width={400} height={400} />,
  document.getElementById("force-graph")
); */
