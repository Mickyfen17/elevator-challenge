export default class Person {
  constructor({ name, currentFloor, dropOffFloor }) {
    this.name = name || '';
    this.currentFloor = currentFloor || null;
    this.dropOffFloor = dropOffFloor || null;
  }


}