import React, { useCallback, useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { saveAs } from "file-saver";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const GraficoCombinado = (props) => {
  const graficoRef = useRef(null);

  const options = {
    plugins: {
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true, mode: "y" },
          pinch: { enabled: false },
          drag: { enabled: false },
          limits: { x: { min: null, max: null }, y: { min: null, max: null } },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 20,
          autoSkip: false,
          maxRotation: 0,
          align: "middle",
          callback: function (value, index) {
            const labelsLength = this.chart.data.labels.length;
            return index === 0 || index === labelsLength - 1
              ? this.getLabelForValue(value)
              : "";
          },
        },
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: props.data.datasets[0].label,
        },
        //beginAtZero: true,
        suggestedMax: Math.max(...props.data.datasets[0].data) * 1.2, // Aumenta o valor máximo em 20%
      },

      y1: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: props.data.datasets[1].label,
        },
        //beginAtZero: true,
        suggestedMax: Math.max(...props.data.datasets[1].data) * 1.2, // Aumenta o valor máximo em 20%
        grid: { drawOnChartArea: false },
      },
    },
  };

  const exportCSV = (dados, filename) => {
    const csvRows = [];
    const headers = [
      "Timestamp",
      ...dados.datasets.map((dataset) => dataset.label),
    ];
    csvRows.push(headers.join(","));
    dados.labels.forEach((label, i) => {
      const row = [label];
      dados.datasets.forEach((dataset) => row.push(dataset.data[i]));
      csvRows.push(row.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    saveAs(blob, filename);
  };

  const ResetZoom = useCallback(() => {
    graficoRef.current.resetZoom();
  }, [graficoRef]);

  return (
    <>
      <Bar ref={graficoRef} data={props.data} options={options} />
      <div className="grafico-buttons">
        <button onClick={ResetZoom}>Reset Zoom</button>
        <button onClick={() => exportCSV(props.data, "dados_grafico.csv")}>
          Exportar CSV
        </button>
      </div>
      <p style={{ fontSize: 10 }}>
        *OBS: Utilize o scroll do mouse para dar zoom no gráfico e arraste
        lateralmente clicando
      </p>
    </>
  );
};

export default GraficoCombinado;
