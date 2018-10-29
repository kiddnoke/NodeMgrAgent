'use strict';
const host = process.argv[ 2 ];
const rl = require('readline')
  .createInterface({
    input: process.stdin,
    output: process.stdout
  });
const request = require('request');
const url = `http://${host}:7001`;
const req = (path, data, callback) => {
  request({
    url: `${url}${path}`,
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json',
    },
    body: data
  }, callback);
};
const makereq = async (state) => {
  const EventId = Math.round(Math.random() * 1000000);
  const timestamp = Math.round(Date.now() / 1000);
  const path = '/SessionStart';
  req(path, {
    Uid: 100008,
    EventId: EventId,
    LimitUp: 50,
    LimitDown: 50,
    StateAbb: state,
    AreaCode: 1,
    Level: 0,
    StartTimeStamp: timestamp,
    UsableTimeSpan: 3600
  }, function(error, response, body) {
    console.log(EventId);
    if (!error && response.statusCode === 200) {
      return Promise.resolve(body);
    } else {
      return Promise.reject(error);
    }
  });
};
rl.on('line', function(params) {
  params = params.toString();
  let inputArr = params.split(' ');
  let input = inputArr[ 0 ];
  switch (input) {
    case 's' : {
      const path = '/SessionStart';
      req(path, JSON.parse(inputArr[ 1 ]));
    }
      break;
    case 'start' : {
      makereq(inputArr[1])
        .then((body) => {
          console.log(body);
        })
        .catch((error) => {
          console.error(error);
        });
    }
      break;
    case 'finish' : {
      const path = '/SessionFinish';
      const timestamp = Math.round(Date.now() / 1000);

      req(path, {
        Uid: 'zhangsen',
        EventId: inputArr[ 1 ],
        FinishTimeStamp: timestamp,
      },function(error,response,body) {
        if (!error && response.statusCode === 200) {
          console.log(body);
        } else {
          console.error(error);
        }
      });
    }
      break;
    case 'limit': {
      const path = '/SessionModifySpeedLimit';
      req(path, {
        Uid: 'zhangsen',
        UpLimit: 80,
        DownLimit: 80
      });
    }
      break;
    case 'clear' : {
      const path = '/ClearEndPoint';
      req(path, {
        Ip: '192.168.1.13',
        Port: 1002
      });
    }
      break;
    case 'q' : {
      const path = '/querybystate';
      req(path, {
        State: 'CN',
        Area: 1
      });
    }
      break;
    case 'robot' : {

    }
      break;
  }
});

