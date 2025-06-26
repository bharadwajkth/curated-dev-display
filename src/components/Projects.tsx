import ProjectCard from "./ProjectCard";
import { useFirebaseProjects } from "../hooks/useFirebaseProjects";
import { useEffect } from "react";

const Projects = () => {
  const { projects, loading, refetchProjects } = useFirebaseProjects();

  // Refresh projects when component mounts
  useEffect(() => {
    console.log('Projects component mounted, current projects:', projects);
  }, [projects]);

  if (loading) {
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
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-slate-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-700 rounded mb-3"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded mb-4 w-3/4"></div>
                  <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-6 w-16 bg-slate-700 rounded-full"></div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <div className="h-8 bg-slate-700 rounded flex-1"></div>
                    <div className="h-8 bg-slate-700 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  console.log('Rendering projects:', projects);

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
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects found. Add some projects to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                techStack={project.techStack}
                liveUrl={project.liveUrl}
                githubUrl={project.githubUrl}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;