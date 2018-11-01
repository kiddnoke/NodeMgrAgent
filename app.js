'use strict';
const logger = require('./lib/logger');
const options = require('./lib/options');
const centerhost = options.center_host;
const centerport = options.center_port;
const myhostname = options.myhostname;
const beginport = options.range[0];
const endport = options.range[1];
const manager_port = options.manager_port;
const controller_port = options.controller_port;
const State = options.state;
const Area = options.area;
const config = {
  ip: myhostname,
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
comm.OnConnect(async () => {
  /**
   * 注册
   */
  await controller.ping();
  comm.Request('login', config, (msgbody) => {
    let body = JSON.stringify(msgbody);
    console.log(`login done : ${body}`);
  });
});
/**
 * 收到服务中心 Open端口的通知
 * TODO 超时或者成功失败的时候都推送结果出去
 */
/**
 * config
 * {
 *   sid
 *   uid
 *   timeout
 *   limitup
 *   limitdown
 *   method
 *   password
 * }
 * ack
 * {
 *   ip
 *   server_port
 * }
 */
comm.OnOpen(async (config, ack) => {
  try {
    const ret = await controller.OpenPort(config);
    if (ret) {
      const port = config.server_port;
      return await ack(port);
    } else {
      return await ack(false);
    }

  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
});
/**
 * 收到服务中心 close端口的通知
 * TODO 超时或者成功失败的时候都推送结果出去
 */
comm.OnClose(async (config, ack) => {
  console.error( config );
  try{
    const ret = await controller.ClosePort(config.server_port);
    console.error(`OnClose ack center server`, ret);
    ack(ret);
  }catch (e) {
    console.error(err);// TODO 用邮件把错误发出去
  }
});
/**
 * 被动Remove事件也需要推送
 * TODO 超时或者成功失败的时候都推送结果出去
 */
controller.OnRemove(port => {
  console.error(`OnRemove ${port}`);
  comm.Notify('remove', port);
});

/**
 * 定时向服务中心发送端口消耗状况
 */
const NotifyHandler = async () => {
  const traffic_msg = controller.sessionCache.alltraffic;
  if (!!!traffic_msg) return;
  comm.Notify('transfer', traffic_msg);
  controller.sessionCache.cleartraffic();
};
let NotifyHandlerTimer;

/**
 * 超时回收端口
 */
const clearSessionTimeout = async () => {
  const now = Math.round(Date.now()/1000);
  const timeouts = controller.sessionCache.alltimeout;
  for (const item of timeouts) {
    const port  = item.port ;
    const timetout = item.timeout ;
    const timestamp = item.timestamp ;
    if( now - timestamp > timetout ) {
      await controller.RemovePort(port);
    }
  }
};
let clearSessionTimer;
/**
 *
 */
comm.OnConnect(() => {
  NotifyHandlerTimer = setInterval(NotifyHandler, 30 * 1000);
  clearSessionTimer = setInterval(clearSessionTimeout, 60 * 1000);
});
comm.OnDisconnect(() => {
  clearInterval(NotifyHandlerTimer);
  clearImmediate(clearSessionTimer);
});
