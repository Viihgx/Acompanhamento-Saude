import React, { useState, useEffect } from "react";
import api from "../../services/api";

const PopupEmail: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem("popupSeen");
    if (!isFirstVisit) {
      setShowPopup(true);
    }
  }, []);

  const handleAccept = async () => {
    const email = prompt("Digite seu e-mail para receber atualizações semanais:");
    if (email) {
      try {
        await api.post("/register", { email, receiveEmails: true });
        alert("Inscrição registrada com sucesso!");
        localStorage.setItem("popupSeen", "true");
        setShowPopup(false);
      } catch (error) {
        console.error("Erro ao registrar e-mail:", error);
        alert("Erro ao registrar e-mail. Tente novamente.");
      }
    }
  };

  const handleDecline = () => {
    localStorage.setItem("popupSeen", "true");
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div style={popupStyles}>
      <h3>Quer receber atualizações semanais?</h3>
      <p>Cadastre seu e-mail para receber dicas e acompanhar seu progresso!</p>
      <button onClick={handleAccept}>Aceitar</button>
      <button onClick={handleDecline}>Não, obrigado</button>
    </div>
  );
};

const popupStyles: React.CSSProperties = {
  position: "fixed",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -20%)",
  backgroundColor: "#fff",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  zIndex: 1000,
};

export default PopupEmail;
