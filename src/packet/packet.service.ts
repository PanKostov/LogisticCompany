import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Packet } from './packet.entity';
import { SendPackageInterface } from './dtos/send.package.interface';
import { CustomerService } from 'src/customer/customer.service';
import { OfficeService } from 'src/office/office.service';

@Injectable()
export class PacketService {
  constructor(
    @InjectRepository(Packet) private repo: Repository<Packet>,
    private customerService: CustomerService,
    private officeService: OfficeService,
  ) {}

  async sendPackage(packet: SendPackageInterface): Promise<Packet> {
    await this.checkIfCustomersExists(packet.senderId, packet.receiverId);
    await this.checkIfOfficesExists(packet.fromOfficeId, packet.toOfficeId);
    await this.checkIfEmployeeExists(packet.fromOfficeId, packet.employeeId);
    return this.repo.save(this.repo.create(packet));
  }

  async receivePackage(id: number): Promise<Packet> {
    const updatedEntity = await this.repo
      .createQueryBuilder()
      .update(Packet)
      .set({
        ...{ isReceived: true },
      })
      .where({ id })
      .returning('*')
      .execute();

    return updatedEntity.raw[0];
  }

  async getAllPackets(): Promise<Packet[]> {
    return this.repo.find();
  }

  // async getAllPacketsFromOfficeReceiver(officeId: number): Promise<Packet[]> {
  //   return await this.repo
  //     .createQueryBuilder()
  //     .innerJoin('packet.toOffice', 'office')
  //     .where('office.id = :officeId', { officeId })
  //     .getMany();
  // }

  private async checkIfCustomersExists(
    senderId: number,
    recieverId: number,
  ): Promise<boolean> {
    await this.customerService.findOne(senderId);
    await this.customerService.findOne(recieverId);
    return true;
  }

  private async checkIfOfficesExists(
    senderOfficeId: number | undefined,
    recieverOfficeId: number | undefined,
  ): Promise<boolean> {
    if (senderOfficeId) {
      await this.officeService.getOfficeById(senderOfficeId);
    }

    if (recieverOfficeId) {
      await this.officeService.getOfficeById(recieverOfficeId);
    }

    return true;
  }

  private async checkIfEmployeeExists(
    fromOfficeId: number,
    employeeId: number,
  ): Promise<boolean> {
    const employee = await this.officeService.getOfficeEmployeeById(
      fromOfficeId,
      employeeId,
    );
    if (!employee) {
      throw new NotFoundException(
        `Employee with id: ${employeeId} does not exist in office with id: ${fromOfficeId}!`,
      );
    }

    return true;
  }
}
