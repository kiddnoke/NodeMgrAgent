'use strict';
const sleep = async (delay = 10) => {
  return new Promise(((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, delay * 1000);
  }));
};
const preTimeStamp = new Date('2018-10-16 17:11:21');
let currTimeStamp;
sleep(1)
  .then(() => {
    console.log(preTimeStamp.toUTCString());

    currTimeStamp = new Date();
    console.log(currTimeStamp.toUTCString());
  })
  .then(() => {
    console.log(currTimeStamp - preTimeStamp);
  })
  .catch(console.error);
