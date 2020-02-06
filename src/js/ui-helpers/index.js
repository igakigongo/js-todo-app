import PriorityLevel from '../models/priority-level';
import DataStore from '../repositories';

const sortByValue = (array, prop = 'value') => {
  if (array && array.length === 0) return array;
  return array.sort((a, b) => {
    const [aString, bString] = [a, b].map(x => x[prop].toString());
    if (aString < bString) return -1;
    if (aString > bString) return 1;
    return 0;
  });
};

const createButton = (options) => {
  const { classes, text } = options;
  const button = document.createElement('button');
  if (classes && classes.length > 0) {
    button.classList.add(...classes);
  }
  button.innerText = text;
  return button;
};

const createInputField = (options) => {
  const {
    classes, id, placeholder, type, value,
  } = options;

  const allClasses = ['form-control', 'my-2'];
  const input = document.createElement('input');
  if (classes && classes.length > 0) {
    allClasses.push(...classes);
  }
  input.classList.add(...allClasses);
  input.setAttribute('id', id);
  input.setAttribute('type', type);
  input.setAttribute('placeholder', placeholder || '');
  input.value = value || '';
  return input;
};

const createSelectList = (options) => {
  const {
    classes, id, items, selected,
  } = options;
  const allClasses = ['form-control', 'my-2'];
  if (classes && classes.length !== 0) {
    allClasses.push(...classes);
  }
  const selectList = document.createElement('select');
  selectList.classList.add(...allClasses);
  selectList.setAttribute('id', id);
  sortByValue(items, 'value').forEach(item => {
    const { text, value } = item;
    const option = document.createElement('option');
    option.text = text;
    option.value = value;
    if (option.value === selected) {
      option.selected = true;
    }
    selectList.appendChild(option);
  });
  return selectList;
};

const createTitle = (text) => {
  const titleComponent = document.createElement('h6');
  titleComponent.style.fontWeight = 'bold';
  titleComponent.innerText = text;
  return titleComponent;
};

const createForm = () => {
  const form = document.createElement('form');
  form.classList.add('pb-5');
  form.setAttribute('method', 'post');
  return form;
};

const createFormControls = () => {
  const controlsDiv = document.createElement('div');
  controlsDiv.classList.add('col-12');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');

  const saveButton = createButton({ classes: ['btn', 'btn-primary', 'btn-sm', 'col-5'], text: 'Save' });
  saveButton.setAttribute('value', 'Save');
  const cancelButton = createButton({ classes: ['btn', 'btn-secondary', 'btn-sm', 'offset-2', 'col-5'], text: 'Cancel' });
  cancelButton.setAttribute('value', 'Cancel');
  rowDiv.append(saveButton, cancelButton);
  controlsDiv.append(rowDiv);
  return controlsDiv;
};

export const createAddTodoForm = () => {
  const form = createForm();

  const formTitle = createTitle('Add Todo');

  const titleInput = createInputField({ id: 'title', type: 'text', placeholder: 'Title' });

  const descriptionInput = createInputField({ id: 'description', type: 'text', placeholder: 'Description' });

  const dueDateInput = createInputField({ id: 'dueDate', type: 'date' });

  const projects = DataStore.projectsRepository.findAll().map(x => ({
    text: x.name,
    value: x.id,
  }));
  const projectsSelectList = createSelectList({ id: 'projectId', items: projects });

  const priorities = Object.getOwnPropertyNames(PriorityLevel).map((name) => ({
    text: PriorityLevel[name],
    value: PriorityLevel[name],
  }));

  const prioritiesSelectList = createSelectList({
    id: 'priority',
    items: priorities,
  });

  // wrap buttons in a div (wrapper)
  const controlsDiv = createFormControls();

  // append all controls to the form
  form.append(formTitle, titleInput, descriptionInput, projectsSelectList, dueDateInput,
    prioritiesSelectList, controlsDiv);
  return form;
};

export const createEditTodoForm = (todoItem) => {
  const {
    description, dueDate, id, priority, projectId, title,
  } = todoItem;
  const form = createForm();
  const formTitle = createTitle('Edit Todo Item');
  formTitle.classList.add('text-center');

  const hiddenId = document.createElement('input');
  hiddenId.setAttribute('type', 'hidden');
  hiddenId.value = id;

  const titleInput = createInputField({ id: 'title', type: 'text', placeholder: 'Title' });
  titleInput.value = title;

  const descriptionInput = createInputField({ id: 'description', type: 'text', placeholder: 'Description' });
  descriptionInput.value = description;

  const dueDateInput = createInputField({ id: 'dueDate', type: 'date' });
  dueDateInput.value = dueDate;

  const projects = DataStore.projectsRepository.findAll().map(x => ({
    text: x.name,
    value: x.id,
  }));
  const projectsSelectList = createSelectList({ id: 'projectId', items: projects, selected: `${projectId}` });

  const priorities = Object.getOwnPropertyNames(PriorityLevel).map((name) => ({
    text: PriorityLevel[name],
    value: PriorityLevel[name],
  }));

  const prioritiesSelectList = createSelectList({
    id: 'priority',
    items: priorities,
    selected: priority,
  });

  // wrap buttons in a div (wrapper)
  const controlsDiv = createFormControls();

  form.append(formTitle, hiddenId, titleInput, descriptionInput, dueDateInput, projectsSelectList,
    prioritiesSelectList, controlsDiv);

  return form;
};

export function clearFormFields() {
  const form = this;
  const [inputFields, selectLists] = [form.querySelectorAll('input'), form.querySelectorAll('select')];
  inputFields.forEach(field => {
    field.value = '';
  });

  selectLists.forEach(selectList => {
    const { id } = selectList;
    if (id === 'priority') {
      selectList.value = PriorityLevel.HIGH;
    } else {
      // set the default project as the selected one
      selectList.value = 1;
    }
  });
}

export function queryFormValuesByName(names) {
  const form = this;
  const obj = Object.create({});
  names.forEach(name => { obj[name] = form.querySelector(`#${name}`).value; });
  return obj;
}