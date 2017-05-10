export default class Person {
  constructor({ name, currentFloor, dropOffFloor, time }) {
    this.name = name || '';
    this.currentFloor = currentFloor || null;
    this.dropOffFloor = dropOffFloor || null;
    this.requestTime = time || '5:00pm';
  }
}