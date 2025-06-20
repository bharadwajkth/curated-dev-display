
import ProjectCard from "./ProjectCard";
import { useProjects } from "../hooks/useProjects";

const Projects = () => {
  const { projects } = useProjects();

  console.log('=== PROJECTS COMPONENT RENDER ===');
  console.log('Projects received from hook:', projects);
  console.log('Number of projects to render:', projects.length);

  // Debug function to check localStorage
  const checkLocalStorage = () => {
    const stored = localStorage.getItem('portfolio-projects');
    console.log('=== LOCALSTORAGE DEBUG ===');
    console.log('Raw localStorage data:', stored);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('Parsed localStorage projects:', parsed);
        console.log('LocalStorage project count:', parsed.length);
        console.log('LocalStorage project titles:', parsed.map((p: any) => p.title));
      } catch (e) {
        console.error('Error parsing localStorage:', e);
      }
    } else {
      console.log('No data in localStorage');
    }
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Here are some of the projects I've worked on that showcase my skills and experience
          </p>
          
          {/* Debug button - remove this after debugging */}
          <button 
            onClick={checkLocalStorage}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded text-sm"
          >
            Debug LocalStorage
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            console.log('Rendering project:', project.title, 'ID:', project.id);
            return (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                techStack={project.techStack}
                liveUrl={project.liveUrl}
                githubUrl={project.githubUrl}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
