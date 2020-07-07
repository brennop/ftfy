import React, { useState, useEffect } from "react";
import { Layout } from "./styles";
import "typeface-inter";
import Create from "./components/Create";
import SignIn from "./components/SignIn";
import Entry from "./components/Entry";
import { getEntries, startTimer } from "./services/api";
import { decode } from "./utils/base64";
import { AnimatePresence } from "framer-motion";
import { ProjectsProvider } from "./context/Projects";
import { TagsProvider } from "./context/Tags";

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

        decode(entry)
          .then(startTimer)
          .then(addEntry)
          .catch((error) => console.error(error));
      }
    }
  }, [key]);

  const addEntry = (entry) => {
    setEntries((entries) => [entry, ...entries]);
  };

  const removeEntry = (id) => {
    setEntries((entries) => entries.filter((entry) => entry.id !== id));
  };

  const updateEntry = (updated) => {
    setEntries((entries) =>
      entries.map((entry) => (entry.id === updated.id ? updated : entry))
    );
  };

  return (
    <Layout>
      {key ? (
        <ProjectsProvider>
          <TagsProvider>
            <Create onSubmit={addEntry} />
            <div
              style={{
                position: "relative",
                height: 80 * entries.length + "px",
              }}
            >
              <AnimatePresence>
                {entries.map((entry, index) => (
                  <Entry
                    index={index}
                    key={entry.id}
                    onDelete={removeEntry}
                    updateEntry={updateEntry}
                    {...entry}
                  />
                ))}
              </AnimatePresence>
            </div>
          </TagsProvider>
        </ProjectsProvider>
      ) : (
        <SignIn />
      )}
    </Layout>
  );
}

export default App;
