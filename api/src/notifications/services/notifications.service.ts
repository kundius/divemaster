import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Attachment } from 'nodemailer/lib/mailer'

const nodemailer = require('nodemailer')

interface SendMailArgs {
  to: string
  html: string
  subject: string
  attachments?: Attachment[]
}

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}

  async sendMail(args: SendMailArgs) {
    if (!this.configService.get('smtp.user')) throw new Error()

    const testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
      host: this.configService.get('smtp.host', 'smtp.ethereal.email'),
      port: this.configService.get('smtp.port', 587),
      secure: this.configService.get('smtp.secure', false),
      auth: {
        user: this.configService.get('smtp.user') || testAccount.user, // generated ethereal user
        pass: this.configService.get('smtp.password') || testAccount.pass // generated ethereal password
      }
    })

    await transporter.sendMail({
      from: this.configService.get('smtp.user'),
      to: args.to,
      subject: args.subject,
      html: args.html,
      attachments: args.attachments
    })
  }
}
