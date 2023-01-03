import Stop from './Stop.js';

export default class StopsList {
    constructor() {
        this.stopIds = [];
        this.stopNames = [];
        this.data = [];
    }

    addTrainsToStop(stopId, trains){
        let stopIndex = this.stopIds.indexOf(stopId)
        if (stopIndex === -1) {
            stopIndex = this.stopIds.push(stopId) - 1
            this.data.push(new Stop(stopId));
            this.stopNames.push(this.data[stopIndex].setStopName())
        }
        this.data[stopIndex].addTrainData(trains)
    }

    getDetailsForStop(stopId) {
        let stopIndex = this.stopIds.indexOf(stopId)
        if (!this.data[stopIndex]) return []
        // process viewer details (stop name, train name, rearrangements)
        console.log(JSON.stringify(this.data[stopIndex].getFullDetails(5)))
    }
}