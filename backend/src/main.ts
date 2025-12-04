import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  const fs = require('fs');
  try {
    fs.writeFileSync('startup_log.txt', `Server started on port ${port} at ${new Date().toISOString()}\n`);
  } catch (e) {
    console.error('Error writing startup log', e);
  }
}
bootstrap();
