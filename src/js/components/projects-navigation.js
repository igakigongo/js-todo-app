// import DataStore from './data-store';
// import EventType from '../event-types';
import DataStore from '../repositories';

// Assume this to be an application module that runs as soon as it's loaded in
// the browser
const ProjectsNavigationComponent = (() => {
  const rootElement = document.querySelector('#projects-nav');

  const createProjectListElement = (project) => {
    const span = document.createElement('span');
    span.innerText = project.name;

    let deleteButton;

    if (!project.isDefault) {
      deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'p-2', 'btn-delete');
      deleteButton.innerHTML = '<i class="fa fa-trash fa-fw" aria-hidden="true"></i>';
    }

    const ele = document.createElement('li');
    ele.appendChild(span);
    if (!project.isDefault) { ele.appendChild(deleteButton); }
    ele.classList.add('bg-white', 'font-weight-lighter', 'my-2', 'p-2', 'rounded', 'shadow-lg', 'project');
    return ele;
  };

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