import fs from 'fs';
import Routes from './Routes.js';

export default class Stop extends Routes{
    constructor(id, name) {
        super();
        this.id = id;
        this.stopName = name;
        this.direction = id.endsWith('S') ? 'Southbound' : (id.endsWith('N') ? 'Northbound' : 'NA');
        this.lines = new Set();
        this.trains = [];
        this.parentId = '';
    }

    setStopName(){
        const [stop_name, parent_station] = this.getMatchingStopData(this.id);
        this.stopName = stop_name;
        this.parentId = parent_station;
        return this.stopName;
    }


    addTrainData(details){
        this.trains = [...this.trains, ...details]
        this.sortTrains(); //TODO: move to full details maybe?
    }

    addLinesData(lines){
        for (const routeId of lines) {
            this.lines.add(routeId)
        }
    }

    sortTrains(){
        this.trains.sort((a, b) => a.rawEta - b.rawEta);
    }

    getParentId(){
        return this.parentId
    }

    getFullDetails(maxTrains = 5){
        let trains = this.trains.slice(0, maxTrains)

        return {
            trainId: this.id,
            stopName: this.stopName,
            lines: Array.from(this.lines),
            direction: this.direction,
            trains
        }
    }

    getSelectionName(){
        if(this.stopName === "Unknown") return this.stopName;
        return `${this.stopName} (${this.lines.join(',')})`
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.stopName;
    }
    
    getDirection(){
        return this.direction;
    }

    getLines(){
        return this.lines;
    }

    /*generateJsonFile() {
        // convert JSON object to a string
        const data = JSON.stringify({
            trainId: this.id,
            stopName: this.stopName,
            lines: this.lines,
            trains: this.trains
        })

        fs.writeFile(`out/lines/${this.id}.json`, data, err => {
            if (err) {
                throw err
            }
            console.log('JSON data '+this.id+'is saved.')
        })
    }*/

}