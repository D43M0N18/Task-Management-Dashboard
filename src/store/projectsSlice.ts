import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface ProjectsState {
  projects: Project[];
  currentProjectId: string | null;
}

const initialState: ProjectsState = {
  projects: [
    {
      id: '1',
      name: 'Default Project',
      description: 'Your default project',
      createdAt: new Date().toISOString(),
    },
  ],
  currentProjectId: '1',
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Omit<Project, 'id' | 'createdAt'>>) => {
      const newProject: Project = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      state.projects.push(newProject);
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
      if (state.currentProjectId === action.payload) {
        state.currentProjectId = state.projects[0]?.id || null;
      }
    },
    switchProject: (state, action: PayloadAction<string>) => {
      state.currentProjectId = action.payload;
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
  },
});

export const { addProject, deleteProject, switchProject, updateProject } = projectsSlice.actions;
export default projectsSlice.reducer; 