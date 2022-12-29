import * as dotenv from 'dotenv'
dotenv.config()
import SubwayRealTimeData from './SubwayRealTimeData.js';

const APILines = [
    new SubwayRealTimeData(process.env.MTA_API_URL_1234567, 'lines-1234567'),
    new SubwayRealTimeData(process.env.MTA_API_URL_NQRW, 'lines-NQRW'),
    new SubwayRealTimeData(process.env.MTA_API_URL_BDFM, 'lines-BDFM'),
    new SubwayRealTimeData(process.env.MTA_API_URL_JZ, 'lines-JZ'),
    new SubwayRealTimeData(process.env.MTA_API_URL_G, 'lines-G'),
    new SubwayRealTimeData(process.env.MTA_API_URL_L, 'lines-L')
]

APILines.forEach(async lines => {
    await lines.getRawTrainData()
    lines.generateJsonFile()
});