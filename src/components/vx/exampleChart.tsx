import React, { useMemo } from "react";
import { Group } from "@vx/group";
import { hierarchy, Tree } from "@vx/hierarchy";
import { pointRadial } from "d3-shape";
import { Polygon, LinkRadialLine } from "@vx/shape";
import { withParentSize } from "@vx/responsive";
import { HierarchyNode, HierarchyPointNode } from "@vx/hierarchy/lib/types";
// import getLinkComponent from "./getLinkComponent";
// import LinkControls from "./linkControls";
// import { LinearGradient } from "@vx/gradient";
//import useForceUpdate from "./useForceUpdate";

interface RawNode {
  name?: string;
  score?: number;
  children?: RawNode[];
  color?: string;
  randFactor?: number;
}

interface Node {
  children?: Node[];
  parent?: Node[];
  data: RawNode;
  depth: number;
  height: number;
  x: number;
  y: number;
}

const colors = ["#00288F", "#D3365F", "#F5C055"];
const mainColor = colors[0];

const paintNodes = (data: {
  name: string;
  points: number;
  children: RawNode[];
}) => {
  const paint = ({
    node,
    index,
    inputColor,
  }: {
    node: RawNode | undefined;
    index: number;
    inputColor?: string;
  }) => {
    const colorIndex = index % colors.length;
    const color = inputColor || colors[colorIndex];

    const painted = { ...node, color };

    if (painted?.children) {
      painted.children = painted.children.map((child, childIndex) =>
        paint({ node: child, index: childIndex, inputColor: color })
      );
    }

    return painted;
  };

  const painted = data.children.map((node, index) => paint({ node, index }));

  return { ...data, children: painted };
};

const addRandFactor = (data: {
  name: string;
  points: number;
  children: RawNode[];
}) => {
  const doRand = (node: RawNode, index: number) => {
    const randFactor = Math.max(1.1, Math.min(1.9, 1 + Math.random()));

    console.log("RAND", randFactor);

    const res = { ...node, randFactor };

    if (res?.children) {
      res.children = res.children.map((child, childIndex) =>
        doRand(child, childIndex)
      );
    }

    return res;
  };

  const withRand = data.children.map(doRand);

  return { ...data, children: withRand };
};

const defaultMargin = { top: 0, left: 30, right: 30, bottom: 0 };

const config = {
  layout: "polar",
  orientation: "vertical",
  linkType: "line",
};

export type LinkTypesProps = {
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  data: any;
};

const Chart = ({
  width: totalWidth = 400,
  height: totalHeight = 400,
  margin = defaultMargin,
  data = {},
}: LinkTypesProps) => {
  console.log("RAW DATA", data);

  const paintedData = paintNodes(data);
  console.log("PAINTED DATA", paintedData);

  const randomFactoredData = addRandFactor(paintedData);
  console.log("RANDOM FACTORED DATA", randomFactoredData);

  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

  origin = {
    x: innerWidth / 2,
    y: innerHeight / 2,
  };

  sizeWidth = Math.min(innerWidth, innerHeight) / 2;
  sizeHeight = Math.min(innerWidth, innerHeight) / 2;

  return totalWidth < 10 ? null : (
    <div>
      <svg
        width={totalWidth}
        height={totalHeight}
        style={{ overflow: "visible" }}
      >
        <rect width={totalWidth} height={totalHeight} rx={14} fill="#fff" />
        <Group top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(randomFactoredData, (d: RawNode) => d.children)}
            size={[Math.PI * 2.2, innerWidth]}
            separation={(a, b) => (a.parent === b.parent ? 1 : 3) / a.depth}
          >
            {(tree) => {
              let nodeLen: number;

              const tweakPosition = (node: HierarchyPointNode<RawNode>) => {
                const { depth, children, parent, data } = node;

                const name = data?.name || "empty splitPoint";
                const log = name === "gatsby" || name === "date-fns";

                let res = { ...node },
                  family: HierarchyPointNode<RawNode>[] | null,
                  childIndex: number | null,
                  firstChild: boolean,
                  lastChild: boolean;

                family = parent?.children || null;

                childIndex = family
                  ? family.findIndex((child) => child.data.name === name)
                  : null;

                firstChild = childIndex === 0 || !family;

                lastChild =
                  (family && childIndex === family?.length - 1) || !family;

                log &&
                  console.log(
                    depth,
                    name,
                    "childIndex",
                    childIndex,
                    "hasChildren",
                    children ? children.length : false,
                    "hasParent",
                    !!parent,
                    "first",
                    firstChild,
                    "last",
                    lastChild,
                    "familyCount",
                    family?.length || null
                  );

                // lastChild && console.log("LAST", name);

                const doY = (factor = 0.8, rand: boolean | number = false) => {
                  const useRand = typeof rand === "number";
                  const origRand = !useRand ? 1 : res.data?.randFactor || 1;
                  const inputRand = typeof rand !== "number" ? 1 : rand;
                  const randFactor = origRand * inputRand;

                  console.log(
                    depth,
                    name,
                    "RAND FACTOR",
                    randFactor,
                    res.data?.randFactor
                  );
                  res.y *= factor * randFactor * 0.5;
                };

                const doX = (factor = 1.2, rand: boolean | number = false) => {
                  const origRand =
                    typeof rand !== "number" ? 1 : res.data?.randFactor || 1;
                  const inputRand = typeof rand !== "number" ? 1 : rand;
                  const randFactor = origRand * inputRand;

                  const val = res.x * factor * randFactor;
                  res.x = firstChild
                    ? res.x - val
                    : lastChild
                    ? res.x + val / 10
                    : res.x;

                  // res.x += val;
                };

                const reducer = [
                  {
                    test: [
                      depth === 2,
                      !children,
                      firstChild || lastChild,
                      nodeLen < 12,
                    ],
                    action: [() => doX(0.4), () => doY(0.6)],
                  },
                  {
                    test: [depth === 1, !!children],
                    action: [() => doY(0.5)],
                  },
                ];

                for (let index = 0; index < reducer.length; index++) {
                  const scenario = reducer[index];
                  const allPass = scenario.test.every((condition) => condition);

                  if (allPass) {
                    scenario.action.forEach((a) => a());
                    break;
                  }
                }

                // console.log("X", res.x);
                // if (depth === 1 && children) console.log("depth 1", name);
                // console.log("X", res.x);
                /* const doY = children && depth === 1;
                if (doY) res.y *= 0.8; */

                // const spread = !children && depth === 2 && nodeLen < 12;
                // if (spread) res.x *= 1.2;

                return res;
              };

              const tweakNodes = (nodes: HierarchyPointNode<RawNode>[]) => {
                const tweaked = [...nodes];

                return tweaked.map(tweakPosition);
              };

              interface Link {
                source: HierarchyPointNode<RawNode>;
                target: HierarchyPointNode<RawNode>;
              }
              const tweakLinks = (links: Link[]) => {
                const tweaked = [...links];

                const tweak = (link: Link) => {
                  const { source, target } = link;
                  let res = { ...link };

                  /* const doYSource = source.children && source.depth === 1;
                  const doYTarget = target.children && target.depth === 1;
                  if (doYSource) res.source.y *= 0.8;
                  if (doYTarget) res.target.y *= 0.8;

                  const spreadTarget =
                    !target.children && target.depth === 2 && nodeLen < 12;
                  if (spreadTarget) res.target.x *= 1.2; */

                  return res;
                };

                return tweaked.map(({ source, target }) => ({
                  source: tweakPosition(source),
                  target: tweakPosition(target),
                }));
              };

              const nodeList = tree.descendants();
              const linkList = tree.links();

              nodeLen = nodeList.length;

              const nodes = tweakNodes(nodeList);
              const links = tweakLinks(linkList);

              console.log("TREE NODES", nodes);
              console.log("TREE LINKS", links);
              return (
                <Group top={origin.y} left={origin.x}>
                  {links.map((link: any, i) => (
                    <LinkRadialLine
                      key={i}
                      data={link}
                      stroke={
                        link.source?.data.color ||
                        link.target?.data.color ||
                        "orange"
                      }
                      strokeOpacity="0.5"
                      strokeWidth="1"
                      fill="none"
                    />
                  ))}

                  {nodes.map((node: any, key) => {
                    const [radialX, radialY] = pointRadial(node.x, node.y);

                    const top = radialY;
                    const left = radialX;

                    const rootNode = node.depth === 0;
                    const hasName = !!node.data.name;
                    const fontsize = nodes.length > 12 ? 9 : 12;

                    return (
                      <Group top={top} left={left} key={key}>
                        {rootNode && (
                          <Polygon
                            sides={7}
                            size={6}
                            rotate={-12}
                            fill={mainColor}
                          />
                        )}
                        {!rootNode && hasName && (
                          <>
                            <circle
                              cx="0"
                              cy="0"
                              r="3"
                              fill={node?.data.color || mainColor}
                            />
                            <text
                              dy="-1em"
                              fontSize={fontsize}
                              fontFamily="monospace"
                              textAnchor="middle"
                              style={{
                                pointerEvents: "none",
                                textShadow: "0 0 2px #aaa",
                              }}
                              fill={node?.data.color || mainColor}
                            >
                              {node.data.name}
                            </text>
                          </>
                        )}
                      </Group>
                    );
                  })}
                </Group>
              );
            }}
          </Tree>
        </Group>
      </svg>
    </div>
  );
};

export default Chart;
