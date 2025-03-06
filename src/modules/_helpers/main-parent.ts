// Identify the top-level parent of the selected item
function getMainParent(node: SceneNode): SceneNode | null {
  while (node.parent && (node.parent.type === 'FRAME' || node.parent.type === 'GROUP' || node.parent.type === 'COMPONENT' || node.parent.type === 'INSTANCE')) {
    node = node.parent;
  }
  // If the node.parent is a PAGE or undefined, then node is the top-level parent
  return node;
}

export default getMainParent;
