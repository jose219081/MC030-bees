import './App.css';
import React, { useEffect, useState } from 'react';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';
import GraficoLinha from "./components/GraficoLinha";

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

	const [dados, setDados] = useState({
		labels: timestamps,
		datasets: [
			{
				label: "Sensacao termica API (°C)",
				data: sensacaoTermicaApi,
				borderWidth: 2,
			},
			{
				label: "Temperatura API (°C)",
				data: temperaturaApi,
				borderWidth: 2,
			},
			{
				label: "Umidade API (%)",
				data: umidadeApi,
				borderWidth: 2,
			},
			{
				label: "Pressao API (hPa)",
				data: pressaoApi,
				borderWidth: 2,
			},
			{
				label: "Temperatura Rsp (°C)",
				data: temperaturaRsp,
				borderWidth: 2,
			},
			{
				label: "Umidade Rsp (%)",
				data: umidadeRsp,
				borderWidth: 2,
			},
			{
				label: "Pressao Rsp (hPa)",
				data: pressaoRsp,
				borderWidth: 2,
			},
		],
	});

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
	

				setDados({
					labels: newTimestamps,
					datasets: [
						{
							label: "Proximidade Placa",
							data: newProximidadeRsp,
							borderWidth: 2,
						},
						{
							label: "Temperatura Placa (°C)",
							data: newTemperaturaRsp,
							borderWidth: 2,
						},
						{
							label: "Umidade Placa (%)",
							data: newUmidadeRsp,
							borderWidth: 2,
						},
						{
							label: "Pressão Placa (hPa)",
							data: newPressaoRsp,
							borderWidth: 2,
						},
						{
							label: "Sensacao térmica Openw (°C)",
							data: newSensacaoTermicaApi,
							borderWidth: 2,
						},
						{
							label: "Temperatura OpenW (°C)",
							data: newTemperaturaApi,
							borderWidth: 2,
						},
						{
							label: "Umidade OpenW (%)",
							data: newUmidadeApi,
							borderWidth: 2,
						},
						{
							label: "Pressão OpenW (hPa)",
							data: newPressaoApi,
							borderWidth: 2,
						},
					],
				});
			});
		};
		fetchData();
	}, [startTime, endTime]);

	return (
		<div className="App">
			<header className="App-header">
				<h1 style={{ marginBottom: 0 }}>Monitoramento de Colmeias</h1>
				<h3 style={{ marginTop: 0 }}>Dashboard de Dados do Firebase</h3>
			</header>
			<main className='Main-Body'>
				<div style={{ width: 850, backgroundColor: 'white' }}>
					<h3>Selecione na legenda quais informações gostaria de ver</h3>
					<GraficoLinha dadosGrafico={dados} />
				</div>
				<div>
					<label>Timestamp Inicial: </label>
					<input type="datetime-local" onChange={(e) => setStartTime(e.target.value)} />
					<label style={{ marginLeft: 30 }}>Timestamp Final: </label>
					<input type="datetime-local" onChange={(e) => setEndTime(e.target.value)} />
				</div>
				<p style={{ fontSize: 10 }}>*OBS: Utilize o scroll do mouse para dar zoom no gráfico e arraste lateralmente clicando</p>
			</main>
			<footer>
				<p>&copy; 2024 Universidade Estadual de Campinas.</p>
			</footer>
		</div>
	);
}

export default App;
