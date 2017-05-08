export default class Elevator {
  constructor() {
    this.requests = [];
    this.riders = [];
    this.currentFloor = 0;
    this.floorsTravelled = 0;
    this.floorsStopped = 0;
    this.motionStatus = '';
  }

  // get currentFloor() {
  // }

  goToFloor(user) {
    const { name, currentFloor, dropOffFloor } = user;
    this.motionStatus = 'idle';
    this.direction = this.elvDirection(currentFloor, dropOffFloor)
    this.requests.push(currentFloor, dropOffFloor)
    this.riders.push(name);
    this.getStops(currentFloor, dropOffFloor);
    this.currentFloor = dropOffFloor;
    return this;
  }

  getStops(riderFloor, dropOffFloor) {
    this.floorsStopped = this.requests.length;
    if(riderFloor < dropOffFloor) {
      return this.floorsTravelled += dropOffFloor;
    }
    this.floorsTravelled = this.requests.reduce((acc, num, i) => {
      return i % 2 === 0 ? acc += num : acc += (this.requests[i - 1] - num)
    }, 0)
    return this.requests;
  }

  elvDirection(currentFloor, dropOffFloor) {
    return currentFloor < dropOffFloor ? 'going up' : 'going down'
  }

  reset() {
    this.requests = [];
    this.riders = [];
    this.currentFloor = 0;
    this.floorsTravelled = 0;
    this.floorsStopped = 0;
    this.motionStatus = '';
  }
}