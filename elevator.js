export default class Elevator {
  constructor() {
    this.requests = [];
    this.completedRides = [];
    this.riders = [];
    this.exitingRider = '';
    this.currentFloor = 0;
    this.floorsTravelled = 0;
    this.floorsStopped = 0;
    this.motionStatus = '';
  }

  goToFloor(user) {
    const { name, currentFloor, dropOffFloor, requestTime } = user;
    this.motionStatus = 'moving';
    this.direction = this.elvDirection(currentFloor, dropOffFloor)
    this.requests.push(currentFloor, dropOffFloor)
    this.riders.push(name);
    this.getStops(currentFloor, dropOffFloor);
    this.riderRemove(dropOffFloor);
    this.returnToLobby(requestTime);
  }

  riderRemove(dropOffFloor) {
    this.exitingRider = this.riders.shift();
    const completedRequest = this.requests.splice(0, 2);
    this.completedRides = this.completedRides.concat(...completedRequest)
    this.currentFloor = dropOffFloor;
    this.motionStatus = 'idle';
  }

  getStops(riderFloor, dropOffFloor) {
    const current = this.currentFloor;
    const curr2RiderMax = Math.max(current, riderFloor);
    const curr2RiderMin = Math.min(current, riderFloor);
    const rider2FloorMax = Math.max(riderFloor, dropOffFloor);
    const rider2FloorMin = Math.min(riderFloor, dropOffFloor);

    this.floorsStopped += this.requests.length;
    this.floorsTravelled += (curr2RiderMax - curr2RiderMin) + (rider2FloorMax - rider2FloorMin)
    return this.completedRides;
  }

  returnToLobby(time) {
    if (time.includes('am')) {
      this.floorsTravelled += this.currentFloor
      this.currentFloor = 0;
      return this.currentFloor;
    }
    return this.currentFloor;
  }

  elvDirection(currentFloor, dropOffFloor) {
    return currentFloor < dropOffFloor ? 'going up' : 'going down'
  }

  reset() {
    this.requests = [];
    this.completedRides = [];
    this.riders = [];
    this.exitingRider = '';
    this.currentFloor = 0;
    this.floorsTravelled = 0;
    this.floorsStopped = 0;
    this.motionStatus = '';
  }
}