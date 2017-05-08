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
  })

  it('should display weather the rider is travelling down to their request level and track stops and floors travelled', () => {
    const mockUser = new Person({ name: "Brittany", currentFloor: 5, dropOffFloor: 1 });
    elevator.goToFloor(mockUser);

    assert.equal(elevator.direction, 'going down');
    assert.equal(elevator.floorsStopped, 2);
    assert.equal(elevator.floorsTravelled, 9);
  })
});