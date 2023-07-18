## How to use

1) Clone this repo
1) Populate the `.env` file with the following values from the MTA developer site.
    ```
    MTA_API_URL_ACE=
    MTA_API_URL_1234567=
    MTA_API_URL_NQRW=
    MTA_API_URL_BDFM=
    MTA_API_URL_JZ=
    MTA_API_URL_L=
    MTA_API_URL_G=
    MTA_TOKEN=
    FIREBASE_RT_URI=url-to-firebase-database
    GOOGLE_APPLICATION_CREDENTIALS=path-to-firebase-service.json
    ```
    *This uses the realtime feeds [MTA Realtime API](https://api.mta.info/#/subwayRealTimeFeeds). You will need to sign up to develop or extend this application for your own usage.*

    *It is not required to use firebase, just comment out/remove DBHelper and it's dot functions inside index.js*

1) `npm install`
1) `npm run start` - example uses stopId = A42S = Hoyt-Schermerhorn
---
## Raw Master Station Data Example
```json
{
  "trainId": "A42S",
  "stopName": "Hoyt-Schermerhorn Sts",
  "lines": ["A", "C", "G"],
  "direction": "Southbound",
  "trains": [
    {
      "routeId": "C",
      "tripId": "124100_C..S",
      "lastStopId": "A55S",
      "time": "9:28 pm",
      "rawEta": 441
    },
    {
      "routeId": "G",
      "tripId": "127100_G..S",
      "lastStopId": "F27S",
      "time": "9:30 pm",
      "rawEta": 557
    },
    {
      "routeId": "A",
      "tripId": "124721_A..S",
      "lastStopId": "A65S",
      "time": "9:32 pm",
      "rawEta": 691
    },
    {
      "routeId": "G",
      "tripId": "127920_G..S",
      "lastStopId": "F27S",
      "time": "9:36 pm",
      "rawEta": 921
    },
    {
      "routeId": "A",
      "tripId": "125736_A..S",
      "lastStopId": "H11S",
      "time": "9:43 pm",
      "rawEta": 1311
    }
  ]
}

```
---
## How to update station/trip lists

#### **TODO:**: automate this a bit better 
  *Most up to date data is here: [MTA Data Downloads](http://web.mta.info/developers/developer-data-terms.html#data)*
1) `cd utilities/csvtojson/`
1) `npm install`
1) Create a folder called `/in/` = `utilities/csvtojson/in/`
1) Add the csv file for `stops.txt` or `trips.txt` and rename to input.csv, insert it to `/in/input.csv` folder
1) `npm run start`
1) Move `/out/output.json` to the `/resources/` folder
1) Rename to appropriate filename: stops = `stations.json` or trips = `trips.json`
---
## Disclaimer
By using / modifying or consuming this software, you are abiding by the existing MTA regulations for the handling of their data. By using this application, the developer is not held responsible for any loss or damages that is in relation to this application. The station/train information provided by this app to the end-user may not be real time because of the lag time between the real time of the MTA data and the hosting of the server where data is held.