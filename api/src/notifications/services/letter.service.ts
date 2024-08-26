import { EntityManager } from '@mikro-orm/mariadb'
import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { ImapFlow } from 'imapflow'
import { Attachment } from 'nodemailer/lib/mailer'
import { Letter, LetterStatus } from '../entities/letter.entity'

const nodemailer = require('nodemailer')

interface SendLetterArgs {
  to: string
  html: string
  subject: string
  attachments?: Attachment[]
}

@Injectable()
export class LetterService {
  private readonly logger = new Logger(LetterService.name)

  constructor(private readonly em: EntityManager) {}

  async getFailureEmails(): Promise<string[]> {
    const output: string[] = []

    const client = new ImapFlow({
      host: process.env['IMAP_HOST'] || '',
      port: 993,
      secure: true,
      logger: false,
      auth: {
        user: process.env['IMAP_USER'] || '',
        pass: process.env['IMAP_PASSWORD'] || ''
      }
    })

    await client.connect()

    let lock = await client.getMailboxLock('INBOX')

    try {
      for await (let message of client.fetch(
        { seen: false },
        { envelope: true, headers: ['X-Failed-Recipients'] }
      )) {
        if (!message.envelope.subject.startsWith('Mail delivery failed')) continue

        const to = message.headers.toString().trim().replace('X-Failed-Recipients: ', '')

        output.push(to)
      }
      await client.messageFlagsAdd({ seen: false }, ['\\Seen'])
    } finally {
      lock.release()
    }

    await client.logout()

    return output
  }

  async sendLetter(args: SendLetterArgs) {
    if (!process.env['SMTP_USER']) throw new Error()

    const letter = new Letter()
    letter.from = process.env['SMTP_USER']
    letter.to = args.to
    letter.status = LetterStatus.Sent
    letter.statusUpdatedAt = new Date()
    letter.readCount = 0
    await this.em.persistAndFlush(letter)

    try {
      let testAccount = await nodemailer.createTestAccount()
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: process.env['SMTP_HOST'] || 'smtp.ethereal.email',
        port: process.env['SMTP_PORT'] ? parseInt(process.env['SMTP_PORT']) : 587,
        secure: process.env['SMTP_SECURE'] === 'true',
        auth: {
          user: process.env['SMTP_USER'] || testAccount.user, // generated ethereal user
          pass: process.env['SMTP_PASSWORD'] || testAccount.pass // generated ethereal password
        }
      })
      let message = {
        // messageId: letter.uuid,
        from: letter.from,
        to: letter.to,
        subject: args.subject,
        html: args.html.replaceAll('{letterId}', letter.uuid),
        dsn: {
          id: letter.uuid,
          return: 'headers',
          notify: ['success', 'failure', 'delay'],
          recipient: process.env['SMTP_USER']
        },
        attachments: args.attachments
      }
      const info = await transporter.sendMail(message)
      letter.messageId = info.messageId
      await this.em.persistAndFlush(letter)
    } catch (e) {
      letter.status = LetterStatus.Fail
      await this.em.persistAndFlush(letter)
    }

    return letter
  }

  @Cron('*/10 * * * * *')
  async handleCron() {
    // this.logger.debug('Called every 10 seconds')

    const localEm = this.em.fork()

    const emails = await this.getFailureEmails()

    for (const email of emails) {
      const letters = await localEm.find(Letter, {
        to: email,
        status: LetterStatus.Sent
      })
      for (const letter of letters) {
        letter.status = LetterStatus.Fail
        letter.statusUpdatedAt = new Date()
        await localEm.persistAndFlush(letter)
      }
    }

    const letters = await localEm.find(Letter, {
      status: LetterStatus.Sent
    })
    for (const letter of letters) {
      letter.status = LetterStatus.Received
      letter.statusUpdatedAt = new Date()
      await localEm.persistAndFlush(letter)
    }
  }
}
