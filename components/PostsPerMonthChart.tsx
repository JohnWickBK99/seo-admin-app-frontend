"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface MonthStat {
  month: string; // e.g. "Jan 2024"
  total: number;
}

export default function PostsPerMonthChart({ data }: { data: MonthStat[] }) {
  const labels = data.map((d) => d.month);
  const counts = data.map((d) => d.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Posts",
        data: counts,
        backgroundColor: "rgba(59,130,246,0.5)", // Tailwind blue-500 at 50%
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Posts per Month (last 6 months)",
      },
    },
  };

  return <Bar options={options} data={chartData} />;
}
