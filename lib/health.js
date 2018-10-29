'use strict';
const { EventEmitter } = require('events');

class Health extends EventEmitter {
  constructor() {
    super();
  }

  On(eventname, callback) {
    this.on(eventname, callback);
  }

  Fire(eventname, params) {
    this.emit(eventname, params);
  }
}

module.exports = Health;