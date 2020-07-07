import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useProjects } from "../context/Projects";

const Indicator = styled(motion.div)`
  height: 8px;
  width: 8px;
  border-radius: 50%;
`;

const Project = ({ id }) => {
  const projects = useProjects();

  const color = projects.find((project) => project.id === id)?.color;

  return <Indicator animate={{ backgroundColor: color }}></Indicator>;
};

export default Project;
