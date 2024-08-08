import { Controller, Get, Headers, NotFoundException, Param, Request, Res } from '@nestjs/common'
import { Response } from 'express'
import { EntityManager } from '@mikro-orm/mariadb'
import { readFileSync } from 'fs'
import { LetterService } from '../services/letter.service'
import { Letter, LetterStatus } from '../entities/letter.entity'

@Controller('notifications/letter')
export class LetterController {
  constructor(private readonly em: EntityManager) {}

  @Get('pixel/:uuid')
  async pixel(@Param('uuid') uuid: string, @Res() response: Response, @Request() req: any) {
    const letter = await this.em.findOne(Letter, uuid)

    if (!letter) {
      throw new NotFoundException()
    }

    if (letter.status === LetterStatus.Sent || letter.status === LetterStatus.Received) {
      if (!letter.to.endsWith('@mail.ru') && !letter.to.endsWith('@bk.ru')) {
        letter.status = LetterStatus.Read
        letter.statusUpdatedAt = new Date()
        await this.em.persistAndFlush(letter)
      }
    }

    const pixel = readFileSync(`uploads/pixel.gif`)
    response.contentType('gif')
    response.send(pixel)
  }

  @Get('accept/:uuid')
  async accept(@Param('uuid') uuid: string, @Res() response: Response) {
    const letter = await this.em.findOne(Letter, uuid)

    if (!letter) {
      throw new NotFoundException()
    }

    if (letter.status !== LetterStatus.Read) {
      letter.status = LetterStatus.Read
      letter.statusUpdatedAt = new Date()
      await this.em.persistAndFlush(letter)
    }

    const origin = process.env['APP_ORIGIN']
    if (origin) {
      return response.redirect(origin)
    }
  }
}
