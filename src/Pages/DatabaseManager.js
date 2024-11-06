import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue, set } from "firebase/database";

function DatabaseManager() {
  const [databaseName, setDatabaseName] = useState("bee_data");
  const [dataRef, setDataRef] = useState(ref(database, "bee_data"));
  const [placasDisponiveis, setPlacasDisponiveis] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });

  const topLevelEntriesRef = ref(database, "/");

  useEffect(() => {
    onValue(topLevelEntriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const topLevelEntries = Object.keys(snapshot.val());
        setPlacasDisponiveis(topLevelEntries);
        setDatabaseName(topLevelEntries[0]);
      }
    });
  }, []);

  useEffect(() => {
    setDataRef(ref(database, databaseName));
  }, [placasDisponiveis]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDeleteAll = () => {
    set(dataRef, "")
      .then(() => {
        setAlert({
          visible: true,
          message: "Dados deletados com sucesso!",
          type: "success",
        });
        setIsModalOpen(false);
      })
      .catch((error) => {
        setAlert({
          visible: true,
          message: "Erro ao tentar deletar os dados!",
          type: "error",
        });
      });
  };

  const closeAlert = () => setAlert({ ...alert, visible: false });

  return (
    <div className="App">
      <main className="Main-Body">
        <div id="btns">
          <h2>Selecione o nome da placa que deseja gerenciar:</h2>
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
          <button onClick={openModal}>Deletar Dados</button>
        </div>
        <div id="btns">
         O que colocar aqui?
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Atenção!!!</h3>
              <p>
                Você tem certeza de que gostaria de deletar todos os dados da
                placa {databaseName} ?
              </p>
              <button onClick={handleDeleteAll}>Sim, quero deletar</button>
              <button onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        )}

        {alert.visible && (
          <div
            className={`alert ${
              alert.type === "success" ? "alert-success" : "alert-error"
            }`}
            style={{ position: "absolute", top: '27vh', right: 20 }}
          >
            {alert.message}
            <button
              onClick={closeAlert}
              style={{ marginLeft: "10px" }}
            >
              x
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default DatabaseManager;
