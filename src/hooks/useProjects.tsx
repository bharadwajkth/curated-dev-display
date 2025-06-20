
import { useState, useEffect } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

const defaultProjects: Project[] = [
  {
    id: '1',
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
    techStack: ["React", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com"
  },
  {
    id: '2',
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, drag & drop functionality, and team collaboration features.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
    techStack: ["React", "TypeScript", "Firebase", "Material-UI"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com"
  }
];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    console.log('=== INITIALIZING PROJECTS STATE ===');
    const saved = localStorage.getItem('portfolio-projects');
    console.log('Raw localStorage data:', saved);
    
    if (saved) {
      try {
        const parsedProjects = JSON.parse(saved);
        console.log('Parsed projects from localStorage:', parsedProjects);
        console.log('Number of projects in localStorage:', parsedProjects.length);
        return parsedProjects;
      } catch (error) {
        console.error('Error parsing localStorage projects:', error);
        return defaultProjects;
      }
    } else {
      console.log('No saved projects found, using defaults');
      return defaultProjects;
    }
  });

  useEffect(() => {
    console.log('=== PROJECTS STATE CHANGED ===');
    console.log('Current projects state:', projects);
    console.log('Number of projects:', projects.length);
    console.log('Project titles:', projects.map(p => p.title));
    console.log('Saving to localStorage with key: portfolio-projects');
    localStorage.setItem('portfolio-projects', JSON.stringify(projects));
    
    // Verify it was saved
    const verification = localStorage.getItem('portfolio-projects');
    console.log('Verification - data in localStorage after save:', verification);
  }, [projects]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
    };
    console.log('=== ADDING NEW PROJECT ===');
    console.log('New project data:', newProject);
    
    setProjects(prev => {
      const updated = [...prev, newProject];
      console.log('Previous projects:', prev);
      console.log('Updated projects array after add:', updated);
      console.log('Total projects after add:', updated.length);
      return updated;
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    console.log('=== UPDATING PROJECT ===');
    console.log('Updating project ID:', id);
    console.log('Updates:', updates);
    
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      console.log('Updated projects after edit:', updated);
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    console.log('=== DELETING PROJECT ===');
    console.log('Deleting project ID:', id);
    
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      console.log('Updated projects after delete:', updated);
      console.log('Remaining project count:', updated.length);
      return updated;
    });
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
  };
};
