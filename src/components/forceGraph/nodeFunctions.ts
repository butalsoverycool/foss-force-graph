import { MutableRefObject } from "react";

import { Node } from "./data";
import { NodeObject, ForceGraphMethods } from "react-force-graph-2d";

import layoutPreset from "./layoutPreset";
import { rescueNode } from "./handleCollision";

const { colors, fontSizes } = layoutPreset;

type GraphInstance = ForceGraphMethods | undefined;

export const nodeRenderObject = (node: any, ctx: any, globalScale: number) => {
  const projectNode = node.id === "<project>";

  const lvl = projectNode ? 0 : !!node.children ? 1 : 2;

  node.vy = 0;
  node.vx = 0;

  // todo, link-must follow coords
  // node.x = projectNode ? 0 : node.x;
  // node.y = projectNode ? 0 : node.y;

  const nodeColor = node.color
    ? node.color
    : projectNode
    ? "#000"
    : colors.blue;
  const arcRadius = projectNode ? 0.4 : 0.3;

  const label = node.name;
  const fontSizeDividend = fontSizes[lvl];
  const fontSize = fontSizeDividend / globalScale;

  ctx.font = `${fontSize}px Roboto`;
  const textWidth = ctx.measureText(label).width;
  const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.5);

  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  !!node.x &&
    !!node.y &&
    ctx.fillRect(
      node.x - bckgDimensions[0] / 2,
      node.y - bckgDimensions[1] / 2,
      ...bckgDimensions
    );

  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.textMargin = "0 0 25px";

  ctx.fillStyle = nodeColor;
  typeof node.x === "number" &&
    typeof node.y === "number" &&
    ctx.fillText(label, node.x, node.y - bckgDimensions[1] * 0.4);

  ctx.strokeStyle = nodeColor;
  ctx.fillStyle = nodeColor;
  ctx.beginPath();
  ctx.arc(node.x, node.y, arcRadius, 0, 2 * Math.PI, false);
  ctx.fill();

  return ctx;
};

const padding = 20;
const readyForZoom = 300;
const zoomDuration = 700;

export const centerAndFit = (graphInstance: GraphInstance, nodes: Node[]) => {
  if (!graphInstance) return;

  const topNode = nodes.find((n) => n.id === "<project>");

  if (topNode) {
    topNode.x = 0;
    topNode.y = 0;
  }
  setTimeout(() => {
    if (!graphInstance) return;

    graphInstance.zoomToFit(zoomDuration, padding);
  }, readyForZoom + 100);
};
