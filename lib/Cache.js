'use strict';
const now = () => {
  return Math.round(Date.now() / 1000);
};

class SessionCache extends Map {
  addtraffic(port, list) {
    const item = this.get(port);
    if (!!!item) return;
    item[1][0] += parseInt(list[0]);
    item[1][1] += parseInt(list[1]);
    item[1][2] += parseInt(list[2]);
    item[1][3] += parseInt(list[3]);
    item[2] = now();
  }

  add(port, config) {
    if (!!!this.get(port)) {
      const traffic = new Array(4);
      traffic[0] = 0;
      traffic[1] = 0;
      traffic[2] = 0;
      traffic[3] = 0;
      const timestamp = now();
      this.set(port, [config, traffic, timestamp]);
    }
  }

  cleartraffic() {
    for (const [port, item] of this.entries()) {
      item[1][0] = 0;
      item[1][1] = 0;
      item[1][2] = 0;
      item[1][3] = 0;
    }
  }

  getsid(port) {
    const item = this.get(port);
    if (!!item) {
      return item[0].sid;
    }
    return null;
  }

  getuid(port) {
    const item = this.get(port);
    if (!!item) {
      return item[0].uid;
    }
    return null;
  }

  delport(port) {
    const item = this.get(port);
    if (!!item) {
      this.delete(port);
      return {
        port: port,
        sid: item[0].sid,
        uid: item[0].uid,
        transfer: item[1],
      };
    }
    return null;
  }

  get alltraffic() {
    const ret = [];
    for (const [port, item] of this.entries()) {
      ret.push({
        port: port,
        sid: item[0].sid,
        uid: item[0].uid,
        transfer: item[1],
      });
    }
    return ret;
  }

  get alltimeout() {
    const ret = [];
    for (const [port, item] of this.entries()) {
      ret.push({
        port: port,
        timeout: item[0].timeout,
        timestamp: item[2],
      });
    }
    return ret;
  }
}

module.exports = SessionCache;
