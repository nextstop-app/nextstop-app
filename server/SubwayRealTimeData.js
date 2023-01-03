import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import fetch from "node-fetch";
export default class SubwayRealTimeData {
  constructor(uri, fileName) {
    this.uri = uri;
    this.tripIds = new Set();
    this.responseData = {};
    this.currentTime = Math.round(Date.now() / 1000);
  }

  async getRawTrainData() {
    const response = await fetch(this.uri, {
      headers: { "x-api-key": process.env.MTA_TOKEN },
    });

    //TODO: removed try/catch, so this is a bit weird looking now.
    if (!response.ok) {
      const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
      error.response = response;
      throw error;
    }

    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    feed.entity.forEach((entity) => {
      if (!this.isValidTripEntry(entity)){ return; }
      const tripId = entity.tripUpdate.trip.tripId;
      const lastStopData = entity.tripUpdate.stopTimeUpdate[entity.tripUpdate.stopTimeUpdate.length-1]
      const lastStopId = lastStopData && lastStopData.stopId ? lastStopData.stopId : -1; 
      this.tripIds.add(tripId);

      entity.tripUpdate.stopTimeUpdate.forEach((scheduledTrip) => {
        if (!this.isValidScheduledTrip(scheduledTrip)) { return; }
        this.responseData[scheduledTrip.stopId] = this.responseData[scheduledTrip.stopId] || []
        this.responseData[scheduledTrip.stopId].push({
          routeId: entity.tripUpdate.trip.routeId,
          tripId,
          lastStopId: lastStopId,
          rawTime: scheduledTrip.departure.time,
          rawEta: scheduledTrip.departure.time - this.currentTime
        })
      })
    })
  }
  getTripsResponseData() {
    return this.responseData;
  }

  isValidTripEntry(entity) {
    return entity.tripUpdate && entity.tripUpdate.stopTimeUpdate && entity.tripUpdate.trip && entity.tripUpdate.trip.tripId && !this.tripIds.has(entity.tripUpdate.trip.tripId);
  }
  isValidScheduledTrip(scheduledTrip) {
    return scheduledTrip && scheduledTrip.departure && scheduledTrip.departure.time && ((scheduledTrip.departure.time - this.currentTime) > 0);
  }
}