import { Node } from "./data";
import { clone } from "../../helpers";

export interface Link {
  source: string;
  target: string;
}

const createNodes = (input: Node[]) => {
  let nodes: Node[] = clone(input);

  // add Children
  nodes.forEach(({ id, deps }) => {
    if (!deps) return;

    deps.forEach((depId) => {
      const depNode = nodes.find((n) => n.id === depId);
      if (!depNode) return;

      if (!Array.isArray(depNode.children)) depNode.children = [];
      depNode.children.push(id);
    });
  });

  return nodes;
};

const createLinks = (nodes: Node[]) => {
  let links: Link[] = [];
  // const parents = nodes.filter(n => !!n.children);

  nodes.forEach((node: Node) => {
    if (!node.deps) return;

    node.deps.forEach((depId: string) => {
      links.push({
        source: depId,
        target: node.id,
      });
    });
  });

  return links;
};

export interface Data {
  nodes: Node[];
  links: Link[];
}

export default (input: Node[]) => {
  const data = clone(input);
  return {
    nodes: createNodes(data),
    links: createLinks(data),
  };
};
