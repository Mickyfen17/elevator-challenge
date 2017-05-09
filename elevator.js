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
    this.riderRemove();
    this.currentFloor = dropOffFloor;
  }

  riderRemove() {
    this.riders.shift();
  }

  getStops(riderFloor, dropOffFloor) {
    this.floorsStopped = this.requests.length;
    if (riderFloor < dropOffFloor) {
      return this.floorsTravelled += dropOffFloor;
    } else if (this.currentFloor > dropOffFloor) {
      return this.floorsTravelled += (this.currentFloor - dropOffFloor)
    } else {
      this.floorsTravelled = this.requests.reduce((acc, num, i) => {
        return i % 2 === 0 ? acc += num : acc += (this.requests[i - 1] - num)
      }, 0)
    }
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