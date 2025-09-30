import { TypesenseService } from '@/typesense/typesense.service'
import { Injectable } from '@nestjs/common'
import { Product } from '../entities/product.entity'

export interface ProductDocument {
  id: string
  title: string
  longTitle: string
  sku: string
}

@Injectable()
export class ProductsSearchService {
  private readonly collectionName = 'products'
  private readonly maxResults = 10000

  constructor(private typesenseService: TypesenseService) {}

  private getClient() {
    return this.typesenseService.getClient()
  }

  async deleteCollection(): Promise<void> {
    await this.getClient().collections(this.collectionName).delete()
  }

  async isCollectionEmpty(): Promise<boolean> {
    try {
      const collection = await this.getClient().collections(this.collectionName).retrieve()
      return collection.num_documents === 0
    } catch (error) {
      if (error.httpStatus === 404) {
        return true
      }
      throw error
    }
  }

  async ensureCollectionExists() {
    const client = this.getClient()
    try {
      await client.collections(this.collectionName).retrieve()
    } catch (e) {
      await client.collections().create({
        name: this.collectionName,
        fields: [
          { name: 'title', type: 'string', locale: 'ru' },
          { name: 'longTitle', type: 'string', locale: 'ru' },
          { name: 'sku', type: 'string', locale: 'ru' }
        ]
      })
    }
  }

  async deleteFromIndex(id: number): Promise<void> {
    try {
      await this.typesenseService
        .getClient()
        .collections<ProductDocument>(this.collectionName)
        .documents(id.toString())
        .delete()
    } catch (error) {
      if (error.httpStatus === 404) {
        return
      }
      throw error
    }
  }

  async index(product: Product) {
    await this.ensureCollectionExists()

    const document: ProductDocument = {
      id: product.id.toString(),
      title: product.title,
      longTitle: product.longTitle || '',
      sku: product.sku || ''
    }

    await this.getClient()
      .collections<ProductDocument>(this.collectionName)
      .documents()
      .upsert(document)
  }

  async search(query: string) {
    const client = this.getClient()
    const ids: number[] = []
    let page = 1
    const perPage = 250

    while (ids.length < this.maxResults) {
      const response = await client
        .collections<ProductDocument>(this.collectionName)
        .documents()
        .search({
          q: query,
          query_by: 'sku,title,longTitle',
          include_fields: 'id',
          query_by_weights: '3,2,2',
          per_page: perPage,
          page: page
        })

      const pageIds = response.hits?.map((hit) => Number(hit.document.id)) || []
      ids.push(...pageIds)

      if (pageIds.length < perPage) {
        break
      }

      page++
    }

    return ids.slice(0, this.maxResults)
  }
}
