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
      // Validate Firebase configuration before making requests
      if (!db) {
        throw new Error('Firebase is not properly initialized. Check your configuration.');
      }

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
      
      // Provide more specific error handling
      if (error instanceof Error) {
        if (error.message.includes('permission-denied') || error.message.includes('insufficient permissions')) {
          console.warn('Firestore permissions issue. Using default projects. Please check your Firebase Security Rules.');
        } else if (error.message.includes('network')) {
          console.warn('Network error. Using default projects. Please check your internet connection.');
        } else {
          console.warn('Firebase error:', error.message);
        }
      }
      
      // Fallback to default projects on any error
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
      throw new Error('Authentication required: You must be logged in to add projects');
    }

    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...project,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      const newProject = { id: docRef.id, ...project };
      setProjects(prev => [...prev, newProject]);
    } catch (error) {
      console.error('Error adding project:', error);
      if (error instanceof Error && error.message.includes('permission-denied')) {
        throw new Error('Permission denied: You do not have permission to add projects');
      }
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!currentUser) {
      throw new Error('Authentication required: You must be logged in to update projects');
    }

    try {
      await updateDoc(doc(db, 'projects', id), {
        ...updates,
        updatedBy: currentUser.uid,
        updatedAt: new Date().toISOString()
      });
      
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (error) {
      console.error('Error updating project:', error);
      if (error instanceof Error && error.message.includes('permission-denied')) {
        throw new Error('Permission denied: You do not have permission to update this project');
      }
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    if (!currentUser) {
      throw new Error('Authentication required: You must be logged in to delete projects');
    }

    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      if (error instanceof Error && error.message.includes('permission-denied')) {
        throw new Error('Permission denied: You do not have permission to delete this project');
      }
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