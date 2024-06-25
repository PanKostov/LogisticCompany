import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/User.entity'
import { UserModule } from './user/UserModule'
import { Employee } from './employee/employee.entity'
import { Office } from './office/Office.entity'
import { Customer } from './customer/Customer.entity'
import { Packet } from './packet/PacketEntity'
import { OfficeModule } from './office/OfficeModule'
import { EmployeeModule } from './employee/EmployeeModule'
import { AuthenticationModule } from './authentication/AuthenticationModule'
import { PacketModule } from './packet/PacketModule'
import { CustomerModule } from './customer/CustomerModule'
import { ThrottlerModule } from '@nestjs/throttler'
import { ONE_MINUTE_TTL } from './utils/RateLimitting'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    //Allow the application to load variables from .env files
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // no need to import into other modules
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 4466,
      username: 'postgres',
      password: 'postgres',
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
