class Store {
  static instance;
  constructor() {
    this.selectionList = [];
  }

  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  replaceSelectionList(newList) {
    this.selectionList = [...newList]
    // console.log('list on UI side', this.selectionList)
  }

  getSelectionList() {
    return this.selectionList;
  }
}

export default Store.getInstance();
