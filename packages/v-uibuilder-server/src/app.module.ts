import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./controller/auth/auth.module";
import { EditModule } from "./controller/edit/edit.module";
import { SettingModule } from "./controller/setting/setting.module";
import { ManagementModule } from "./controller/management/management.module";
import { EventsModule } from "./events/events.module";
import { SentryModule } from "@ntegral/nestjs-sentry";
import { getConfigJson } from "@/utils/utils";

const { sentry_dsn = "" } = getConfigJson("./conf/ui-config.json") as any;

@Module({
  imports: [
    EditModule,
    ManagementModule,
    SettingModule,
    EventsModule,
    AuthModule,
    SentryModule.forRoot({
      dsn: sentry_dsn,
      tracesSampleRate: 1.0,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
