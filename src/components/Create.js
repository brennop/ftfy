import React from 'react';
import styled from '@emotion/styled';
import { FaPlay } from 'react-icons/fa';

const Container = styled.form`
  background: #f0f0f0;
  padding: 1em;
  border-radius: 12px;
  height: 4em;
  box-shadow: 0 0 16px 8px #00000008;
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

const Emoji = styled.span`
  cursor: pointer;
`

const Submit = styled.button`
  background: #12e746;
  border-radius: 50%;
  border: none;
  height: 40px;
  width: 40px;
  box-shadow: 0 0 16px 8px #00000008;
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

  svg {
    transform: translate(2px, 0);
  }
`;

const Create = () => {
  return (
    <Container>
      <Emoji>🍉</Emoji>
      <Input />
      <Submit>
        <FaPlay />
      </Submit>
    </Container>
  );
};

export default Create;
