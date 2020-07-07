import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";

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

  background: ${(props) => (props.focused ? "#eee" : "none")};
`;

const normalize = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const includes = (a, b) => normalize(a).includes(normalize(b));

const Suggestions = ({
  onSelect,
  input,
  setValue,
  trigger,
  value,
  suggestions,
  itemRenderer,
}) => {
  const [show, setShow] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [focused, setFocused] = useState(0);

  useEffect(() => {
    const handleClick = () => {
      setShow(false);
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const { current } = input;

    const handleKey = (event) => {
      if (show) {
        const { key, shiftKey } = event;
        switch (key) {
          case "ArrowDown":
            setFocused((amount) => Math.min(amount + 1, filtered.length - 1));
            event.preventDefault();
            break;
          case "ArrowUp":
            setFocused((amount) => Math.max(amount - 1, 0));
            event.preventDefault();
            break;
          case "Tab":
            shiftKey
              ? setFocused((amount) => Math.max(amount - 1, 0))
              : setFocused((amount) =>
                  Math.min(amount + 1, filtered.length - 1)
                );
            event.preventDefault();
            break;
          case "Enter":
            event.preventDefault();
            const regex = new RegExp(`${trigger}([^ ]*)`);
            setValue((value) => value.replace(regex, ""));
            onSelect(filtered[focused]);
            break;
          default:
        }
      }
    };

    current.addEventListener("keydown", handleKey);

    return () => current.removeEventListener("keydown", handleKey);
  }, [input, filtered, focused, onSelect, show, trigger, setValue]);

  useEffect(() => {
    setFocused(0);

    if (value.includes("@")) {
      setShow(true);
      setFiltered(
        suggestions
          .filter((suggestion) =>
            includes(suggestion.name, value.split("@")[1])
          )
          .slice(0, 5)
      );
    } else {
      setShow(false);
    }
  }, [suggestions, value]);

  return input.current
    ? createPortal(
        show && (
          <Box>
            <List>
              {filtered.map((suggestion, index) => (
                <Item key={suggestion.id} focused={index === focused}>
                  {itemRenderer(suggestion)}
                </Item>
              ))}
            </List>
          </Box>
        ),
        input.current
      )
    : null;
};

export default Suggestions;
