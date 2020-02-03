import PriorityLevel from './priority-level';

class TodoItem {
  constructor(description, dueDate, id, priority, projectId, title) {
    if (!projectId) throw Error('Invalid Project');
    if (!title) throw Error('Invalid title');
    this.createdOn = new Date();
    this.description = description || null;
    this.dueDate = dueDate || null;
    this.id = id;
    this.priority = priority || PriorityLevel.LOW;
    this.projectId = projectId;
    this.title = title.trim();
  }

  asJsonSerializable() {
    const serializableObject = {
      createdOn: this.createdOn,
      description: this.description,
      dueDate: this.dueDate,
      id: this.id,
      priority: this.priority,
      projectId: this.projectId,
      title: this.title,
    };
    return serializableObject;
  }
}

export default TodoItem;