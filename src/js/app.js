import '../css/app.scss';
// import DataStore from './repositories';
// import EventType from './event-types';
import ProjectsNavigationComponent from './components/projects-navigation';

// Assume this to be an application module that runs as soon as it's loaded in
// the browser
const app = (() => {
  const bootstrapApp = () => {
    ProjectsNavigationComponent.initialize();
  };

  return {
    initialize: bootstrapApp,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  app.initialize();
});
