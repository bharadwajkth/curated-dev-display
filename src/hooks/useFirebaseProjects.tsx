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

// Global state to share between all hook instances
let globalProjects: Project[] = [];
let globalLoading = true;
const subscribers: Array<(projects: Project[], loading: boolean) => void> = [];

// Function to notify all subscribers
const notifySubscribers = () => {
  subscribers.forEach(callback => callback([...globalProjects], globalLoading));
};

// Function to update global state
const updateGlobalProjects = (projects: Project[], loading: boolean = false) => {
  globalProjects = [...projects];
  globalLoading = loading;
  console.log('Global projects updated:', globalProjects);
  notifySubscribers();
};

export const useFirebaseProjects = () => {
  const [projects, setProjects] = useState<Project[]>(globalProjects);
  const [loading, setLoading] = useState(globalLoading);
  const { currentUser } = useAuth();

  // Subscribe to global state changes
  useEffect(() => {
    const callback = (newProjects: Project[], newLoading: boolean) => {
      console.log('Hook received global update:', newProjects);
      setProjects(newProjects);
      setLoading(newLoading);
    };

    subscribers.push(callback);

    // Cleanup subscription
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects from Firebase...');
      updateGlobalProjects(globalProjects, true); // Set loading
      
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
      
      console.log('Firebase projects fetched:', projectsData);
      
      // Combine default projects with Firebase projects
      const allProjects = [...defaultProjects, ...projectsData];
      console.log('All projects (default + Firebase):', allProjects);
      
      updateGlobalProjects(allProjects, false);
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
      updateGlobalProjects(defaultProjects, false);
    }
  };

  // Initial fetch only once
  useEffect(() => {
    if (globalProjects.length === 0) {
      fetchProjects();
    }
  }, []);

  const addProject = async (project: Omit<Project, 'id'>) => {
    if (!currentUser) {
      throw new Error('Authentication required: You must be logged in to add projects');
    }

    console.log('Adding new project:', project);

    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...project,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      const newProject = { id: docRef.id, ...project };
      console.log('Project added to Firebase with ID:', docRef.id);
      
      // Update global state immediately
      const updatedProjects = [...globalProjects, newProject];
      updateGlobalProjects(updatedProjects);
      
      console.log('Project added successfully');
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

    console.log('Updating project with ID:', id, 'Updates:', updates);

    try {
      // Check if this is a default project
      if (id === '1' || id === '2') {
        // For default projects, just update global state
        console.log('Updating default project in global state');
        const updatedProjects = globalProjects.map(p => p.id === id ? { ...p, ...updates } : p);
        updateGlobalProjects(updatedProjects);
        return;
      }

      // For Firebase projects, update in Firestore
      await updateDoc(doc(db, 'projects', id), {
        ...updates,
        updatedBy: currentUser.uid,
        updatedAt: new Date().toISOString()
      });
      
      const updatedProjects = globalProjects.map(p => p.id === id ? { ...p, ...updates } : p);
      updateGlobalProjects(updatedProjects);
      
      console.log('Project updated successfully');
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

    console.log('Attempting to delete project with ID:', id);

    try {
      // Check if this is a default project (string ID)
      if (id === '1' || id === '2') {
        // For default projects, just remove from global state
        console.log('Deleting default project from global state');
        const updatedProjects = globalProjects.filter(p => p.id !== id);
        updateGlobalProjects(updatedProjects);
        return;
      }

      // For Firebase projects, delete from Firestore
      console.log('Deleting project from Firebase');
      await deleteDoc(doc(db, 'projects', id));
      
      // Update global state
      const updatedProjects = globalProjects.filter(p => p.id !== id);
      updateGlobalProjects(updatedProjects);
      
      console.log('Project deleted successfully');
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
    isAuthenticated: !!currentUser,
    refetchProjects: fetchProjects
  };
};