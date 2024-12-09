import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DietAndObstaclesChart({
  dietQuality,
  obstacles,
  weeks,
}: {
  dietQuality: string[];
  obstacles: string[];
  weeks: string[];
}) {
  // Dados do gráfico com valores fixos para uniformidade
  const chartData = {
    labels: weeks.map((date, index) => `Semana ${index + 1}`),
    datasets: [
      {
        label: "Qualidade da Alimentação",
        data: weeks.map(() => 1), // Define todas as barras com valor fixo
        backgroundColor: "rgb(47,146,207)", // Cor azul
      },
      {
        label: "Obstáculos",
        data: weeks.map(() => 1), // Define todas as barras com valor fixo
        backgroundColor: "#ff8c00", // Cor vermelha
      },
    ],
  };

  // Opções do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const datasetLabel = context.dataset.label;

            if (datasetLabel === "Qualidade da Alimentação") {
              return `Qualidade: ${dietQuality[index] || "Sem registro"}`;
            }
            if (datasetLabel === "Obstáculos") {
              return `Obstáculo: ${obstacles[index] || "Nenhum obstáculo"}`;
            }
            return "";
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        display: false, // Oculta os números no eixo Y
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
