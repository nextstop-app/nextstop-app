import * as dotenv from 'dotenv'
dotenv.config()
import SubwayRealTimeData from './SubwayRealTimeData.js';
import StopsList from './StopsList.js';
import DatabaseHelper from './DatabaseHelper.js';

const params = process.argv.slice(2);
const operation = params[0] || 'rtfile';

const DBHelper = new DatabaseHelper(process.env.FIREBASE_RT_URI);
const MasterStopsList = new StopsList();
const APILines = [
    new SubwayRealTimeData(process.env.MTA_API_URL_1234567),
    new SubwayRealTimeData(process.env.MTA_API_URL_ACE),
    new SubwayRealTimeData(process.env.MTA_API_URL_NQRW),
    new SubwayRealTimeData(process.env.MTA_API_URL_BDFM),
    new SubwayRealTimeData(process.env.MTA_API_URL_JZ),
    new SubwayRealTimeData(process.env.MTA_API_URL_G),
    new SubwayRealTimeData(process.env.MTA_API_URL_L)
]
let progress = 1;
let init = async () => {
    console.log('Starting API Processing..');

    // Process each API
    performance.mark('api-started');
    for (const apiLine of APILines){
        console.info(`Processing API (${progress++} of 7)`)
        await apiLine.getRawTrainData()
        for (const [stopId, {trains, lines}] of Object.entries(apiLine.getTripsResponseData())) {
            MasterStopsList.addTrainsToStop(stopId, trains, lines)
        }
    }
    performance.mark('api-finished');
    console.log('Finished API Processing..');

    switch(operation){
        case 'parentfile':
            console.log('Generating parent station file..');
            MasterStopsList.setParentSelectionList();
            MasterStopsList.generateMasterStopListFile();
            break;
        case 'parentsync':
            console.log('Syncing parent stations to database..');
            MasterStopsList.setParentSelectionList();
            await DBHelper.setParentData(MasterStopsList.outputMasterStopList())
            break;
        case 'rtsync':
            console.log('Syncing RT data to database..');
            await DBHelper.setRealTimeData(MasterStopsList.outputObject()) // update upstream db
            break;
        case 'rtfile':
        default:
            console.log('Generating RT data file..');
            MasterStopsList.outputJson(); // output master file
            break;
    }
    console.log('Done!');
    process.exit();
};

init();

