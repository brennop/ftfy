import React, { useState } from 'react';
import styled from '@emotion/styled';
import { getWorkspaces, getUser } from '../services/api';

const Container = styled.form`
  width: 512px;
  display: flex;
  margin: auto;
  background: #f0f0f0;
  border-radius: 12px;
  padding: 1em;
  & > * {
    margin: 0.5em;
  }
`;

const Input = styled.input`
  border: none;
  border-radius: 8px;
  padding: 0.4em 0.8em;
  margin-left: 0.5em;
`;

const Submit = styled.button`
  border: none;
  border-radius: 8px;
  background: #29d177;
  padding: 0.4em 0.8em;
`;

const List = styled.ul`
  width: 420px;
  margin: 1em auto;

  li {
    cursor: pointer;
  }
`;

const Link = styled.a`
  background: none;
  text-decoration: none;

  &,
  :visited {
    color: black;
  }

  :hover {
    text-decoration: underline;
  }
`;

const SignIn = () => {
  const [workspaces, setWorkspaces] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const key = event.target.elements.key.value;
    localStorage.setItem('key', key);
    getWorkspaces(key).then(setWorkspaces);
    getUser(key).then(user => localStorage.setItem('user', user.id));
  };

  const handleSelect = (id) => {
    localStorage.setItem('workspace', id);
  };

  return (
    <>
      <Container onSubmit={handleSubmit}>
        <label>
          Chave do Clockify:
          <Input autoFocus name="key" />
        </label>
        <Submit type="submit">Seguir</Submit>
      </Container>
      <List>
        {workspaces.map((workspace) => (
          <li key={workspace.id}>
            <Link href="/" onClick={() => handleSelect(workspace.id)}>
              {workspace.name}
            </Link>
          </li>
        ))}
      </List>
    </>
  );
};

export default SignIn;
