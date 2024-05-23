import { Injectable } from '@nestjs/common'
import { File } from '../entities/file.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { dirname, join, basename } from 'path'
import fs from 'fs'
import md5File from 'md5-file'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private configService: ConfigService
  ) {}

  // getFullPath(path: string) {
  //   return join(process.env['LOCAL_STORAGE_PATH'] || '', path)
  // }

  async saveFile(rd: fs.ReadStream, path: string): Promise<void> {
    const fullPath = join(this.configService.get('LOCAL_STORAGE_PATH', ''), path)
    fs.mkdirSync(dirname(fullPath), { recursive: true })
    const wr = fs.createWriteStream(fullPath)
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

  async upload(upload: Express.Multer.File, path?: string): Promise<File> {
    const readableStream = fs.createReadStream(upload.path)

    if (!path) {
      path = upload.originalname
    }

    await this.saveFile(readableStream, path)

    const file = new File()
    file.file = upload.originalname
    file.path = path
    file.size = upload.size
    file.type = upload.mimetype
    file.hash = md5File.sync(upload.path)
    await this.fileRepository.save(file)

    return file
  }

  getHello(): string {
    return 'Hello World!'
  }
}
