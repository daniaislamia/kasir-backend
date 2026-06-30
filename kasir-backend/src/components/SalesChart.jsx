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

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SalesChart() {

  const data = {
    labels: [
      "Sen",
      "Sel",
      "Rab",
      "Kam",
      "Jum",
      "Sab",
      "Min",
    ],
    datasets: [
      {
        label: "Penjualan",
        data: [120, 190, 300, 250, 420, 500, 650],
      },
    ],
  };

  return <Line data={data} />;
}

export default SalesChart;