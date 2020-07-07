import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useTags } from "context/Tags";

const Tag = styled(motion.div)`
  background: #c0cdea;
  border-radius: 4px;
  color: #000040a0;
  font-weight: bold;
  font-size: 12px;
  padding: 0.3em 0.5em;

  ::before {
    content: "#";
  }
`;

const Tags = ({ ids }) => {
  const tags = useTags();

  return ids && tags
    ? ids.map((id) => (
        <Tag animate={{ scale: 1 }} initial={{ scale: 0 }} key={id}>
          {tags.find((tag) => tag.id === id).name}
        </Tag>
      ))
    : null;
};

export default Tags;
