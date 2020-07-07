import React, { createContext, useState, useEffect, useContext } from "react";
import { getTags } from "../services/api";

const TagsContext = createContext([]);

export const TagsProvider = ({ children }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  return <TagsContext.Provider value={tags}>{children}</TagsContext.Provider>;
};

export function useTags() {
  return useContext(TagsContext);
}
