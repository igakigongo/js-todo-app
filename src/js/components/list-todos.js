import PriorityLevel from '../models/priority-level';
import DataStore from '../repositories';
import { createEditTodoForm, queryFormValuesByName } from '../ui-helpers';

const ListTodosComponent = (() => {
  const rootElement = document.querySelector('#todos-list');

  /**
   * Only called when we need to re-render a todoItem after canceling edit action
   * is invoked from the UI
   */
  const handleRenderTodo = (evt) => {
    evt.preventDefault();
    const { id } = evt.target.dataset;
    const todoItem = DataStore.todosRepository.find(+id);
    // eslint-disable-next-line no-use-before-define
    const todoDOMElement = createTodoItemDOMElement(todoItem);
    const oldChildDOMElement = rootElement.querySelector(`#todo-${id}`);
    rootElement.replaceChild(todoDOMElement, oldChildDOMElement);
  };

  /**
   * Handle update todo Item then rebuild that part of the UI
   * @param {MouseEvent} evt
   */
  const handleUpdateTodo = (evt) => {
    evt.preventDefault();
    const form = evt.target;
    const id = form.querySelector('input[type="hidden"]').value;
    const options = form.queryFormValuesByName(['description', 'dueDate',
      'priority', 'projectId', 'title']);

    try {
      DataStore.todosRepository.update(+id, options);
      const todoItem = DataStore.todosRepository.find(+id);
      // eslint-disable-next-line no-use-before-define
      const todoDOMElement = createTodoItemDOMElement(todoItem);
      const oldChildDOMElement = rootElement.querySelector(`#todo-${id}`);
      rootElement.replaceChild(todoDOMElement, oldChildDOMElement);
    } catch ({ message }) {
      // eslint-disable-next-line no-alert
      alert(message);
    }
  };

  const renderEditTodoForm = (id) => {
    const todo = DataStore.todosRepository.find(id);
    const editForm = createEditTodoForm(todo);
    const shellElement = rootElement.querySelector(`#shell-todo-${id}`);
    while (shellElement.firstChild) {
      shellElement.removeChild(shellElement.firstChild);
    }
    shellElement.appendChild(editForm);
    const [saveButton, cancelButton] = ['Save', 'Cancel']
      .map(value => shellElement.querySelector(`button[value="${value}"]`));
    cancelButton.dataset.id = id;
    saveButton.dataset.id = id;

    cancelButton.addEventListener('click', handleRenderTodo);
    editForm.queryFormValuesByName = queryFormValuesByName.bind(editForm);
    editForm.addEventListener('submit', handleUpdateTodo);
  };

  /**
   * Remove a todo node from the DOM, do not rebuild, simply find and delete it
   * @param {string} id
   */
  const removeTodoItem = (id) => {
    DataStore.todosRepository.delete(id);
    const todoDOMNode = rootElement.querySelector(`#todo-${id}`);
    todoDOMNode.parentElement.removeChild(todoDOMNode);
  };

  /**
   * Get the text and background colors pair based on priority level
   * @param {PriorityLevel} todoPriority
   */
  const getCssClasses = (todoPriority) => {
    switch (todoPriority) {
      case PriorityLevel.URGENT:
        return ['bg-danger', 'text-white'];
      case PriorityLevel.HIGH:
        return ['bg-primary', 'text-white'];
      case PriorityLevel.MEDIUM:
        return ['bg-warning', 'text-dark'];
      default:
        return ['bg-success', 'text-dark'];
    }
  };

  const createTodoItemFooterDOMElement = (todoItem) => {
    const { id, priority, projectId } = todoItem;
    const { name } = DataStore.projectsRepository.find(projectId);

    const iconsWrapper = document.createElement('div');

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('align-self-end', 'fa', 'fa-fw', 'fa-trash-o');
    deleteIcon.dataset.id = id;
    deleteIcon.style.cursor = 'pointer';
    deleteIcon.title = 'Delete Todo';
    deleteIcon.addEventListener('click', (evt) => {
      const { id } = evt.target.dataset;
      removeTodoItem(+id);
    });

    const editIcon = document.createElement('i');
    editIcon.classList.add('fa', 'fa-fw', 'fa-pencil');
    editIcon.dataset.id = id;
    editIcon.style.cursor = 'pointer';
    editIcon.title = 'Edit Todo';
    editIcon.addEventListener('click', (evt) => {
      const { id } = evt.target.dataset;
      renderEditTodoForm(+id);
    });

    const span = document.createElement('span');
    const cardFooter = document.createElement('div');

    span.innerText = name;
    const [backgroundCss, textCss] = getCssClasses(priority);
    cardFooter.classList.add('card-footer', 'd-flex', 'justify-content-between',
      `${backgroundCss}`, 'font-weight-bold', `${textCss}`);

    iconsWrapper.append(editIcon, deleteIcon);
    cardFooter.append(span, iconsWrapper);
    return cardFooter;
  };

  const createTodoItemTitleDOMElement = ({ id, title }) => {
    const span = document.createElement('span');
    span.innerText = title;

    const icon = document.createElement('icon');
    icon.classList.add('fa', 'fa-chevron-circle-left');
    icon.setAttribute('aria-controls', `shell-todo-${id}`);
    icon.setAttribute('aria-expanded', false);
    icon.setAttribute('data-target', `#shell-todo-${id}`);
    icon.setAttribute('data-toggle', 'collapse');
    icon.style.fontSize = 'smaller';
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', (evt) => {
      const { target } = evt;
      if ([...target.classList].includes('fa-chevron-circle-left')) {
        target.classList.remove('fa-chevron-circle-left');
        target.classList.add('fa-chevron-circle-down');
      } else {
        target.classList.remove('fa-chevron-circle-down');
        target.classList.add('fa-chevron-circle-left');
      }
    });

    const h2 = document.createElement('h2');
    h2.classList.add('d-flex', 'justify-content-between');


    h2.append(span, icon);
    return h2;
  };

  const createTodoItemBodyDOMElement = (todoItem) => {
    const { description, dueDate, id } = todoItem;
    const titleElement = createTodoItemTitleDOMElement(todoItem);
    const shellElement = document.createElement('div');
    shellElement.classList.add('collapse');
    shellElement.setAttribute('id', `shell-todo-${id}`);

    const dueDateElement = document.createElement('h6');
    dueDateElement.classList.add('font-weight-bold', 'text-center', 'text-primary');
    dueDateElement.innerText = `Due on: ${dueDate}`;
    shellElement.appendChild(dueDateElement);

    if (description) {
      const descriptionElement = document.createElement('p');
      descriptionElement.innerText = description;
      shellElement.appendChild(descriptionElement);
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    cardBody.append(titleElement, shellElement);
    return cardBody;
  };

  function createTodoItemDOMElement(todoItem) {
    const { id } = todoItem;

    const col = document.createElement('div');
    col.classList.add('col-12', 'col-lg-4', 'mb-3', 'todo');
    col.setAttribute('id', `todo-${id}`);

    const card = document.createElement('div');
    card.classList.add('card', 'border-bottom', 'shadow');

    const cardBody = createTodoItemBodyDOMElement(todoItem);

    // create a footer with its elements
    const cardFooter = createTodoItemFooterDOMElement(todoItem);

    card.append(cardBody, cardFooter);
    col.appendChild(card);
    return col;
  }

  const appendTodoItemOnUserInterface = (todoItem) => {
    const todoDOMElement = createTodoItemDOMElement(todoItem);
    const firstChildNode = rootElement.firstChild;
    if (firstChildNode) {
      rootElement.insertBefore(todoDOMElement, firstChildNode);
      return;
    }
    rootElement.appendChild(todoDOMElement);
  };

  const removeTodos = (projectId) => DataStore.todosRepository
    .where(projectId)
    .map(todo => todo.id)
    .forEach(removeTodoItem);

  const bootstrapComponent = () => DataStore.todosRepository
    .findAll()
    .forEach((todo, index) => setTimeout(() => {
      appendTodoItemOnUserInterface(todo);
    }, (index + 1) * 200));

  return {
    addTodoItem: appendTodoItemOnUserInterface,
    initialize: bootstrapComponent,
    removeTodosAssociatedWith: removeTodos,
  };
})();

export default ListTodosComponent;