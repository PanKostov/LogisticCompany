import { Encryptor } from 'src/other/encryptor';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  async encryptFields(encryptor: Encryptor): Promise<User> {
    this.egn = await encryptor.encryptText(this.egn);
    return this;
  }

  async decryptFields(dectyptor: Encryptor): Promise<User> {
    this.egn = await dectyptor.decryptText(this.egn);
    return this;
  }
}
