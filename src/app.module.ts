import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TemplateModule } from './templates/template.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenMiddleware } from 'common/middleware/authen.middleware';
import { CvModule } from './cv/cv.module';
import { JwtModule } from '@nestjs/jwt';
import { TemplateController } from './templates/template.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'aA123!@#',
      database: 'cv-maker-dev',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      // synchronize: true,
      logging: true,
    }),
    UserModule,
    TemplateModule,
    CvModule,
    JwtModule.register({
      secret: '12345aA!#',
    }),
    ConfigModule.forRoot(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenMiddleware).forRoutes(TemplateController);
  }
}
