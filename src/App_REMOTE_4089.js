import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ marginBottom: 0 }}>Monitoramento de Colmeias</h1>
        <h3 style={{ marginTop: 0 }}>Dashboard de Dados do Firebase</h3>
        <nav className="navbar">
          <Link to="/" className="nav-link">
            Página Inicial
          </Link>
          <Link to="/database-manager" className="nav-link">
            Gerenciar Banco de Dados
          </Link>
        </nav>
      </header>
      <Outlet />
      <footer>
        <p>&copy; 2024 Universidade Estadual de Campinas.</p>
      </footer>
    </div>
  );
}

export default App;
