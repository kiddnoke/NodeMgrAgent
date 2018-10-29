'use strict';
const Session = require('../lib/Cache');
let session = new Session();
session.add(1,{sid:1 , uid:1 , timeout:180});
session.add(2,{sid:2 , uid:2 , timeout:180});
session.add(3,{sid:2 , uid:2 , timeout:180});
session.add(5,{sid:2 , uid:2 , timeout:180});

session.addtraffic(1,[1,1]);
session.addtraffic(2,[2,2]);
session.addtraffic(3,[3,3]);
session.addtraffic(4,[4,4]);
console.log( session.alltraffic );

console.log(session.delport(2));
console.log(session.delport(8));

console.log( session.alltraffic );
console.log( session.alltimeout );