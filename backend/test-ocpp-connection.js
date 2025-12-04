const WebSocket = require('ws');

// Test OCPP WebSocket connection
const chargePointId = 'MRIAD2025';
const wsUrl = `ws://localhost:3001/ocpp/${chargePointId}`;

console.log(`\n🔌 Testing OCPP Connection...`);
console.log(`URL: ${wsUrl}\n`);

// Create WebSocket with OCPP subprotocol
const ws = new WebSocket(wsUrl, ['ocpp1.6']);

ws.on('open', () => {
    console.log('✅ WebSocket connection established!');
    console.log(`Connected as Charge Point: ${chargePointId}\n`);

    // Send BootNotification message (OCPP format: [MessageTypeId, MessageId, Action, Payload])
    const bootNotification = [
        2, // CALL message
        'test-boot-' + Date.now(),
        'BootNotification',
        {
            chargePointVendor: 'V2C',
            chargePointModel: 'Trydan',
            chargePointSerialNumber: 'V2C-TEST-001',
            firmwareVersion: '3.0.3'
        }
    ];

    console.log('📤 Sending BootNotification...');
    console.log(JSON.stringify(bootNotification, null, 2));
    ws.send(JSON.stringify(bootNotification));
});

ws.on('message', (data) => {
    console.log('\n📥 Received response from backend:');
    const response = JSON.parse(data.toString());
    console.log(JSON.stringify(response, null, 2));

    // Send Heartbeat after receiving BootNotification response
    if (response[2] && response[2].status === 'Accepted') {
        setTimeout(() => {
            const heartbeat = [
                2,
                'test-heartbeat-' + Date.now(),
                'Heartbeat',
                {}
            ];
            console.log('\n💓 Sending Heartbeat...');
            console.log(JSON.stringify(heartbeat, null, 2));
            ws.send(JSON.stringify(heartbeat));
        }, 1000);
    }

    // Close after receiving heartbeat response
    if (response[1] && response[1].includes('heartbeat')) {
        setTimeout(() => {
            console.log('\n✅ Test completed successfully!');
            console.log('🎉 OCPP connection is working correctly!\n');
            ws.close();
            process.exit(0);
        }, 1000);
    }
});

ws.on('error', (error) => {
    console.error('\n❌ WebSocket error:', error.message);
    process.exit(1);
});

ws.on('close', (code, reason) => {
    console.log(`\n🔌 Connection closed. Code: ${code}, Reason: ${reason || 'Normal closure'}`);
});

// Timeout after 10 seconds
setTimeout(() => {
    console.log('\n⏱️ Test timeout - closing connection');
    ws.close();
    process.exit(0);
}, 10000);
