import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartDataProps {
  dates: string[];
  imcValues: number[];
}

export default function ProgressChart({ dates, imcValues }: ChartDataProps) {
  const data = {
    labels: dates,
    datasets: [
      {
        label: "IMC ao longo do tempo",
        data: imcValues,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)", // Cor de preenchimento◘
        borderColor: "rgb(47,146,207)", // Cor da linha
        tension: 0.4, // Aumenta a curvatura da linha
        pointBackgroundColor: "rgb(47,146,207)", // Cor dos pontos
        pointBorderColor: "#ffffff", // Cor da borda dos pontos
        pointRadius: 5, // Tamanho dos pontos
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true, // Pula labels automaticamente se houver muitas
          maxTicksLimit: 10, // Limita o número máximo de ticks no eixo X
        },
      },
      y: {
         // Começa o eixo Y no zero
      },
    },
  };

  return <Line data={data} options={options} />;
}
