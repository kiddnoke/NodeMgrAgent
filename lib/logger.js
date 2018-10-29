'use strict';
/**
 * log4js 日志输出配置文件
 * @type {exports}
 */
const log4js = require('log4js');
// TODO SMTP 的配置
// TODO UDP by logstash 配置

// logger configure
log4js.configure({
  appenders: {
    console : {type:'console'},
    access: { type: 'dateFile', filename: 'log/access.log', pattern: '-yyyy-MM-dd' },
    app: { type: 'file', filename: 'log/app.log', maxLogSize: 10485760, numBackups: 3 },
    errorFile: { type: 'file', filename: 'log/errors.log' },
    errors: { type: 'logLevelFilter', level: 'error', appender: 'errorFile' }
  },
  categories: {
    default: { appenders: ['app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'info' }
  }
});

module.exports = log4js.getLogger('logger');
