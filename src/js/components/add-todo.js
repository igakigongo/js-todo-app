import DataStore from '../repositories';
import PriorityLevel from '../models/priority-level';
import Todo from '../models/todo';
import { clearFormFields, createAddTodoForm, queryFormValuesByName } from '../ui-helpers';

const AddTodoComponent = (() => {
  const rootElement = document.querySelector('#key');

  const priorityCssClassMap = new Map();
  priorityCssClassMap.set(4, { className: 'danger', name: PriorityLevel.URGENT });
  priorityCssClassMap.set(3, { className: 'primary', name: PriorityLevel.HIGH });
  priorityCssClassMap.set(2, { className: 'warning', name: PriorityLevel.MEDIUM });
  priorityCssClassMap.set(1, { className: 'success', name: PriorityLevel.LOW });

  // const handleFormSubmission = (evt) => {

  // };

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
        const todoItem = new Todo(description, dueDate, id, priority, +projectId, title);
        DataStore.todosRepository.add(todoItem);
        form.clearFormFields();
      } catch ({ message }) {
        // eslint-disable-next-line no-alert
        alert(message);
      }
    });

    // append all items to the root
    rootElement.append(form, ...priorityButtons);
  };

  return {
    initialize: bootstrapComponent,
  };
})();

export default AddTodoComponent;