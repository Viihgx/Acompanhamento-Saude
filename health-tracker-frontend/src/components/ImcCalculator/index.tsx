import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import ProgressChart from "../ProgressChart";
import PieChart from "../PieChart";
import DietAndObstaclesChart from "../Charts/DietAndObstaclesChart"; // Importação do gráfico atualizado
import "./ImcCalculator.css";
import QuickHistory from "../QuickHistory.tsx";
import HealthTips from "../HealthTips";
import Incentives from "../Incentives";

export default function ImcCalculator() {
  const [dashboardData, setDashboardData] = useState<{
    imc: string;
    tips: string;
  } | null>(null);
  const [progressData, setProgressData] = useState<{
    dates: string[];
    imcValues: number[];
    weights: number[];
    dietQuality: string[];
    obstacles: string[];
  }>({
    dates: [],
    imcValues: [],
    weights: [],
    dietQuality: [],
    obstacles: [],
  });
  const [categories, setCategories] = useState<{
    [key: string]: number;
  } | null>(null);

  // Estado para o QuickHistory
  const [historyData, setHistoryData] = useState<{
    treino: number;
    alimentacao: string;
    obstaculos: string;
  }>({
    treino: 0,
    alimentacao: "Sem registro",
    obstaculos: "Nenhum",
  });

  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      api
        .get("/dashboard", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setDashboardData(response.data))
        .catch((err) => console.error("Erro ao carregar dashboard:", err));

      api
        .get("/progress", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          const {
            dates,
            imcValues,
            weights,
            dietQuality,
            obstacles,
            lastWeekSummary,
          } = response.data;

          const weeks = dates.map((date: string, index: number) =>
            index === 0 ? "Inicial" : `Semana ${index}`
          );

          setProgressData({
            dates: weeks,
            imcValues: imcValues.map((value: number) => value || 0),
            weights: weights.map((value: number) => value || 0),
            dietQuality: dietQuality.map(
              (item: string) => item || "Sem registro"
            ),
            obstacles: obstacles.map(
              (item: string) => item || "Nenhum obstáculo"
            ),
          });

          setHistoryData({
            treino: lastWeekSummary.daysExercised || 0,
            alimentacao: String(
              lastWeekSummary.healthyEating || "Sem registro"
            ), // Converte para string
            obstaculos: lastWeekSummary.lastWeekObstacles || "Nenhum",
          });
        })
        .catch((err) => console.error("Erro ao carregar progresso:", err));

        api
        .get("/user", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setUserName(response.data.name))
        .catch((err) => console.error("Erro ao carregar usuário:", err));

      api
        .get("/imc-categories", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setCategories(response.data.categories))
        .catch((err) =>
          console.error("Erro ao carregar categorias do IMC:", err)
        );
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleCheckInClick = () => {
    if (!token) {
      alert("Você precisa estar logado para acessar essa funcionalidade.");
      navigate("/login");
    } else {
      navigate("/acompanhamento");
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="calculator-container">
        <div className="title-user">
          <h3>Olá, {userName || "Visitante"}!</h3>
          </div>
        <div className="btn-ckeck">
        <button className="btn-checkin" onClick={handleCheckInClick}>
          Fazer Check-in Semanal
        </button>
        </div>
      
      </div>

      <div className="charts-row">
        {/* Substituí o gráfico de peso pelo DietAndObstaclesChart */}
        <div className="chart-card">
          <ProgressChart
            dates={progressData.dates}
            imcValues={progressData.imcValues}
          />
        </div>
        <div className="chart-card calendar">
          <QuickHistory data={historyData} />
        </div>
      </div>

      <div className="full-width-row">
        <div className="chart-card-progress">
          <DietAndObstaclesChart
            dietQuality={progressData.dietQuality}
            obstacles={progressData.obstacles}
            weeks={progressData.dates} // Corrigido para usar `weeks`
          />
        </div>
        <div className="chart-card-categories">
          <PieChart categories={categories || {}} />
        </div>
      </div>

      <div className="sidebar">
      <div className="sidebar-section">
        <HealthTips imc={dashboardData?.imc ? parseFloat(dashboardData.imc) : 0} />
      </div>
      <div className="sidebar-section-incentives">
        {dashboardData?.imc && <Incentives imc={parseFloat(dashboardData.imc)} />}
      </div>
      </div>
    </div>
  );
}
