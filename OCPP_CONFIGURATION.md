# OCPP WebSocket Configuration

## Production WebSocket URL

To configure your charging stations to connect to this backend, use the following WebSocket URL format:

```
ws://YOUR_SERVER_IP:3001/ocpp/CHARGE_POINT_ID
```

### Examples:

**Local Network:**
```
ws://192.168.1.100:3001/ocpp/CP001
```

**Public Server:**
```
ws://your-domain.com:3001/ocpp/CP001
```

**Secure WebSocket (WSS) - Recommended for Production:**
```
wss://your-domain.com/ocpp/CP001
```

### Configuration Steps:

1. **Find Your Server IP:**
   - Local network: Use `ipconfig` (Windows) or `ifconfig` (Linux/Mac)
   - Public server: Use your domain name or public IP

2. **Configure Firewall:**
   - Open port 3001 for WebSocket connections
   - For production, use port 443 with WSS

3. **Update Charging Station:**
   - Access your charging station's configuration interface
   - Set the OCPP WebSocket URL to: `ws://YOUR_IP:3001/ocpp/STATION_ID`
   - Replace `STATION_ID` with a unique identifier for each station (e.g., CP001, CP002, etc.)

4. **Test Connection:**
   - The station should appear in the dashboard once connected
   - Check the backend logs for connection messages

### Supported OCPP 1.6J Messages:

**From Charge Point to Central System:**
- ✅ BootNotification
- ✅ Heartbeat
- ✅ Authorize
- ✅ StartTransaction
- ✅ StopTransaction
- ✅ StatusNotification
- ✅ MeterValues
- ✅ DataTransfer

**From Central System to Charge Point:**
- ✅ RemoteStartTransaction
- ✅ RemoteStopTransaction
- ✅ Reset
- ✅ UnlockConnector

### Security Recommendations:

1. **Use WSS (WebSocket Secure) in production**
2. **Implement authentication** (Basic Auth or Token-based)
3. **Use a reverse proxy** (nginx or Apache) for SSL termination
4. **Restrict access** by IP whitelist if possible

### Example nginx Configuration for WSS:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /ocpp/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
