class Project {
  constructor(createdOn, id, name) {
    if (!id) throw Error('Invalid id');
    if (!name) throw Error('Invalid project name');

    this.createdOn = createdOn || new Date();
    this.id = id;
    this.name = name.trim();
  }

  asJsonSerializable() {
    const serializableObject = {
      createdOn: this.createdOn,
      id: this.id,
      name: this.name,
    };

    return serializableObject;
  }

  get isDefault() {
    return this.name === 'Default';
  }

  static parse(anonymousObject, format = 'JSON') {
    switch (format) {
      case 'JSON': {
        const { createdOn, id, name } = anonymousObject;
        return new Project(createdOn, id, name);
      }

      default:
        throw Error('Unsupported format for parsing');
    }
  }
}

export default Project;