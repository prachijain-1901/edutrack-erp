import { Module, Global } from '@nestjs/common';
import { AppGateway } from './socket.gateway';
import { SocketListener } from './socket.listener';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AppGateway, SocketListener],
  exports: [AppGateway],
})
export class SocketModule {}
