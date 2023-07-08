import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { Employee } from './employee/employee.entity';
import { Office } from './office/office.entity';
import { OfficeModule } from './office/office.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'postgres',
      entities: [User, Office, Employee],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Office, Employee]),
    UserModule,
    OfficeModule,
    EmployeeModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
