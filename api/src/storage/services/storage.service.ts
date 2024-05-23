import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { createReadStream, createWriteStream, mkdirSync, unlinkSync, existsSync } from 'fs'
import { sync as md5FileSync } from 'md5-file'
import * as stream from 'node:stream'
import { dirname, join } from 'path'
import { Repository } from 'typeorm'
import { File } from '../entities/file.entity'

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private configService: ConfigService
  ) {}

  async findOne(id: number): Promise<File | null> {
    return this.fileRepository.findOneBy({ id })
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
    file.file = upload.originalname
    file.path = path
    file.size = upload.size
    file.type = upload.mimetype
    file.hash = md5FileSync(upload.path)
    await this.fileRepository.save(file)

    return file
  }

  async remove(fileId: number) {
    const file = await this.findOne(fileId)
    if (file) {
      await this.unlink(file)
      await this.fileRepository.delete(file)
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
