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
    getMatchingStopData(stopId){
        const matchingStop = rawStationsData.find(({ stop_id }) => stop_id === stopId);
        return matchingStop && matchingStop.stop_name ? [matchingStop.stop_name, matchingStop.parent_station || ''] : ['Unknown', '']
    }
    getStopNameById(stopId){
        const matchingStop = rawStationsData.find(({ stop_id }) => stop_id === stopId);
        return (matchingStop && matchingStop.stop_name) ? matchingStop.stop_name : 'Unknown';
    }
}