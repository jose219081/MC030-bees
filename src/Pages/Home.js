import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import GraficoLinha from "../components/GraficoLinha";
import GraficoColuna from "../components/GraficoColuna";
import GraficoCombinado from "../components/GraficoCombinado";
import { saveAs } from "file-saver";

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

function Home() {
  const [databaseName, setDatabaseName] = useState("bee_data");
  const [dataRef, setDataRef] = useState(ref(database, "bee_data"));
  const [placasDisponiveis, setPlacasDisponiveis] = useState([]);
  const sensacaoTermicaApi = [];
  const temperaturaApi = [];
  const umidadeApi = [];
  const pressaoApi = [];
  const proximidadeRsp = [];
  const temperaturaRsp = [];
  const umidadeRsp = [];
  const pressaoRsp = [];
  const poluicaoAirQApi = [];
  const poluicaoCompApi = [];
  const dailyProximidade = [];
  const dailyTemperatura = [];

  const [proximidadeDados, setProximidade] = useState({
    labels: [],
    datasets: [
      {
        type: "bar",
        label: "Proximidade Placa",
        data: proximidadeRsp,
        borderWidth: 2,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Temperatura Placa (°C)",
        data: temperaturaRsp,
        borderWidth: 2,
        yAxisID: "y1",
      },
    ],
  });

  const [proximidadeDiariaDados, setProximidadeDiaria] = useState({
    labels: [],
    datasets: [
      {
        type: "bar",
        label: "Proximidade Diária Placa",
        data: dailyProximidade,
        borderWidth: 2,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Temperatura Diária Placa (°C)",
        data: dailyTemperatura,
        borderWidth: 2,
        yAxisID: "y1",
      },
    ],
  });

  const [sensacaoTermicaDados, setSensacaoTermicaDados] = useState({
    labels: [],
    datasets: [
      {
        type: "line",
        yAxisID: "y",
        label: "Sensacao termica API (°C)",
        data: sensacaoTermicaApi,
        borderWidth: 2,
      },
    ],
  });
  const [poluicaoAirQDados, setPoluicaoAirQDados] = useState({
    labels: [],
    datasets: [
      {
        type: "line",
        yAxisID: "y",
        label: "Poluicao Api",
        data: poluicaoAirQApi,
        borderWidth: 2,
      },
    ],
  });
  const [poluicaoCompDados, setPoluicaoCompDados] = useState({
    labels: [],
    datasets: [
      {
        type: "line",
        yAxisID: "y",
        label: "Poluicao Componentes CO Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
      {
        type: "line",
        yAxisID: "y",
        label: "Poluicao Componentes NO Api",
        data: poluicaoCompApi.no,
        borderWidth: 2,
      },
      {
        type: "line",
        yAxisID: "y",
        label: "Poluicao Componentes NO2 Api",
        data: poluicaoCompApi.no,
        borderWidth: 2,
      },
      {
        type: "line",
        yAxisID: "y",
        label: "Poluicao Componentes O3 Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
      {
        type: "line",
        yAxisID: "y",
        label: "Poluicao Componentes SO2 Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
      {
        type: "line",
        yAxisID: "y",
        label: "Poluicao Componentes PM2_5 Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
      {
        type: "line",
        yAxisID: "y",
        label: "Poluicao Componentes PM10 Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
      {
        type: "line",
        yAxisID: "y",
        label: "Poluicao Componentes NH3 Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
    ],
  });
  const [temperaturaDados, setTemperaturaDados] = useState({
    labels: [],
    datasets: [
      {
        type: "line",
        yAxisID: "y",
        label: "Temperatura API (°C)",
        data: temperaturaApi,
        borderWidth: 2,
      },
      {
        type: "line",
        yAxisID: "y",
        label: "Temperatura Rsp (°C)",
        data: temperaturaRsp,
        borderWidth: 2,
      },
    ],
  });
  const [umidadeDados, setUmidadeDados] = useState({
    labels: [],
    datasets: [
      {
        type: "line",
        yAxisID: "y",
        label: "Umidade API (%)",
        data: umidadeApi,
        borderWidth: 2,
      },
      {
        type: "line",
        yAxisID: "y",
        label: "Umidade Rsp (%)",
        data: umidadeRsp,
        borderWidth: 2,
      },
    ],
  });
  const [pressaoDados, setPressaoDados] = useState({
    labels: [],
    datasets: [
      {
        type: "line",
        yAxisID: "y",
        label: "Pressao API (hPa)",
        data: pressaoApi,
        borderWidth: 2,
      },
      {
        type: "line",
        yAxisID: "y",
        label: "Pressao Rsp (hPa)",
        data: pressaoRsp,
        borderWidth: 2,
      },
    ],
  });

  const [allData, setAllData] = useState();
  const [partialData, setPartialData] = useState();

  const [dados, setDados] = useState(proximidadeDados);
  const [nomeDados, setNomeDados] = useState("proximidade");
  const [showAll, setShowAll] = useState(false);
  const [graphTitle, setGraphTitle] = useState(
    "Selecione um gráfico usando os botões"
  );
  const topLevelEntriesRef = ref(database, "/");

  useEffect(() => {
    onValue(topLevelEntriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const topLevelEntries = Object.keys(snapshot.val());
        setPlacasDisponiveis(topLevelEntries);
      }
    });
  }, []);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const formatTimestamp = (timestamp) => {
    const [date, time] = timestamp.split("-");
    const [day, month, year] = date.split("_");
    const formattedTime = time.replace(/_/g, ":");
    return `${day}/${month}/${year} - ${formattedTime}`;
  };

  const parseFormattedTimestamp = (formattedTimestamp) => {
    const [date, time] = formattedTimestamp.split(" - ");
    const [day, month, year] = date.split("/");
    const [hours, minutes, seconds] = time.split(":");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  };

  const fetchData = async () => {
    onValue(dataRef, (snapshot) => {
      const values = snapshot.val();
      const dataArray = [];

      for (let key in values) {
        const formattedTimestamp = formatTimestamp(key);
        const dateTimestamp = parseFormattedTimestamp(formattedTimestamp);

        const startDate = startTime ? new Date(startTime) : null;
        const endDate = endTime ? new Date(endTime) : null;

        if (
          (!startDate || dateTimestamp >= startDate) &&
          (!endDate || dateTimestamp <= endDate)
        ) {
          dataArray.push({
            timestamp: formattedTimestamp,
            sensacaoTermicaApi: parseFloat(
              values[key].openweathermap.main.feels_like - 273
            ).toFixed(2),
            temperaturaApi: parseFloat(
              values[key].openweathermap.main.temp - 273
            ).toFixed(2),
            umidadeApi: parseFloat(
              values[key].openweathermap.main.humidity
            ).toFixed(2),
            pressaoApi: parseFloat(
              values[key].openweathermap.main.grnd_level
            ).toFixed(2),
            proximidadeRsp: values[key].sensor.proximidade,
            temperaturaRsp: parseFloat(
              values[key].sensor.temperatura_interna
            ).toFixed(2),
            umidadeRsp: parseFloat(values[key].sensor.umidade_interna).toFixed(
              2
            ),
            pressaoRsp: parseFloat(values[key].sensor.pressao_interna).toFixed(
              2
            ),
            poluicaoAirQApi: values[key].pollution?.list[0].main?.aqi,
            poluicaoCompAPI: values[key].pollution?.list[0].components,
          });
        }
      }

      // Ordena os dados pelos timestamps
      dataArray.sort(
        (a, b) =>
          parseFormattedTimestamp(a.timestamp) -
          parseFormattedTimestamp(b.timestamp)
      );

      const newTimestamps = [];
      const newSensacaoTermicaApi = [];
      const newTemperaturaApi = [];
      const newUmidadeApi = [];
      const newPressaoApi = [];
      const newProximidadeRsp = [];
      const newTemperaturaRsp = [];
      const newUmidadeRsp = [];
      const newPressaoRsp = [];
      const newPoluicaoAirQApi = [];
      const newPoluicaoCompApi = [];

      dataArray.forEach((data, index) => {
        newTimestamps.push(data.timestamp);
        newSensacaoTermicaApi.push(data.sensacaoTermicaApi);
        newTemperaturaApi.push(data.temperaturaApi);
        newUmidadeApi.push(data.umidadeApi);
        newPressaoApi.push(data.pressaoApi);
        newProximidadeRsp.push(data.proximidadeRsp);
        newTemperaturaRsp.push(data.temperaturaRsp);
        newUmidadeRsp.push(data.umidadeRsp);
        newPressaoRsp.push(data.pressaoRsp);
        newPoluicaoAirQApi.push(data.poluicaoAirQApi);
        newPoluicaoCompApi.push(data.poluicaoCompAPI);
      });

      setProximidade({
        labels: newTimestamps,
        datasets: [
          {
            type: "bar",
            label: "Proximidade Placa",
            data: newProximidadeRsp,
            borderWidth: 2,
            yAxisID: "y",
          },
          {
            type: "line",
            label: "Temperatura Placa (°C)",
            data: newTemperaturaRsp,
            borderWidth: 2,
            yAxisID: "y1",
          },
        ],
      });

      setSensacaoTermicaDados({
        labels: newTimestamps,
        datasets: [
          {
            type: "line",
            yAxisID: "y",
            label: "Sensacao térmica Online (°C)",
            data: newSensacaoTermicaApi,
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      });

      setTemperaturaDados({
        labels: newTimestamps,
        datasets: [
          {
            type: "line",
            yAxisID: "y",
            label: "Temperatura Online (°C)",
            data: newTemperaturaApi,
            borderWidth: 2,
            tension: 0.4,
          },
          {
            type: "line",
            yAxisID: "y",
            label: "Temperatura Placa (°C)",
            data: newTemperaturaRsp,
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      });

      setUmidadeDados({
        labels: newTimestamps,
        datasets: [
          {
            type: "line",
            yAxisID: "y",
            label: "Umidade Online (%)",
            data: newUmidadeApi,
            borderWidth: 2,
            tension: 0.4,
          },
          {
            type: "line",
            yAxisID: "y",
            label: "Umidade Placa (%)",
            data: newUmidadeRsp,
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      });

      setPressaoDados({
        labels: newTimestamps,
        datasets: [
          {
            type: "line",
            yAxisID: "y",
            label: "Pressão Online (hPa)",
            data: newPressaoApi,
            borderWidth: 2,
            tension: 0.4,
          },
          {
            type: "line",
            yAxisID: "y",
            label: "Pressão Placa (hPa)",
            data: newPressaoRsp,
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      });

      setPoluicaoAirQDados({
        labels: newTimestamps,
        datasets: [
          {
            type: "line",
            yAxisID: "y",
            label: "Poluicao do Ar Online",
            data: newPoluicaoAirQApi,
            borderWidth: 2,
          },
        ],
      });

      setPoluicaoCompDados({
        labels: newTimestamps,
        datasets: [
          {
            type: "line",
            yAxisID: "y",
            label: "CO (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.co).toFixed(2)
            ),
            borderWidth: 2,
          },
          {
            type: "line",
            yAxisID: "y",
            label: "NO (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.no).toFixed(2)
            ),
            borderWidth: 2,
          },
          {
            type: "line",
            yAxisID: "y",
            label: "NO2 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.no2).toFixed(2)
            ),
            borderWidth: 2,
          },
          {
            type: "line",
            yAxisID: "y",
            label: "O3 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.o3).toFixed(2)
            ),
            borderWidth: 2,
          },
          {
            type: "line",
            yAxisID: "y",
            label: "SO2 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.so2).toFixed(2)
            ),
            borderWidth: 2,
          },
          {
            type: "line",
            yAxisID: "y",
            label: "PM2_5 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.pm2_5).toFixed(2)
            ),
            borderWidth: 2,
          },
          {
            type: "line",
            yAxisID: "y",
            label: "PM10 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.pm10).toFixed(2)
            ),
            borderWidth: 2,
          },
          {
            type: "line",
            yAxisID: "y",
            label: "NH3 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.nh3).toFixed(2)
            ),
            borderWidth: 2,
          },
        ],
      });

      setPartialData({
        labels: newTimestamps,
        datasets: [
          {
            label: "Proximidade Placa",
            data: newProximidadeRsp,
          },
          {
            label: "Sensacao térmica Online (°C)",
            data: newSensacaoTermicaApi,
          },
          {
            label: "Temperatura Online (°C)",
            data: newTemperaturaApi,
          },
          {
            label: "Temperatura Placa (°C)",
            data: newTemperaturaRsp,
          },
          {
            label: "Umidade Online (%)",
            data: newUmidadeApi,
          },
          {
            label: "Umidade Placa (%)",
            data: newUmidadeRsp,
          },
          {
            label: "Pressão Online (hPa)",
            data: newPressaoApi,
          },
          {
            label: "Pressão Placa (hPa)",
            data: newPressaoRsp,
          },
          {
            label: "Poluicao do Ar Online",
            data: newPoluicaoAirQApi,
          },
          {
            label: "CO (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.co).toFixed(2)
            ),
          },
          {
            label: "NO (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.no).toFixed(2)
            ),
          },
          {
            label: "NO2 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.no2).toFixed(2)
            ),
          },
          {
            label: "O3 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.o3).toFixed(2)
            ),
          },
          {
            label: "SO2 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.so2).toFixed(2)
            ),
          },
          {
            label: "PM2_5 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.pm2_5).toFixed(2)
            ),
          },
          {
            label: "PM10 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.pm10).toFixed(2)
            ),
          },
          {
            label: "NH3 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.nh3).toFixed(2)
            ),
          },
        ],
      });
    });
  };

  const fetchAllData = async () => {
    onValue(dataRef, (snapshot) => {
      const values = snapshot.val();
      const dataArray = [];

      for (let key in values) {
        const formattedTimestamp = formatTimestamp(key);

        dataArray.push({
          timestamp: formattedTimestamp,
          sensacaoTermicaApi: parseFloat(
            values[key].openweathermap.main.feels_like - 273
          ).toFixed(2),
          temperaturaApi: parseFloat(
            values[key].openweathermap.main.temp - 273
          ).toFixed(2),
          umidadeApi: parseFloat(
            values[key].openweathermap.main.humidity
          ).toFixed(2),
          pressaoApi: parseFloat(
            values[key].openweathermap.main.grnd_level
          ).toFixed(2),
          proximidadeRsp: values[key].sensor.proximidade,
          temperaturaRsp: parseFloat(
            values[key].sensor.temperatura_interna
          ).toFixed(2),
          umidadeRsp: parseFloat(values[key].sensor.umidade_interna).toFixed(2),
          pressaoRsp: parseFloat(values[key].sensor.pressao_interna).toFixed(2),
          poluicaoAirQApi: values[key].pollution?.list[0].main?.aqi,
          poluicaoCompAPI: values[key].pollution?.list[0].components,
        });
      }

      // Ordena os dados pelos timestamps
      dataArray.sort(
        (a, b) =>
          parseFormattedTimestamp(a.timestamp) -
          parseFormattedTimestamp(b.timestamp)
      );

      const newTimestamps = [];
      const newSensacaoTermicaApi = [];
      const newTemperaturaApi = [];
      const newUmidadeApi = [];
      const newPressaoApi = [];
      const newProximidadeRsp = [];
      const newTemperaturaRsp = [];
      const newUmidadeRsp = [];
      const newPressaoRsp = [];
      const newPoluicaoAirQApi = [];
      const newPoluicaoCompApi = [];

      dataArray.forEach((data, index) => {
        newTimestamps.push(data.timestamp);
        newSensacaoTermicaApi.push(data.sensacaoTermicaApi);
        newTemperaturaApi.push(data.temperaturaApi);
        newUmidadeApi.push(data.umidadeApi);
        newPressaoApi.push(data.pressaoApi);
        newProximidadeRsp.push(data.proximidadeRsp);
        newTemperaturaRsp.push(data.temperaturaRsp);
        newUmidadeRsp.push(data.umidadeRsp);
        newPressaoRsp.push(data.pressaoRsp);
        newPoluicaoAirQApi.push(data.poluicaoAirQApi);
        newPoluicaoCompApi.push(data.poluicaoCompAPI);
      });

      setAllData({
        labels: newTimestamps,
        datasets: [
          {
            label: "Proximidade Placa",
            data: newProximidadeRsp,
          },
          {
            label: "Sensacao térmica Online (°C)",
            data: newSensacaoTermicaApi,
          },
          {
            label: "Temperatura Online (°C)",
            data: newTemperaturaApi,
          },
          {
            label: "Temperatura Placa (°C)",
            data: newTemperaturaRsp,
          },
          {
            label: "Umidade Online (%)",
            data: newUmidadeApi,
          },
          {
            label: "Umidade Placa (%)",
            data: newUmidadeRsp,
          },
          {
            label: "Pressão Online (hPa)",
            data: newPressaoApi,
          },
          {
            label: "Pressão Placa (hPa)",
            data: newPressaoRsp,
          },
          {
            label: "Poluicao do Ar Online",
            data: newPoluicaoAirQApi,
          },
          {
            label: "CO (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.co).toFixed(2)
            ),
          },
          {
            label: "NO (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.no).toFixed(2)
            ),
          },
          {
            label: "NO2 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.no2).toFixed(2)
            ),
          },
          {
            label: "O3 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.o3).toFixed(2)
            ),
          },
          {
            label: "SO2 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.so2).toFixed(2)
            ),
          },
          {
            label: "PM2_5 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.pm2_5).toFixed(2)
            ),
          },
          {
            label: "PM10 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.pm10).toFixed(2)
            ),
          },
          {
            label: "NH3 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) =>
              parseFloat(obj.nh3).toFixed(2)
            ),
          },
        ],
      });
    });
  };

  const fetchDayData = async () => {
    onValue(dataRef, (snapshot) => {
      const values = snapshot.val();
      const dataArray = [];

      const parseFormattedDailyTimestamp = (formattedTimestamp) => {
        const [date] = formattedTimestamp.split(" - ");
        const [day, month, year] = date.split("/");
        return new Date(`${year}-${month}-${day}`);
      };

      for (let key in values) {
        const formattedTimestamp = formatTimestamp(key);
        const dateTimestamp = parseFormattedDailyTimestamp(formattedTimestamp);

        const startDate = startTime
          ? new Date(startTime.substring(0, 10))
          : null;
        const endDate = endTime ? new Date(endTime.substring(0, 10)) : null;

        if (
          (!startDate || dateTimestamp >= startDate) &&
          (!endDate || dateTimestamp <= endDate)
        ) {
          dataArray.push({
            timestamp: formattedTimestamp,
            proximidadeRsp: values[key].sensor.proximidade,
            temperaturaRsp: values[key].sensor.temperatura_interna,
          });
        }
      }

      // Ordena os dados pelos timestamps
      dataArray.sort(
        (a, b) =>
          parseFormattedTimestamp(a.timestamp) -
          parseFormattedTimestamp(b.timestamp)
      );

      const dailyProx = [];
      const dailyTemp = [];
      const newDatestamps = [];

      let dProx = 0;
      let count = 0;
      let countTemp = 0;
      let meanTemp = 0;
      dataArray.forEach((data, index) => {
        if (
          newDatestamps.filter(
            (date) => date.substring(0, 10) !== data.timestamp.substring(0, 10)
          ).length === newDatestamps.length &&
          newDatestamps.length === 0
        ) {
          newDatestamps.push(data.timestamp.substring(0, 10));
          dProx = data.proximidadeRsp;
          count = 1;
          countTemp = data.temperaturaRsp;
        } else if (
          newDatestamps.filter(
            (date) => date.substring(0, 10) !== data.timestamp.substring(0, 10)
          ).length === newDatestamps.length &&
          newDatestamps.length > 0
        ) {
          dailyProx.push(dProx);
          meanTemp = countTemp / count;
          dailyTemp.push(parseFloat(meanTemp).toFixed(2));
          newDatestamps.push(data.timestamp.substring(0, 10));
          dProx = data.proximidadeRsp;
          count = 1;
          countTemp = data.temperaturaRsp;
        } else if (index === dataArray.length - 1) {
          dailyProx.push(dProx);
          meanTemp = countTemp / count;
          dailyTemp.push(parseFloat(meanTemp).toFixed(2));
        } else {
          dProx += data.proximidadeRsp;
          count += 1;
          countTemp += data.temperaturaRsp;
        }
      });

      setProximidadeDiaria({
        labels: newDatestamps,
        datasets: [
          {
            type: "bar",
            label: "Proximidade Diária Placa",
            data: dailyProx,
            borderWidth: 2,
            yAxisID: "y",
          },
          {
            type: "line",
            label: "Temperatura Diária Placa (°C)",
            data: dailyTemp,
            borderWidth: 2,
            yAxisID: "y1",
          },
        ],
      });
    });
  };

  useEffect(() => {
    fetchData();
    fetchDayData();
    fetchAllData();
  }, [startTime, endTime, dataRef]);

  useEffect(() => {
    switch (nomeDados) {
      case "proximidade":
        setDados(proximidadeDados);
        setGraphTitle(" Dados do Sensor de Proximidade ");
        break;
      case "proximidade diaria":
        setDados(proximidadeDiariaDados);
        setGraphTitle(" Dados do Sensor de Proximidade por dia");
        break;
      case "pressao":
        setDados(pressaoDados);
        setGraphTitle(" Dados de Pressão (hPa) ");
        break;
      case "umidade":
        setDados(umidadeDados);
        setGraphTitle(" Dados de Umidade (%) ");
        break;
      case "temperatura":
        setDados(temperaturaDados);
        setGraphTitle(" Dados de Temperatura (°C) ");
        break;
      case "poluicao ar":
        setDados(poluicaoAirQDados);
        setGraphTitle(" Poluição do Ar ");
        break;
      case "componentes poluicao":
        setDados(poluicaoCompDados);
        setGraphTitle(" Dados de Poluição do Ar ");
        break;
      default:
        setDados(sensacaoTermicaDados);
        setGraphTitle(" Dados de Sensação Térmica (°C) ");
        break;
    }
  }, [
    nomeDados,
    proximidadeDados,
    proximidadeDiariaDados,
    pressaoDados,
    umidadeDados,
    temperaturaDados,
    sensacaoTermicaDados,
    poluicaoAirQDados,
    poluicaoCompDados,
  ]);

  function handleDataChange(data, name) {
    setDados(data);
    setShowAll(false);
    setNomeDados(name);
  }

  return (
    <div className="App">
      <main className="Main-Body">
        <div id="btns">
          <h2>Selecione o nome da placa: </h2>
          <select
            className="styled-textfield"
            value={databaseName}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length > 0) {
                setDataRef(ref(database, newValue));
              }
              setDatabaseName(newValue);
            }}
          >
            {placasDisponiveis.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <h2>Selecione o gráfico: </h2>
          <div className="button-grid">
            <button
              onClick={() => handleDataChange(proximidadeDados, "proximidade")}
            >
              Dados de Proximidade
            </button>
            <button
              onClick={() =>
                handleDataChange(proximidadeDiariaDados, "proximidade diaria")
              }
            >
              Dados de Proximidade diario
            </button>
            <button onClick={() => handleDataChange(pressaoDados, "pressao")}>
              Dados de Pressão
            </button>
            <button onClick={() => handleDataChange(umidadeDados, "umidade")}>
              Dados de Umidade
            </button>
            <button
              onClick={() => handleDataChange(temperaturaDados, "temperatura")}
            >
              Dados de Temperatura
            </button>
            <button
              onClick={() => handleDataChange(sensacaoTermicaDados, "sensacao")}
            >
              Dados de Sensação Térmica
            </button>
            <button
              onClick={() => handleDataChange(poluicaoAirQDados, "poluicao ar")}
            >
              Poluição do Ar
            </button>
            <button
              onClick={() =>
                handleDataChange(poluicaoCompDados, "componentes poluicao")
              }
            >
              Dados de Poluição do Ar
            </button>
            <button onClick={() => setShowAll(!showAll)}>
              Mostrar Todos Dados
            </button>
          </div>
          <h2>Selecione o intervalo de datas: </h2>
          <div className="date-inputs">
            <label>Data Inicial: </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <label style={{ marginLeft: 30 }}>Data Final: </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <h2>Exportar em CSV todos os dados do dashboard: </h2>
          <div className="button-grid">
            <button onClick={() => exportCSV(allData, "dados_gerais.csv")}>
              Exportar CSV total
            </button>
            <button onClick={() => exportCSV(partialData, "dados_parcial.csv")}>
              Exportar CSV parcial
            </button>
          </div>
          <p style={{ fontSize: 10 }}>
            *OBS: Exportar CSV parcial utiliza o intervalo de datas do input
            acima, enquanto exportar CSV total utiliza todos dados.
          </p>
        </div>

        {!showAll &&
          dados !== proximidadeDiariaDados &&
          dados !== poluicaoAirQDados &&
          dados !== poluicaoCompDados &&
          dados !== proximidadeDados && (
            <div className="chart-container">
              <h3>{graphTitle}</h3>
              <GraficoLinha dadosGrafico={dados} />
            </div>
          )}

        {!showAll &&
          (dados === proximidadeDados || dados === proximidadeDiariaDados) && (
            <div className="chart-container">
              <h3>{graphTitle}</h3>
              <GraficoCombinado data={dados} />
            </div>
          )}

        {!showAll &&
          dados === poluicaoAirQDados &&
          dados !== poluicaoCompDados && (
            <div className="chart-container">
              <h3>{graphTitle}</h3>
              <GraficoLinha dadosGrafico={dados} />
            </div>
          )}

        {!showAll &&
          dados !== poluicaoAirQDados &&
          dados === poluicaoCompDados && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="chart-container" key={i}>
                  <h3>{dados.datasets[i].label}</h3>
                  <GraficoColuna
                    dadosGrafico={{
                      labels: dados.labels,
                      datasets: [dados.datasets[i]],
                    }}
                  />
                </div>
              ))}
            </>
          )}

        {showAll && (
          <>
            <div className="chart-container">
              <h3> Dados do Sensor de Proximidade </h3>
              <GraficoCombinado data={proximidadeDados} />
            </div>
            <div className="chart-container">
              <h3> Dados do Sensor de Proximidade por dia </h3>
              <GraficoCombinado data={proximidadeDiariaDados} />
            </div>
            <div className="chart-container">
              <h3> Dados de Pressão (hPa) </h3>
              <GraficoLinha dadosGrafico={pressaoDados} />
            </div>
            <div className="chart-container">
              <h3> Dados de Umidade (%) </h3>
              <GraficoLinha dadosGrafico={umidadeDados} />
            </div>
            <div className="chart-container">
              <h3> Dados de Temperatura (°C) </h3>
              <GraficoLinha dadosGrafico={temperaturaDados} />
            </div>
            <div className="chart-container">
              <h3> Dados de Sensação Térmica (°C) </h3>
              <GraficoLinha dadosGrafico={sensacaoTermicaDados} />
            </div>
            <div className="chart-container">
              <h3> Poluição do Ar </h3>
              <GraficoColuna dadosGrafico={poluicaoAirQDados} />
            </div>
            <div className="chart-container">
              <h3> Dados de Poluição do Ar </h3>
              <GraficoColuna dadosGrafico={poluicaoCompDados} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Home;
