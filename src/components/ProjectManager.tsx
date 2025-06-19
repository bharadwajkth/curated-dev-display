
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Project, useProjects } from "../hooks/useProjects";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";

const ProjectManager = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSave = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    setEditingProject(null);
    setIsAddingNew(false);
    setIsDialogOpen(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsAddingNew(false);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsAddingNew(true);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsAddingNew(false);
    setIsDialogOpen(false);
  };

  return (
    <div className="hidden md:block fixed top-20 right-4 z-30 lg:top-4 lg:z-40">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg text-xs lg:text-sm px-3 py-2 lg:px-4 lg:py-2"
            onClick={() => {
              setEditingProject(null);
              setIsAddingNew(false);
            }}
          >
            <Plus size={14} className="mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Manage Projects</span>
            <span className="sm:hidden">Projects</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 w-[95vw] md:w-full z-50">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProject ? 'Edit Project' : isAddingNew ? 'Add New Project' : 'Manage Projects'}
            </DialogTitle>
          </DialogHeader>
          
          {(editingProject || isAddingNew) ? (
            <ProjectForm 
              project={editingProject || undefined} 
              onSave={handleSave} 
              onCancel={handleCancel} 
            />
          ) : (
            <ProjectList
              projects={projects}
              onEdit={handleEdit}
              onDelete={deleteProject}
              onAddNew={handleAddNew}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManager;
