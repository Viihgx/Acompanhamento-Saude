import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import { FaSignOutAlt, FaCalendarCheck } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "./Sidebar.css";

export default function SideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpa o token do localStorage
    localStorage.removeItem("token");

    // Redireciona para a página de login
    navigate("/");
  };

  return (
    <div className="sidebar-container">
      <div>
        {/* Título e navegação */}
        <div className="top-container">
          <h2 style={{color: "#ff8c00"}} className="title-sidebar">BalançoSaúde</h2>
          <hr />
          <div className="nav-items">
            <NavLink
              to="/imc-calculator"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <MdDashboard className="icon" /> Dashboard
            </NavLink>
            <NavLink
              to="/acompanhamento"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <FaCalendarCheck className="icon" /> Acompanhamento
            </NavLink>
          </div>
        </div>
      </div>

      {/* Botão de logout na parte inferior */}
      <div>
        <hr />
        <button className="logout-botao" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /> Logout
        </button>
      </div>
    </div>
  );
}
