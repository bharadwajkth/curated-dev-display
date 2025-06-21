import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

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

export const useFirebaseProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('title'));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      
      if (projectsData.length === 0) {
        // If no projects in Firestore, use default projects
        setProjects(defaultProjects);
      } else {
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to default projects on error
      setProjects(defaultProjects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (project: Omit<Project, 'id'>) => {
    if (!currentUser) {
      throw new Error('You must be logged in to add projects');
    }

    try {
      const docRef = await addDoc(collection(db, 'projects'), project);
      const newProject = { id: docRef.id, ...project };
      setProjects(prev => [...prev, newProject]);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!currentUser) {
      throw new Error('You must be logged in to update projects');
    }

    try {
      await updateDoc(doc(db, 'projects', id), updates);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    if (!currentUser) {
      throw new Error('You must be logged in to delete projects');
    }

    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    isAuthenticated: !!currentUser
  };
};