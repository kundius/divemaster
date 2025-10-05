import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import {
  createReadStream,
  createWriteStream,
  mkdirSync,
  unlinkSync,
  existsSync,
  writeFile,
  copyFileSync
} from 'fs'
import { sync as md5FileSync } from 'md5-file'
import * as stream from 'node:stream'
import { basename, dirname, join } from 'path'
import { Repository } from 'typeorm'
import { File } from '../entities/file.entity'
import { statSync } from 'node:fs'

const mime = require('mime-types')

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private configService: ConfigService
  ) {}

  async findOne(id: number): Promise<File | null> {
    return this.fileRepository.findOne({ where: { id } })
  }

  async findOneOrFail(id: number): Promise<File> {
    return this.fileRepository.findOneOrFail({ where: { id } })
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

    const file = new File()
    this.fileRepository.merge(file, {
      file: upload.originalname,
      path: path,
      size: upload.size,
      type: upload.mimetype,
      hash: md5FileSync(upload.path)
    })
    await this.fileRepository.save(file)

    console.log(file)

    return file
  }

  async createFromPath(fromPath: string, toPath: string): Promise<File> {
    mkdirSync(dirname(this.fullPath(toPath)), { recursive: true })
    copyFileSync(this.fullPath(fromPath), this.fullPath(toPath))

    const stats = statSync(this.fullPath(toPath))

    const file = new File()
    this.fileRepository.merge(file, {
      file: basename(toPath),
      path: toPath,
      size: stats.size,
      type: mime.lookup(toPath),
      hash: md5FileSync(this.fullPath(toPath))
    })
    await this.fileRepository.save(file)

    return file
  }

  async createFromBuffer(data: Buffer, path: string): Promise<File> {
    await this.uploadBuffer(data, path)

    const file = new File()
    this.fileRepository.merge(file, {
      file: basename(path),
      path: path,
      size: Buffer.byteLength(data),
      type: mime.lookup(path),
      hash: md5FileSync(this.fullPath(path))
    })
    await this.fileRepository.save(file)

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
      await this.fileRepository.delete({ id: file.id })
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
