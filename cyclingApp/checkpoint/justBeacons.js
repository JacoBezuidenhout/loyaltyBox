var Bleacon = require('bleacon');

Bleacon.startScanning();

Bleacon.on('discover', function(bleacon) {
    console.log(bleacon);
});