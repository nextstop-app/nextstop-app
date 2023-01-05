var { initializeApp } = require('firebase/app');
var { getDatabase, ref, onValue, equalTo, query, orderByKey, orderByValue, child, get } = require("firebase/database");

const firebaseConfig = {
  databaseURL: process.env.FIREBASE_RT_URI,
};

const fbApp = initializeApp(firebaseConfig);

const db = getDatabase(fbApp);

const getStopIdIndex = (stopId, callback) => {
  const indexRef = query(ref(db, process.env.DB_ID_PATH), orderByValue(), equalTo(stopId));
  onValue(indexRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      console.log(childKey);
      callback(childKey)
    });
  }, {
    onlyOnce: true
  });
}

const getStopNameByIndex = (dbIndex, callback) => {
  get(ref(db, `${process.env.DB_NAME_PATH}${dbIndex}`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      callback(snapshot.val())
    } else {
      console.log("No stopname available");
      callback('')

    }
  }).catch((error) => {
    console.error(error);
  });
}

const getStopDataByIndex = (dbIndex, callback) => {
  get(ref(db, `${process.env.DB_DATA_PATH}${dbIndex}`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      callback(snapshot.val())
    } else {
      console.log("No stopdata available");
      callback([])
    }
    callback()
  }).catch((error) => {
    console.error(error);
  });
}

module.exports = {
    getStopIdIndex,
    getStopNameByIndex,
    getStopDataByIndex
};
