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
    this.currentFloor = dropOffFloor;
    this.motionStatus = 'idle';
    this.requests.push(currentFloor, dropOffFloor)
    this.riders.push(name);
    return this;
  }

  getStops() {
    this.floorsStopped = this.requests.length;
    this.floorsTravelled = this.requests.reduce((inc, num) => inc += num ,0)
    return this.requests;
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