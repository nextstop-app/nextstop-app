
import admin from 'firebase-admin';

export default class DatabaseHelper {
  constructor(databaseURL) {
  this.app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL,
    });
  }

  async setRealTimeData({stopIds, stopNames, stopData}){
    const APIMeasure = performance.measure("api-duration", "api-started", "api-finished");
    console.log('API work finished in: ' + APIMeasure.duration + ' milliseconds.');
    performance.mark('db-started');
    const db = this.app.database();
    await db.ref('/').set({
        'lastSynced': new Date().toUTCString(),
        'processingMs': APIMeasure.duration,
        'stopIds': stopIds,
        'stopNames': stopNames,
        'stopData': stopData
    });
    db.goOffline();
    performance.mark('db-finished');
    console.log('DB work finished in: '+ performance.measure("db-duration", "db-started", "db-finished").duration + ' milliseconds.');
    console.log('RT data synced!')
  }

  async setParentData(list){
    let dropdownName, baseStopId;
    const db = this.app.database();
    for(let i = 0; i < list.length; i++){
        [dropdownName, baseStopId] = list[i]
      await db.ref(db, 'baseStopNames/' + dropdownName).set(baseStopId);
    }
    db.goOffline();
    console.log('Parent station data synced!')
  }
}