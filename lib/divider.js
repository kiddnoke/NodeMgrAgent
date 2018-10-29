'use strict';

class Divider {
  constructor(props) {
    this.rangMin = props.rangMin;
    this.rangMax = props.rangMax;
    if (this.rangMax < this.rangMin) {
      [ this.rangMin, this.rangMax ] = [ this.rangMax, this.rangMin ];
    }
    this.ports = new Set();
  }

  addport(port) {
    if (!this.ports.has(port)) {
      this.ports.add(port);
    }
  }

  delport(port) {
    if (this.ports.has(port)) {
      this.ports.delete(port);
    }
  }

  has(port) {
    return this.ports.has(port);
  }

  get getport() {
    for (let i = this.rangMin; i <= this.rangMax; ++i) {
      if (this.ports.has(i)) continue;
      return i;
    }
    return null;
  }
}

module.exports = Divider;
