import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue, } from "firebase/database";

function DatabaseManager() {
  const [databaseName, setDatabaseName] = useState("bee_data");
  const [dataRef, setDataRef] = useState(ref(database, "bee_data"));
  const [placasDisponiveis, setPlacasDisponiveis] = useState([]);
  const topLevelEntriesRef = ref(database, "/");

  useEffect(() => {
    onValue(topLevelEntriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const topLevelEntries = Object.keys(snapshot.val());
        setPlacasDisponiveis(topLevelEntries);
      }
    });
  }, []);

  return (
    <div className="App">
      <main className="Main-Body">
        <div id="btns">
        <h2>Selecione o nome da placa que deseja gerenciar: </h2>
          <select
            className="styled-textfield"
            value={databaseName}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length > 0) {
                setDataRef(ref(database, newValue));
              }
              setDatabaseName(newValue);
            }}
          >
            {placasDisponiveis.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div id="btns">
          
        </div>
      </main>
    </div>
  );
}

export default DatabaseManager;