// import { Injectable } from '@nestjs/common';
// import { UserRepository } from './user.repository';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../user.entity';
// import { Encryptor } from '../../other/encryptor';

// @Injectable()
// export class DefaultUserRepository implements UserRepository {
//   constructor(
//     @InjectRepository(User) private repo: Repository<User>,
//     private encryptor: Encryptor,
//   ) {
//     this.encryptor = new Encryptor('Password used to generate key');
//   }

//   async create(user: User): Promise<User> {
//     return await this.repo.save(user);
//   }

//   async save(user: User): Promise<User> {
//     return await this.repo.save(user);
//   }

//   async findOne(id: number): Promise<User> {
//     return await this.repo.findOneBy({ id });
//   }

//   async findByEmail(email: string): Promise<User> {
//     return await this.repo.findOneBy({ email });
//   }

//   async findByEgn(egn: string): Promise<User> {
//     const encryptedEgn = await this.encryptor.encryptText(egn);
//     return await this.repo.findOneBy({ egn: encryptedEgn });
//   }

//   async getEgnOfUser(id: number): Promise<string> {
//     const user = await this.findOne(id);
//     return await this.encryptor.decryptText(user.egn);
//   }
// }
