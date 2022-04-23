/*
	TODO:
	  - https://observablehq.com/@sophietalbot/bipartite-graph-of-virtual-water-trade-wheat/2
*/

export const simpleData = {
	nodes: [
		{ id: 'A1' },
		{ id: 'A2' },
		{ id: 'A3' },
		{ id: 'B1' },
		{ id: 'B2' },
		{ id: 'B3' },
		{ id: 'B4' },
		{ id: 'C1' },
		{ id: 'C2' },
		{ id: 'C3' },
		{ id: 'D1' },
		{ id: 'D2' }
	],
	links: [
		{ source: 'A1', target: 'B1', value: 27 },
		{ source: 'A1', target: 'B2', value: 9 },
		{ source: 'A2', target: 'B2', value: 5 },
		{ source: 'A2', target: 'B3', value: 11 },
		{ source: 'A3', target: 'B2', value: 12 },
		{ source: 'A3', target: 'B4', value: 7 },
		{ source: 'B1', target: 'C1', value: 13 },
		{ source: 'B1', target: 'C2', value: 10 },
		{ source: 'B4', target: 'C2', value: 5 },
		{ source: 'B4', target: 'C3', value: 2 },
		{ source: 'B1', target: 'D1', value: 4 },
		{ source: 'C3', target: 'D1', value: 1 },
		{ source: 'C3', target: 'D2', value: 1 }
	]
};

export const complexData = {
	nodes: [
		{ name: "Agricultural 'waste'" },
		{ name: 'Bio-conversion' },
		{ name: 'Liquid' },
		{ name: 'Losses' },
		{ name: 'Solid' },
		{ name: 'Gas' },
		{ name: 'Biofuel imports' },
		{ name: 'Biomass imports' },
		{ name: 'Coal imports' },
		{ name: 'Coal' },
		{ name: 'Coal reserves' },
		{ name: 'District heating' },
		{ name: 'Industry' },
		{ name: 'Heating and cooling - commercial' },
		{ name: 'Heating and cooling - homes' },
		{ name: 'Electricity grid' },
		{ name: 'Over generation / exports' },
		{ name: 'H2 conversion' },
		{ name: 'Road transport' },
		{ name: 'Agriculture' },
		{ name: 'Rail transport' },
		{ name: 'Lighting & appliances - commercial' },
		{ name: 'Lighting & appliances - homes' },
		{ name: 'Gas imports' },
		{ name: 'Ngas' },
		{ name: 'Gas reserves' },
		{ name: 'Thermal generation' },
		{ name: 'Geothermal' },
		{ name: 'H2' },
		{ name: 'Hydro' },
		{ name: 'International shipping' },
		{ name: 'Domestic aviation' },
		{ name: 'International aviation' },
		{ name: 'National navigation' },
		{ name: 'Marine algae' },
		{ name: 'Nuclear' },
		{ name: 'Oil imports' },
		{ name: 'Oil' },
		{ name: 'Oil reserves' },
		{ name: 'Other waste' },
		{ name: 'Pumped heat' },
		{ name: 'Solar PV' },
		{ name: 'Solar Thermal' },
		{ name: 'Solar' },
		{ name: 'Tidal' },
		{ name: 'UK land based bioenergy' },
		{ name: 'Wave' },
		{ name: 'Wind' }
	],
	links: [
		{ source: 0, target: 1, value: 124.729 },
		{ source: 1, target: 2, value: 0.597 },
		{ source: 1, target: 3, value: 26.862 },
		{ source: 1, target: 4, value: 280.322 },
		{ source: 1, target: 5, value: 81.144 },
		{ source: 6, target: 2, value: 35 },
		{ source: 7, target: 4, value: 35 },
		{ source: 8, target: 9, value: 11.606 },
		{ source: 10, target: 9, value: 63.965 },
		{ source: 9, target: 4, value: 75.571 },
		{ source: 11, target: 12, value: 10.639 },
		{ source: 11, target: 13, value: 22.505 },
		{ source: 11, target: 14, value: 46.184 },
		{ source: 15, target: 16, value: 104.453 },
		{ source: 15, target: 14, value: 113.726 },
		{ source: 15, target: 17, value: 27.14 },
		{ source: 15, target: 12, value: 342.165 },
		{ source: 15, target: 18, value: 37.797 },
		{ source: 15, target: 19, value: 4.412 },
		{ source: 15, target: 13, value: 40.858 },
		{ source: 15, target: 3, value: 56.691 },
		{ source: 15, target: 20, value: 7.863 },
		{ source: 15, target: 21, value: 90.008 },
		{ source: 15, target: 22, value: 93.494 },
		{ source: 23, target: 24, value: 40.719 },
		{ source: 25, target: 24, value: 82.233 },
		{ source: 5, target: 13, value: 0.129 },
		{ source: 5, target: 3, value: 1.401 },
		{ source: 5, target: 26, value: 151.891 },
		{ source: 5, target: 19, value: 2.096 },
		{ source: 5, target: 12, value: 48.58 },
		{ source: 27, target: 15, value: 7.013 },
		{ source: 17, target: 28, value: 20.897 },
		{ source: 17, target: 3, value: 6.242 },
		{ source: 28, target: 18, value: 20.897 },
		{ source: 29, target: 15, value: 6.995 },
		{ source: 2, target: 12, value: 121.066 },
		{ source: 2, target: 30, value: 128.69 },
		{ source: 2, target: 18, value: 135.835 },
		{ source: 2, target: 31, value: 14.458 },
		{ source: 2, target: 32, value: 206.267 },
		{ source: 2, target: 19, value: 3.64 },
		{ source: 2, target: 33, value: 33.218 },
		{ source: 2, target: 20, value: 4.413 },
		{ source: 34, target: 1, value: 4.375 },
		{ source: 24, target: 5, value: 122.952 },
		{ source: 35, target: 26, value: 839.978 },
		{ source: 36, target: 37, value: 504.287 },
		{ source: 38, target: 37, value: 107.703 },
		{ source: 37, target: 2, value: 611.99 },
		{ source: 39, target: 4, value: 56.587 },
		{ source: 39, target: 1, value: 77.81 },
		{ source: 40, target: 14, value: 193.026 },
		{ source: 40, target: 13, value: 70.672 },
		{ source: 41, target: 15, value: 59.901 },
		{ source: 42, target: 14, value: 19.263 },
		{ source: 43, target: 42, value: 19.263 },
		{ source: 43, target: 41, value: 59.901 },
		{ source: 4, target: 19, value: 0.882 },
		{ source: 4, target: 26, value: 400.12 },
		{ source: 4, target: 12, value: 46.477 },
		{ source: 26, target: 15, value: 525.531 },
		{ source: 26, target: 3, value: 787.129 },
		{ source: 26, target: 11, value: 79.329 },
		{ source: 44, target: 15, value: 9.452 },
		{ source: 45, target: 1, value: 182.01 },
		{ source: 46, target: 15, value: 19.013 },
		{ source: 47, target: 15, value: 289.366 }
	]
};

// https://www.fusioncharts.com/charts/sankey-diagram/vertical-sankey-diagram?framework=javascript
export const bilateralTradeValue2013 = {
	nodes: [
		{
			label: 'Netherlands'
		},
		{
			label: 'Canada'
		},
		{
			label: 'Belgium'
		},
		{
			label: 'Italy'
		},
		{
			label: 'Mexico'
		},
		{
			label: 'Russia'
		},
		{
			label: 'Spain'
		},
		{
			label: 'South Korea'
		},
		{
			label: 'Germany'
		},
		{
			label: 'China'
		},
		{
			label: 'European Union'
		},
		{
			label: 'Japan'
		},
		{
			label: 'United Kingdom'
		},
		{
			label: 'United States'
		},
		{
			label: 'France'
		},
		{
			label: 'Hong Kong'
		},
		{
			label: 'Switzerland'
		},
		{
			label: 'Austria'
		},
		{
			label: 'Sweden'
		}
	],
	links: [
		{
			from: 'Netherlands',
			to: 'European Union',
			value: 798744
		},
		{
			from: 'Germany',
			to: 'European Union',
			value: 1468990
		},
		{
			from: 'European Union',
			to: 'France',
			value: 745931
		},
		{
			from: 'European Union',
			to: 'United States',
			value: 660541
		},
		{
			from: 'Canada',
			to: 'United States',
			value: 594546
		},
		{
			from: 'Belgium',
			to: 'European Union',
			value: 628796
		},
		{
			from: 'China',
			to: 'Hong Kong',
			value: 400571
		},
		{
			from: 'China',
			to: 'United States',
			value: 526454
		},
		{
			from: 'European Union',
			to: 'United Kingdom',
			value: 520318
		},
		{
			from: 'China',
			to: 'European Union',
			value: 560536
		},
		{
			from: 'Italy',
			to: 'European Union',
			value: 539556
		},
		{
			from: 'Mexico',
			to: 'United States',
			value: 492715
		},
		{
			from: 'Russia',
			to: 'European Union',
			value: 385778
		},
		{
			from: 'Spain',
			to: 'European Union',
			value: 365191
		},
		{
			from: 'China',
			to: 'Japan',
			value: 312062
		},
		{
			from: 'European Union',
			to: 'Switzerland',
			value: 328609
		},
		{
			from: 'South Korea',
			to: 'China',
			value: 229073
		},
		{
			from: 'European Union',
			to: 'Austria',
			value: 244913
		},
		{
			from: 'Japan',
			to: 'United States',
			value: 206091
		},
		{
			from: 'European Union',
			to: 'Sweden',
			value: 204849
		},
		{
			from: 'Germany',
			to: 'United States',
			value: 184287
		}
	]
};

// https://bl.ocks.org/d3noob/5028304
export const greenhouse = {
	links: [
		{ source: 'Agricultural Energy Use', target: 'Carbon Dioxide', value: '1.4' },
		{ source: 'Agriculture', target: 'Agriculture Soils', value: '5.2' },
		{ source: 'Agriculture', target: 'Livestock and Manure', value: '5.4' },
		{ source: 'Agriculture', target: 'Other Agriculture', value: '1.7' },
		{ source: 'Agriculture', target: 'Rice Cultivation', value: '1.5' },
		{ source: 'Agriculture Soils', target: 'Nitrous Oxide', value: '5.2' },
		{ source: 'Air', target: 'Carbon Dioxide', value: '1.7' },
		{ source: 'Aluminium Non-Ferrous Metals', target: 'Carbon Dioxide', value: '1.0' },
		{ source: 'Aluminium Non-Ferrous Metals', target: 'HFCs - PFCs', value: '0.2' },
		{ source: 'Cement', target: 'Carbon Dioxide', value: '5.0' },
		{ source: 'Chemicals', target: 'Carbon Dioxide', value: '3.4' },
		{ source: 'Chemicals', target: 'HFCs - PFCs', value: '0.5' },
		{ source: 'Chemicals', target: 'Nitrous Oxide', value: '0.2' },
		{ source: 'Coal Mining', target: 'Carbon Dioxide', value: '0.1' },
		{ source: 'Coal Mining', target: 'Methane', value: '1.2' },
		{ source: 'Commercial Buildings', target: 'Carbon Dioxide', value: '6.3' },
		{ source: 'Deforestation', target: 'Carbon Dioxide', value: '10.9' },
		{ source: 'Electricity and heat', target: 'Agricultural Energy Use', value: '0.4' },
		{ source: 'Electricity and heat', target: 'Aluminium Non-Ferrous Metals', value: '0.4' },
		{ source: 'Electricity and heat', target: 'Cement', value: '0.3' },
		{ source: 'Electricity and heat', target: 'Chemicals', value: '1.3' },
		{ source: 'Electricity and heat', target: 'Commercial Buildings', value: '5.0' },
		{ source: 'Electricity and heat', target: 'Food and Tobacco', value: '0.5' },
		{ source: 'Electricity and heat', target: 'Iron and Steel', value: '1.0' },
		{ source: 'Electricity and heat', target: 'Machinery', value: '1.0' },
		{ source: 'Electricity and heat', target: 'Oil and Gas Processing', value: '0.4' },
		{ source: 'Electricity and heat', target: 'Other Industry', value: '2.7' },
		{ source: 'Electricity and heat', target: 'Pulp - Paper and Printing', value: '0.6' },
		{ source: 'Electricity and heat', target: 'Residential Buildings', value: '5.2' },
		{ source: 'Electricity and heat', target: 'T and D Losses', value: '2.2' },
		{ source: 'Electricity and heat', target: 'Unallocated Fuel Combustion', value: '2.0' },
		{ source: 'Energy', target: 'Electricity and heat', value: '24.9' },
		{ source: 'Energy', target: 'Fugitive Emissions', value: '4.0' },
		{ source: 'Energy', target: 'Industry', value: '14.7' },
		{ source: 'Energy', target: 'Other Fuel Combustion', value: '8.6' },
		{ source: 'Energy', target: 'Transportation', value: '14.3' },
		{ source: 'Food and Tobacco', target: 'Carbon Dioxide', value: '1.0' },
		{ source: 'Fugitive Emissions', target: 'Coal Mining', value: '1.3' },
		{ source: 'Fugitive Emissions', target: 'Oil and Gas Processing', value: '3.2' },
		{ source: 'Harvest / Management', target: 'Carbon Dioxide', value: '1.3' },
		{ source: 'Industrial Processes', target: 'Aluminium Non-Ferrous Metals', value: '0.4' },
		{ source: 'Industrial Processes', target: 'Cement', value: '2.8' },
		{ source: 'Industrial Processes', target: 'Chemicals', value: '1.4' },
		{ source: 'Industrial Processes', target: 'Other Industry', value: '0.5' },
		{ source: 'Industry', target: 'Aluminium Non-Ferrous Metals', value: '0.4' },
		{ source: 'Industry', target: 'Cement', value: '1.9' },
		{ source: 'Industry', target: 'Chemicals', value: '1.4' },
		{ source: 'Industry', target: 'Food and Tobacco', value: '0.5' },
		{ source: 'Industry', target: 'Iron and Steel', value: '3.0' },
		{ source: 'Industry', target: 'Oil and Gas Processing', value: '2.8' },
		{ source: 'Industry', target: 'Other Industry', value: '3.8' },
		{ source: 'Industry', target: 'Pulp - Paper and Printing', value: '0.5' },
		{ source: 'Iron and Steel', target: 'Carbon Dioxide', value: '4.0' },
		{ source: 'Land Use Change', target: 'Deforestation', value: '10.9' },
		{ source: 'Land Use Change', target: 'Harvest / Management', value: '1.3' },
		{ source: 'Landfills', target: 'Methane', value: '1.7' },
		{ source: 'Livestock and Manure', target: 'Methane', value: '5.1' },
		{ source: 'Livestock and Manure', target: 'Nitrous Oxide', value: '0.3' },
		{ source: 'Machinery', target: 'Carbon Dioxide', value: '1.0' },
		{ source: 'Oil and Gas Processing', target: 'Carbon Dioxide', value: '3.6' },
		{ source: 'Oil and Gas Processing', target: 'Methane', value: '2.8' },
		{ source: 'Other Agriculture', target: 'Methane', value: '1.4' },
		{ source: 'Other Agriculture', target: 'Nitrous Oxide', value: '0.3' },
		{ source: 'Other Fuel Combustion', target: 'Agricultural Energy Use', value: '1.0' },
		{ source: 'Other Fuel Combustion', target: 'Commercial Buildings', value: '1.3' },
		{ source: 'Other Fuel Combustion', target: 'Residential Buildings', value: '5.0' },
		{ source: 'Other Fuel Combustion', target: 'Unallocated Fuel Combustion', value: '1.8' },
		{ source: 'Other Industry', target: 'Carbon Dioxide', value: '6.6' },
		{ source: 'Other Industry', target: 'HFCs - PFCs', value: '0.4' },
		{ source: 'Pulp - Paper and Printing', target: 'Carbon Dioxide', value: '1.1' },
		{ source: 'Rail - Ship and Other Transport', target: 'Carbon Dioxide', value: '2.5' },
		{ source: 'Residential Buildings', target: 'Carbon Dioxide', value: '10.2' },
		{ source: 'Rice Cultivation', target: 'Methane', value: '1.5' },
		{ source: 'Road', target: 'Carbon Dioxide', value: '10.5' },
		{ source: 'T and D Losses', target: 'Carbon Dioxide', value: '2.2' },
		{ source: 'Transportation', target: 'Air', value: '1.7' },
		{ source: 'Transportation', target: 'Rail - Ship and Other Transport', value: '2.5' },
		{ source: 'Transportation', target: 'Road', value: '10.5' },
		{ source: 'Unallocated Fuel Combustion', target: 'Carbon Dioxide', value: '3.0' },
		{ source: 'Unallocated Fuel Combustion', target: 'Methane', value: '0.4' },
		{ source: 'Unallocated Fuel Combustion', target: 'Nitrous Oxide', value: '0.4' },
		{ source: 'Waste', target: 'Landfills', value: '1.7' },
		{ source: 'Waste', target: 'Waste water - Other Waste', value: '1.5' },
		{ source: 'Waste water - Other Waste', target: 'Methane', value: '1.2' },
		{ source: 'Waste water - Other Waste', target: 'Nitrous Oxide', value: '0.3' }
	],
	nodes: [
		{ name: 'Energy' },
		{ name: 'Industrial Processes' },
		{ name: 'Electricity and heat' },
		{ name: 'Industry' },
		{ name: 'Land Use Change' },
		{ name: 'Agriculture' },
		{ name: 'Waste' },
		{ name: 'Transportation' },
		{ name: 'Other Fuel Combustion' },
		{ name: 'Fugitive Emissions' },
		{ name: 'Road' },
		{ name: 'Air' },
		{ name: 'Rail - Ship and Other Transport' },
		{ name: 'Residential Buildings' },
		{ name: 'Commercial Buildings' },
		{ name: 'Unallocated Fuel Combustion' },
		{ name: 'Iron and Steel' },
		{ name: 'Aluminium Non-Ferrous Metals' },
		{ name: 'Machinery' },
		{ name: 'Pulp - Paper and Printing' },
		{ name: 'Food and Tobacco' },
		{ name: 'Chemicals' },
		{ name: 'Cement' },
		{ name: 'Other Industry' },
		{ name: 'T and D Losses' },
		{ name: 'Coal Mining' },
		{ name: 'Oil and Gas Processing' },
		{ name: 'Deforestation' },
		{ name: 'Harvest / Management' },
		{ name: 'Agricultural Energy Use' },
		{ name: 'Agriculture Soils' },
		{ name: 'Livestock and Manure' },
		{ name: 'Rice Cultivation' },
		{ name: 'Other Agriculture' },
		{ name: 'Landfills' },
		{ name: 'Waste water - Other Waste' },
		{ name: 'Carbon Dioxide' },
		{ name: 'HFCs - PFCs' },
		{ name: 'Methane' },
		{ name: 'Nitrous Oxide' }
	]
};
