import React, { useState, useEffect } from 'react';
import { Layout } from './styles';
import 'typeface-inter';
import Create from './components/Create';
import SignIn from './components/SignIn';
import Entry from './components/Entry';
import { getEntries, startTimer } from './services/api';

const search = new URLSearchParams(window.location.search)
const entry = atob(search.get('data'))

function App() {
  const [entries, setEntries] = useState([]);
  const key = localStorage.getItem('key');

  useEffect(() => {
    if (key) {
      getEntries().then(setEntries);
    }
  }, [key]);

  useEffect(() => {
    if(entry && key) {
      window.history.pushState({}, null, '/');

      startTimer(JSON.parse(entry))
    }
  }, [key]);

  return <Layout>{key ? <> <Create /> {entries.map(entry => <Entry key={entry.id} {...entry} />)} </> : <SignIn />}</Layout>;
}

export default App;
