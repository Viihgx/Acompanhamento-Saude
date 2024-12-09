import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressChart from "../../components/ProgressChart";
import PieChart from "../../components/PieChart";
import WeightChart from "../../components/WeightChart";
import api from "../../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progressData, setProgressData] = useState<{ dates: string[]; imcValues: number[] }>({
    dates: [],
    imcValues: [],
  });
  const [weightData, setWeightData] = useState<{ dates: string[]; weights: number[] }>({
    dates: [],
    weights: [],
  });
  const [categoryData, setCategoryData] = useState<{ [key: string]: number }>({});
  const [weightComparisonText, setWeightComparisonText] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);

      // Carregar dados do progresso
      api
        .get("/progress", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const { dates, imcValues, weights } = response.data;
          setProgressData({ dates, imcValues });
          setWeightData({ dates, weights });
          setCategoryData(generateCategoryData(imcValues));
          generateWeightComparisonText(weights, dates);
        })
        .catch((err) => console.error("Erro ao carregar progresso:", err));
    }
  }, [navigate]);

  const generateCategoryData = (imcValues: number[]) => {
    const categories = { Normal: 0, Sobrepeso: 0, Obesidade: 0, "Abaixo do Peso": 0 };
    imcValues.forEach((imc) => {
      if (imc < 18.5) categories["Abaixo do Peso"]++;
      else if (imc >= 18.5 && imc < 25) categories["Normal"]++;
      else if (imc >= 25 && imc < 30) categories["Sobrepeso"]++;
      else categories["Obesidade"]++;
    });
    return categories;
  };

  const generateWeightComparisonText = (weights: number[], dates: string[]) => {
    if (weights.length < 2) {
      setWeightComparisonText("Continue registrando seus pesos para visualizar comparações.");
      return;
    }

    let comparison = "Comparação de Pesos ao longo do tempo:\n";
    weights.forEach((weight, index) => {
      comparison += `Data ${new Date(dates[index]).toLocaleDateString()}: Peso: ${weight} kg\n`;
    });

    const latestWeight = weights[weights.length - 1];
    const previousWeight = weights[weights.length - 2];

    comparison += latestWeight < previousWeight
      ? "Parabéns! Seu peso está reduzindo."
      : latestWeight > previousWeight
      ? "Seu peso aumentou. Considere ajustar sua dieta e exercícios."
      : "Seu peso está estável. Continue assim!";

    setWeightComparisonText(comparison);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-item">
          <h2 className="dashboard-item-title">Progresso do IMC</h2>
          <ProgressChart dates={progressData.dates} imcValues={progressData.imcValues} />
        </div>

        <div className="dashboard-item">
          <h2 className="dashboard-item-title">Proporção de Categorias do IMC</h2>
          <PieChart categories={categoryData} />
        </div>

        <div className="dashboard-item">
          <h2 className="dashboard-item-title">Progresso do Peso</h2>
          <WeightChart dates={weightData.dates} weights={weightData.weights} />
        </div>

        <div className="dashboard-item">
          <h2 className="dashboard-item-title">Comparação de Pesos</h2>
          <pre className="comparison-text">{weightComparisonText}</pre>
        </div>
      </div>
    </div>
  );
}
