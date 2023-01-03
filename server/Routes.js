import rawStationsData from "../resources/stations.json" assert { type: "json" };
import rawTripsData from "../resources/trips.json" assert { type: "json" };

export default class Routes {
    getHeadSign({tripId, lastStopId}){
        return this.getHeadSignByPartialTripId(tripId) || this.getStopNameById(lastStopId);
    }
    getHeadSignByPartialTripId(partialTripId){
        const matchingTrip = rawTripsData.find(({ trip_id }) => trip_id.includes(partialTripId));
        return (matchingTrip && matchingTrip[0] && matchingTrip[0].trip_headsign) ? matchingTrip[0].trip_headsign : false;
    }
    getStopNameById(stopId){
        const matchingStop = rawStationsData.find(({ stop_id }) => stop_id === stopId);
        return (matchingStop && matchingStop.stop_name) ? matchingStop.stop_name : 'Unknown';
    }
    getRouteTiming({rawTime}){
        const currentTime = Math.round(Date.now() / 1000);
        const timeDiff = rawTime - currentTime;
        const departureTime = this.convertEpoch(rawTime);
        const minutesAway = this.secsToMins(timeDiff);
        return {
            eta: departureTime,
            minAway: minutesAway
        }
    }
    secsToMins(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time - minutes * 60;
        return `${minutes}m, ${seconds}s`;
    }

    convertEpoch(time) {
        const date = new Date(time * 1000);
        return date
            .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            .toLowerCase();
    }
}