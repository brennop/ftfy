import React, { useState } from 'react';
import { Layout } from './styles';
import 'typeface-inter'
import Create from './components/Create';
import SignIn from './components/SignIn'

function App() {
  const key = localStorage.getItem('key');

  return (
    <Layout>
    {key ?
      <Create key={key} />
    :
    <SignIn />
    }
    </Layout>
  );
}

export default App;
