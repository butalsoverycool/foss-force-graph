import formatData from "./formatData";

export interface Node {
  id: string;
  name: string;
  deps?: string[];
  children?: string[];
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

const data: Node[] = [
  {
    id: "<project>",
    name: "Doberman's use of Open Source",
    deps: ["eslint", "lodash", "gatsby", "force-graph"],
  },
  {
    id: "gatsby",
    name: "gatsby",
    deps: ["react", "react-dom", "eslint", "lodash"],
  },
  {
    id: "react",
    name: "react",
  },
  {
    id: "@babel/core",
    name: "babel",
  },
  {
    id: "eslint",
    name: "eslint",
    deps: ["@babel/core"],
  },
  {
    id: "lodash",
    name: "lodash",
  },
  {
    id: "styled-components",
    name: "styled-components",
    deps: ["@babel/core", "eslint", "react"],
  },
  {
    id: "force-graph",
    name: "force-graph",
    deps: ["lodash", "d3-zoom"],
  },
  {
    id: "d3-zoom",
    name: "d3-zoom",
    deps: ["d3-transition"],
  },
  {
    id: "d3-transition",
    name: "d3-transition",
    deps: ["scheduler"],
  },
  {
    id: "react-dom",
    name: "react-dom",
    deps: ["scheduler"],
  },
  {
    id: "scheduler",
    name: "scheduler",
  },
];

export default formatData(data);
