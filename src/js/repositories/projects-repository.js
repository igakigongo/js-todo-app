import GenericRepository from './generic-repository';
import Project from '../models/project';

// make sure the key cannot be over-written
const key = 'JUBEI-TODO-APP-PROJECTS-REPOSITORY';

class ProjectsRepository extends GenericRepository {
  constructor(key) {
    super(key);
    const itemsFromLocalStorage = localStorage.getItem(key);
    if (!itemsFromLocalStorage) {
      const id = this.maxId + 1;
      this.add(new Project(new Date(), id, 'Default'));
      return;
    }

    const itemsAsJson = JSON.parse(itemsFromLocalStorage);
    this.items = itemsAsJson.map(item => Project.parse(item));
  }

  static get KEY() {
    return key;
  }

  update(id, options) {
    const { index } = this.indexOf(id);
    if (index === -1) return;
    const { name } = options;
    if (name) this.items[index].name = name;
  }
}

export default ProjectsRepository;