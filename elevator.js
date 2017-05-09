export default class Elevator {
  constructor() {
    this.requests = [];
    this.riders = [];
    this.currentFloor = 0;
    this.floorsTravelled = 0;
    this.floorsStopped = 0;
    this.motionStatus = '';
  }

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
    if(riderFloor < this.currentFloor && this.direction === 'going up') {
      const elvToRider = this.currentFloor - riderFloor;
      const riderToFloor = dropOffFloor - riderFloor;
      this.floorsTravelled += (elvToRider + riderToFloor);
    }
    else if (riderFloor < dropOffFloor && this.direction === 'going up') {
      this.floorsTravelled += (dropOffFloor - this.currentFloor);
    }
    else if (this.currentFloor > dropOffFloor && this.direction === 'going down') {
      this.floorsTravelled += (this.currentFloor - dropOffFloor)
    }
    else {
      const curr = this.currentFloor
      this.floorsTravelled = this.requests.reduce((acc, num, i) => {
        return i % 2 === 0 ? acc += (num - this.currentFloor) : acc += (this.requests[i - 1] - num)
      }, curr)
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