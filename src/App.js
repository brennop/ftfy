import React, { useState, useEffect } from "react";
import { Layout } from "./styles";
import "typeface-inter";
import Create from "./components/Create";
import SignIn from "./components/SignIn";
import Entry from "./components/Entry";
import { getEntries, startTimer } from "./services/api";
import { decode } from "./utils/base64";

function App() {
  const [entries, setEntries] = useState([]);
  const key = localStorage.getItem("key");

  useEffect(() => {
    if (key) {
      getEntries().then((entries) => {
        setEntries(entries);
      });

      const entry = window.location.pathname.slice(1);

      if (entry) {
        window.history.pushState({}, null, "/");

        decode(entry).then(startTimer).then(addEntry);
      }
    }
  }, [key]);

  const addEntry = (entry) => {
    setEntries((entries) => [entry, ...entries]);
  };

  return (
    <Layout>
      {key ? (
        <>
          <Create onSubmit={addEntry} />
          {entries.map((entry) => (
            <Entry key={entry.id} {...entry} />
          ))}
        </>
      ) : (
        <SignIn />
      )}
    </Layout>
  );
}

export default App;
