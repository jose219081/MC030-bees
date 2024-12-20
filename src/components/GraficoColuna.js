import React, { useCallback, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  PointElement,
} from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { saveAs } from "file-saver";

ChartJS.register(
  zoomPlugin,
  BarElement,
  CategoryScale,
  PointElement
);

function GraficoColuna(props) {
  const graficoRef = useRef(null);
  const options = {
    plugins: {
      zoom: {
        pan: {
          enabled: true, // Enable panning
          mode: "xy", // Allow panning in both axes
        },
        zoom: {
          wheel: {
            enabled: true, // Enable zoom with mouse wheel
            mode: "y",
          },
          pinch: {
            enabled: false, // Disable pinch zoom
          },
          drag: {
            enabled: false, // Disable drag zoom
          },
          limits: {
            x: {
              min: null,
              max: null,
            },
            y: {
              min: null,
              max: null,
            },
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          align: "middle",
          callback: function (value, index) {
            const labelsLength = this.chart.data.labels.length;
            // Show label only for the first and last ticks
            if (index === 0 || index === labelsLength - 1) {
              return this.getLabelForValue(value);
            }
            return "";
          },
        },
      },
      y: {
        beginAtZero: true, // Start the Y axis at zero
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
      dados.datasets.forEach((dataset) => {
        row.push(dataset.data[i]);
      });
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    saveAs(blob, filename);
  };

  const ResetZoom = useCallback(() => {
    graficoRef.current.resetZoom(); // Use the plugin's resetZoom method
  }, [graficoRef]);

  // const ddd = { labels: props.dadosGrafico.labels, datasets: [props.dadosGrafico.datasets[0]]}
  
  return (
    <>
      <Bar ref={graficoRef} data={props.dadosGrafico} options={options} />
      <div className="grafico-buttons">
        <button onClick={ResetZoom}>Reset Zoom</button>
        <button
          onClick={() => exportCSV(props.dadosGrafico, "dados_grafico.csv")}
        >
          Exportar CSV
        </button>
      </div>
      <p style={{ fontSize: 10 }}>
        *OBS: Utilize o scroll do mouse para dar zoom no gráfico e arraste
        lateralmente clicando
      </p>
    </>
  );
}

export default GraficoColuna;
