
## Checklist
[ ] Backend Integration
- [x] Output any sort of output from realtime MTA api
- [x] add relevant information for LAMetric time integration 
    - [x] train name - uses trips.json
    - [x] station name
    - [x] figure out how to map newer train names added after MTA's trips.json (nov 29th) - use last stop name
- [x] combine api feeds into master list for same station ids (ex: smith-9th street use G and F line apis, hoyt-s (ACE+G), etc.)
- [ 50% ] Add export data to auto updating gist or text/json file format
- [ ] Create cron/automation to auto update gist/raw file x min / seconds
- [x] Automate trips.json / stations.json when it is updated upstream (converted to use the utility csvtojson)

[ ] Lametric integration
- [ 60% ] figure out filtering via dropdown selection - refactored the stop logic
- [ ] use express or similar to parse url params (line, station)
- [ ] private the parsing api to only be used by lametric or webapp (keep raw data public - gists)
- [ ] add logos for each train

[ ] Web app integration
- [ 60% ]  filtering via dropdown selection
- [ ] match dropdown to backend integration
---
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
    ```
    *This uses the realtime feeds [MTA Realtime API](https://api.mta.info/#/subwayRealTimeFeeds). You will need to sign up to develop or extend this application for your own usage.*

1) `npm install`
1) `npm run start` - example uses stopId = A42S = Hoyt-Schermerhorn
---
## Master Station Data Example
```json
{
    "trainId": "A42S",
    "stopName": "Hoyt-Schermerhorn Sts",
    "lines": [
        "A",
        "G",
        "C"
    ],
    "trains": [
        {
            "line": "A",
            "trainName": "Ozone Park-Lefferts Blvd",
            "eta": "6:10 pm",
            "minAway": "1m, 25s"
        },
        {
            "line": "G",
            "trainName": "Church Av",
            "eta": "6:13 pm",
            "minAway": "4m, 23s"
        },
        {
            "line": "A",
            "trainName": "Far Rockaway-Mott Av",
            "eta": "6:17 pm",
            "minAway": "7m, 53s"
        },
        {
            "line": "A",
            "trainName": "Ozone Park-Lefferts Blvd",
            "eta": "6:19 pm",
            "minAway": "9m, 53s"
        },
        {
            "line": "C",
            "trainName": "Euclid Av",
            "eta": "6:19 pm",
            "minAway": "9m, 53s"
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
1) Add the csv file for stations.txt and rename to input.csv, insert it to `/in/input.csv` folder
1) `npm run start`
1) Move `/out/output.json` to the `/resources/` folder
1) Rename to appropriate filename: `stations|trips.json`
---
## Disclaimer
By using / modifying or consuming this software, you are abiding by the existing MTA regulations for the handling of their data. By using this application, the developer is not held responsible for any loss or damages that is in relation to this application. The station/train information provided by this app to the end-user may not be real time because of the lag time between the real time of the MTA data and the hosting of the server where data is held.