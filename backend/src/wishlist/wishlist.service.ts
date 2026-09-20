import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { WishlistQueryDto } from './dto/wishlist-query.input';
import { WishlistDto } from './dto/wishlist.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string, query: WishlistQueryDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    // Параллельно получаем список и общее количество
    const [items, totalCount] = await Promise.all([
      this.prisma.wishlistItem.findMany({
        where: { userId },
        include: {
          product: {
            include: { category: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.wishlistItem.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    return {
      items,
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage,
    };
  }

  async toggleWishlist(userId: string, input: WishlistDto): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: input.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: input.productId,
        },
      },
    });

    if (existing) {
      await this.prisma.wishlistItem.delete({
        where: {
          userId_productId: {
            userId,
            productId: input.productId,
          },
        },
      });
      return false;
    }

    await this.prisma.wishlistItem.create({
      data: {
        userId,
        productId: input.productId,
      },
    });
    return true;
  }

  async addToWishlist(userId: string, input: WishlistDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: input.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    try {
      await this.prisma.wishlistItem.create({
        data: {
          userId,
          productId: input.productId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Товар уже в избранном');
      }

      throw error;
    }

    return this.getWishlist(userId);
  }

  async removeFromWishlist(userId: string, input: WishlistDto) {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: input.productId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Товар отсутствует в избранном');
    }

    await this.prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId: input.productId,
        },
      },
    });

    return this.getWishlist(userId);
  }

  async getWishlistProductIds(
    userId: string,
    productIds: string[],
  ): Promise<string[]> {
    if (productIds.length === 0) return [];

    const items = await this.prisma.wishlistItem.findMany({
      where: {
        userId,
        productId: {
          in: productIds,
        },
      },
      select: {
        productId: true,
      },
    });

    return items.map((item) => item.productId);
  }
}
