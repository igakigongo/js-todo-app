import '../css/app.scss';
import ProjectsNavigationComponent from './components/projects-navigation';
import AddTodoComponent from './components/add-todo';
import EventType from './event-types';
import ListTodosComponent from './components/list-todos';

// Assume this to be an application module that runs as soon as it's loaded in
// the browser

document.addEventListener('DOMContentLoaded', () => {
  ProjectsNavigationComponent.initialize();
  AddTodoComponent.initialize();
  ListTodosComponent.initialize();
});

document.addEventListener(EventType.PROJECT_CREATED, (evt) => {
  const { project } = evt.detail;
  AddTodoComponent.updateProjectsSelectList(project);
});

document.addEventListener(EventType.TODO_ITEM_CREATED, (evt) => {
  const { todoItem } = evt.detail;
  ListTodosComponent.addTodoItem(todoItem);
});