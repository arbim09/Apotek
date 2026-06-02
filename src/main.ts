import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Swagger/OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Apotek Backend API')
    .setDescription('API documentation untuk sistem apotek')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addTag('Authentication', 'Auth endpoints')
    .addTag('Products', 'Product endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI - http://localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
    },
  });

  // ReDoc - http://localhost:3000/api/redoc (alternative UI)
  // ReDoc is automatically available when Swagger is setup

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);

  console.log(`
╔════════════════════════════════════════════════════════════╗
║           Apotek Backend Server Running                    ║
╠════════════════════════════════════════════════════════════╣
║  🚀 Server:     http://localhost:${port}
║  📚 Swagger:    http://localhost:${port}/api/docs
║  📖 ReDoc:      http://localhost:${port}/api/redoc
║  📋 JSON:       http://localhost:${port}/api/docs-json
║  🔌 Insomnia:   Import backend/insomnia-collection.json
╚════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();