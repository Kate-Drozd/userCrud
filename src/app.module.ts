import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import {MulterModule} from '@nestjs/platform-express';

@Module({
  imports: [
      AuthModule,
    UserModule,
    MulterModule.register({dest: './files'}),
  ],
  controllers: [AppController],
})
export class AppModule {}
