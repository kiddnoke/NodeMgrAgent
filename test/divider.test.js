'use strict';
const D = require('../lib/divider');
const d = new D({port:20 , range:20});
const test = async () =>{
  await console.log(d.getport); //21
  await d.addport(d.getport); // add 21
  await d.addport(d.getport); // add 22
  await d.addport(d.getport); // add 23
  await d.addport(d.getport); // add 24
  await console.log(d.getport); //25
  await d.delport(21); // del 21
  await console.log(d.getport); // 21
  await d.addport(d.getport); // add 21
  await d.addport(d.getport) ; // add 25
  await console.warn('========================');
  for(const port of d.ports ) {
    await console.log(`d.ports has ${port}`);
  }
  await console.warn('========================');
  return await  true ;
};

test().then(console.log).catch(console.error);


