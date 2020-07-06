import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useProjects } from "context/Projects";

const Box = styled.div`
  width: 100%;
  position: relative;
`;

const List = styled.ul`
  position: absolute;
  z-index: 1;
  list-style: none;
  background: #fff;
  width: 100%;
`;

const Item = styled.li`
  padding: 0.5em 1em;
  color: ${(props) => props.color};

  background: ${(props) => (props.focused ? "#eee" : "none")};
`;

const Container = styled.div`
  flex: 1;
`;

const Input = styled.div`
  background: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4em 0.8em;
  font-size: 16px;
  width: 100%;
`;

const normalize = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const includes = (a, b) => normalize(a).includes(normalize(b));

const Suggestions = ({ name }) => {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const projects = useProjects();
  const [filtered, setFiltered] = useState(projects);
  const [focused, setFocused] = useState(0);
  const input = useRef();

  const handleChange = (event) => {
    setValue(event.target.innerText);
  };

  const count = () => filtered.length;

  const increaseFocused = () =>
    setFocused((amount) => Math.min(amount + 1, count() - 1));
  const decreaseFocused = () => setFocused((amount) => Math.max(amount - 1, 0));

  useEffect(() => {
    const handleClick = () => {
      setShow(false);
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleKey = (event) => {
    if (show) {
      const { key, shiftKey } = event;
      switch (key) {
        case "ArrowDown":
          increaseFocused();
          event.preventDefault();
          break;
        case "ArrowUp":
          decreaseFocused();
          event.preventDefault();
          break;
        case "Tab":
          shiftKey ? decreaseFocused() : increaseFocused();
          event.preventDefault();
          break;
        case "Enter":
          event.preventDefault();
          input.current.innerHTML =
            value.split("@")[0] +
            "<span>@" +
            filtered[focused].name +
            "</span>";
        default:
      }
    }
  };

  useEffect(() => {
    setFocused(0);

    if (value.includes("@")) {
      setShow(true);
      setFiltered(
        projects
          .filter((project) =>
            includes(project.name, value.split("@")[1].trim())
          )
          .slice(0, 5)
      );
    } else {
      setShow(false);
    }
  }, [value]);

  return (
    <Container>
      <Input
        onKeyDown={handleKey}
        name={name}
        autoFocus
        autoComplete="off"
        onInput={handleChange}
        contentEditable
        ref={input}
      />
      {show && (
        <Box>
          <List>
            {filtered.map((project, index) => (
              <Item
                key={project.id}
                color={project.color}
                focused={index === focused}
              >
                {project.name}
              </Item>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
};

export default Suggestions;
