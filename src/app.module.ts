import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { Employee } from './employee/employee.entity';
import { Office } from './office/office.entity';
import { Customer } from './customer/customer.entity';
import { Packet } from './packet/packet.entity';
import { OfficeModule } from './office/office.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PacketModule } from './packet/packet.module';
import { CustomerModule } from './customer/customer.module';

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
    UserModule,
    OfficeModule,
    EmployeeModule,
    AuthenticationModule,
    PacketModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
