
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
    const saved = localStorage.getItem('portfolio-projects');
    const initialProjects = saved ? JSON.parse(saved) : defaultProjects;
    console.log('Initial projects loaded:', initialProjects);
    return initialProjects;
  });

  useEffect(() => {
    console.log('Projects state updated, saving to localStorage:', projects);
    localStorage.setItem('portfolio-projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
    };
    console.log('Adding new project:', newProject);
    setProjects(prev => {
      const updated = [...prev, newProject];
      console.log('Updated projects array:', updated);
      return updated;
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    console.log('Updating project:', id, updates);
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      console.log('Updated projects after edit:', updated);
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    console.log('Deleting project:', id);
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      console.log('Updated projects after delete:', updated);
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
