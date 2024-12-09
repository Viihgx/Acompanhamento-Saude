import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { ChartData } from "chart.js";
import axios from "axios";

const ObjectivesAndSuccessChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<"radar"> | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/objectives-success", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { objectivesCounts, successCounts } = response.data;

        setChartData({
          labels: Object.keys(objectivesCounts),
          datasets: [
            {
              label: "Objetivos",
              data: Object.values(objectivesCounts),
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              borderColor: "rgba(76, 175, 80, 1)",
              borderWidth: 2,
            },
            {
              label: "Alvo Alcançado",
              data: Object.values(successCounts),
              backgroundColor: "rgba(33, 150, 243, 0.2)",
              borderColor: "rgba(33, 150, 243, 1)",
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchChartData();
  }, []);

  if (!chartData) return <p>Carregando gráfico...</p>;

  return (
    <div>
      <h2>Objetivos e Sucesso Alcançado</h2>
      <Radar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
          scales: {
            r: {
              angleLines: { display: true },
              suggestedMin: 0,
            },
          },
        }}
      />
    </div>
  );
};

export default ObjectivesAndSuccessChart;
