import { HttpExceptionFilter } from '@/core/filter/http-exception.filter';
import { TransformInterceptor } from '@/core/interceptor/transform.interceptor';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { getConfigJson, IConfig } from './utils/utils';
import corsOptionsDelegate from './utils/corsOptionsDelegate';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 配置静态资源
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.useStaticAssets(join(process.cwd(), 'upload'), {
    prefix: '/static'
  });

  // 请求正文大小
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));

  app.enableCors(corsOptionsDelegate);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  const options = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription('文件系统接口文档') // 文档介绍
    .setVersion('1.0.0') // 文档版本
    .addBearerAuth()
    .build();
  // 为了创建完整的文档（具有定义的HTTP路由）
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api', app, document);

  const { port = 3300 } = getConfigJson('./conf/config.json') as IConfig;
  await app.listen(process.argv[2]||port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
