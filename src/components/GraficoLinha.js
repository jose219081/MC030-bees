import React, { useCallback, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(zoomPlugin);

function GraficoLinha({ dadosGrafico }) {
  const graficoRef = useRef(null);
  const options = {
    plugins: {
      zoom: {
        pan: {
          enabled: true, // Habilita o panning
          mode: 'xy', // Permite panning apenas no eixo X
        },
        zoom: {
          wheel: {
            enabled: true, // Ativa zoom com a roda do mouse
            mode: 'y',
          },
          pinch: {
            enabled: false, // Desativa zoom com gesto de pinça
          },
          drag: {
            enabled: false, // Desativa zoom ao arrastar
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
          maxRotation: 0,
          align: "middle", 
          callback: function(value, index) {
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
        beginAtZero: false, // Inicia o eixo Y do zero, ajuste conforme necessário
      },
    },
  };

  const ResetZoom = useCallback(() => {
    graficoRef.current.resetZoom(); // Use the plugin's resetZoom method
  }, [graficoRef]);

  return (
  <>
    <Line ref={graficoRef} data={dadosGrafico} options={options}/>
    <button onClick={ResetZoom}>Reset Zoom</button>
  </>  
  );
}

export default GraficoLinha;
