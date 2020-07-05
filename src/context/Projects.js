import React, { createContext, useState, useEffect, useContext } from "react";
import { getProjects } from "../services/api";

const ProjectsContext = createContext([]);

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <ProjectsContext.Provider value={projects}>
      {children}
    </ProjectsContext.Provider>
  );
};

export function useProjects() {
  return useContext(ProjectsContext);
}
