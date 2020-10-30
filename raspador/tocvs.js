const fs = require('fs');
const path = require('path');
let f = fs.readFileSync('salida_convencion.json');
let current = JSON.parse(f);

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriterCurrent = createCsvWriter({
    path: 'salida_conv.csv',
    header: [
	{id: 'Comuna', title: 'Comuna'},
	{id: 'Circ_Elec', title: 'Circ_Elec'},
	{id: 'Local', title: 'Local'},
	{id: 'Mesa', title: 'Mesa'},
	{id: 'Mixta', title: 'Mixta'},
	{id: 'CC', title: 'CC'},
	{id: 'Nulos', title: 'Nulos'},
	{id: 'Blancos', title: 'Blancos'},
	{id: 'Total', title: 'Total'},
	{id: 'p', title: 'p'},
	{id: 'md', title: 'md'}
    ]
});
csvWriterCurrent.writeRecords(current)       // returns a promise
    .then(() => {
	console.log('...Done');
    });
