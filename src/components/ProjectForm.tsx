import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, X, Image as ImageIcon } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Project } from "../hooks/useFirebaseProjects";

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
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(project?.image || '');
  const [uploading, setUploading] = useState(false);
  const [imageMethod, setImageMethod] = useState<'url' | 'upload'>('url');
  
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file (JPG, PNG, GIF, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile || !currentUser) {
      throw new Error('No file selected or user not authenticated');
    }

    setUploading(true);
    
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `projects/${currentUser.uid}/${timestamp}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);
      
      // Upload the file
      console.log('Uploading image to Firebase Storage...');
      const snapshot = await uploadBytes(storageRef, imageFile);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Image uploaded successfully:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let finalImageUrl = formData.image;
      
      // If user selected file upload and has a file, upload it
      if (imageMethod === 'upload' && imageFile) {
        finalImageUrl = await uploadImage();
      }
      
      // Validate required fields
      if (!formData.title.trim()) {
        toast({
          title: "Validation Error",
          description: "Project title is required",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.description.trim()) {
        toast({
          title: "Validation Error",
          description: "Project description is required",
          variant: "destructive",
        });
        return;
      }
      
      if (!finalImageUrl.trim()) {
        toast({
          title: "Validation Error",
          description: "Project image is required",
          variant: "destructive",
        });
        return;
      }

      onSave({
        ...formData,
        image: finalImageUrl,
        techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean),
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Project Title *</Label>
            <Input
              id="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-white">Project Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
              className="bg-slate-800 border-slate-600 text-white resize-none"
            />
          </div>
          
          <div>
            <Label htmlFor="techStack" className="text-white">Tech Stack *</Label>
            <Input
              id="techStack"
              placeholder="React, Node.js, PostgreSQL, etc."
              value={formData.techStack}
              onChange={(e) => setFormData(prev => ({ ...prev, techStack: e.target.value }))}
              required
              className="bg-slate-800 border-slate-600 text-white"
            />
            <p className="text-sm text-gray-400 mt-1">Separate technologies with commas</p>
          </div>
          
          <div>
            <Label htmlFor="liveUrl" className="text-white">Live Demo URL *</Label>
            <Input
              id="liveUrl"
              placeholder="https://your-project.com"
              value={formData.liveUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
              required
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="githubUrl" className="text-white">GitHub URL *</Label>
            <Input
              id="githubUrl"
              placeholder="https://github.com/username/repo"
              value={formData.githubUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
              required
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-white">Project Image *</Label>
            <Tabs value={imageMethod} onValueChange={(value) => setImageMethod(value as 'url' | 'upload')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="url" className="data-[state=active]:bg-slate-600">
                  <Link className="w-4 h-4 mr-2" />
                  Image URL
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-slate-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-3">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <p className="text-sm text-gray-400">Paste an image URL from the web</p>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-3">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-300 mb-2">Click to upload an image</p>
                    <p className="text-sm text-gray-400">PNG, JPG, GIF up to 5MB</p>
                  </label>
                </div>
                {imageFile && (
                  <div className="text-sm text-gray-300">
                    Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white">Preview</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearImage}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-slate-600"
                  onError={() => {
                    setImagePreview('');
                    toast({
                      title: "Invalid Image",
                      description: "Failed to load image. Please check the URL or try a different image.",
                      variant: "destructive",
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-3 pt-4 border-t border-slate-700">
        <Button 
          type="submit" 
          disabled={uploading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex-1"
        >
          {uploading ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              {project ? 'Update' : 'Add'} Project
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={uploading}
          className="border-gray-400 text-gray-300 hover:bg-white hover:text-gray-900 flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;