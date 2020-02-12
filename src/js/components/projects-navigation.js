import DataStore from '../repositories';
import Project from '../models/project';
import EventType from '../event-types';

// Assume this to be an application module that runs as soon as it's loaded in
// the browser
const ProjectsNavigationComponent = (() => {
  const rootElement = document.querySelector('#projects-nav');
  const divContainingForm = rootElement.querySelector('#addProjectForm');
  const createProjectForm = rootElement.querySelector('form');

  const resetErrorsElement = (element) => {
    ['text-danger', 'text-success'].forEach(className => element.classList.remove(className));
    element.innerHTML = '';
  };

  function clear() {
    const form = this;
    const errorsElement = form.querySelector('span');
    const inputElement = form.querySelector('input');

    resetErrorsElement(errorsElement);
    inputElement.value = '';
    return form;
  }

  const displayMessage = (element, message, type = 'success') => {
    switch (type) {
      case 'error':
        element.classList.add('text-danger');
        element.classList.remove('text-success');
        break;

      default:
        element.classList.add('text-success');
        element.classList.remove('text-danger');
        break;
    }

    element.innerHTML = `${message}`;
  };

  const deleteProjectHandler = (evt) => {
    evt.preventDefault();

    const { localName, parentNode } = evt.target;

    /**
     * sometimes the eventTarget is the icon
     * we need to read the id from the dataset of the parent node
     */
    const { id } = localName === 'i' ? parentNode.dataset : evt.target.dataset;
    const listItemNode = localName === 'i' ? parentNode.parentNode : parentNode;

    DataStore.projectsRepository.delete(+id);
    listItemNode.parentNode.removeChild(listItemNode);
    const event = new CustomEvent(EventType.PROJECT_DELETED, {
      detail: {
        id,
      },
    });
    document.dispatchEvent(event);
  };

  function hide() {
    const formDiv = this;
    formDiv.classList.add('collapse');
    formDiv.classList.remove('show');
    return formDiv;
  }

  /**
   * Bind functions to elements
   */
  createProjectForm.clearForm = clear.bind(createProjectForm);
  divContainingForm.thenHideForm = hide.bind(divContainingForm);

  const createProjectListElement = (project) => {
    const span = document.createElement('span');
    span.innerText = project.name;

    let deleteButton;

    if (!project.isDefault) {
      deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'p-2', 'btn-delete');
      deleteButton.innerHTML = '<i class="fa fa-trash fa-fw" aria-hidden="true"></i>';
      deleteButton.setAttribute('data-id', project.id);
      deleteButton.addEventListener('click', deleteProjectHandler);
    }

    const ele = document.createElement('li');
    ele.appendChild(span);
    if (!project.isDefault) { ele.appendChild(deleteButton); }
    ele.classList.add('bg-white', 'font-weight-lighter', 'my-2', 'p-2', 'rounded', 'shadow-lg', 'project');
    return ele;
  };

  createProjectForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const { value: projectName } = createProjectForm.querySelector('#name');
    const spanElement = createProjectForm.querySelector('span');
    resetErrorsElement(spanElement);

    try {
      const id = DataStore.projectsRepository.maxId + 1;
      const project = new Project(new Date(), id, projectName);
      displayMessage(spanElement, 'Project created');

      DataStore.projectsRepository.add(project);
      const listElement = rootElement.querySelector('ul');
      if (listElement.hasChildNodes()) {
        const { firstChild } = listElement;
        listElement.insertBefore(createProjectListElement(project), firstChild);
      } else {
        listElement.appendChild(createProjectListElement(project));
      }
      const event = new CustomEvent(EventType.PROJECT_CREATED, {
        detail: {
          project,
        },
      });
      document.dispatchEvent(event);
      setTimeout(() => {
        createProjectForm.clearForm();
        divContainingForm.thenHideForm();
      }, 1000);
    } catch ({ message }) {
      displayMessage(spanElement, message, 'error');
    }
  });

  const bootstrapApp = () => {
    const projects = DataStore.projectsRepository.findAll();
    const projectListElements = projects.map(createProjectListElement);

    const listElement = document.createElement('ul');
    listElement.classList.add('list-unstyled');
    rootElement.appendChild(listElement);

    projectListElements.forEach((ele, index) => setTimeout(() => {
      listElement.appendChild(ele);
    }, (index + 1) * 200));
  };

  return {
    initialize: bootstrapApp,
  };
})();

export default ProjectsNavigationComponent;