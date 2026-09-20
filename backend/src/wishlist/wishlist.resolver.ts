import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';
import { User } from '../auth/model/user.model';
import { WishlistDto } from './dto/wishlist.input';
import { WishlistQueryDto } from './dto/wishlist-query.input';
import { WishlistItemModel } from './types/wishlist-item.model';
import { WishlistResponse } from './types/wishlist-response.type';
import { WishlistService } from './wishlist.service';

@Resolver(() => WishlistItemModel)
export class WishlistResolver {
  constructor(private wishlistService: WishlistService) {}

  @Query(() => WishlistResponse, {
    description: 'Получить список избранного текущего пользователя',
  })
  @Authorization()
  async wishlist(
    @Authorized() user: User,
    @Args('input', { nullable: true }) input?: WishlistQueryDto,
  ): Promise<WishlistResponse> {
    return this.wishlistService.getWishlist(user.id, input);
  }

  @Mutation(() => Boolean, {
    description:
      'Toggle: добавить/убрать товар из избранного. Возвращает текущее состояние.',
  })
  @Authorization()
  async toggleWishlist(
    @Authorized() user: User,
    @Args('input') input: WishlistDto,
  ): Promise<boolean> {
    return this.wishlistService.toggleWishlist(user.id, input);
  }

  @Mutation(() => WishlistResponse, {
    description: 'Добавить товар в избранное',
  })
  @Authorization()
  async addToWishlist(
    @Authorized() user: User,
    @Args('input') input: WishlistDto,
  ): Promise<WishlistResponse> {
    return this.wishlistService.addToWishlist(user.id, input);
  }

  @Mutation(() => WishlistResponse, {
    description: 'Удалить товар из избранного',
  })
  @Authorization()
  async removeFromWishlist(
    @Authorized() user: User,
    @Args('input') input: WishlistDto,
  ): Promise<WishlistResponse> {
    return this.wishlistService.removeFromWishlist(user.id, input);
  }
}
