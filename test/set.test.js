'use strict'
let ports = new Set();

ports.add( 1 ) ;
ports.add(2 ) ;
ports.add(4) ;
let port ;
let iter = ports[Symbol.iterator]();
const index = Math.round( Math.random() * (ports.size -1 ));
for (let i = 0 ; i < ports.size ; ++i) {
  if( i === index ) {
    port = iter.next().value;
  } else {
    iter.next();
  }
}
console.log( index , port);