class GenericRepository {
  constructor(key) {
    if (!key) throw Error('Repository key is required');
    this.key = key;
    this.items = [];
  }

  add(item) {
    this.items = [item, ...this.items];
    this.syncStorage();
  }

  delete(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.syncStorage();
  }

  find(itemId) {
    for (let i = 0; i < this.items.length;) {
      if (this.items[i].id === itemId) {
        return this.items[i];
      }
      i += 1;
    }
    return null;
  }

  findAll() {
    return this.items;
  }

  indexOf(id) {
    for (let i = 0; i < this.items.length;) {
      if (this.items[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  syncStorage() {
    if (!window.localStorage) return;
    const serializableItems = this.items.map(item => item.asJsonSerializable());
    localStorage.setItem(this.key, JSON.stringify(serializableItems));
  }
}

export default GenericRepository;