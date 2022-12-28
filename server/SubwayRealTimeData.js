import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import fetch from "node-fetch";
import stationData from "../resources/station-list.json" assert { type: "json" };
import tripsData from "../resources/trips.json" assert { type: "json" };

export default class SubwayRealTimeData {
  constructor(uri) {
    this.uri = uri;
    this.response = {};
    this.json = {};
  }

  async getRawTrainData() {
    const response = await fetch(this.uri, {
      headers: { "x-api-key": process.env.MTA_TOKEN },
    });

    //TODO: removed try/catch, so this is a bit weird looking now.
    if (!response.ok) {
      const error = new Error(
        `${response.url}: ${response.status} ${response.statusText}`
      );
      error.response = response;
      throw error;
      //process.exit(1);
    }
    const tripIds = new Set();
    const currentTime = Math.round(Date.now() / 1000);
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    feed.entity.forEach((entity) => {
      // TODO: cleanup all these nested if statements
      if (entity.tripUpdate && entity.tripUpdate.stopTimeUpdate) {
        // TODO: cleanup all these nested if statements
        if (entity.tripUpdate.trip && entity.tripUpdate.trip.tripId) {
          const tripId = entity.tripUpdate.trip.tripId;
          // TODO: cleanup all these nested if statements
          if (!tripIds.has(tripId)) {
            tripIds.add(tripId);
            entity.tripUpdate.stopTimeUpdate.forEach((scheduledTrip) => {
              const whichStation = scheduledTrip.stopId; //TODO: cleanup by train/station

              if(!this.json[whichStation]){
                this.json[whichStation] = {trains: []};
              }
              if (
                scheduledTrip &&
                scheduledTrip.departure &&
                scheduledTrip.departure.time
              ) {

                const timeDiff = scheduledTrip.departure.time - currentTime;

                if (timeDiff > 0) {
                  const departureTime = this.convertEpoch(scheduledTrip.departure.time);
                  const minutesAway = this.secsToMins(timeDiff);
                  const stationStopData = stationData[scheduledTrip.stopId];
                  const stationName = stationStopData.stop_name;
                  const trainName = this.findHeadSign(tripId);
                  let trainDirection = '';
                  //TODO: do we trust this?
                  if(scheduledTrip.stopId){
                    if(scheduledTrip.stopId.endsWith('S')){
                      trainDirection = "Southbound"
                    } else if(scheduledTrip.stopId.endsWith('X')){
                      trainDirection = "Express? or CrossTown?" //TODO
                    } else if(scheduledTrip.stopId.endsWith('N')){
                      trainDirection = "Northbound"
                    }
                  }

                  const trainStop = {
                    trainId: entity.tripUpdate.trip.routeId,
                    //stopId: scheduledTrip.stopId,
                    stationName,
                    trainName,
                    trainDirection,
                    eta: departureTime,
                    //rawTime: scheduledTrip.departure.time,
                    minAway: minutesAway,
                    rawEta: timeDiff,
                  };

                  // Add to response
                  this.json[whichStation].trains.push(trainStop);
                }
              }
            });
          }
        }
      }
    });
    Object.values(this.json).forEach((station) => {
      station.trains.sort((a,b) => a.rawEta - b.rawEta);
    });
    console.log(this.json['G22S']);

  }

  findHeadSign(partialTripId){
    const filtered = tripsData.filter(trip => 
       trip.trip_id.includes(partialTripId)
    );
    return filtered.length === 1 ? filtered[0].trip_headsign : 'Unknown'
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