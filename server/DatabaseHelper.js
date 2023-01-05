
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, goOffline } from "firebase/database";

export default class DatabaseHelper {
  constructor(databaseURL) {
    this.app = initializeApp({
      databaseURL,
    });
  }

  async setRealTimeData({stopIds, stopNames, stopData}){
    const APIMeasure = performance.measure("api-duration", "api-started", "api-finished");
    console.log('API work finished in: ' + APIMeasure.duration + ' milliseconds.');
    performance.mark('db-started');
    const db = getDatabase();
    await set(ref(db), {
        'lastSynced': new Date().toUTCString(),
        'processingMs': APIMeasure.duration,
        'stopIds': stopIds,
        'stopNames': stopNames,
        'stopData': stopData
    });
    goOffline(db);
    performance.mark('db-finished');
    console.log('DB work finished in: '+ performance.measure("db-duration", "db-started", "db-finished").duration + ' milliseconds.');
    console.log('RT data synced!')
  }

  async setParentData(list){
    const db = getDatabase();
    let dropdownName, baseStopId;
    for(let i = 0; i < list.length; i++){
        [dropdownName, baseStopId] = list[i]
        await set(ref(db, 'baseStopNames/'+dropdownName), baseStopId);
    }
    goOffline(db);
    console.log('Parent station data synced!')
  }
}