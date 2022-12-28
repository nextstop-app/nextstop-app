let csvToJson = require('convert-csv-to-json');

let fileInputName = 'in/input.csv'; 
let fileOutputName = 'out/output.json';

csvToJson.fieldDelimiter(',').generateJsonFileFromCsv(fileInputName,fileOutputName);