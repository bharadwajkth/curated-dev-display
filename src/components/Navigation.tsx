
import { useState } from "react";
import { Menu, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Project, useProjects } from "../hooks/useProjects";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { projects, addProject, updateProject, deleteProject } = useProjects();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const handleSave = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    setEditingProject(null);
    setIsAddingNew(false);
    setIsProjectDialogOpen(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsAddingNew(false);
    setIsProjectDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsAddingNew(true);
    setIsProjectDialogOpen(true);
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsAddingNew(false);
    setIsProjectDialogOpen(false);
  };

  const handleManageProjects = () => {
    setEditingProject(null);
    setIsAddingNew(false);
    setIsProjectDialogOpen(true);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm z-40 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Portfolio
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-slate-700/50 rounded-md"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-sm z-30 relative">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left hover:bg-slate-700/50 rounded-md transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={handleManageProjects}
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium w-full text-left hover:bg-slate-700/50 rounded-md transition-colors duration-200 flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Manage Projects
            </button>
          </div>
        </div>
      )}

      {/* Project Management Dialog for Mobile */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
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
    </nav>
  );
};

export default Navigation;
