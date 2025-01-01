import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  createReadStream,
  createWriteStream,
  mkdirSync,
  unlinkSync,
  existsSync,
  writeFile
} from 'fs'
import { sync as md5FileSync } from 'md5-file'
import * as stream from 'node:stream'
import { basename, dirname, join } from 'path'
import { PrismaService } from '@/prisma.service'
import { File } from '@prisma/client'

const mime = require('mime-types')

@Injectable()
export class StorageService {
  constructor(
    private readonly prismaService: PrismaService,
    private configService: ConfigService
  ) {}

  async findOne(id: number): Promise<File | null> {
    return this.prismaService.file.findUnique({ where: { id } })
  }

  async findOneOrFail(id: number): Promise<File> {
    return this.prismaService.file.findUniqueOrThrow({ where: { id } })
  }

  fullPath(path: string) {
    return join(this.configService.get('LOCAL_STORAGE_PATH', ''), path)
  }

  async stream(file: File): Promise<stream.Readable | undefined> {
    const fullPath = this.fullPath(file.path)
    if (existsSync(fullPath)) {
      return createReadStream(fullPath)
    }
  }

  async unlink(file: File): Promise<void> {
    const fullPath = this.fullPath(file.path)
    if (existsSync(fullPath)) {
      unlinkSync(fullPath)
    }
  }

  async upload(upload: Express.Multer.File, path?: string): Promise<File> {
    if (!path) {
      path = upload.originalname
    }

    await this.fsMove(upload.path, path)

    const file = await this.prismaService.file.create({
      data: {
        file: upload.originalname,
        path: path,
        size: upload.size,
        type: upload.mimetype,
        hash: md5FileSync(upload.path)
      }
    })

    return file
  }

  async createFromBuffer(data: Buffer, path: string): Promise<File> {
    await this.uploadBuffer(data, path)

    const file = await this.prismaService.file.create({
      data: {
        file: basename(path),
        path: path,
        size: Buffer.byteLength(data),
        type: mime.lookup(path),
        hash: md5FileSync(this.fullPath(path))
      }
    })

    return file
  }

  async uploadBuffer(data: Buffer, path: string): Promise<void> {
    // const rd = createReadStream(data)
    mkdirSync(dirname(this.fullPath(path)), { recursive: true })
    // const wr = fs.createWriteStream(this.fullPath(path))
    // try {
    //   return await new Promise(function (resolve, reject) {
    //     rd.on('error', reject)
    //     wr.on('error', reject)
    //     wr.on('finish', resolve)
    //     rd.pipe(wr)
    //   })
    // } catch (error) {
    //   rd.destroy()
    //   wr.end()
    //   throw error
    // }
    return await new Promise((resolve, reject) => {
      writeFile(this.fullPath(path), data, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  async remove(fileId: number) {
    const file = await this.findOne(fileId)
    if (file) {
      await this.unlink(file)
      await this.prismaService.file.delete({ where: { id: file.id } })
    }
  }

  private async fsMove(from: string, to: string): Promise<void> {
    const rd = createReadStream(from)
    const fullPath = this.fullPath(to)
    mkdirSync(dirname(fullPath), { recursive: true })
    const wr = createWriteStream(fullPath)
    try {
      return await new Promise(function (resolve, reject) {
        rd.on('error', reject)
        wr.on('error', reject)
        wr.on('finish', resolve)
        rd.pipe(wr)
      })
    } catch (error) {
      rd.destroy()
      wr.end()
      throw error
    }
  }
}
