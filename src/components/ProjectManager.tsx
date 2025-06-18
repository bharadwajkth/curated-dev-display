
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { Project, useProjects } from "../hooks/useProjects";

const ProjectForm = ({ 
  project, 
  onSave, 
  onCancel 
}: { 
  project?: Project; 
  onSave: (project: Omit<Project, 'id'>) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    techStack: project?.techStack.join(', ') || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Project Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
      />
      <Textarea
        placeholder="Project Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        required
      />
      <Input
        placeholder="Image URL"
        value={formData.image}
        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
        required
      />
      <Input
        placeholder="Tech Stack (comma separated: React, Node.js, etc.)"
        value={formData.techStack}
        onChange={(e) => setFormData(prev => ({ ...prev, techStack: e.target.value }))}
        required
      />
      <Input
        placeholder="Live Demo URL"
        value={formData.liveUrl}
        onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
        required
      />
      <Input
        placeholder="GitHub URL"
        value={formData.githubUrl}
        onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
        required
      />
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          {project ? 'Update' : 'Add'} Project
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const ProjectManager = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
            onClick={() => setEditingProject(null)}
          >
            <Plus size={16} className="mr-2" />
            Manage Projects
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProject ? 'Edit Project' : 'Manage Projects'}
            </DialogTitle>
          </DialogHeader>
          
          {editingProject ? (
            <ProjectForm 
              project={editingProject} 
              onSave={handleSave} 
              onCancel={handleCancel} 
            />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Your Projects</h3>
                <Button 
                  onClick={() => setEditingProject({} as Project)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Plus size={16} className="mr-2" />
                  Add New Project
                </Button>
              </div>
              
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-slate-800 border-slate-700">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(project)}
                            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProject(project.id)}
                            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
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
              
              {editingProject && Object.keys(editingProject).length === 0 && (
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Add New Project</h3>
                  <ProjectForm onSave={handleSave} onCancel={handleCancel} />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManager;
