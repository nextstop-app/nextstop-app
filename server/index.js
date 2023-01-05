import * as dotenv from 'dotenv'
dotenv.config()
import SubwayRealTimeData from './SubwayRealTimeData.js';
import StopsList from './StopsList.js';
import DatabaseHelper from './DatabaseHelper.js';

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

let init = async () => {

    // Process each API
    for (const apiLine of APILines){
        await apiLine.getRawTrainData()
        for (const [stopId, {trains, lines}] of Object.entries(apiLine.getTripsResponseData())) {
            MasterStopsList.addTrainsToStop(stopId, trains, lines)
        }
    }

    MasterStopsList.getDetailsForStop("A42S"); //demo

    MasterStopsList.outputJson(); // output master file

    DBHelper.setRealTimeData(MasterStopsList.outputObject()) // update upstream db

    //MasterStopsList.setParentSelectionList();
    //console.log(MasterStopsList.outputMasterStopList())
    //MasterStopsList.generateMasterStopListFile();
    //DBHelper.setParentData(MasterStopsList.outputMasterStopList())
};

init();

