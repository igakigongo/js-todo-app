import ProjectsRepository from './projects-repository';
import TodosRepository from './todos-repository';

/**
 * DataStore - Manages mapping between Local Storage and InMemoryModels
 */

const DataStore = (() => {
  let repoOfProjects;
  let repoOfTodos;

  const projectsRepo = () => {
    if (!repoOfProjects) {
      repoOfProjects = new ProjectsRepository(ProjectsRepository.KEY);
    }
    return repoOfProjects;
  };

  const todosRepo = () => {
    if (!repoOfTodos) {
      repoOfTodos = new TodosRepository(TodosRepository.KEY);
    }
    return repoOfTodos;
  };

  return {
    projectsRepository: projectsRepo(),
    todosRepository: todosRepo(),
  };
})();


export default DataStore;