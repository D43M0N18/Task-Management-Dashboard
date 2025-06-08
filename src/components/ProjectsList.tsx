import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { RootState } from '../store/store';
import { addProject, deleteProject, switchProject, updateProject, Project } from '../store/projectsSlice';

const ProjectsList: React.FC = () => {
  const dispatch = useDispatch();
  const { projects, currentProjectId } = useSelector((state: RootState) => state.projects);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      dispatch(addProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
      }));
      setNewProjectName('');
      setNewProjectDescription('');
      setIsAddingProject(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length > 1) {
      dispatch(deleteProject(projectId));
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  const handleSaveEdit = () => {
    if (editingProject && editingProject.name.trim()) {
      dispatch(updateProject(editingProject));
      setEditingProject(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Projects</h2>
        <button
          onClick={() => setIsAddingProject(true)}
          className="flex items-center space-x-1 text-primary hover:text-primary-hover"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {isAddingProject && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="space-y-3">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name"
              className="w-full p-2 border rounded bg-white border-gray-300 text-gray-900"
            />
            <textarea
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              placeholder="Project Description"
              className="w-full p-2 border rounded bg-white border-gray-300 text-gray-900"
              rows={2}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingProject(false)}
                className="px-3 py-1 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-hover"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
              currentProjectId === project.id
                ? 'bg-primary bg-opacity-10 border border-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {editingProject?.id === project.id ? (
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="flex-1 p-1 border rounded bg-white border-gray-300 text-gray-900"
                />
                <button
                  onClick={handleSaveEdit}
                  className="text-green-600 hover:text-green-700"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setEditingProject(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div
                  className="flex-1"
                  onClick={() => dispatch(switchProject(project.id))}
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Edit2 size={16} />
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList; 