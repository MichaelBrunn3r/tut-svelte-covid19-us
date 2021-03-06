import moment from 'moment';
import stateNames from "../data/stateNames.js";

function usStats(data) {
	const [usStatsData] = data;
	return parseStats(usStatsData);
}

function stateStats(stateData) {
	return parseStats(stateData);
}

function parseStats(data) {
	return {
		cases: data.positive,
		deaths: data.death,
		recovered: data.recovered,
		ventilator: data.onVentilatorCurrently,
		hospitalized: data.hospitalizedCurrently,
		icu: data.inIcuCurrently,
		tested: data.totalTestResults,
		updated: moment(data.lastModified).format('LLLL')
	}
}

function historicUS(data) {
	return parseHistoric(data);
}

function historicState(data) {
	return parseHistoric(data);
}

function parseHistoric(data) {
	return [
		{
			label: 'Cases',
			key: 'positive',
			color: 'rgb(100, 0, 200)'
		},
		{
			label: 'Recovered',
			key: 'recovered',
			color: 'rgb(100, 100, 200)'
		},
		{
			label: 'Total Tested',
			key: 'totalTestResults',
			color: 'rgb(10, 30, 100)'
		},
		{
			label: 'Hospitalized',
			key: 'hospitalizedCurrently',
			color: 'rgb(20, 100, 230)'
		},
		{
			label: 'Deaths',
			key: 'death',
			color: 'rgb(255, 99, 132)'
		}
	].reduce((prev, next) => {
		if(data.filter(d => d[next.key]).length > 4) {
			prev.push(parseChart(data, next.key, next.label, next.color))
		}
		return prev;
	}, []);
}

function parseChart(data, key, label, color) {
	const chartData = data.map(data => {
		return {
			x: moment(data.date, 'YYYYMMDD'),
			y: data[key] || 0
		}
	});

	return {
		label,
		data: chartData,
		fill: false,
		borderColor: color
	}
}

function stateTable(data) {
	return data.map(data => {
		return {
			abbrev: data.state,
			name: stateNames.find(s => s.abbreviation === data.state).name,
			cases: data.positive,
			deaths: data.death,
			tested: data.totalTestResults
		}
	}).sort((a,b) => {
		return a.name.localeCompare(b.name)
	});
}

export default {
	usStats,
	stateStats,
	historicUS,
	historicState,
	stateTable
}