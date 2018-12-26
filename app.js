'use strict';
const logger = require('./lib/logger');
const options = require('./lib/options');
const centerhost = options.center_host;
const centerport = options.center_port;
const beginport = options.range[0];
const endport = options.range[1];
const manager_port = options.manager_port;
const controller_port = options.controller_port;
const State = options.state;
const Area = options.area;
const config = {
  beginport: beginport,
  endport: endport,
  manager_port: manager_port,
  controller_port: controller_port,
  state: State,
  area: Area
};
const Comm = require('./lib/Comm');
const Command = require('./lib/SSManager');
const comm = new Comm({host: centerhost, port: centerport, router: '/'});
const controller = new Command(config);
/**
 * ss管理器初始化
 */
controller.Init();
controller.On('error', e => {
  console.error(e)
});
comm.OnConnect(async () => {
  /**
   * 注册
   */
  comm.Request('login', config, (msgbody) => {
    let body = JSON.stringify(msgbody);
    console.log(`login done : ${body}`);
  });
  comm.Notify('health', controller.sessionCache.size);
});
/**
 * 收到服务中心 Open端口的通知
 * TODO 超时或者成功失败的时候都推送结果出去
 */
/**
 * config
 * {
 *   uid
 *   sid
 *   method
 *   password
 *   timeout
 *   currlimitup
 *   currlimitdown
 *   remain
 *   nextlimitup
 *   nextlimitdown
 *   expire
 *   notifyid
 *   notifytimestamp
 * }
 * ack
 * {
 *   ip
 *   server_port
 * }
 */
comm.OnOpen(async (config) => {
  try {
    const ret = await controller.OpenPort(config);
    await comm.Notify('health', controller.sessionCache.size);
    if (ret) {
      console.log(`OnOpen ${JSON.stringify(config)}`);
      return await comm.Notify('open', config);
    } else {
      console.log(`OnOpen ${config.sid} failed`);
      return await comm.Notify('open', false);
    }
  } catch (e) {
    console.error(e);
    comm.Notify('agentWarn', e.message);
  }
});
/**
 * 收到服务中心 close端口的通知
 * TODO 超时或者成功失败的时候都推送结果出去
 */
comm.OnClose(async (config) => {
  console.error(config);
  try {
    const ret = await controller.ClosePort(config.server_port);
    console.error(`OnClose ack center server`, ret);
    await comm.Notify('health', controller.sessionCache.size);
    return await comm.Notify('close', ret);
  } catch (e) {
    console.error(e);// TODO 用邮件把错误发出去
    comm.Notify('agentWarn', e.message);
  }
});
/**
 *
 */
let NotifyHandlerTimer;
comm.OnConnect(() => {
  const Interval = 60;
  /**
   * 定时向服务中心发送端口消耗状况
   */
  const NotifyHandler = async () => {
    let traffic_msg = [];
    const Now = Math.round(Date.now() / 1000);
    for (const [port, item] of controller.sessionCache.entries()) {
      const timestamp = item[2];
      if (Now - timestamp < Interval)
        traffic_msg.push({
          port: port,
          sid: item[0].sid,
          uid: item[0].uid,
          transfer: item[1],
        });
    }
    if (!!!traffic_msg) return;
    comm.Notify('transfer', traffic_msg);
  };
  NotifyHandlerTimer = setInterval(NotifyHandler, Interval * 1000);
  controller.EnableClear(true, Interval);
});
comm.OnDisconnect(async () => {
  clearInterval(NotifyHandlerTimer);
  controller.EnableClear(false);
});
controller.OnTimeOut(async (params) => {
  console.error(`remove ${params.port}`);
  const traffic_msg = await controller.RemovePort(params.port);
  await comm.Notify('health', controller.sessionCache.size);
  await comm.Notify('timeout', traffic_msg);
});
controller.OnExpire(async (params) => {
  console.error(`expire ${params.port}`);
  const traffic_msg = await controller.RemovePort(params.port);
  await comm.Notify('health', controller.sessionCache.size);
  await comm.Notify('expire', traffic_msg);
});
controller.OnBalance(async (params) => {
  console.error(`balance ${params.port}`);
  await comm.Notify('balance', {balanceid: params.balanceid, balancenotifytime: params.balancenotifytime});
});
controller.OnOverflow(async (params) => {
  console.error(`overflow ${params.port}`);
  await controller.UpdateLimit(params.port, params.limitup, params.limitdown);
  let item = controller.sessionCache.get(params.port);
  item[0].remain = 0;
  await comm.Notify('overflow', params);
});

const {Watchdog} = require('watchdog');
const dog = new Watchdog();
dog.sleep();
const feed = async () => {
  try {
    const duran = await controller.ping(5);
    if (500 < duran && duran < 1000) {
      comm.Notify('agentWarn', `ping duran = ${duran}`);
    } else if (1000 < duran && duran < 2000) {
      comm.Notify('agentWarn', `ping duran = ${duran}`);
    } else if (2000 < duran && duran < 4000) {
      comm.Notify('agentError', `ping duran = ${duran}`);
    }
    dog.feed({});
  } catch (e) {
    dog.sleep();
    comm.Notify('agentError', e.message);
  }
};
let feedTimer;
comm.OnConnect(async () => {
  feedTimer = setInterval(feed, 30 * 1000);
});

dog.on('reset', async () => {
  comm.Notify('agentError', 'dog is reset');
});


