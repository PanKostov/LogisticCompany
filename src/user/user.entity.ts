import { EncryptionService } from '../encryption-service/encryption.service';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAccess } from './user.access.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  userName: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ unique: true, type: 'varchar' })
  egn: string;

  @Column({ type: 'boolean' })
  isEmployee: boolean;

  @Column({ enum: UserAccess, type: 'enum' })
  type: UserAccess;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  static from(source: Partial<User>): User {
    const entityModel = new User();
    entityModel.updateFields(source);

    return entityModel;
  }

  updateFields(source: Partial<User>) {
    this.email = source.email ?? this.email;
    this.userName = source.userName ?? this.userName;
    this.password = source.password ?? this.password;
    this.egn = source.egn ?? this.egn;
    this.isEmployee = source.isEmployee ?? this.isEmployee;
  }

  async encryptFields(encryptionService: EncryptionService): Promise<User> {
    this.egn = encryptionService.encrypt(this.egn);
    return this;
  }

  async decryptFields(encryptionService: EncryptionService): Promise<User> {
    this.egn = encryptionService.decrypt(this.egn);
    return this;
  }
}
