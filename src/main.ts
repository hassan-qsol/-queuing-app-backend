import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until a logger is attached
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));

  app.useGlobalInterceptors(new ResponseInterceptor());

  // Enable CORS with multiple origins
  app.enableCors({
    origin: ['https://ehs.hazwoper-osha.com', 'http://localhost:5173'], // Allow origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // If you need to handle cookies or authentication headers
  });

  // Set a global prefix for all routes
  app.setGlobalPrefix('api');

  // Start the server and listen on port 3000
  await app.listen(3000);
}

bootstrap();
