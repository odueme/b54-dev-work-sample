import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';






async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
