import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Packet } from './Packet.entity'
import { SendPackageInterface } from './dtos/SendPackageInterface'
import { CustomerService } from '../customer/CustomerService'
import { OfficeService } from '../office/OfficeService'
import { Customer } from '../customer/Customer.entity'
import { Employee } from '../employee/Employee.entity'
import { Office } from '../office/Office.entity'

@Injectable()
export class PacketService {
  constructor(
    @InjectRepository(Packet) private repo: Repository<Packet>,
    private customerService: CustomerService,
    private officeService: OfficeService,
  ) {}

  async sendPacket(packet: SendPackageInterface): Promise<Packet> {
    const customers = await this.checkIfCustomersExists(packet.senderId, packet.receiverId)
    const offices = await this.checkIfOfficesExists(packet.fromOfficeId, packet.toOfficeId)
    await this.checkIfEmployeeExists(packet.fromOfficeId, packet.employeeId)

    const createdPacket = this.repo.create({
      weight: packet.weight,
      fromAddress: packet.fromAdress,
      fromOffice: offices.senderOffice,
      sender: customers.sender,
      receiver: customers.receiver,
      toAddress: packet.toAdress,
      toOffice: offices.receiverOffice,
      employeeId: packet.employeeId,
      isReceived: false,
    })
    return this.repo.save(createdPacket)
  }

  async receivePacket(id: number, officeId: number): Promise<Packet> {
    const updatedEntity = await this.repo
      .createQueryBuilder()
      .update(Packet)
      .set({
        ...{ isReceived: true },
      })
      .where({ id, toOffice: { id: officeId } })
      .returning('*')
      .execute()

    return updatedEntity.raw[0]
  }

  async getPacketById(id: number): Promise<Packet | undefined> {
    return this.repo.findOneBy({ id })
  }

  async getAllPackets(): Promise<Packet[]> {
    return this.repo.find()
  }

  async getAllPacketsByEmployee(employeeId: number): Promise<Packet[]> {
    return await this.repo.find({ where: { employeeId } })
  }

  async getAllNotReceivedPackets(): Promise<Packet[]> {
    return await this.repo.find({ where: { isReceived: false } })
  }

  async getAllSentPacketsForCustomer(customerId: number): Promise<Packet[]> {
    return await this.repo.find({ where: { sender: { id: customerId } } })
  }

  async getAllReceivedPacketsForCustomer(customerId: number): Promise<Packet[]> {
    return await this.repo.find({ where: { receiver: { id: customerId } } })
  }

  private async checkIfCustomersExists(senderId: number, recieverId: number): Promise<{ sender: Customer; receiver: Customer }> {
    const sender = await this.customerService.findById(senderId)
    const receiver = await this.customerService.findById(recieverId)
    return { sender, receiver }
  }

  private async checkIfOfficesExists(
    senderOfficeId: number | undefined,
    recieverOfficeId: number | undefined,
  ): Promise<{ senderOffice?: Office; receiverOffice?: Office }> {
    let senderOffice
    let receiverOffice
    if (senderOfficeId) {
      senderOffice = await this.officeService.getOfficeById(senderOfficeId)
    }

    if (recieverOfficeId) {
      receiverOffice = await this.officeService.getOfficeById(recieverOfficeId)
    }

    return { senderOffice, receiverOffice }
  }

  private async checkIfEmployeeExists(fromOfficeId: number, employeeId: number): Promise<Employee> {
    const employee = await this.officeService.getOfficeEmployeeById(fromOfficeId, employeeId)
    if (!employee) {
      throw new NotFoundException(`Employee with id: ${employeeId} does not exist in office with id: ${fromOfficeId}!`)
    }

    return employee
  }
}
