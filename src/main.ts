import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';






async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://dev-work-sample-2k3t.onrender.com',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
