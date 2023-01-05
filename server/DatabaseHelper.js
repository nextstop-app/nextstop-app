
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, goOffline } from "firebase/database";

export default class DatabaseHelper {
  constructor(databaseURL) {
    this.app = initializeApp({
      databaseURL,
    });
  }

  async setRealTimeData({stopIds, stopNames, stopData}){
      const db = getDatabase();
      await set(ref(db), {
          'stopIds': stopIds,
          'stopNames': stopNames,
          'stopData': stopData
      });
      goOffline(db);
  }

  async setParentData(list){
    const db = getDatabase();
    let dropdownName, baseStopId;
    for(let i = 0; i < list.length; i++){
        [dropdownName, baseStopId] = list[i]
        console.log(dropdownName, baseStopId)
        await set(ref(db, 'baseStopNames/'+dropdownName), baseStopId);
    }
    goOffline(db);
  }
}