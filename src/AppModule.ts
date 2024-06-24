import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { Employee } from './employee/employee.entity';
import { Office } from './office/office.entity';
import { Customer } from './customer/customer.entity';
import { Packet } from './packet/packet.entity';
import { OfficeModule } from './office/office.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthenticationModule } from './authentication/AuthenticationModule';
import { PacketModule } from './packet/packet.module';
import { CustomerModule } from './customer/customer.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ONE_MINUTE_TTL } from './utils/RateLimitting';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'postgres',
      entities: [User, Office, Employee, Customer, Packet],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Office, Employee, Customer, Packet]),
    ThrottlerModule.forRoot([
      {
        ttl: ONE_MINUTE_TTL,
        limit: 10,
      },
    ]),
    UserModule,
    OfficeModule,
    EmployeeModule,
    AuthenticationModule,
    PacketModule,
    CustomerModule,
  ],
})
export class AppModule {}
