import { useState } from "react";
import { Menu, X, Plus, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project, useFirebaseProjects } from "../hooks/useFirebaseProjects";
import { useAuth } from '../contexts/AuthContext';
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import LoginModal from "./LoginModal";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { projects, addProject, updateProject, deleteProject, isAuthenticated } = useFirebaseProjects();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

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
      setIsProjectDialogOpen(false);
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
    setIsProjectDialogOpen(true);
  };

  const handleAddNew = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setEditingProject(null);
    setIsAddingNew(true);
    setIsProjectDialogOpen(true);
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
    setIsProjectDialogOpen(false);
  };

  const handleManageProjects = () => {
    setEditingProject(null);
    setIsAddingNew(false);
    setIsProjectDialogOpen(true);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
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
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm z-40 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Portfolio
              </span>
            </div>
            
            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-baseline space-x-8">
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

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-xs text-gray-300 max-w-32 truncate">
                    {currentUser?.email}
                  </span>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <LogOut size={14} className="mr-1" />
                    Logout
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
                  Login
                </Button>
              )}
              
              <Button 
                onClick={handleManageProjects}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg text-sm px-4 py-2"
              >
                <Plus size={14} className="mr-2" />
                Projects
              </Button>
            </div>
            
            {/* Mobile menu button */}
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

        {/* Mobile Navigation */}
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
              
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-400">
                    Welcome, {currentUser?.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-white block px-3 py-2 text-base font-medium w-full text-left hover:bg-slate-700/50 rounded-md transition-colors duration-200 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsOpen(false);
                  }}
                  className="text-blue-400 hover:text-white block px-3 py-2 text-base font-medium w-full text-left hover:bg-slate-700/50 rounded-md transition-colors duration-200 flex items-center"
                >
                  <LogIn size={16} className="mr-2" />
                  Admin Login
                </button>
              )}
              
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
      </nav>

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
              onDelete={handleDelete}
              onAddNew={handleAddNew}
              isAuthenticated={isAuthenticated}
            />
          )}
        </DialogContent>
      </Dialog>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Navigation;