
## Checklist
[ ] Backend Integration
- [x] Output any sort of output from realtime MTA api
- [ ] add relevant information for LAMetric time integration 
    - [x] train name - uses trips.json
    - [x] station name
    - [ ] train direction ? (name might be better)
- [ ] Add export data to auto updating gist or text/json file format
- [ ] Create cron/automation to auto update gist/raw file x min / seconds
- [ ] Automate trips.json when it is updated upstream

[ ] Lametric integration
- [ ] figure out filtering via dropdown selection
- [ ] add logos for each train
---
## Raw Train Data Example v.01
```json
    {
      trainId: 'G',
      stationName: 'Court Sq',
      trainName: 'Church Av',
      trainDirection: 'Southbound',
      eta: '6:55 pm',
      minAway: '7m, 4s',
    },
```