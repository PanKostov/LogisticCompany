import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
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
      price: packet.price ?? 0,
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

  async getRevenue(from?: string, to?: string): Promise<number> {
    const fromDate = this.parseDate(from, 'from')
    const toDate = this.parseDate(to, 'to')

    const query = this.repo.createQueryBuilder('packet').select('COALESCE(SUM(packet.price), 0)', 'total')

    if (fromDate) {
      query.andWhere('packet.createdAt >= :from', { from: fromDate })
    }

    if (toDate) {
      query.andWhere('packet.createdAt <= :to', { to: toDate })
    }

    const result = await query.getRawOne()
    return Number(result?.total ?? 0)
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

  private parseDate(value: string | undefined, field: string): Date | undefined {
    if (!value) {
      return undefined
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`Invalid ${field} date format`)
    }

    return parsed
  }
}
