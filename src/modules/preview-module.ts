export function preview(selection: readonly SceneNode[]): String[] {
  let list = [];
  for (var i = 0; i < selection.length; i++) {
    list.push(selection[i].name);
  }
  return list;
}
