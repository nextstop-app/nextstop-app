
## Checklist
[ ] Backend Integration
- [x] Output any sort of output from realtime MTA api
- [ ] add relevant information for LAMetric time integration 
    - [x] train name - uses trips.json
    - [x] station name
    - [x] figure out how to map newer train names added after MTA's trips.json (nov 29th) - use last stop name
- [ ] combine api feeds into master list for same station ids (ex: smith-9th street use G and F line apis, hoyt-s (ACE+G), etc.)
- [50%] Add export data to auto updating gist or text/json file format
- [ ] Create cron/automation to auto update gist/raw file x min / seconds
- [ ] Automate trips.json when it is updated upstream

[ ] Lametric integration
- [ ] figure out filtering via dropdown selection
- [ ] use express or similar to parse url params (line, station)
- [ ] private the parsing api to only be used by lametric or webapp (keep raw data public - gists)
- [ ] add logos for each train

[ ] Web app integration
- [ ] filtering via dropdown selection
- [ ] match dropdown to backend integration
---

## Individual API Train(s) Data Example v.02
```json
 "R42N": {
    "stopName": "Bay Ridge Av",
    "trains": [
      {
        "trainId": "R",
        "trainName": "Whitehall St",
        "eta": "12:31 am",
        "minAway": "18m, 3s",
        "rawEta": 1083
      },
      {
        "trainId": "R",
        "trainName": "Whitehall St",
        "eta": "12:51 am",
        "minAway": "38m, 3s",
        "rawEta": 2283
      },
      {
        "trainId": "R",
        "trainName": "Whitehall St-South Ferry",
        "eta": "1:11 am",
        "minAway": "58m, 3s",
        "rawEta": 3483
      }
    ]
  },
  ```
  ## Master Station Data Example v.02
```json
tbd
```