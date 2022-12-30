import fs from 'fs';
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import fetch from "node-fetch";
import stationData from "../resources/station-list.json" assert { type: "json" };
import tripsData from "../resources/trips.json" assert { type: "json" };
export default class SubwayRealTimeData {
  constructor(uri, fileName) {
    this.uri = uri;
    this.fileName = fileName;
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
        // convert JSON object to a string
    /*    const data = JSON.stringify(feed)
    
        // write JSON string to a file
        fs.writeFile(`out/feed-${this.fileName}.json`, data, err => {
          if (err) {
            throw err
          }
          console.log('JSON feed data is saved.')
        })*/
    feed.entity.forEach((entity) => {
      // TODO: cleanup all these nested if statements
      if (entity.tripUpdate && entity.tripUpdate.stopTimeUpdate) {
        // TODO: cleanup all these nested if statements
        if (entity.tripUpdate.trip && entity.tripUpdate.trip.tripId) {
          const tripId = entity.tripUpdate.trip.tripId;
          // TODO: cleanup all these nested if statements
          if (!tripIds.has(tripId)) {
            tripIds.add(tripId);
            const lastStopData = entity.tripUpdate.stopTimeUpdate[entity.tripUpdate.stopTimeUpdate.length-1]
            const lastStopId = lastStopData && lastStopData.stopId ? lastStopData.stopId : -1;
            entity.tripUpdate.stopTimeUpdate.forEach((scheduledTrip) => {
              const whichStation = scheduledTrip.stopId; //TODO: cleanup by train/station

              if(!this.json[whichStation]){
                this.json[whichStation] = {
                  stopName: this.findStopNameById(whichStation),
                  trains: []
                };
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
                  if(!stationStopData){
                    console.log(`Stop Name Unknown (${tripId}): ${scheduledTrip.stopId}}`)
                    //TODO: add a .json for unknown stops for debugging
                  } else {
                    const stationName = stationStopData.stop_name;
                    const trainName = this.findHeadSign(tripId, lastStopId);
                    const trainStop = {
                      trainId: entity.tripUpdate.trip.routeId,
                      //stopId: scheduledTrip.stopId,
                      //stationName,
                      trainName,
                      eta: departureTime,
                      //rawTime: scheduledTrip.departure.time,
                      minAway: minutesAway,
                      rawEta: timeDiff,
                    };
  
                    // Add to response
                    this.json[whichStation].trains.push(trainStop);
                  }
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
  }

  generateJsonFile(){
    // convert JSON object to a string
    const data = JSON.stringify(this.json)
    //console.log(this.json);

    // write JSON string to a file
    fs.writeFile(`out/${this.fileName}.json`, data, err => {
      if (err) {
        throw err
      }
      console.log('JSON data is saved.')
    })

  }

  findStopNameById(stopId){
    if(stopId && stationData[stopId] && stationData[stopId].stop_name){
      return stationData[stopId].stop_name;
    }
    return 'Unknown';
  }
  findHeadSign(partialTripId, lastStopId){
    const availableTrips = tripsData.filter(trip => 
      trip.trip_id.includes(partialTripId)
    );
    if(availableTrips.length > 0 && availableTrips[0].trip_headsign){ //TODO: fix reliablity if > 0
      return availableTrips[0].trip_headsign;
    } 
    // When no headsign and/or id for trip, use last stop | Unknown instead
    return this.findStopNameById(lastStopId);
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