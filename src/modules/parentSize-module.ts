/*
======
The parent size module returns the byte data of the exportable asset in the relative size of the top-level parent.
Means, if the top-level frame of a 50x50px rectangle is 200x200px large, the exportable rectangle asset will be 200x200px instead of 50x50px.
======
*/

export async function parentSize(selection: SceneNode[], exportSettings: ExportSettings) {
  const highestParents = selection.map(getMainParent);

  for (let index = 0; index < highestParents.length; index++) {
    const parent = highestParents[index];

    // settings = await fileFormat(exportSettings.format, exportSettings.scaling);

    if (parent) {
      // console.log(`Layer ${selection[index].name} is in top-level frame/section: ${parent.name}`);
      const positionInParent = getRelativePosition(selection[index], parent);
      const selectionClone = selection[index].clone();
      const parentClone: any = parent.clone();
      // const newFrame = figma.createFrame();
      // newFrame.resize(parent.width, parent.height);

      // frame position is somewhere in the nowhere, so there is no visual appearance/disappearance for the user on the canvas
      // newFrame.name = 'TEMPORARY FRAME';
      // newFrame.x = -99999;
      // newFrame.y = -99999;
      // newFrame.fills = [];
      // newFrame.appendChild(selectionClone);
      // selectionClone.x = positionInParent.x;
      // selectionClone.y = positionInParent.y;

      parentClone.name = 'TEMPORARY FRAME';
      parentClone.x = -99999;
      parentClone.y = -99999;

      for(let i = 0; i < parentClone.children.length; i++) {
        parentClone.children[i].remove();
      }

      // if(parentClone.type === 'INSTANCE') {
      //   parentClone.detachInstance();
      // }

          // if (parentClone.type === 'INSTANCE') {

    //   parentClone.detachInstance()

    //   // @ts-ignore
    //   for(let i = 0; i < parentClone.children.length; i++) {
        
    //     // @ts-ignore
    //     parentClone.children[i].remove();
    //   }
    // }

      parentClone.appendChild(selectionClone);
      selectionClone.x = positionInParent.x;
      selectionClone.y = positionInParent.y;

      console.log(selectionClone.name)

      parentClone.fills = [];
      parentClone.strokes = [];
      parentClone.effects = [];
      parentClone.blendMode= 'PASS_THROUGH';
      parentClone.layoutMode = 'NONE';

      /*
      Idee für top-level frame export mit variable modes
      1. Clone selection
      2. Clone top level
      3. Paste top level on -9999
      4. remove all content in top-level
      5. clear all properties in top-level
        5.1 fills
        5.2 strokes
        5.3 effects
        5.4 blend mode
        5.5 opacity
        5.6 layout
      6. paste selection in top level
      */

      // newFrame.appendChild(parentClone);
      // parentClone.x = 0;
      // parentClone.y = 0;

      // var bytes = await newFrame.exportAsync(exportSettings);
      var bytes = await parentClone.exportAsync(exportSettings);

      // Remove the new frame after exporting
      // newFrame.remove();

      return bytes; // Await the async function

    } else {
      console.log(`Layer ${selection[index].name} has no top-level frame/section`);
    }
  }

  // Identify the top-level parent of the selected item
  function getMainParent(node: SceneNode): SceneNode | null {
    while (node.parent && (node.parent.type === 'FRAME' || node.parent.type === 'GROUP' || node.parent.type === 'COMPONENT' || node.parent.type === 'INSTANCE')) {
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
        // = works for groups and += for frames
        if (node.type === 'FRAME' || node.type === 'INSTANCE') {
          x += node.x;
          y += node.y;
        } else {
          x = node.x;
          y = node.y;
        }
        // console.log(`${node.name}, x: ${x}, y: ${y}`)
      }
      node = node.parent as SceneNode;
    }

    return { x, y };
  }
}

