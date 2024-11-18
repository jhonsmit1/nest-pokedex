import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //transformar datos implicitamente del query
      transform:true,
      transformOptions:{
        enableImplicitConversion:true
      }
    })
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log(`app running on PORT ${process.env.PORT}`); 
}
bootstrap();
