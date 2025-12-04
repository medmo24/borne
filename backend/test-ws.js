const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001/ocpp?chargePointId=MRIAD2025');

ws.on('open', function open() {
    console.log('connected');
    ws.send(JSON.stringify([2, "123", "BootNotification", {}]));
    setTimeout(() => {
        ws.close();
        process.exit(0);
    }, 1000);
});

ws.on('error', function error(err) {
    console.error('Connection error:', err);
    process.exit(1);
});
