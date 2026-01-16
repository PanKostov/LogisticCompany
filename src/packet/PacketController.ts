import { Controller, Post, Body, Patch, Param, Get, UseGuards, Query, Delete } from '@nestjs/common'
import { PacketService } from './PacketService'
import { SendPackageInterface } from './dtos/SendPackageInterface'
import { Packet } from './Packet.entity'
import { EmployeeGuard } from '../guards/EmployeeGuard'
import { AdminGuard } from '../guards/AdminGuard'
import { UpdatePacketDto } from './dtos/UpdatePacketDto.dto'

@Controller('packet')
export class PacketController {
  constructor(private readonly packetService: PacketService) {}
  @Post('/sending')
  @UseGuards(EmployeeGuard)
  async sendPackaet(@Body() body: SendPackageInterface): Promise<Packet> {
    return await this.packetService.sendPacket(body)
  }

  @Patch('/receiving')
  @UseGuards(EmployeeGuard)
  async receivePacket(@Body() body: { packageId: number; officeId: number }): Promise<Packet> {
    return await this.packetService.receivePacket(body.packageId, body.officeId)
  }

  @Patch('/:id')
  @UseGuards(EmployeeGuard)
  async updatePacket(@Param('id') id: string, @Body() body: UpdatePacketDto): Promise<Packet> {
    return await this.packetService.updatePacket(parseInt(id), body)
  }

  @Delete('/:id')
  @UseGuards(EmployeeGuard)
  async deletePacket(@Param('id') id: string): Promise<Packet> {
    return await this.packetService.deletePacket(parseInt(id))
  }

  @Get('/all')
  @UseGuards(EmployeeGuard)
  async getAllPackets(): Promise<Packet[]> {
    return await this.packetService.getAllPackets()
  }

  @Get('/all-from-employee/:id')
  @UseGuards(EmployeeGuard)
  async getAllPacketsByEmployee(@Param('id') employeeId: string) {
    return await this.packetService.getAllPacketsByEmployee(parseInt(employeeId))
  }

  @Get('/not-received')
  @UseGuards(EmployeeGuard)
  async getNotRecievedPackets(): Promise<Packet[]> {
    return await this.packetService.getAllNotReceivedPackets()
  }

  @Get('/sent-by-customer/:id')
  @UseGuards(EmployeeGuard)
  async getAllSentPacketsForCustomer(@Param('id') id: string) {
    return await this.packetService.getAllSentPacketsForCustomer(parseInt(id))
  }

  @Get('/received-by-customer/:id')
  @UseGuards(EmployeeGuard)
  async getAllReceivedPacketsForCustomer(@Param('id') id: string) {
    return await this.packetService.getAllReceivedPacketsForCustomer(parseInt(id))
  }

  @Get('/revenue')
  @UseGuards(AdminGuard)
  async getRevenue(@Query('from') from?: string, @Query('to') to?: string) {
    const total = await this.packetService.getRevenue(from, to)
    return { total, from: from || null, to: to || null }
  }

  @Get(':id')
  @UseGuards(EmployeeGuard)
  async getPacket(@Param('id') id: string) {
    return await this.packetService.getPacketById(parseInt(id))
  }
}
