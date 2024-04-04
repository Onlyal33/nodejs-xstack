import EventEmitter from './EventEmitter.js';

export default class WithTime extends EventEmitter {
  async execute(asyncFunc, ...args) {
    this.emit('begin');
    console.time('execute ' + asyncFunc.name);
    try {
      const data = await asyncFunc(...args);
      this.emit('data', data);
    } catch (error) {
      this.emit('error', error);
    }

    console.timeEnd('execute ' + asyncFunc.name);
    this.emit('end');
  }
}
