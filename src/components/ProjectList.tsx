import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, LogIn } from "lucide-react";
import { Project } from "../hooks/useFirebaseProjects";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  isAuthenticated: boolean;
}

const ProjectList = ({ projects, onEdit, onDelete, onAddNew, isAuthenticated }: ProjectListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Your Projects</h3>
        <Button 
          onClick={onAddNew}
          className={isAuthenticated ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
        >
          {isAuthenticated ? (
            <>
              <Plus size={16} className="mr-2" />
              Add New Project
            </>
          ) : (
            <>
              <LogIn size={16} className="mr-2" />
              Login to Add Projects
            </>
          )}
        </Button>
      </div>
      
      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {projects.map((project) => (
          <Card key={project.id} className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                {isAuthenticated && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(project)}
                      className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(project.id)}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-2">{project.description.substring(0, 100)}...</p>
              <div className="flex flex-wrap gap-1">
                {project.techStack.map((tech, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!isAuthenticated && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">
            Login as admin to add, edit, or delete projects
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;