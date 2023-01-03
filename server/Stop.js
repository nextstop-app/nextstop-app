import fs from 'fs';
import Routes from './Routes.js';

export default class Stop extends Routes{
    constructor(id, name) {
        super();
        this.id = id;
        this.stopName = name;
        this.lines = [];
        this.trains = [];
    }

    setStopName(){
        this.stopName = this.getStopNameById(this.id);
        return this.stopName;
    }

    addTrainData(details){
        this.trains = [...this.trains, ...details]
        this.sortTrains(); //TODO: move to full details maybe?
    }

    sortTrains(){
        this.trains.sort((a, b) => a.rawEta - b.rawEta);
    }

    getTrainsMetadata(trains){
        return Object.values(trains).map((train) => {
            const trainName = this.getHeadSign(train);
            if (this.lines.indexOf(train.routeId) < 0) { //adds to lines if not added previously  (TODO: take this out of )
                this.lines.push(train.routeId)
            }
            return {
                line: train.routeId,
                trainName,
                ...this.getRouteTiming(train),
                //...train
            }
        });
    }

    getFullDetails(maxTrains = 5){
        let trains = this.trains.slice(0, maxTrains)
        trains = this.getTrainsMetadata(trains)

        return {
            trainId: this.id,
            stopName: this.stopName,
            lines: this.lines,
            trains
        }
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