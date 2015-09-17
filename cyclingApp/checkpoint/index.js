var Bleacon = require('bleacon');
var Cylon = require('cylon');

var b0 = 0;
var b1 = 0;
var b2 = 0;
var b3 = 0;

var time = 0;

setInterval(function(){
  time += 0.5;
},500);


Cylon.robot({
  connections: {
    edison: { adaptor: 'intel-iot' }
  },

  devices: {
    ledr: { driver: 'led', pin: 3 },
    ledg: { driver: 'led', pin: 5 },
    ledb: { driver: 'led', pin: 6 }
  },

  work: function(my) {
    Bleacon.startScanning();
    
    my.ledr.turnOn();
    my.ledg.turnOff();
    my.ledb.turnOff();

    Bleacon.on('discover', function(bleacon) {
        if (bleacon.major == 0) b0 = time;
        if (bleacon.major == 1) b1 = time;
        if (bleacon.major == 2) b2 = time;
        if (bleacon.major == 3) b3 = time;
        
        my.ledr.turnOff();
        my.ledg.turnOn();
        setTimeout(function(){
          my.ledr.turnOn();
          my.ledg.turnOff();
        },5000);
        console.log(b0,b1,b2,b3);
    });
  }
}).start();



