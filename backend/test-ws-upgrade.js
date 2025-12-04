const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/ocpp/MRIAD2025',
    headers: {
        'Connection': 'Upgrade',
        'Upgrade': 'websocket',
        'Sec-WebSocket-Version': '13',
        'Sec-WebSocket-Key': Buffer.from('test-key').toString('base64'),
    }
};

console.log('\n🔌 Testing WebSocket Upgrade...');
console.log(`Connecting to: ${options.hostname}:${options.port}${options.path}\n`);

const req = http.request(options);

req.on('response', (res) => {
    console.log(`❌ Got HTTP response (expected WebSocket upgrade)`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    res.on('data', (chunk) => {
        console.log('Body:', chunk.toString());
    });
});

req.on('upgrade', (res, socket, head) => {
    console.log('✅ WebSocket upgrade successful!');
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    socket.end();
    process.exit(0);
});

req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});

req.end();

setTimeout(() => {
    console.log('\n⏱️  Timeout - no response received');
    process.exit(1);
}, 5000);
