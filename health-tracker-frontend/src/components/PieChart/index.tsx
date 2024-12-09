import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  categories: { [key: string]: number };
}

export default function PieChart({ categories }: PieChartProps) {
  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: ["#FF6384", "rgb(47,146,207)", "#ff8c00", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "rgb(47,146,207)", "#ff8c00", "#4BC0C0"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return <Pie data={data} options={options} />;
}
