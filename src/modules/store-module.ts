class Store {
  private static instance: Store;
  private selectionList: SceneNode[];

  constructor() {
    this.selectionList = [];
  }

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  public addToSelectionList(newItem: SceneNode): void {
    let counter = 0;
    this.selectionList.forEach((listItem: SceneNode) => {
      if (newItem === listItem) {
        counter++
      }
    });
    if (counter === 0) {
      this.selectionList.push(newItem);
      counter = 0;
      // console.log('list on backend side', this.selectionList)
    }
  }

  public removeFromSelectionList(itemToDelete: SceneNode): void {
    this.selectionList = this.selectionList.filter((item: SceneNode) => {
      return item.id !== itemToDelete.id;
    });
  }

  public getSelectionList(): SceneNode[] {
    return this.selectionList;
  }
}

export default Store.getInstance();
