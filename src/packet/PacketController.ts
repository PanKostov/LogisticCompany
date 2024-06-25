import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common'
import { PacketService } from './PacketService'
import { SendPackageInterface } from './dtos/SendPackageInterface'
import { Packet } from './PacketEntity'

//TODO: add Auth Guard - to be used only from users who are employees

@Controller('packet')
export class PacketController {
  constructor(private readonly packetService: PacketService) {}
  @Post('/sending')
  async sendPackaet(@Body() body: SendPackageInterface): Promise<Packet> {
    return await this.packetService.sendPacket(body)
  }

  @Patch('/receiving')
  async receivePacket(@Body() body: { packageId: number; officeId: number }): Promise<Packet> {
    return await this.packetService.receivePacket(body.packageId, body.officeId)
  }

  @Get(':id')
  async getPacket(@Param('id') id: string) {
    return await this.packetService.getPacketById(parseInt(id))
  }

  @Get('/all')
  async getAllPackets(): Promise<Packet[]> {
    return await this.packetService.getAllPackets()
  }

  @Get('/all-from-employee/:id')
  async getAllPacketsByEmployee(@Param('id') employeeId: string) {
    return await this.packetService.getAllPacketsByEmployee(parseInt(employeeId))
  }

  @Get('/not-received')
  async getNotRecievedPackets(): Promise<Packet[]> {
    return await this.packetService.getAllNotReceivedPackets()
  }

  @Get('/sent-by-customer/:id')
  async getAllSentPacketsForCustomer(@Param('id') id: string) {
    return await this.packetService.getAllSentPacketsForCustomer(parseInt(id))
  }

  @Get('/received-by-customer/:id')
  async getAllReceivedPacketsForCustomer(@Param('id') id: string) {
    return await this.packetService.getAllReceivedPacketsForCustomer(parseInt(id))
  }
}
