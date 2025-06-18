
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "../hooks/useProjects";

interface ProjectFormProps {
  project?: Project;
  onSave: (project: Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

const ProjectForm = ({ project, onSave, onCancel }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    techStack: project?.techStack?.join(', ') || '',
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

export default ProjectForm;
