import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, LogIn, LogOut } from "lucide-react";
import { Project, useFirebaseProjects } from "../hooks/useFirebaseProjects";
import { useAuth } from '../contexts/AuthContext';
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import LoginModal from "./LoginModal";
import { useToast } from "@/hooks/use-toast";

const ProjectManager = () => {
  const { projects, addProject, updateProject, deleteProject, isAuthenticated } = useFirebaseProjects();
  const { currentUser, logout } = useAuth();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { toast } = useToast();

  const handleSave = async (projectData: Omit<Project, 'id'>) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        toast({
          title: "Success",
          description: "Project updated successfully!",
        });
      } else {
        await addProject(projectData);
        toast({
          title: "Success",
          description: "Project added successfully!",
        });
      }
      setEditingProject(null);
      setIsAddingNew(false);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsAddingNew(false);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setEditingProject(null);
    setIsAddingNew(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsAddingNew(false);
    setIsDialogOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="hidden md:block fixed top-20 right-4 z-50 lg:top-4">
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-xs text-gray-300 hidden lg:inline">
                Welcome, {currentUser?.email}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <LogOut size={14} className="mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setShowLoginModal(true)}
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              <LogIn size={14} className="mr-1" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
          
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
                  onDelete={handleDelete}
                  onAddNew={handleAddNew}
                  isAuthenticated={isAuthenticated}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default ProjectManager;