import * as dotenv from 'dotenv'
dotenv.config()
import SubwayRealTimeData from './SubwayRealTimeData.js';
import StopsList from './StopsList.js';

const MasterStopsList = new StopsList();

const APILines = [
    //new SubwayRealTimeData(process.env.MTA_API_URL_1234567, 'lines-1234567'),
    new SubwayRealTimeData(process.env.MTA_API_URL_ACE, 'lines-ACE'),
    //new SubwayRealTimeData(process.env.MTA_API_URL_NQRW, 'lines-NQRW'),
    //new SubwayRealTimeData(process.env.MTA_API_URL_BDFM, 'lines-BDFM'),
    //new SubwayRealTimeData(process.env.MTA_API_URL_JZ, 'lines-JZ'),
    new SubwayRealTimeData(process.env.MTA_API_URL_G, 'lines-G'),
    //new SubwayRealTimeData(process.env.MTA_API_URL_L, 'lines-L')
]

let init = async () => {
    for (const lines of APILines){
        await lines.getRawTrainData()
        for (const [stopId, trains] of Object.entries(lines.getTripsResponseData())) {
            MasterStopsList.addTrainsToStop(stopId, trains)
        }
    }

    MasterStopsList.getDetailsForStop("A42S");
};

init();

