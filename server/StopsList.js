import fs from 'fs';
import Stop from './Stop.js';

export default class StopsList {
    constructor() {
        this.stops = 0;
        this.stopIds = [];
        this.stopNames = [];
        this.data = [];
        this.parentList = {};
    }

    addTrainsToStop(stopId, trains, lines){
        let stopIndex = this.stopIds.indexOf(stopId)
        if (stopIndex === -1) {
            stopIndex = this.addNewStop(stopId);
            this.stops++;
        }
        this.data[stopIndex].addTrainData(trains)
        this.data[stopIndex].addLinesData(lines)
    }

    addNewStop(stopId){
        const stopIndex = this.stopIds.push(stopId) - 1
        this.data.push(new Stop(stopId));
        this.stopNames.push(this.data[stopIndex].setStopName())
        return stopIndex
    }

    getDetailsForStop(stopId) {
        let stopIndex = this.stopIds.indexOf(stopId)
        if (!this.data[stopIndex]) return []
    }

    setParentSelectionList(){
        let parentId, stop;
        for(let i = 0; i < this.stops; i++){
            stop = this.data[i];
            parentId = stop.getParentId();
            //if a child of parent, then combine lines together
            if(parentId !== ''){
                this.parentList[parentId] = this.parentList[parentId] || {name: stop.getName(), lines: stop.getLines() }
                for (const routeId of stop.getLines()) {
                    this.parentList[parentId].lines.add(routeId)
                }
            }
        }
    }

    getSelectionNames(idAssoc=false){
        const parentKeys = Object.keys(this.parentList)
        const result = [];
        let name, lines, formattedName;
        for(let i = 0; i < parentKeys.length; i++){
            ({name, lines} = this.parentList[parentKeys[i]]);
            formattedName = `${name} (${Array.from(lines).sort().join(',')})`;
            if(idAssoc){
                result.push([formattedName, parentKeys[i]])
            } else {
                result.push(formattedName)
            }
        }
        result.sort();
        return result;
    }

    outputMasterStopList() {
        return this.getSelectionNames(true);
    }
    generateMasterStopListFile() {
        fs.writeFile(`out/station-selection-list.json`, JSON.stringify(this.getSelectionNames(true),  null, " "), err => {
            if (err) {
                throw err
            }
            console.log('JSON data is saved to /out/station-selection-list.json.')
        })
    }
    outputObject() {
        return {
            stopIds: this.stopIds,
            stopNames: this.stopNames,
            stopData: this.data
        }
    }

    outputJson() {
        const data = JSON.stringify({
            stopIds: this.stopIds,
            stopNames: this.stopNames,
            stopData: this.data
        }, (key, value) => value instanceof Set ? [...value] : value)

        fs.writeFile(`out/stoplist.json`, data, err => {
            if (err) {
                throw err
            }
            console.log('JSON data is saved to /out/stoplist.json.')
        })
    }
}