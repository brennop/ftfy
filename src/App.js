import React, { useState, useEffect } from 'react';
import { Layout } from './styles';
import 'typeface-inter';
import Create from './components/Create';
import SignIn from './components/SignIn';
import Entry from './components/Entry';
import { getEntries } from './services/api';

function App() {
  const [entries, setEntries] = useState([]);
  const key = localStorage.getItem('key');

  useEffect(() => {
    if (key) {
      getEntries().then(setEntries);
    }
  }, [key]);

  return <Layout>{key ? <> <Create /> {entries.map(entry => <Entry key={entry.id} {...entry} />)} </> : <SignIn />}</Layout>;
}

export default App;
