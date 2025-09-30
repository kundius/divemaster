import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from 'typesense'

@Injectable()
export class TypesenseService {
  private client: Client

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      nodes: [
        {
          host: String(this.configService.get('typesense.host')),
          port: Number(this.configService.get('typesense.port')),
          protocol: String(this.configService.get('typesense.protocol'))
        }
      ],
      apiKey: String(this.configService.get('typesense.apiKey')),
      connectionTimeoutSeconds: 2
    })
  }

  getClient(): Client {
    return this.client
  }
}
