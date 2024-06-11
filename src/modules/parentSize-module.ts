/*
======
The parent size module returns the byte data of the exportable asset in the relative size of the top-level parent.
Means, if the top-level frame of a 50x50px rectangle is 200x200px large, the exportable rectangle asset will be 200x200px instead of 50x50px.
======
*/

export async function parentSize(selection: SceneNode[]) {
  const highestParents = selection.map(getMainParent);

  for (let index = 0; index < highestParents.length; index++) {
    const parent = highestParents[index];

    if (parent) {
      // console.log(`Layer ${selection[index].name} is in top-level frame/section: ${parent.name}`);
      const positionInParent = getRelativePosition(selection[index], parent);
      const clone = selection[index].clone();
      const newFrame = figma.createFrame();
      newFrame.resize(parent.width, parent.height);
      // frame position is somewhere in the nowhere, so there is no visual appear/disappear on the canvas for the user
      newFrame.x = -99999;
      newFrame.y = -99999;
      newFrame.fills = [];
      newFrame.appendChild(clone);
      clone.x = positionInParent.x;
      clone.y = positionInParent.y;

      var bytes = await newFrame.exportAsync({
        format: 'PNG',
        constraint: { type: 'SCALE', value: 1 }
      });

      // Remove the new frame after exporting
      newFrame.remove();

      return bytes; // Await the async function

    } else {
      console.log(`Layer ${selection[index].name} has no top-level frame/section`);
    }
  }

  // Identify the top-level parent of the selected item
  function getMainParent(node: SceneNode): SceneNode | null {
    while (node.parent && (node.parent.type === 'FRAME' || node.parent.type === 'SECTION' || node.parent.type === 'GROUP')) {
      node = node.parent;
    }
    // If the node.parent is a PAGE or undefined, then node is the top-level parent
    return node;
  }

  // Get the relative position of the selected item to its top-level parent
  function getRelativePosition(node: SceneNode, topLevelParent: SceneNode | null): { x: number, y: number } {
    let x = 0;
    let y = 0;

    while (node && node !== topLevelParent) {
      if ('x' in node && 'y' in node) {
        x += node.x;
        y += node.y;
      }
      node = node.parent as SceneNode;
    }

    return { x, y };
  }
}

