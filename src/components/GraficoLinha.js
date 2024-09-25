import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(zoomPlugin);

function GraficoLinha({ dadosGrafico }) {
  const options = {
    plugins: {
      zoom: {
        pan: {
          enabled: true, // Habilita o panning
          mode: 'x', // Permite panning apenas no eixo X
        },
        zoom: {
          wheel: {
            enabled: true, // Desativa zoom com a roda do mouse
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
              min: 0, 
              max: 1000, 
            },
          },
        },
      },
    },
    scales: {
      x: {

        ticks: {
          autoSkip: false, // Não pula ticks automaticamente
        },
      },
      y: {
        beginAtZero: true, // Inicia o eixo Y do zero, ajuste conforme necessário
        min: 0,
        max: 1000, 
      },
    },
  };

  return <Line data={dadosGrafico} options={options}/>;
}

export default GraficoLinha;
