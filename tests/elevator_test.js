require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});
const assert   = require("assert");

const Elevator = require('../elevator').default;
const Person   = require('../person').default;

describe('Elevator', function() {
  let elevator = new Elevator();

  afterEach(function() {
    elevator.reset();
  });

  it('should bring a rider to a floor above their current floor', () => {
    const mockUser = new Person({ name: "Brittany", currentFloor: 2, dropOffFloor: 5 });
    elevator.goToFloor(mockUser);

    assert.equal(elevator.currentFloor, 5);
    assert.equal(elevator.motionStatus, 'idle');
    assert.deepEqual(elevator.getStops(), [2, 5]);
  });

  it('should bring a rider to a floor below their current floor', () => {
    const mockUser = new Person({ name: "Brittany", currentFloor: 8, dropOffFloor: 3 });
    elevator.goToFloor(mockUser);

    assert.equal(elevator.currentFloor, 3);
    assert.equal(elevator.motionStatus, 'idle');
    assert.deepEqual(elevator.getStops(), [8, 3]);
  });

  it('should display "going up" if rider is travelling from a lower level to their request level', () => {
    const currentFloor = 4;
    const dropOffFloor = 10;
    const direction = elevator.elvDirection(currentFloor, dropOffFloor);

    assert.equal(direction, 'going up')
  })

  it('should display "going down" if rider is travelling from a lower level to their request level', () => {
    const currentFloor = 8;
    const dropOffFloor = 2;
    const direction = elevator.elvDirection(currentFloor, dropOffFloor);

    assert.equal(direction, 'going down')
  })

  it('should display weather the rider is travelling up to their request level and track stops and floors travelled', () => {
    const mockUser = new Person({ name: "Brittany", currentFloor: 1, dropOffFloor: 5 });
    elevator.goToFloor(mockUser);

    assert.equal(elevator.direction, 'going up');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 5);
    assert.deepEqual(elevator.completedRides, [1, 5]);

  })

  it('should display weather the rider is travelling down to their request level and track stops and floors travelled', () => {
    const mockUser = new Person({ name: "Brittany", currentFloor: 5, dropOffFloor: 1 });
    elevator.goToFloor(mockUser);

    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 9);
    assert.deepEqual(elevator.completedRides, [5, 1]);
  })

  it('should be able to pick up a rider, drop them off, then pick up a second rider and also drop them offer', () => {
    const mockUser1 = new Person({ name: "Bob", currentFloor: 3, dropOffFloor: 9 });
    const mockUser2 = new Person({ name: "Sue", currentFloor: 6, dropOffFloor: 2 });

    elevator.goToFloor(mockUser1);
    assert.equal(elevator.direction, 'going up');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 9);
    assert.deepEqual(elevator.completedRides, [3, 9]);

    elevator.goToFloor(mockUser2);
    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 4);
    assert.equal(elevator.floorsTravelled, 16);
    assert.deepEqual(elevator.completedRides, [3, 9, 6, 2]);
  })

  it('should be able to pick two riders up who are both travelling up in the elevator', () => {
    const mockUser1 = new Person({ name: "Bob", currentFloor: 3, dropOffFloor: 7 });
    const mockUser2 = new Person({ name: "Sue", currentFloor: 1, dropOffFloor: 5 });

    elevator.goToFloor(mockUser1);
    assert.equal(elevator.direction, 'going up');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 7);
    assert.equal(elevator.exitingRider, 'Bob');
    assert.deepEqual(elevator.completedRides, [3, 7]);

    elevator.goToFloor(mockUser2);
    assert.equal(elevator.direction, 'going up');
    assert.equal(elevator.floorsStopped, 4);
    assert.equal(elevator.floorsTravelled, 17);
    assert.equal(elevator.exitingRider, 'Sue');
    assert.deepEqual(elevator.completedRides, [3, 7, 1, 5]);
  })

  it('should be able to pick two riders up with the first rider going up and second rider coming down', () => {
    const mockUser1 = new Person({ name: "Bob", currentFloor: 2, dropOffFloor: 8 });
    const mockUser2 = new Person({ name: "Sue", currentFloor: 7, dropOffFloor: 4 });

    elevator.goToFloor(mockUser1);
    assert.equal(elevator.direction, 'going up');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 8);
    assert.equal(elevator.exitingRider, 'Bob');
    assert.deepEqual(elevator.completedRides, [2, 8]);

    elevator.goToFloor(mockUser2);
    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 4);
    assert.equal(elevator.floorsTravelled, 12);
    assert.equal(elevator.exitingRider, 'Sue');
    assert.deepEqual(elevator.completedRides, [2, 8, 7, 4]);
  })

  it('should be able to pick two riders up with the first rider coming down and second rider going down', () => {
    const mockUser1 = new Person({ name: "Bob", currentFloor: 6, dropOffFloor: 1 });
    const mockUser2 = new Person({ name: "Sue", currentFloor: 2, dropOffFloor: 5 });

    elevator.goToFloor(mockUser1);
    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 11);
    assert.equal(elevator.exitingRider, 'Bob');
    assert.deepEqual(elevator.completedRides, [6, 1]);

    elevator.goToFloor(mockUser2);
    assert.equal(elevator.direction, 'going up');
    assert.equal(elevator.floorsStopped, 4);
    assert.equal(elevator.floorsTravelled, 15);
    assert.equal(elevator.exitingRider, 'Sue');
    assert.deepEqual(elevator.completedRides, [6, 1, 2, 5]);
  })

  it('should be able to pick two riders up with both riders going down', () => {
    const mockUser1 = new Person({ name: "Bob", currentFloor: 7, dropOffFloor: 2 });
    const mockUser2 = new Person({ name: "Sue", currentFloor: 8, dropOffFloor: 5 });

    elevator.goToFloor(mockUser1);
    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 12);
    assert.equal(elevator.exitingRider, 'Bob');
    assert.deepEqual(elevator.completedRides, [7, 2]);

    elevator.goToFloor(mockUser2);
    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 4);
    assert.equal(elevator.floorsTravelled, 21);
    assert.equal(elevator.exitingRider, 'Sue');
    assert.deepEqual(elevator.completedRides, [7, 2, 8, 5]);
  })

  it('should be able to pick two riders up who are both travelling up in the elevator and incorporate the elvator resetting to floor 0 between 00:00am & 11:59am', () => {
    const mockUser1 = new Person({ name: "Bob", currentFloor: 3, dropOffFloor: 7, time: '10:00am' });
    const mockUser2 = new Person({ name: "Sue", currentFloor: 1, dropOffFloor: 5, time: '10:49am'  });

    elevator.goToFloor(mockUser1);
    assert.equal(elevator.direction, 'going up');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 14);
    assert.equal(elevator.exitingRider, 'Bob');

    elevator.goToFloor(mockUser2);
    assert.equal(elevator.direction, 'going up');
    assert.equal(elevator.floorsStopped, 4);
    assert.equal(elevator.floorsTravelled, 24);
    assert.equal(elevator.exitingRider, 'Sue');
  })

  it('should be able to pick two riders up with the first rider going up and second rider coming down and incorporate the elvator resetting to floor 0 between 00:00am & 11:59am', () => {
    const mockUser1 = new Person({ name: "Bob", currentFloor: 2, dropOffFloor: 8, time: '11:08am' });
    const mockUser2 = new Person({ name: "Sue", currentFloor: 7, dropOffFloor: 4, time: '11:21am' });

    elevator.goToFloor(mockUser1);
    assert.equal(elevator.direction, 'going up');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 16);
    assert.equal(elevator.exitingRider, 'Bob');

    elevator.goToFloor(mockUser2);
    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 4);
    assert.equal(elevator.floorsTravelled, 30);
    assert.equal(elevator.exitingRider, 'Sue');
  })

  it('should be able to pick two riders up with the first rider coming down and second rider going down and incorporate the elvator resetting to floor 0 between 00:00am & 11:59am', () => {
    const mockUser1 = new Person({ name: "Bob", currentFloor: 6, dropOffFloor: 1, time: '00:00am' });
    const mockUser2 = new Person({ name: "Sue", currentFloor: 2, dropOffFloor: 5, time: '00:09am' });

    elevator.goToFloor(mockUser1);
    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 12);
    assert.equal(elevator.exitingRider, 'Bob');

    elevator.goToFloor(mockUser2);
    assert.equal(elevator.direction, 'going up');
    assert.equal(elevator.floorsStopped, 4);
    assert.equal(elevator.floorsTravelled, 22);
    assert.equal(elevator.exitingRider, 'Sue');
  })

  it('should be able to pick two riders up with both riders going down and incorporate the elvator resetting to floor 0 between 00:00am & 11:59am', () => {
    const mockUser1 = new Person({ name: "Bob", currentFloor: 7, dropOffFloor: 2, time: '07:00am' });
    const mockUser2 = new Person({ name: "Sue", currentFloor: 8, dropOffFloor: 5, time: '07.12am' });

    elevator.goToFloor(mockUser1);
    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 14);
    assert.equal(elevator.exitingRider, 'Bob');

    elevator.goToFloor(mockUser2);
    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 4);
    assert.equal(elevator.floorsTravelled, 30);
    assert.equal(elevator.exitingRider, 'Sue');
  })
});