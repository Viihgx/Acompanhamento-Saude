import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import "./App.css";
import AppRoutes from "./components/routes";

function App() {
  return (
    <Router>
      <div className="app-container">
        <ConditionalSidebar />
        <Content>
          <AppRoutes />
        </Content>
      </div>
    </Router>
  );
}

// Componente para exibir o Sidebar apenas em rotas específicas
function ConditionalSidebar() {
  const location = useLocation();

  // Rotas onde o Sidebar não deve aparecer
  const noSidebarRoutes = ["/", "/register"];

  // Exibe o Sidebar somente se a rota atual não estiver na lista
  if (noSidebarRoutes.includes(location.pathname)) {
    return null;
  }

  return <Sidebar />;
}

export default App;
