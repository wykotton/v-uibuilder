import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FilesModule } from "./controller/files/files.module";
import { FilesTagModule } from "./controller/tag/tag.module";
import { SentryModule } from "@ntegral/nestjs-sentry";
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/utils/jwt/constants';
import { JwtStrategy } from '@/utils/jwt/jwt.strategy';
import { getConfigJson } from "@/utils/utils";

const { sentry_dsn = "" } = getConfigJson("./conf/ui-config.json") as any;

@Module({
  imports: [
    FilesModule,
    FilesTagModule,
    SentryModule.forRoot({
      dsn: sentry_dsn,
      tracesSampleRate: 1.0,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' }, //token过期
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, JwtStrategy],
})
export class AppModule {}
