import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';






async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://fanciful-treacle-ff4cc5.netlify.app',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
