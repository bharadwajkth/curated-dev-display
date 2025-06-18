
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

const ProjectCard = ({ title, description, image, techStack, liveUrl, githubUrl }: ProjectCardProps) => {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 group">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-300 mb-4 leading-relaxed">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {techStack.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-slate-700/50 text-gray-300 rounded-full text-sm border border-slate-600"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-4">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2 flex-1"
            onClick={() => window.open(liveUrl, '_blank')}
          >
            <ExternalLink size={16} />
            Live Demo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-400 text-gray-300 hover:bg-white hover:text-gray-900 flex items-center gap-2 flex-1"
            onClick={() => window.open(githubUrl, '_blank')}
          >
            <Github size={16} />
            Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
