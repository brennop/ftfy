import React from "react";
import styled from "@emotion/styled";
import { FaPlus } from "react-icons/fa";
import { startTimer } from "../services/api";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";
import { encode } from "../utils/base64";
import chrono from "chrono-node";

const Container = styled.form`
  background: #f0f0f0;
  padding: 1em;
  border-radius: 12px;
  height: 4em;
  box-shadow: 0 4px 8px -4px #00000010;
  display: flex;
  align-items: center;

  & > * {
    margin: 0.5em;
  }
`;

const Input = styled.input`
  border: none;
  border-radius: 8px;
  flex: 1;
  padding: 0.4em 0.8em;
  font-size: 16px;
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

const Create = ({ onSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const { value } = event.target.elements.description;

    const [parsedDate] = chrono.pt.parse(value);

    const description = value.replace(parsedDate?.text, "");

    const entry = {
      description,
      start: dayjs(parsedDate?.start?.date()).toISOString(),
      end: parsedDate?.end
        ? dayjs(parsedDate?.end?.date()).toISOString()
        : undefined,
    };

    startTimer(entry).then(onSubmit);

    const url = `${window.location.host}/${encode(entry)}`;
    copy(url);
  };

  return (
    <Container onSubmit={handleSubmit}>
      <Input name="description" autoFocus />
      <Submit>
        <FaPlus />
      </Submit>
    </Container>
  );
};

export default Create;
