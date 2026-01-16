import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: '*',
  //   methods: ['GET', 'POST', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });
  // const port = process.env.PORT || 3000; 
  // await app.listen(port, '0.0.0.0');
  // console.log(`Chat Engine running on port ${port}`);
  
  app.enableCors();
  const port = process.env.PORT || 3001;  // Default to 3001 to avoid conflict with Next.js
  await app.listen(port, '0.0.0.0');
  console.log(`Chat Engine running on http://localhost:${port}`);
}

bootstrap();
