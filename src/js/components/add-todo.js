import DataStore from '../repositories';
import PriorityLevel from '../models/priority-level';
import Todo from '../models/todo';
import { clearFormFields, createAddTodoForm, queryFormValuesByName } from '../ui-helpers';
import EventType from '../event-types';

const AddTodoComponent = (() => {
  const rootElement = document.querySelector('#key');

  const priorityCssClassMap = new Map();
  priorityCssClassMap.set(4, { className: 'danger', name: PriorityLevel.URGENT });
  priorityCssClassMap.set(3, { className: 'primary', name: PriorityLevel.HIGH });
  priorityCssClassMap.set(2, { className: 'warning', name: PriorityLevel.MEDIUM });
  priorityCssClassMap.set(1, { className: 'success', name: PriorityLevel.LOW });

  const createPriorityButton = (key) => {
    const { className, name: priority } = priorityCssClassMap.get(key);

    const span = document.createElement('span');
    span.classList.add('badge', 'badge-light', 'mr-2');
    span.innerText = key;

    const text = document.createElement('span');
    text.innerText = priority;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-block', 'btn-sm', `btn-${className}`, 'font-weight-bold', 'my-2', 'text-left');
    button.append(span, text);

    return button;
  };

  const bootstrapComponent = () => {
    // create priority buttons
    const priorityButtons = [...priorityCssClassMap.keys()].sort((a, b) => b - a)
      .map(createPriorityButton);

    // create form
    const form = createAddTodoForm();
    form.clearFormFields = clearFormFields.bind(form);
    form.queryFormValuesByName = queryFormValuesByName.bind(form);

    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const viewModel = evt.target.queryFormValuesByName(['description', 'dueDate',
        'priority', 'projectId', 'title']);
      const {
        description, dueDate, priority, projectId, title,
      } = viewModel;
      try {
        const id = DataStore.todosRepository.maxId + 1;
        const todoItem = new Todo(new Date(), description, dueDate, id,
          priority, +projectId, title);
        DataStore.todosRepository.add(todoItem);
        form.clearFormFields();
        const event = new CustomEvent(EventType.TODO_ITEM_CREATED, { detail: { todoItem } });
        document.dispatchEvent(event);
      } catch ({ message }) {
        // eslint-disable-next-line no-alert
        alert(message);
      }
    });

    // append all items to the root
    rootElement.append(form, ...priorityButtons);
  };

  const removeProjectFromSelectableProjects = (projectId) => {
    const selectList = rootElement.querySelector('#projectId');
    if (!selectList) return;
    const id = (typeof projectId) === 'number' ? `${projectId}` : projectId;
    for (let i = 0; i < selectList.options.length;) {
      const optionElement = selectList.options[i];
      if (optionElement.value === id) {
        selectList.removeChild(optionElement);
        break;
      }
      i += 1;
    }
  };

  const updateListOfSelectableProjects = (project) => {
    const selectList = rootElement.querySelector('#projectId');
    if (!selectList) return;
    const { id, name } = project;
    const optionElement = document.createElement('option');
    optionElement.text = name;
    optionElement.value = id;
    selectList.options.add(optionElement);
  };

  return {
    initialize: bootstrapComponent,
    removeProject: removeProjectFromSelectableProjects,
    updateProjectsSelectList: updateListOfSelectableProjects,
  };
})();

export default AddTodoComponent;