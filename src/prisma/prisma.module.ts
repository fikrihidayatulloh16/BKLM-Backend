import { Global, Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Global()
@Module({
  providers: [UsersService],
  exports: [UsersService]
})
export class PrismaModule {}
