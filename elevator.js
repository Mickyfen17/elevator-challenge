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
    const curr = this.currentFloor;
    const direction = this.direction;
    const requests = this.requests;

    this.floorsStopped += requests.length;
    if (riderFloor < curr && direction === 'going up') {
      const elvToRider = curr - riderFloor;
      const riderToFloor = dropOffFloor - riderFloor;
      this.floorsTravelled += (elvToRider + riderToFloor);
    }
    else if (riderFloor < dropOffFloor && direction === 'going up') {
      this.floorsTravelled += (dropOffFloor - curr);
    }
    else if (curr > dropOffFloor && direction === 'going down') {
      this.floorsTravelled += (curr - dropOffFloor)
    }
    else {
      this.floorsTravelled += requests.reduce((acc, num, i) => {
        return i % 2 === 0 ? acc += (num - curr) : acc += (requests[i - 1] - num)
      }, 0)
    }
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