
## Checklist
[ ] Backend Integration
- [x] Output any sort of output from realtime MTA api
- [ ] add relevant information for LAMetric time integration 
    - [-] train name - need a better way to decipher (G line is broke)
    - [x] station name
    - [ ] train direction ? (name might be better)
- [ ] Add export data to auto updating gist or text/json file format
- [ ] Create cron/automation to auto update gist/raw file x min / seconds

[ ] Lametric integration
- [ ] figure out filtering via dropdown selection
- [ ] add logos for each train
---
## Raw Train Data Example v.01
```json
{
  trainId: 'G',
  stationName: 'Metropolitan Av',
  trainName: 'Metropolitan Av',
  trainDirection: 'Northbound',
  eta: '6:36 pm',
  minAway: '83m, 26s'
}
```
```json
{
  trainId: 'G',
  stationName: 'Nassau Av',
  trainName: 'Nassau Av',
  trainDirection: 'Northbound',
  eta: '6:39 pm',
  minAway: '86m, 26s'
}
```