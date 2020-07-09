import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { FaPlus } from "react-icons/fa";
import { startTimer } from "../services/api";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";
import { encode } from "../utils/base64";
import chrono from "chrono-node";
import Project from "./Project";
import Suggestions from "./Suggestions";
import { useProjects } from "context/Projects";
import { useTags } from "context/Tags";
import Tags from "./Tags";

const Container = styled.form`
  background: #e8eaec;
  padding: 1em;
  border-radius: 12px;
  height: 4em;
  box-shadow: 0 4px 8px -4px #00000020;
  display: flex;
  align-items: center;

  & > * {
    margin: 0.5em;
  }
`;

const Submit = styled.button`
  background: #5496f2;
  border-radius: 50%;
  border: none;
  height: 40px;
  width: 40px;
  box-shadow: 0 0 8px 0px #5496f240;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: 0.2s ease-in;

  :hover {
    box-shadow: 0 0 12px 8px #00000010;
  }
`;

const Input = styled.input`
  background: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4em 0.8em;
  font-size: 16px;
  width: 100%;
`;

const InputContainer = styled.div`
  flex: 1;
`;

const ProjectSuggestion = styled.span`
  color: ${(props) => props.color};
`;

const Create = ({ onSubmit }) => {
  const [project, setProject] = useState();
  const [value, setValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const projects = useProjects();
  const tags = useTags();

  const input = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();

    const { value } = event.target.elements.description;

    const [parsedDate, parsedDateEnd] = chrono.pt.parse(value);

    const description = value
      .replace(parsedDate?.text, "")
      .replace(parsedDateEnd?.text, "");

    const end = parsedDate?.end?.date() || parsedDateEnd?.start.date();

    const entry = {
      description,
      projectId: project,
      tagIds: selectedTags,
      start: dayjs(parsedDate?.start?.date()).toISOString(),
      end: end && dayjs(end).toISOString(),
    };

    startTimer(entry).then(onSubmit);

    const url = `${window.location.origin}/${encode(entry)}`;
    copy(url);
  };

  return (
    <>
      <Container onSubmit={handleSubmit}>
        <Project id={project} />
        <Tags ids={selectedTags} />
        <InputContainer ref={input}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            name="description"
            autoFocus
            autoComplete="off"
          />
        </InputContainer>
        <Suggestions
          onSelect={({ id }) => setProject(id)}
          input={input}
          value={value}
          setValue={setValue}
          suggestions={projects}
          trigger="@"
          itemRenderer={(project) => (
            <ProjectSuggestion {...project}>{project.name}</ProjectSuggestion>
          )}
        />
        <Suggestions
          onSelect={(tag) => setSelectedTags([...selectedTags, tag.id])}
          input={input}
          value={value}
          setValue={setValue}
          suggestions={tags}
          trigger="#"
          itemRenderer={(tag) => <span>{tag.name}</span>}
        />
        <Submit>
          <FaPlus />
        </Submit>
      </Container>
    </>
  );
};

export default Create;

