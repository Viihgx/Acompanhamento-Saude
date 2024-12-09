import React from "react";
import "./HealthTips.css";

interface HealthTipsProps {
  imc: number;
}

const HealthTips: React.FC<HealthTipsProps> = ({ imc }) => {
  let tips;

  if (imc < 18.5) {
    tips = [
      { text: "Aumente sua ingestão calórica com alimentos saudáveis." },
      { text: "Consulte um nutricionista para um plano de ganho de peso." },
      {
        text: "Tente aplicativos como MyFitnessPal para acompanhar sua dieta.",
        app: "MyFitnessPal",
        appLink: "https://www.myfitnesspal.com/",
        showApp: true, // Exibe o nome do app apenas nesta dica
      },
    ];
  } else if (imc >= 18.5 && imc <= 24.9) {
    tips = [
      { text: "Continue mantendo sua dieta equilibrada." },
      {
        text: "Pratique exercícios regularmente para manter sua saúde.",
        app: "Nike Training Club",
        appLink: "https://www.nike.com/ntc-app",
      },
      {
        text: "Experimente o aplicativo Nike Training Club para treinos guiados.",
        app: "Nike Training Club",
        appLink: "https://www.nike.com/ntc-app",
        showApp: true,
      },
    ];
  } else if (imc >= 25 && imc <= 29.9) {
    tips = [
      { text: "Reduza o consumo de carboidratos simples e alimentos processados." },
      {
        text: "Adicione exercícios aeróbicos à sua rotina.",
        app: "Lose It!",
        appLink: "https://www.loseit.com/",
      },
      {
        text: "Tente o aplicativo Lose It! para monitorar calorias e exercícios.",
        app: "Lose It!",
        appLink: "https://www.loseit.com/",
        showApp: true,
      },
    ];
  } else {
    tips = [
      { text: "Considere um plano estruturado para perda de peso." },
      { text: "Foque em alimentos integrais e evite bebidas açucaradas." },
      {
        text: "Experimente o aplicativo Noom para suporte na perda de peso.",
        app: "Noom",
        appLink: "https://www.noom.com/",
        showApp: true,
      },
    ];
  }

  return (
    <div className="health-tips-container">
      <h3>Cuidados Personalizados</h3>
      <div className="tips-list">
        {tips.map((tip, index) => (
          <div className="tip-item" key={index}>
            <div className="icon-star">★</div>
            <div className="tip-content">
              <p>{tip.text}</p>
              {tip.showApp && tip.app && (
                <a
                  href={tip.appLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-link"
                >
                  {tip.app}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthTips;
