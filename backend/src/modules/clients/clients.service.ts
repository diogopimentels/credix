import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClientDto) {
    const existing = await this.prisma.client.findFirst({ where: { name: dto.name } })
    if (existing) throw new BadRequestException('Client already exists')
    return this.prisma.client.create({ data: dto as any })
  }

  async findAll() {
    return this.prisma.client.findMany()
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } })
    if (!client) throw new NotFoundException('Client not found')
    return client
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.findOne(id)
    return this.prisma.client.update({ where: { id }, data: dto as any })
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.client.delete({ where: { id } })
  }
}
