import React from "react";
import "./Incentives.css";

interface IncentivesProps {
  imc: number;
}

const Incentives: React.FC<IncentivesProps> = ({ imc }) => {
  let message;

  if (imc < 18.5) {
    message =
      "Você está abaixo do peso. Continue forte e busque sempre melhorar sua alimentação. Cada passo importa!";
  } else if (imc >= 18.5 && imc <= 24.9) {
    message =
      "Parabéns! Você está com um IMC saudável. Mantenha sua rotina e cuide bem de sua saúde!";
  } else if (imc >= 25 && imc <= 29.9) {
    message =
      "Ótimo esforço! Adotar hábitos saudáveis pode ajudá-lo a melhorar ainda mais sua saúde.";
  } else {
    message =
      "Você é capaz! Pequenas mudanças diárias podem fazer uma grande diferença. Dê um passo de cada vez.";
  }

  return (
    <div className="incentives-container">
      <div className="bubble1"></div>
      <div className="bubble2"></div>
      <div className="bubble3"></div>
      <div className="incentives-background">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Incentives;
