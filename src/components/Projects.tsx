
import ProjectCard from "./ProjectCard";

const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce platform with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
      techStack: ["React", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com"
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag & drop functionality, and team collaboration features.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
      techStack: ["React", "TypeScript", "Firebase", "Material-UI"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com"
    },
    {
      title: "Weather Dashboard",
      description: "A responsive weather dashboard with location-based forecasts, interactive maps, and historical weather data visualization.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop",
      techStack: ["React", "Chart.js", "OpenWeather API", "CSS Grid"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com"
    },
    {
      title: "Social Media App",
      description: "A social media platform with real-time messaging, post sharing, and user profiles. Built with modern web technologies.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop",
      techStack: ["Next.js", "MongoDB", "Socket.io", "Cloudinary"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com"
    },
    {
      title: "Portfolio Website",
      description: "A responsive portfolio website showcasing projects and skills with smooth animations and modern design principles.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&h=300&fit=crop",
      techStack: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com"
    },
    {
      title: "AI Chat Application",
      description: "An intelligent chat application powered by AI with natural language processing and context-aware responses.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
      techStack: ["React", "Python", "OpenAI API", "FastAPI"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com"
    }
  ];

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
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              image={project.image}
              techStack={project.techStack}
              liveUrl={project.liveUrl}
              githubUrl={project.githubUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
