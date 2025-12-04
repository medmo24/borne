"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_ws_1 = require("@nestjs/platform-ws");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    const fs = require('fs');
    try {
        fs.writeFileSync('startup_log.txt', `Server started on port ${port} at ${new Date().toISOString()}\n`);
    }
    catch (e) {
        console.error('Error writing startup log', e);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map