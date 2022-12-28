import * as dotenv from 'dotenv'
dotenv.config()
import SubwayRealTimeData from './SubwayRealTimeData.js';

const GLine = new SubwayRealTimeData(process.env.MTA_API_URL_G);
const OneToSevenLines = new SubwayRealTimeData(process.env.MTA_API_URL_1_to_7);

GLine.getRawTrainData();
//OneToSevenLines.getRawTrainData();