import { forceCollide, forceCenter } from "d3-force";

export const rescueNode = (node, limit) => {
  // bounce on box walls
  if (Math.abs(node.x) > limit) {
    // node.vx *= -1;
    node.vx = 0;
  }
  if (Math.abs(node.y) > limit) {
    // node.vy *= -1;
    node.vy = 0;
  }
};

export default (graph, nodes, canvasSize) => {
  const { width = 500 } = canvasSize;
  console.log("width", width);

  // Deactivate existing forces
  graph.d3Force("center", forceCenter().strength(1));
  graph.d3Force("charge", null);

  // Prevent collision and bound to graph-box
  graph.d3Force("collide", forceCollide(4));
  graph.d3Force("box", () => {
    nodes.forEach((n) => {
      // console.log("rescuing...");
      const topNode = n.id === "<project>";
      const limit = 50;
      rescueNode(n, limit);
    });
  });
};
