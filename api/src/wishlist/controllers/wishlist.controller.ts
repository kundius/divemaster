import { Controller } from '@nestjs/common'
import { WishlistService } from '../services/wishlist.service'

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}
}
