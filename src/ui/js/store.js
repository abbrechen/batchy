class Store {
  static instance;
  constructor() {
    this.listeners = [];
    this.selectionList = [];
    this.isSelectionEmpty = null;
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  notifyListeners(property, newValue) {
    this.listeners.forEach(listener => {
      listener(property, newValue);
    });
  }

  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  replaceSelectionList(newList) {
    this.selectionList = [...newList]
    this.notifyListeners('selectionList', this.selectionList);
    // console.log('list on UI side', this.selectionList)
  }

  getSelectionList() {
    return this.selectionList;
  }

  setIsSelectionEmpty(v) {
    this.isSelectionEmpty = v;
    this.notifyListeners('isSelectionEmpty', this.isSelectionEmpty);
  }

  getIsSelectionEmpty() {
    return this.isSelectionEmpty;
  }
}

export default Store.getInstance();
