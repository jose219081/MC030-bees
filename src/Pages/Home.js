import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import GraficoLinha from "../components/GraficoLinha";
import GraficoColuna from "../components/GraficoColuna";

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

  const [proximidadeDados, setProximidade] = useState({
    labels: [],
    datasets: [
      {
        label: "Proximidade Placa",
        data: proximidadeRsp,
        borderWidth: 2,
      },
    ],
  });
  const [sensacaoTermicaDados, setSensacaoTermicaDados] = useState({
    labels: [],
    datasets: [
      {
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
        label: "Poluicao Componentes CO Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
      {
        label: "Poluicao Componentes NO Api",
        data: poluicaoCompApi.no,
        borderWidth: 2,
      },
      {
        label: "Poluicao Componentes NO2 Api",
        data: poluicaoCompApi.no,
        borderWidth: 2,
      },
      {
        label: "Poluicao Componentes O3 Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
      {
        label: "Poluicao Componentes SO2 Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
      {
        label: "Poluicao Componentes PM2_5 Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
      {
        label: "Poluicao Componentes PM10 Api",
        data: poluicaoCompApi.co,
        borderWidth: 2,
      },
      {
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
        label: "Temperatura API (°C)",
        data: temperaturaApi,
        borderWidth: 2,
      },
      {
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
        label: "Umidade API (%)",
        data: umidadeApi,
        borderWidth: 2,
      },
      {
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
        label: "Pressao API (hPa)",
        data: pressaoApi,
        borderWidth: 2,
      },
      {
        label: "Pressao Rsp (hPa)",
        data: pressaoRsp,
        borderWidth: 2,
      },
    ],
  });

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
          console.log(values[key])
          dataArray.push({
            timestamp: formattedTimestamp,
            sensacaoTermicaApi:
              values[key].openweathermap.main.feels_like - 273,
            temperaturaApi: values[key].openweathermap.main.temp - 273,
            umidadeApi: values[key].openweathermap.main.humidity,
            pressaoApi: values[key].openweathermap.main.grnd_level,
            proximidadeRsp: values[key].sensor.proximidade,
            temperaturaRsp: values[key].sensor.temperatura_interna,
            umidadeRsp: values[key].sensor.umidade_interna,
            pressaoRsp: values[key].sensor.pressao_interna,
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

      dataArray.forEach((data) => {
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
            label: "Proximidade Placa",
            data: newProximidadeRsp,
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      });

      setSensacaoTermicaDados({
        labels: newTimestamps,
        datasets: [
          {
            label: "Sensacao térmica Openw (°C)",
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
            label: "Temperatura OpenW (°C)",
            data: newTemperaturaApi,
            borderWidth: 2,
            tension: 0.4,
          },
          {
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
            label: "Umidade OpenW (%)",
            data: newUmidadeApi,
            borderWidth: 2,
            tension: 0.4,
          },
          {
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
            label: "Pressão OpenW (hPa)",
            data: newPressaoApi,
            borderWidth: 2,
            tension: 0.4,
          },
          {
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
            label: "Poluicao do Ar Openw",
            data: newPoluicaoAirQApi,
            borderWidth: 2,
          },
        ],
      });

      setPoluicaoCompDados({
        labels: newTimestamps,
        datasets: [
          {
            label: "CO (μg/m³)",
            data: newPoluicaoCompApi.map((obj) => (obj.co)),
            borderWidth: 2,
          },
          {
            label: "NO (μg/m³)",
            data: newPoluicaoCompApi.map((obj) => (obj.no)),
            borderWidth: 2,
          },
          {
            label: "NO2 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) => (obj.no2)),
            borderWidth: 2,
          },
          {
            label: "O3 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) => (obj.o3)),
            borderWidth: 2,
          },
          {
            label: "SO2 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) => (obj.so2)),
            borderWidth: 2,
          },
          {
            label: "PM2_5 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) => (obj.pm2_5)),
            borderWidth: 2,
          },
          {
            label: "PM10 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) => (obj.pm10)),
            borderWidth: 2,
          },
          {
            label: "NH3 (μg/m³)",
            data: newPoluicaoCompApi.map((obj) => (obj.nh3)),
            borderWidth: 2,
          },
        ],
      });

    });
  };

  useEffect(() => {
    fetchData();
  }, [startTime, endTime, dataRef]);

  useEffect(() => {
    switch (nomeDados) {
      case "proximidade":
        setDados(proximidadeDados);
        setGraphTitle(" Dados do Sensor de Proximidade ");
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
              Dados do Sensor de Proximidade
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
              onClick={() => handleDataChange(poluicaoCompDados, "componentes poluicao")}
            >
              Dados de Poluição do Ar
            </button>
            <button onClick={() => setShowAll(!showAll)}>
              Mostrar Todos Dados
            </button>
          </div>
          <h2>Selecione o intervalo de datas: </h2>
          <div className="date-inputs">
            <label>Timestamp Inicial: </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <label style={{ marginLeft: 30 }}>Timestamp Final: </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* {!showAll && (
          <div className="chart-container">
            <h3>{graphTitle}</h3>
            <GraficoLinha dadosGrafico={dados} />
          </div>
        )} */}

        {!showAll && (dados !== poluicaoAirQDados && dados !== poluicaoCompDados) && (
          <div className="chart-container">
            <h3>{graphTitle}</h3>
            <GraficoLinha
              dadosGrafico={dados}
            />
          </div>
        )}
        
        {!showAll && (dados === poluicaoAirQDados && dados !== poluicaoCompDados) && (
          <div className="chart-container">
            <h3>{graphTitle}</h3>
            <GraficoLinha
              dadosGrafico={dados}
            />
          </div>
        )}

        {!showAll && dados !== poluicaoAirQDados && dados === poluicaoCompDados && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="chart-container" key={i}>
                <h3>{dados.datasets[i].label}</h3>
                <GraficoColuna
                  dadosGrafico={{ labels: dados.labels, datasets: [dados.datasets[i]] }}
                />
              </div>
            ))}
          </>
        )}

        {showAll && (
          <>
            <div className="chart-container">
              <h3> Dados do Sensor de Proximidade </h3>
              <GraficoLinha dadosGrafico={proximidadeDados} />
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
              <GraficoColuna
                dadosGrafico={poluicaoAirQDados}
              />
            </div>
            <div className="chart-container">
              <h3> Dados de Poluição do Ar </h3>
              <GraficoColuna
                dadosGrafico={poluicaoCompDados}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Home;
