import GenericRepository from './generic-repository';
import Todo from '../models/todo';

// make sure the key cannot be over-written
const key = 'JUBEI-TODO-APP-TODOS-REPOSITORY';

class TodosRepository extends GenericRepository {
  constructor(key) {
    super(key);
    const itemsFromLocalStorage = localStorage.getItem(key);
    if (!itemsFromLocalStorage) {
      localStorage.setItem(key, JSON.stringify([]));
      return;
    }

    const itemsAsJson = JSON.parse(itemsFromLocalStorage);
    this.items = itemsAsJson.map(item => Todo.parse(item));
  }

  static get KEY() {
    return key;
  }

  // description = null, dueDate = null, priority = null, title = null
  update(id, options) {
    const { index } = this.indexOf(id);
    if (index === -1) return;

    const {
      description, dueDate, priority, title,
    } = options;
    if (description) this.items[index].description = description;
    if (dueDate) this.items[index].dueDate = dueDate;
    if (priority) this.items[index].priority = priority;
    if (title) this.items[index].title = title;
  }
}

export default TodosRepository;