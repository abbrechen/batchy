/*
======
The parent size module returns the byte data of the exportable asset in the relative size of the top-level parent.
Means, if the top-level frame of a 50x50px rectangle is 200x200px large, the exportable rectangle asset will be 200x200px instead of 50x50px.
======
*/

import getMainParent from './_helpers/main-parent';

export async function parentSize(selection: SceneNode[], exportSettings: ExportSettings) {
  const highestParents = selection.map(getMainParent);

  for (let index = 0; index < highestParents.length; index++) {
    const parent = highestParents[index];

    // settings = await fileFormat(exportSettings.format, exportSettings.scaling);

    /*
    Some words for the following if parent process. It might be confusing why there is this
    clone and removal process instead of creating a new frame and pasting the selection in it.
    Unfortunately, the Figma API (date: Jan 2025) is not providing information about a frames appearance.
    This means I cannot determine an obects active variable mode, which is needed for the
    correct appearance of the selection in its parent for the parent size export.
    */
    if (parent) {
      // console.log(`Layer ${selection[index].name} is in top-level frame/section: ${parent.name}`);
      const positionInParent = getRelativePosition(selection[index]);
      const selectionClone = selection[index].clone();
      let parentClone: any = parent.clone();

      // frame position is somewhere in the nowhere, so there is no visual appearance/disappearance for the user on the canvas
      parentClone.name = 'TEMPORARY FRAME';
      parentClone.x = -99999;
      parentClone.y = -99999;

      // instances need to be detached to remove the children in the next step
      parentClone = parentClone.type === 'INSTANCE' ? parentClone.detachInstance() : parentClone;

      // remove all children, before placing the selection.
      parentClone.children.forEach((child: SceneNode, i: number) => {
        child.remove();
      });

      // placing the selection in its parent with the relative position
      parentClone.appendChild(selectionClone);
      selectionClone.x = positionInParent.x;
      selectionClone.y = positionInParent.y;

      // clean-up the parent styles that might effect the export
      parentClone.fills = [];
      parentClone.strokes = [];
      parentClone.effects = [];
      parentClone.blendMode= 'PASS_THROUGH';
      parentClone.layoutMode = 'NONE';

      var bytes = await parentClone.exportAsync(exportSettings);

      // Remove the new frame after exporting
      parentClone.remove();

      return bytes; // Await the async function

    } else {
      console.log(`Layer ${selection[index].name} has no top-level frame/section`);
    }
  }

  // Get the relative position of the selected item to its top-level parent
  function getRelativePosition(node: SceneNode): { x: number, y: number } {
    // Get the node's absolute position.
    const absoluteX = node.absoluteTransform[0][2];
    const absoluteY = node.absoluteTransform[1][2];
  
    // Traverse up to find the highest parent that is not a PAGE.
    let currentNode: SceneNode = node;
    while (currentNode.parent && currentNode.parent.type !== 'PAGE' && currentNode.parent.type !== 'SECTION') {
      currentNode = currentNode.parent as SceneNode;
    }
    
    // currentNode now represents the highest parent that isn’t a PAGE.
    const frameX = currentNode.absoluteTransform[0][2];
    const frameY = currentNode.absoluteTransform[1][2];
  
    // Return the node's position relative to this highest frame.
    return { x: absoluteX - frameX, y: absoluteY - frameY };
  }
  
}

