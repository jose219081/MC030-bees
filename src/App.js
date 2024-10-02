import './App.css';
import React, { useEffect, useState } from 'react';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';
import GraficoLinha from "./components/GraficoLinha";
import { saveAs } from 'file-saver';

function App() {
	const dataRef = ref(database, 'bee_data');
	const timestamps = [];
	const sensacaoTermicaApi = [];
	const temperaturaApi = [];
	const umidadeApi = [];
	const pressaoApi = [];
	const proximidadeRsp = [];
	const temperaturaRsp = [];
	const umidadeRsp = [];
	const pressaoRsp = [];

	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');

	const exportCSV = (dados, filename) => {
        const csvRows = [];
        const headers = ["Timestamp", ...dados.datasets.map(dataset => dataset.label)];
        csvRows.push(headers.join(','));

        dados.labels.forEach((label, i) => {
            const row = [label];
            dados.datasets.forEach(dataset => {
                row.push(dataset.data[i]);
            });
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        saveAs(blob, filename);
    };

	const formatTimestamp = (timestamp) => {
		const [date, time] = timestamp.split('-');
		const [day, month, year] = date.split('_');
		const formattedTime = time.replace(/_/g, ':');
		return `${day}/${month}/${year} - ${formattedTime}`;
	};

	const parseFormattedTimestamp = (formattedTimestamp) => {
		const [date, time] = formattedTimestamp.split(' - ');
		const [day, month, year] = date.split('/');
		const [hours, minutes, seconds] = time.split(':');
		return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
	};

	useEffect(() => {
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
							sensacaoTermicaApi: values[key].openweathermap.main.feels_like - 273,
							temperaturaApi: values[key].openweathermap.main.temp - 273,
							umidadeApi: values[key].openweathermap.main.humidity,
							pressaoApi: values[key].openweathermap.main.grnd_level,
							proximidadeRsp: values[key].sensor.proximidade,
							temperaturaRsp: values[key].sensor.temperatura_interna,
							umidadeRsp: values[key].sensor.umidade_interna,
							pressaoRsp: values[key].sensor.pressao_interna,
						});
					}
				}
	
				// Ordena os dados pelos timestamps
				dataArray.sort((a, b) => parseFormattedTimestamp(a.timestamp) - parseFormattedTimestamp(b.timestamp));
	
				const newTimestamps = [];
				const newSensacaoTermicaApi = [];
				const newTemperaturaApi = [];
				const newUmidadeApi = [];
				const newPressaoApi = [];
				const newProximidadeRsp = [];
				const newTemperaturaRsp = [];
				const newUmidadeRsp = [];
				const newPressaoRsp = [];
	
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
				});
	

				setProximidade({
                    labels: newTimestamps,
                    datasets: [
                        {
                            label: "Proximidade Placa",
                            data: newProximidadeRsp,
                            borderWidth: 2,
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
                        },
                        {
                            label: "Temperatura Placa (°C)",
                            data: newTemperaturaRsp,
                            borderWidth: 2,
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
                        },
                        {
                            label: "Umidade Placa (%)",
                            data: newUmidadeRsp,
                            borderWidth: 2,
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
                        },
                        {
                            label: "Pressão Placa (hPa)",
                            data: newPressaoRsp,
                            borderWidth: 2,
                        },
                    ],
                });
			});
		};
		fetchData();
	}, [startTime, endTime]);

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

	return (
		<div className="App">
			<header className="App-header">
				<h1 style={{ marginBottom: 0 }}>Monitoramento de Colmeias</h1>
				<h3 style={{ marginTop: 0 }}>Dashboard de Dados do Firebase</h3>
			</header>
			<main className='Main-Body'>
			<div style={{ width: 850, backgroundColor: 'white', borderStyle: 'solid' }}>
				<h3>Proximidade Placa </h3>
				<GraficoLinha dadosGrafico={proximidadeDados} />
				<button onClick={() => exportCSV(proximidadeDados, "proximidade.csv")}>Exportar CSV</button>
			</div>
			<div style={{ width: 850, backgroundColor: 'white', borderStyle: 'solid' }}>
				<h3>Sensação térmica (°C)</h3>
				<GraficoLinha dadosGrafico={sensacaoTermicaDados} />
				<button onClick={() => exportCSV(sensacaoTermicaDados, "sensacao_termica.csv")}>Exportar CSV</button>
			</div>
			<div style={{ width: 850, backgroundColor: 'white', borderStyle: 'solid'}}>
				<h3>Temperatura (°C)</h3>
				<GraficoLinha dadosGrafico={temperaturaDados} />
				<button onClick={() => exportCSV(temperaturaDados, "temperatura.csv")}>Exportar CSV</button>
			</div>
			<div style={{ width: 850, backgroundColor: 'white', borderStyle: 'solid' }}>
				<h3>Umidade (%)</h3>
				<GraficoLinha dadosGrafico={umidadeDados} />
				<button onClick={() => exportCSV(umidadeDados, "umidade.csv")}>Exportar CSV</button>
			</div>
			<div style={{ width: 850, backgroundColor: 'white', borderStyle: 'solid' }}>
				<h3>Pressão (hPa)</h3>
				<GraficoLinha dadosGrafico={pressaoDados} />
				<button onClick={() => exportCSV(pressaoDados, "pressao.csv")}>Exportar CSV</button>
			</div>
            </main>
			<footer>
				<p>&copy; 2024 Universidade Estadual de Campinas.</p>
			</footer>
		</div>
	);
}

export default App;
